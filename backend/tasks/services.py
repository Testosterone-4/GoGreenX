import os
import google.generativeai as genai
import json
import time
from datetime import datetime, timedelta
from .models import Task
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_fitness_plan(fitness_input):
    tasks = []
    try:
        # Calculate the next Monday as the start date
        today = datetime.now()
        days_until_monday = (7 - today.weekday()) % 7 or 7
        start_date = today + timedelta(days=days_until_monday)

        # Prepare prompt for Gemini
        prompt = f"""
        Generate a personalized fitness plan for a {fitness_input.age}-year-old {fitness_input.sex} weighing {fitness_input.weight}kg, {fitness_input.height}cm tall, with the goal of {fitness_input.goal}. Create a 5-day plan (Monday to Friday) starting from {start_date.strftime('%Y-%m-%d')}. Each day must have exactly 5 tasks: 3 exercise tasks and 2 nutrition tasks. Return a JSON array of 25 tasks with the following fields:
        - title: Short description of the task (max 150 characters).
        - category: Either "exercise" or "nutrition".
        - due_date: Date in YYYY-MM-DD format, corresponding to the assigned day (Monday to Friday).
        Ensure titles are concise, varied, and relevant to the user's goal. Example:
        [
          {{"title": "Run 5km at moderate pace", "category": "exercise", "due_date": "2025-04-28"}},
          {{"title": "Eat 200g grilled chicken", "category": "nutrition", "due_date": "2025-04-28"}},
          ...
          {{"title": "Yoga for 30 min", "category": "exercise", "due_date": "2025-05-02"}}
        ]
        """

        # Gemini API request with retries
        model = genai.GenerativeModel('gemini-1.5-flash')
        max_retries = 5
        for attempt in range(max_retries):
            try:
                response = model.generate_content(prompt)
                generated_text = response.text.strip()
                print(f"Gemini Response (Attempt {attempt + 1}): {generated_text}")
                if generated_text.startswith('```json'):
                    generated_text = generated_text[7:-3].strip()
                tasks_data = json.loads(generated_text)
                if not isinstance(tasks_data, list) or len(tasks_data) != 25:
                    raise ValueError("Expected a JSON array with 25 tasks")
                # Verify each day has 5 tasks (3 exercise, 2 nutrition)
                for day in range(5):
                    day_tasks = [t for t in tasks_data if t['due_date'] == (start_date + timedelta(days=day)).strftime('%Y-%m-%d')]
                    if len(day_tasks) != 5:
                        raise ValueError(f"Day {day + 1} does not have exactly 5 tasks")
                    exercise_count = sum(1 for t in day_tasks if t['category'] == 'exercise')
                    if exercise_count != 3:
                        raise ValueError(f"Day {day + 1} does not have exactly 3 exercise tasks")
                break
            except (Exception, json.JSONDecodeError, ValueError) as e:
                print(f"Attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                else:
                    raise Exception(f"Gemini API failed after {max_retries} attempts: {str(e)}")

        # Create tasks
        for task_data in tasks_data:
            title = task_data.get('title', f"{fitness_input.goal.capitalize()} Task")[:150]
            category = task_data.get('category', 'exercise')
            if category not in ['exercise', 'nutrition']:
                category = 'exercise'
            due_date_str = task_data.get('due_date', '')
            try:
                due_date = datetime.strptime(due_date_str, '%Y-%m-%d')
            except ValueError:
                due_date = start_date  # Fallback to Monday
            tasks.append(Task(
                user=fitness_input.user,
                title=title,
                category=category,
                due_date=due_date,
                is_completed=False
            ))

    except Exception as e:
        print(f"Error in generate_fitness_plan: {str(e)}")
        # Fallback tasks: 5 days, 5 tasks per day (3 exercise, 2 nutrition)
        for day in range(5):
            day_date = start_date + timedelta(days=day)
            for i in range(5):
                tasks.append(Task(
                    user=fitness_input.user,
                    title=f"{fitness_input.goal.capitalize()} Task {i + 1} Day {day + 1}",
                    category="exercise" if i < 3 else "nutrition",
                    due_date=day_date,
                    is_completed=False
                ))

    # Save tasks
    Task.objects.bulk_create(tasks)
    return tasks