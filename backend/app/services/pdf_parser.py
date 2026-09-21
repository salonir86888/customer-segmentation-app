import io
import re
import pdfplumber  # pyrefly: ignore [missing-import]
import pandas as pd

def extract_transactions_from_pdf(file_bytes: bytes) -> pd.DataFrame:
    records = []
    
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            # Method 1: Try structured tables
            tables = page.extract_tables()
            for table in tables:
                if not table or len(table) < 2:
                    continue
                
                # Clean headers: remove newlines, special characters, and lowercase
                raw_headers = [
                    re.sub(r"[^a-z0-9]", "", str(c).lower()) if c else "" 
                    for c in table[0]
                ]
                
                # Find indices for customer, date, total
                cust_idx = next((i for i, h in enumerate(raw_headers) if "cust" in h), None)
                date_idx = next((i for i, h in enumerate(raw_headers) if "date" in h or "time" in h), None)
                total_idx = next((i for i, h in enumerate(raw_headers) if "total" in h or "amount" in h or "price" in h), None)
                
                for row in table[1:]:
                    if not any(row):
                        continue
                    
                    cust_val = row[cust_idx] if cust_idx is not None and cust_idx < len(row) else None
                    date_val = row[date_idx] if date_idx is not None and date_idx < len(row) else "01-09-2026"
                    total_val = row[total_idx] if total_idx is not None and total_idx < len(row) else None
                    
                    if cust_val and total_val:
                        cleaned_cust = str(cust_val).replace("\n", " ").strip()
                        cleaned_total = re.sub(r"[^\d.]", "", str(total_val).strip())
                        if cleaned_total and cleaned_cust:
                            records.append({
                                "customer_id": cleaned_cust,
                                "date": str(date_val).replace("\n", " ").strip(),
                                "total": float(cleaned_total)
                            })

            # Method 2: Fallback text regex if table borders were missed
            if not records:
                text = page.extract_text()
                if text:
                    for line in text.split("\n"):
                        # Match pattern: CUST-XXXX and currency amounts
                        cust_match = re.search(r"(CUST-\d+)", line, re.IGNORECASE)
                        amount_matches = re.findall(r"(\d{1,3}(?:,\d{3})*(?:\.\d{2}))", line)
                        date_match = re.search(r"(\d{2}-\d{2}-\d{4})", line)
                        
                        if cust_match and amount_matches:
                            # Usually the last or largest numeric figure in POS row is the row total
                            total_val = float(amount_matches[-1].replace(",", ""))
                            records.append({
                                "customer_id": cust_match.group(1).upper(),
                                "date": date_match.group(1) if date_match else "01-09-2026",
                                "total": total_val
                            })
                            
    if not records:
        raise ValueError("Could not extract valid customer transaction table from PDF. Please check column format.")
        
    return pd.DataFrame(records)