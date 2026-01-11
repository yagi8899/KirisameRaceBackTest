"""FastAPI アプリケーション"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.upload import router as upload_router
from app.api.backtest import router as backtest_router

app = FastAPI(
    title="Kirisame Race BackTest API",
    version="1.0.0",
    description="競馬バックテストシステム API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター登録
app.include_router(upload_router)
app.include_router(backtest_router)


@app.get("/")
async def root():
    """ルートエンドポイント"""
    return {
        "message": "Kirisame Race BackTest API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/api/health")
async def health_check():
    """ヘルスチェック"""
    return {
        "status": "ok",
        "service": "Kirisame Race BackTest API"
    }
