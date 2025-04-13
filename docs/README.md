# Green Living Hub

A web app for health and sustainability tracking, built with Django and React (Vite, JavaScript).

## Setup

### Backend
1. Navigate to `backend/`.
2. Create virtual environment: `python -m venv venv`.
3. Activate: `source venv/bin/activate`.
4. Install dependencies: `pip install -r requirements.txt`.
5. Create `.env` with secrets.
6. Run migrations: `python manage.py migrate`.
7. Start server: `python manage.py runserver`.

### Frontend
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Create `.env` with `VITE_API_URL`.
4. Start dev server: `npm run dev`.

## Team Workflow
- Feature branches: `feature/<name>`.
- PRs require one reviewer.
- Track tasks in [Trello/GitHub Projects].

## License
MIT