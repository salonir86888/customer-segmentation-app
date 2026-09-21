import pandas as pd

def process_raw_transactions(df: pd.DataFrame) -> pd.DataFrame:
    # 1. Strip spaces and lowercase column headers
    df.columns = [str(c).lower().strip().replace(" ", "_") for c in df.columns]

    # 2. Dynamic column detection
    id_col = next((c for c in df.columns if "id" in c and ("cust" in c or "client" in c or "user" in c)), None)
    if not id_col:
        id_col = next((c for c in df.columns if "cust" in c or "client" in c), None)

    name_col = next((c for c in df.columns if "name" in c and c != id_col), None)
    date_col = next((c for c in df.columns if "date" in c or "time" in c), None)
    amount_col = next((c for c in df.columns if "total" in c or "amount" in c or "spend" in c or "price" in c), None)

    if not id_col or not amount_col:
        raise ValueError("File must contain Customer ID and Amount columns.")

    # 3. Clean numeric amounts
    df[amount_col] = df[amount_col].astype(str).str.replace(r"[^\d.]", "", regex=True)
    df[amount_col] = pd.to_numeric(df[amount_col], errors="coerce").fillna(0.0)

    # 4. Clean date & compute reference max date
    if date_col:
        df[date_col] = pd.to_datetime(df[date_col], format="mixed", errors="coerce")
        max_date = df[date_col].max()
        if pd.isna(max_date):
            max_date = pd.Timestamp.now()
    else:
        df["_temp_date"] = pd.Timestamp.now()
        date_col = "_temp_date"
        max_date = pd.Timestamp.now()

    # 5. Group by Customer ID and aggregate
    group_cols = [id_col]
    if name_col:
        group_cols.append(name_col)

    rfm = df.groupby(group_cols).agg(
        recency=(date_col, lambda x: int((max_date - x.max()).days) if pd.notnull(x.max()) else 0),
        frequency=(amount_col, 'count'),
        monetary=(amount_col, 'sum')
    ).reset_index()

    # 6. Standardize column names
    rfm.rename(columns={id_col: "customer_id"}, inplace=True)
    if name_col:
        rfm.rename(columns={name_col: "customer_name"}, inplace=True)
    else:
        rfm["customer_name"] = rfm["customer_id"]

    rfm["recency"] = rfm["recency"].fillna(0).clip(lower=0)
    rfm["monetary"] = rfm["monetary"].round(2)

    return rfm