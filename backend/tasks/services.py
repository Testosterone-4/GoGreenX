import requests
from datetime import datetime, timedelta
from django.conf import settings
from .models import Task
from users.models import FitnessInput

def generate_fitness_plan(fitness_input):
    """Generate a weekly task plan using Hugging Face API."""
    user = fitness_input.user
    weight = fitness_input.weight
    height = fitness_input.height
    sex = fitness_input.sex
    age = fitness_input.age
    goal = fitness_input.goal

    # Prepare prompt for AI
    prompt = (
        f"Generate a weekly fitness plan for a {sex} aged {age}, weighing {weight}kg, "
        f"{height}cm tall, with the goal of {goal}. Return a JSON array of tasks, each with: "
        f"'title' (e.g., 'Run 5km', 'Eat 50g protein'), 'category' ('exercise' or 'nutrition'), "
        f"and 'day' (0 to 6 for Monday to Sunday). Example: "
        f"[{{'title': 'Run 5km', 'category': 'exercise', 'day': 0}}, ...]"
    )

    # Call Hugging Face API
    headers = {
        "Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 500,
            "return_full_text": False,
            "temperature": 0.7,
        },
    }
    try:
        response = requests.post(
            "https://api-inference.huggingface.co/models/mixtral-8x7b-instruct-v0.1",
            headers=headers,
            json=payload,
            timeout=30,
        )
        response.raise_for_status()
        tasks_json = response.json()[0]["generated_text"]

        # Parse JSON (assuming model outputs valid JSON)
        import json
        tasks_data = json.loads(tasks_json)
    except (requests.RequestException, json.JSONDecodeError) as e:
        # Fallback: Return empty list if API fails
        print(f"Error calling Hugging Face API: {e}")
        return []

    # Create Task objects
    tasks = []
    today = datetime.now()
    for task_data in tasks_data:
        tasks.append(Task(
            user=user,
            title=task_data["title"],
            category=task_data["category"],
            due_date=today + timedelta(days=task_data["day"]),
            created_at=today,
        ))

    # Save tasks
    Task.objects.bulk_create(tasks)
    return tasks