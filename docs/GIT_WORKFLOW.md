# Git Workflow for Green Living Hub

This document outlines the Git workflow for the Green Living Hub project to ensure a clean, organized commit history and effective collaboration among the team. Follow these steps for all contributions.

## Overview
- **Project**: A web app for health and sustainability tracking, built with Django (backend) and React (Vite, JavaScript, frontend).
- **Branches**:
  - `main`: Reserved for stable releases, protected for admin-only merges.
  - `develop`: Active development branch where all team contributions are integrated via pull requests (PRs).
- **Goal**: Maintain a linear, readable commit history using structured commits and rebasing.

## Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<organization-or-username>/green-living-hub.git
   cd green-living-hub

2. **Install Dependencies**:

Backend:
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

Frontend:
cd frontend
npm install

3. **Switch to Develop Branch**:
git checkout develop
git pull origin develop

Workflow

Follow these steps for every contribution to keep the repository organized.

1. Create a Branch

Branch Types:

feature/<name>: New features (e.g., feature/login-form).

fix/<name>: Bug fixes (e.g., fix/auth-error).

docs/<name>: Documentation updates (e.g., docs/api-guide).

chore/<name>: Maintenance tasks (e.g., chore/dependency-update).

test/<name>: Tests (e.g., test/user-endpoints).

ci/<name>: CI/CD configurations (e.g., ci/linting).

Naming: Use lowercase, kebab-case, and be descriptive (e.g., feature/wearable-sync).

Command:
git checkout develop git pull origin develop git checkout -b feature/<name>

2. Make and Test Changes

Implement your changes in the appropriate files (e.g., frontend/src/components/ for React, backend/users/views.py for Django).

Test locally to ensure functionality and responsiveness:

3.Commit Changes

Use a structured commit message format: <prefix>(<scope>): <description>

Prefixes:

feat: New features or enhancements.

fix: Bug fixes.

docs: Documentation changes.

chore: Maintenance tasks (e.g., dependency updates).

test: Adding or updating tests.

ci: CI/CD pipeline changes.

Scope: Specifies the affected area, e.g., frontend, backend, api, repo, docs.

Description: Short (<50 characters), imperative, and clear (e.g., "add login form", not "added login").

Examples:
text
CollapseWrapCopy
feat(frontend): implement login form with Axios fix(backend): correct wearable data parsing docs: add API endpoint descriptions chore(frontend): upgrade chart.js to 4.4.4 test(backend): add tests for user authentication ci: configure GitHub Actions for linting

Rules:

Commit one logical change at a time (e.g., separate logic and styling).

Multiple commits are fine during development; they’ll be cleaned up before the PR.

Command:
bash
CollapseWrapCopy
git add . git commit -m "feat(frontend): add login form component"

4. Clean Commits with Rebase

Before submitting a PR, organize commits to create a concise history:
bash
CollapseWrapCopy
git rebase -i origin/develop

In the interactive rebase:

Keep the main commit as pick.

Mark related commits as squash or fixup to combine them.

Example:
text
CollapseWrapCopy
pick <hash> feat(frontend): add login form component squash <hash> feat(frontend): add login form styles squash <hash> feat(frontend): integrate Axios for login

Edit the final message:
text
CollapseWrapCopy
feat(frontend): implement login form with styling and Axios

Resolve any conflicts during rebase:
bash
CollapseWrapCopy
git add . git rebase --continue

5. Push and Create a Pull Request

Push the branch to GitHub:
bash
CollapseWrapCopy
git push origin feature/<name> --force

--force is safe after rebasing, as it updates your branch.

On GitHub:

Create a PR from feature/<name> to develop.

Complete the PR template (see below).

Request a review from the team admin.

If feedback requires changes:
bash
CollapseWrapCopy
# Make updates git add . git commit -m "fix(frontend): adjust login form per review" git rebase -i origin/develop git push origin feature/<name> --force

6. PR Review and Merge

PRs to develop require admin approval to ensure quality.

The admin will:

Review code, tests, and mobile responsiveness.

Request changes if necessary.

Rebase the branch (if needed) to ensure a single, clear commit.

Merge using Squash and merge or Rebase and merge to maintain a linear history.

Team members cannot merge PRs themselves.

The main branch is updated from develop by the admin for stable releases.