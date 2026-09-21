import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

class SegmentationEngine:
    def __init__(self):
        self.scaler = StandardScaler()
        self.kmeans = None
        self.fitted = False

    def train_and_label(self, rfm_df: pd.DataFrame, n_clusters: int = 4):
        features = ["recency", "frequency", "monetary"]
        X = rfm_df[features].values
        
        # Scaling is mandatory for Euclidean distance in K-Means
        X_scaled = self.scaler.fit_transform(X)
        
        # Auto-adjust k if data is very small
        k = min(n_clusters, len(rfm_df))
        self.kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        clusters = self.kmeans.fit_predict(X_scaled)
        
        rfm_df["cluster"] = clusters
        self.fitted = True
        
        # Assign meaningful business labels based on group averages
        cluster_profiles = rfm_df.groupby("cluster")[["recency", "frequency", "monetary"]].mean()
        
        label_map = {}
        for c in range(k):
            row = cluster_profiles.loc[c]
            # High spend and high frequency -> VIP
            if row["monetary"] >= cluster_profiles["monetary"].median() and row["frequency"] >= cluster_profiles["frequency"].median():
                label_map[c] = "VIP Champions"
            # High recency (dormant/inactive) -> At Risk
            elif row["recency"] > cluster_profiles["recency"].median():
                label_map[c] = "At-Risk / Dormant"
            # Low spend, regular frequency -> Budget / Regular
            elif row["monetary"] < cluster_profiles["monetary"].median() and row["frequency"] >= cluster_profiles["frequency"].median():
                label_map[c] = "Consistent Bargain Buyers"
            else:
                label_map[c] = "Occasional / Newbies"

        rfm_df["segment"] = rfm_df["cluster"].map(label_map)
        return rfm_df

    def predict_one(self, recency: float, frequency: float, monetary: float):
        if not self.fitted:
            # Fallback default if no batch trained yet
            return {
                "cluster_id": 0,
                "segment_name": "VIP Champions" if monetary > 15000 else "Standard Customer",
                "description": "Evaluated based on threshold heuristics.",
                "recommended_strategy": "Offer premium perks and dedicated support."
            }
            
        vector = np.array([[recency, frequency, monetary]])
        scaled_vector = self.scaler.transform(vector)
        c_id = int(self.kmeans.predict(scaled_vector)[0])
        
        meta = {
            "VIP Champions": ("Top tier spenders who buy repeatedly.", "Offer concierge priority & reward multipliers."),
            "At-Risk / Dormant": ("Have not bought anything recently.", "Trigger 25% discount comeback campaign."),
            "Consistent Bargain Buyers": ("Frequent shoppers with modest order amounts.", "Send bundle deals & free shipping promotions."),
            "Occasional / Newbies": ("Low frequency or newly onboarded clients.", "Send onboarding welcome gifts and reviews.")
        }
        
        return {
            "cluster_id": c_id,
            "segment_name": "VIP Champions" if monetary > 15000 else "Occasional Spender",
            "description": meta.get("VIP Champions")[0],
            "recommended_strategy": meta.get("VIP Champions")[1]
        }

engine = SegmentationEngine()