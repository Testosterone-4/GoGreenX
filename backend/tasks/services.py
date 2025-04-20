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
        # Prepare prompt for Gemini
        prompt = f"""
        Generate a personalized fitness plan for a {fitness_input.age}-year-old {fitness_input.sex} weighing {fitness_input.weight}kg, {fitness_input.height}cm tall, with the goal of {fitness_input.goal}. Return a JSON array of 5 daily tasks (3 exercise, 2 nutrition) with the following fields:
        - title: Short description of the task (max 150 characters).
        - category: Either "exercise" or "nutrition".
        - due_date: Date in YYYY-MM-DD format, within the next 7 days, unique for each task.
        Ensure titles are concise and relevant to the user's goal. Example:
        [
          {{"title": "Run 5km at moderate pace", "category": "exercise", "due_date": "2025-04-21"}},
          {{"title": "Eat 200g grilled chicken", "category": "nutrition", "due_date": "2025-04-22"}}
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
                if not isinstance(tasks_data, list) or len(tasks_data) != 5:
                    raise ValueError("Expected a JSON array with 5 tasks")
                break
            except (Exception, json.JSONDecodeError, ValueError) as e:
                print(f"Attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                else:
                    raise Exception(f"Gemini API failed after {max_retries} attempts: {str(e)}")

        # Create tasks
        for i, task_data in enumerate(tasks_data):
            title = task_data.get('title', f"{fitness_input.goal.capitalize()} Task {i + 1}")[:150]
            category = task_data.get('category', 'exercise')
            if category not in ['exercise', 'nutrition']:
                category = 'exercise'
            due_date_str = task_data.get('due_date', '')
            try:
                due_date = datetime.strptime(due_date_str, '%Y-%m-%d')
            except ValueError:
                due_date = datetime.now() + timedelta(days=i + 1)
            tasks.append(Task(
                user=fitness_input.user,
                title=title,
                category=category,
                due_date=due_date,
                is_completed=False
            ))

    except Exception as e:
        print(f"Error in generate_fitness_plan: {str(e)}")
        # Fallback tasks
        base_date = datetime.now()
        for i in range(5):
            tasks.append(Task(
                user=fitness_input.user,
                title=f"{fitness_input.goal.capitalize()} Task {i + 1}",
                category="exercise" if i < 3 else "nutrition",
                due_date=base_date + timedelta(days=i + 1),
                is_completed=False
            ))

    # Save tasks
    Task.objects.bulk_create(tasks)
    return tasks