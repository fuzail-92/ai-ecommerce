import json
import os
from typing import List, Optional

from fastapi import FastAPI
from pydantic import BaseModel

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="AI E-Commerce Service", version="1.0.0")

# Load products
PRODUCTS_FILE = os.path.join(os.path.dirname(__file__), "products.json")
with open(PRODUCTS_FILE, "r", encoding="utf-8") as f:
    PRODUCTS = json.load(f)

# Prepare TF-IDF vectorizer on product descriptions
vectorizer = TfidfVectorizer(stop_words="english")
product_texts = [p["description"] for p in PRODUCTS]
product_vectors = vectorizer.fit_transform(product_texts)

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3

class ChatRequest(BaseModel):
    message: str

def search_products(query: str, top_k: int = 3):
    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, product_vectors).flatten()
    top_indices = similarities.argsort()[::-1][:top_k]
    results = []
    for idx in top_indices:
        results.append({
            "product": PRODUCTS[idx],
            "score": float(similarities[idx]),
        })
    return results

@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-ecommerce"}

@app.post("/search")
def semantic_search(req: SearchRequest):
    results = search_products(req.query, req.top_k)
    return {"success": True, "results": results}

@app.post("/recommend")
def recommend(user_id: str):
    # Simple recommendation: return top products by category popularity (mock)
    # In real system, use user behavior, purchase history, etc.
    # For now, just return all products or based on simple heuristic
    recommended = sorted(PRODUCTS, key=lambda x: x["price"], reverse=True)[:3]
    return {"success": True, "recommendations": recommended}

@app.post("/chat")
def chat(req: ChatRequest):
    message = req.message.lower()
    # Very simple rule-based assistant
    if "laptop" in message or "programming" in message:
        results = search_products("laptop programming", 2)
        reply = "I found some laptops that might be good for programming: " + ", ".join([r["product"]["name"] for r in results])
    elif "headphone" in message or "audio" in message:
        results = search_products("headphones", 2)
        reply = "Here are some audio products: " + ", ".join([r["product"]["name"] for r in results])
    else:
        results = search_products(message, 3)
        reply = "Based on your query, I found these products: " + ", ".join([r["product"]["name"] for r in results])
    return {"success": True, "reply": reply, "products": [r["product"] for r in results]}
