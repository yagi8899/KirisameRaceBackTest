"""データストア（ディスク永続化対応）"""
import uuid
import pickle
import time
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Optional
import pandas as pd


class DataStore:
    """データを一時保存するストア（シングルトン）"""
    
    _instance = None
    _storage_dir = Path("temp/data_store")
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._storage = {}
            cls._instance._storage_dir.mkdir(parents=True, exist_ok=True)
            # 起動時にディスクから既存ファイルを復元
            cls._instance._load_from_disk()
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, '_storage'):
            self._storage: Dict[str, dict] = {}
            self._storage_dir.mkdir(parents=True, exist_ok=True)
    
    def _load_from_disk(self):
        """起動時にディスクから既存のファイルを読み込む"""
        if not self._storage_dir.exists():
            return
        
        now = datetime.now()
        for file_path in self._storage_dir.glob("*.pkl"):
            try:
                with open(file_path, 'rb') as f:
                    item = pickle.load(f)
                
                # 有効期限チェック
                if now <= item["expires_at"]:
                    file_id = file_path.stem  # ファイル名（拡張子なし）をIDとして使用
                    self._storage[file_id] = item
                    print(f"✓ 復元: {file_id} (expires: {item['expires_at']})")
                else:
                    # 期限切れファイルは削除
                    file_path.unlink()
                    print(f"✗ 期限切れで削除: {file_path.name}")
            except Exception as e:
                print(f"✗ ファイル読み込みエラー: {file_path.name} - {e}")
                # 壊れたファイルは削除
                try:
                    file_path.unlink()
                except:
                    pass
    
    @classmethod
    def get_instance(cls) -> 'DataStore':
        """シングルトンインスタンスを取得
        
        Returns:
            DataStoreインスタンス
        """
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def save(self, df: pd.DataFrame, retention_minutes: int = 1440) -> str:
        """データを保存し、IDを返す
        
        Args:
            df: 保存するDataFrame
            retention_minutes: 保持時間（分）デフォルト24時間
            
        Returns:
            ファイルID
        """
        file_id = str(uuid.uuid4())
        expires_at = datetime.now() + timedelta(minutes=retention_minutes)
        
        # メモリに保存
        self._storage[file_id] = {
            "data": df,
            "uploaded_at": datetime.now(),
            "expires_at": expires_at
        }
        
        # ディスクにも保存
        file_path = self._storage_dir / f"{file_id}.pkl"
        with open(file_path, 'wb') as f:
            pickle.dump({
                "data": df,
                "uploaded_at": datetime.now(),
                "expires_at": expires_at
            }, f)
        
        return file_id
    
    def get(self, file_id: str) -> Optional[pd.DataFrame]:
        """データを取得
        
        Args:
            file_id: ファイルID
            
        Returns:
            DataFrame（存在しないまたは期限切れの場合はNone）
        """
        # メモリにあればそこから取得
        if file_id in self._storage:
            item = self._storage[file_id]
            # 期限チェック
            if datetime.now() > item["expires_at"]:
                del self._storage[file_id]
                # ディスクからも削除
                file_path = self._storage_dir / f"{file_id}.pkl"
                if file_path.exists():
                    file_path.unlink()
                return None
            return item["data"]
        
        # メモリになければディスクから読み込み
        file_path = self._storage_dir / f"{file_id}.pkl"
        if not file_path.exists():
            return None
        
        try:
            with open(file_path, 'rb') as f:
                item = pickle.load(f)
            
            # 期限チェック
            if datetime.now() > item["expires_at"]:
                file_path.unlink()
                return None
            
            # メモリにキャッシュ
            self._storage[file_id] = item
            return item["data"]
        except Exception:
            # ファイルが壊れてたら削除
            if file_path.exists():
                file_path.unlink()
            return None
    
    def delete(self, file_id: str) -> bool:
        """データを削除
        
        Args:
            file_id: ファイルID
            
        Returns:
            削除できた場合True
        """
        deleted = False
        
        # メモリから削除
        if file_id in self._storage:
            del self._storage[file_id]
            deleted = True
        
        # ディスクからも削除
        now = time.time()
        
        # メモリ内の期限切れを削除
        expired_ids = [
            file_id for file_id, item in self._storage.items()
            if now > item["expires_at"]
        ]
        for file_id in expired_ids:
            del self._storage[file_id]
            # ディスクからも削除
            file_path = self._storage_dir / f"{file_id}.pkl"
            if file_path.exists():
                file_path.unlink()
        
        # ディスク内の期限切れも確認
        if self._storage_dir.exists():
            for file_path in self._storage_dir.glob("*.pkl"):
                try:
                    with open(file_path, 'rb') as f:
                        item = pickle.load(f)
                    if now > item["expires_at"]:
                        file_path.unlink()
                except Exception:
                    # 壊れてるファイルは削除
                    file_path.unlink()
    
    def cleanup_expired(self):
        """期限切れのデータを削除"""
        now = datetime.now()
        expired_ids = [
            file_id for file_id, item in self._storage.items()
            if now > item["expires_at"]
        ]
        for file_id in expired_ids:
            del self._storage[file_id]
    
    def get_storage_info(self) -> dict:
        """ストレージ情報を取得"""
        return {
            "total_files": len(self._storage),
            "files": [
                {
                    "fileId": file_id,
                    "uploadedAt": item["uploaded_at"].isoformat(),
                    "expiresAt": item["expires_at"].isoformat(),
                    "rowCount": len(item["data"])
                }
                for file_id, item in self._storage.items()
            ]
        }


# グローバルインスタンス
data_store = DataStore()
