from django.conf import settings
from datetime import datetime, timedelta
from .models import Task
import google.generativeai as genai
import logging
import json

logger = logging.getLogger(__name__)

def generate_fitness_plan(fitness_input):
    """
    Generate a fitness plan using Gemini API based on FitnessInput.
    Returns a list of Task objects.
    """
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')

        prompt = f"""
        Create a 5-day fitness plan with 5 daily tasks each day for a {fitness_input.sex} 
        aged {fitness_input.age}, weight {fitness_input.weight}kg, height {fitness_input.height}cm, 
        with the goal of {fitness_input.goal}. Include daily tasks categorized as 'exercise', 
        'nutrition', or 'sustainability'. Each day should have exactly 5 tasks with a mix of categories.
        
        Each task should have:
        - title (max 150 characters)
        - category
        - due_date (YYYY-MM-DD format, 5 consecutive dates)
        
        Return a JSON array of objects with keys: title, category, due_date.
        
        Example structure:
        [
            {{"title": "Morning jog", "category": "exercise", "due_date": "2025-04-23"}},
            {{"title": "100g protein intake", "category": "nutrition", "due_date": "2025-04-23"}},
            {{"title": "Recycle plastics", "category": "sustainability", "due_date": "2025-04-23"}},
            {{"title": "Strength training", "category": "exercise", "due_date": "2025-04-23"}},
            {{"title": "Vegetable salad", "category": "nutrition", "due_date": "2025-04-23"}},
            {{"title": "Cycling session", "category": "exercise", "due_date": "2025-04-24"}},
            ...
        ]
        """
        response = model.generate_content(prompt)
        
        try:
            tasks_data = json.loads(response.text.strip('```json\n').strip('```'))
        except json.JSONDecodeError:
            logger.warning("Gemini API returned invalid JSON, falling back to default tasks")
            tasks_data = []
            for day in range(1, 6):
                due_date = (datetime.now() + timedelta(days=day)).strftime('%Y-%m-%d')
                tasks_data.extend([
                    {"title": "30-minute cardio", "category": "exercise", "due_date": due_date},
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
                    is_completed=False
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
        # Fallback default tasks
        tasks = []
        for day in range(1, 6):
            due_date = datetime.now() + timedelta(days=day)
            tasks.extend([
                Task(
                    user=fitness_input.user,
                    title="30-minute cardio",
                    category="exercise",
                    due_date=due_date,
                    is_completed=False
                ),
                Task(
                    user=fitness_input.user,
                    title="High-protein meal",
                    category="nutrition",
                    due_date=due_date,
                    is_completed=False
                ),
                Task(
                    user=fitness_input.user,
                    title="Use public transport",
                    category="sustainability",
                    due_date=due_date,
                    is_completed=False
                ),
                Task(
                    user=fitness_input.user,
                    title="Strength training",
                    category="exercise",
                    due_date=due_date,
                    is_completed=False
                ),
                Task(
                    user=fitness_input.user,
                    title="Vegetable intake",
                    category="nutrition",
                    due_date=due_date,
                    is_completed=False
                )
            ])
        
        for task in tasks:
            try:
                task.save()
            except Exception as e:
                logger.error(f"Error saving fallback task: {str(e)}")
                continue

        logger.info(f"Fallback: Generated {len(tasks)} default tasks for user {fitness_input.user.email}")
        return [task for task in tasks if task.id is not None]