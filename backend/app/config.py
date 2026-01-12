"""設定管理"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """アプリケーション設定"""
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174"  # カンマ区切りの文字列として扱う
    MAX_UPLOAD_SIZE: int = 52428800  # 50MB
    UPLOAD_DIR: str = "./tmp/uploads"
    DATA_RETENTION_MINUTES: int = 60
    
    @property
    def cors_origins_list(self) -> List[str]:
        """CORS_ORIGINSをリストに変換"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
