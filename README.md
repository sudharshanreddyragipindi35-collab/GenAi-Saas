# GenAI SaaS Website Builder

AI SaaS Website Builder built from scratch with an architecture-first workflow.

## Current Local MVP

The current runnable slice includes:

- FastAPI backend
- Static localhost UI served by the backend
- `GET /api/health`
- `POST /api/websites/generate`
- Deterministic website draft generator
- Structured JSON response for future AI integration

Real OpenAI, MongoDB, authentication, React/Tailwind setup, export, and
deployment workflows are planned next steps.

## Run Locally

From the project root:

```bash
python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

Open:

```text
http://127.0.0.1:8000
```

API docs:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/api/health
```

## Test the First Workflow

1. Start the backend.
2. Open `http://127.0.0.1:8000`.
3. Fill or keep the default business requirements.
4. Click `Generate Draft`.
5. Confirm the preview updates.
6. Open the `JSON` tab and confirm the response includes:
   - `project_id`
   - `website_structure`
   - `generated_content`
   - `theme`
   - `preview_data`

## Project Notes

- `PROJECT_FEATURES.txt` tracks architecture and feature planning.
- `WORKLIST.txt` tracks step-by-step implementation tasks.
