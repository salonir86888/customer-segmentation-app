backed 

.\.venv\Scripts\Activate.ps1
cd backend
uvicorn app.main:app --reload

frontend

cd frontend
npm run dev
