from django.conf import settings
from datetime import datetime, timedelta
from .models import Task
import google.generativeai as genai
import logging
import json
import random  # Add this import

logger = logging.getLogger(__name__)

def calculate_points(category, title):
    """Calculate points based on category and task complexity"""
    base_points = {
        'exercise': random.randint(40, 100),  # Highest points for exercise
        'sustainability': random.randint(30, 80),
        'nutrition': random.randint(20, 60)
    }
    
    # Add bonus points for specific keywords
    bonus_triggers = {
        'intense': 20,
        'training': 15,
        'cardio': 10,
        'organic': 15,
        'recycle': 10,
        'meal prep': 10
    }
    
    points = base_points[category]
    
    for trigger, bonus in bonus_triggers.items():
        if trigger in title.lower():
            points += bonus
    
    return min(max(points, 10), 100)  # Ensure between 10-100

def generate_fitness_plan(fitness_input):
    """
    Generate a fitness plan using Gemini API based on FitnessInput.
    Returns a list of Task objects.
    """
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Get current date in YYYY-MM-DD format
        start_date = datetime.now().strftime('%Y-%m-%d')
        
        prompt = f"""
        Create a 5-day fitness plan with 5 daily tasks each day for a {fitness_input.sex} 
        aged {fitness_input.age}, weight {fitness_input.weight}kg, height {fitness_input.height}cm, 
        with the goal of {fitness_input.goal}. Include daily tasks categorized as 'exercise', 
        'nutrition', or 'sustainability'. Each day should have exactly 5 tasks with a mix of categories.
        
        Each task should have:
        - title (max 150 characters)
        - category (must be 'exercise', 'nutrition', or 'sustainability')
        - due_date (YYYY-MM-DD format, 5 consecutive dates starting from {start_date})
        
        Return a JSON array of objects with keys: title, category, due_date.
        
        Example structure:
        [
            {{"title": "Morning jog", "category": "exercise", "due_date": "{start_date}"}},
            {{"title": "100g protein intake", "category": "nutrition", "due_date": "{start_date}"}},
            ...
        ]
        """
        
        response = model.generate_content(prompt)
        
        try:
            # Strip markdown and parse JSON
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:-3].strip()
            tasks_data = json.loads(text)
            
            # Validate tasks
            valid_categories = {'exercise', 'nutrition', 'sustainability'}
            for task in tasks_data:
                if task['category'] not in valid_categories:
                    raise ValueError(f"Invalid category: {task['category']}")
                try:
                    datetime.strptime(task['due_date'], '%Y-%m-%d')
                except ValueError:
                    raise ValueError(f"Invalid due_date format: {task['due_date']}")
        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Gemini API error: {str(e)}. Falling back to default tasks")
            tasks_data = []
            start_date = datetime.now()
            for day in range(5):
                due_date = (start_date + timedelta(days=day)).strftime('%Y-%m-%d')
                tasks_data.extend([
                    {"title": "Walk 30 minutes", "category": "exercise", "due_date": due_date},
                    {"title": "High-protein meal", "category": "nutrition", "due_date": due_date},
                    {"title": "Use reusable bottle", "category": "sustainability", "due_date": due_date},
                    {"title": "Strength training", "category": "exercise", "due_date": due_date},
                    {"title": "Vegetable intake", "category": "nutrition", "due_date": due_date}
                ])

        tasks = []
        for task_data in tasks_data:
            try:
                task = Task(
                    user=fitness_input.user,
                    title=task_data['title'][:150],
                    category=task_data['category'],
                    due_date=task_data['due_date'],
                    is_completed=False,
                    points_rewarded=calculate_points(
                        task_data['category'],
                        task_data['title']
                    )
                )
                task.save()
                tasks.append(task)
            except Exception as e:
                logger.error(f"Error creating task: {str(e)}")
                continue

        logger.info(f"Generated {len(tasks)} tasks for user {fitness_input.user.email}")
        return tasks
    
    except Exception as e:
        logger.error(f"Error generating fitness plan: {str(e)}")
        # Fallback default tasks with points
        tasks = []
        start_date = datetime.now()
        for day in range(5):
            due_date = start_date + timedelta(days=day)
            default_tasks = [
                ("Walk 30 minutes", "exercise", 40),
                ("High-protein meal", "nutrition", 30),
                ("Use public transport", "sustainability", 35),
                ("Strength training", "exercise", 60),
                ("Vegetable intake", "nutrition", 25)
            ]
            
            for title, category, points in default_tasks:
                task = Task(
                    user=fitness_input.user,
                    title=title,
                    category=category,
                    due_date=due_date,
                    is_completed=False,
                    points_rewarded=points
                )
                try:
                    task.save()
                    tasks.append(task)
                except Exception as e:
                    logger.error(f"Error saving fallback task: {str(e)}")
                    continue

        logger.info(f"Fallback: Generated {len(tasks)} default tasks")
        return [task for task in tasks if task.id is not None]