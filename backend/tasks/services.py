from datetime import datetime, timedelta
from .models import Task
from users.models import FitnessInput

def generate_fitness_plan(fitness_input):
    """Generate a weekly task plan based on user inputs."""
    user = fitness_input.user
    weight = fitness_input.weight
    height = fitness_input.height
    sex = fitness_input.sex
    age = fitness_input.age
    goal = fitness_input.goal

    # Calculate BMR and TDEE
    if sex == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    tdee = bmr * 1.55  # Moderate activity

    # Set calorie target
    calories = tdee + 500 if goal == 'bulking' else tdee - 500

    # Macros (grams)
    protein = weight * 2
    carb_percentage = 0.45 if goal == 'bulking' else 0.30
    carbs = (calories * carb_percentage) / 4
    fat = (calories * 0.25) / 9

    # Generate tasks
    tasks = []
    today = datetime.now()

    # Exercise tasks (5 days)
    exercises = {
        'bulking': [
            ('Strength: Squats, Deadlifts (3 sets)', 60),
            ('Strength: Bench Press, Rows (3 sets)', 60),
            ('Cardio: 20min cycling', 20),
            ('Strength: Pull-ups, Push-ups (3 sets)', 45),
            ('Cardio: 30min jogging', 30),
        ],
        'dieting': [
            ('Cardio: Run 5km', 40),
            ('Light Weights: Full body (3 sets)', 45),
            ('Cardio: 30min cycling', 30),
            ('HIIT: 20min intervals', 20),
            ('Cardio: Walk 10km', 60),
        ],
    }
    for i, (title, duration) in enumerate(exercises[goal]):
        tasks.append(Task(
            user=user,
            title=title,
            category='exercise',
            due_date=today + timedelta(days=i),
            created_at=today,
        ))

    # Nutrition tasks (daily)
    meal_plan = [
        f"Eat {int(protein/3)}g protein breakfast",
        f"Eat {int(carbs/3)}g carbs lunch",
        f"Eat {int(protein/3)}g protein dinner",
        f"Eat {int(fat/2)}g fat snack",
    ]
    for i in range(7):
        for title in meal_plan:
            tasks.append(Task(
                user=user,
                title=title,
                category='nutrition',
                due_date=today + timedelta(days=i),
                created_at=today,
            ))

    # Save tasks
    Task.objects.bulk_create(tasks)
    return tasks