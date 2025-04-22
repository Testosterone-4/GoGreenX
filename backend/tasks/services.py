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
        Create a 7-day fitness plan for a {fitness_input.sex} aged {fitness_input.age}, 
        weight {fitness_input.weight}kg, height {fitness_input.height}cm, with the goal of {fitness_input.goal}.
        Include daily tasks categorized as 'exercise', 'nutrition', or 'sustainability'.
        Each task should have a title (max 150 chars), category, and due date (YYYY-MM-DD).
        Return a JSON array of objects with keys: title, category, due_date.
        Example: [
            {{"title": "Run 5km", "category": "exercise", "due_date": "2025-04-23"}},
            {{"title": "Eat 100g protein", "category": "nutrition", "due_date": "2025-04-23"}}
        ]
        """
        response = model.generate_content(prompt)
        
        try:
            tasks_data = json.loads(response.text.strip('```json\n').strip('```'))
        except json.JSONDecodeError:
            logger.warning("Gemini API returned invalid JSON, falling back to default tasks")
            tasks_data = [
                {"title": "Walk 30 minutes", "category": "exercise", "due_date": (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')},
                {"title": "Eat a salad", "category": "nutrition", "due_date": (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')},
                {"title": "Use reusable bag", "category": "sustainability", "due_date": (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')}
            ]

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
        tasks = [
            Task(
                user=fitness_input.user,
                title="Walk 30 minutes",
                category="exercise",
                due_date=datetime.now() + timedelta(days=1),
                is_completed=False
            ),
            Task(
                user=fitness_input.user,
                title="Eat a salad",
                category="nutrition",
                due_date=datetime.now() + timedelta(days=1),
                is_completed=False
            ),
            Task(
                user=fitness_input.user,
                title="Use reusable bag",
                category="sustainability",
                due_date=datetime.now() + timedelta(days=1),
                is_completed=False
            )
        ]
        for task in tasks:
            task.save()
        logger.info(f"Fallback: Generated {len(tasks)} default tasks for user {fitness_input.user.email}")
        return tasks