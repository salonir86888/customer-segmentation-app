import io
import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import PredictRequest, PredictResponse, AnalysisResponse
from app.services.data_cleaner import process_raw_transactions
from app.services.pdf_parser import extract_transactions_from_pdf
from app.services.ml_model import engine
from app.services.auth_service import init_auth_db
from app.api.auth import router as auth_router

app = FastAPI(title="Customer Segmentation Analytics API")

# Initialize SQLite database for authentication
init_auth_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])


@app.get("/")
def root():
    return {"message": "Customer Segmentation API is running smoothly."}


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_file(file: UploadFile = File(...)):
    filename = file.filename.lower()
    contents = await file.read()

    try:
        if filename.endswith(".csv"):
            raw_df = pd.read_csv(io.BytesIO(contents))
        elif filename.endswith(".pdf"):
            raw_df = extract_transactions_from_pdf(contents)
        else:
            raise HTTPException(status_code=400, detail="Only CSV and PDF files are supported.")

        # 1. Transform raw transactions to RFM
        rfm_df = process_raw_transactions(raw_df)

        # 2. Run K-Means
        clustered_df = engine.train_and_label(rfm_df)

        # 3. Compute summaries
        total_customers = len(clustered_df)
        total_revenue = float(clustered_df["monetary"].sum())

        segments_summary = []
        for segment_name, group in clustered_df.groupby("segment"):
            segments_summary.append({
                "segment_name": segment_name,
                "customer_count": len(group),
                "avg_recency": round(float(group["recency"].mean()), 1),
                "avg_frequency": round(float(group["frequency"].mean()), 1),
                "avg_spend": round(float(group["monetary"].mean()), 2),
                "percentage": round((len(group) / total_customers) * 100, 1)
            })

        customers_list = [
            {
                "customer_id": str(r["customer_id"]),
                "customer_name": str(r.get("customer_name", r["customer_id"])),
                "recency": float(r["recency"]),
                "frequency": int(r["frequency"]),
                "monetary": float(r["monetary"]),
                "segment": str(r["segment"])
            }
            for _, r in clustered_df.iterrows()
        ]

        return {
            "total_customers": total_customers,
            "total_revenue": total_revenue,
            "segments_summary": segments_summary,
            "customers": customers_list
        }

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


@app.post("/api/predict", response_model=PredictResponse)
def predict_single(req: PredictRequest):
    return engine.predict_one(req.recency_days, req.frequency_orders, req.monetary_spend)