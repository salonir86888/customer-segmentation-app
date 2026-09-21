from pydantic import BaseModel
from typing import List, Optional


class PredictRequest(BaseModel):
    recency_days: float
    frequency_orders: float
    monetary_spend: float


class PredictResponse(BaseModel):
    cluster_id: int
    segment_name: str
    description: str
    recommended_strategy: str


class SegmentStat(BaseModel):
    segment_name: str
    customer_count: int
    avg_recency: float
    avg_frequency: float
    avg_spend: float
    percentage: float


class CustomerItem(BaseModel):
    customer_id: str
    customer_name: Optional[str] = "Unknown"
    recency: float
    frequency: int
    monetary: float
    segment: str


class AnalysisResponse(BaseModel):
    total_customers: int
    total_revenue: float
    segments_summary: List[SegmentStat]
    customers: List[CustomerItem]