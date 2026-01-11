"""データローダー"""
import pandas as pd
from pathlib import Path
from typing import List
from app.utils.constants import REQUIRED_COLUMNS, COLUMN_MAPPING
from app.utils.exceptions import FileFormatError, ValidationError


def load_tsv_file(file_path: str) -> pd.DataFrame:
    """TSVファイルを読み込む
    
    Args:
        file_path: TSVファイルパス
        
    Returns:
        DataFrame
        
    Raises:
        FileFormatError: ファイル読み込みエラー
    """
    try:
        df = pd.read_csv(file_path, sep='\t', encoding='utf-8')
        return df
    except UnicodeDecodeError:
        # UTF-8で読めない場合はShift-JISで試す
        try:
            df = pd.read_csv(file_path, sep='\t', encoding='shift_jis')
            return df
        except Exception as e:
            raise FileFormatError(f"Failed to load TSV file: {e}")
    except Exception as e:
        raise FileFormatError(f"Failed to load TSV file: {e}")


def validate_columns(df: pd.DataFrame) -> bool:
    """必須カラムの存在確認
    
    Args:
        df: DataFrame
        
    Returns:
        True if valid
        
    Raises:
        ValidationError: 必須カラムが不足
    """
    missing_columns = set(REQUIRED_COLUMNS) - set(df.columns)
    if missing_columns:
        raise ValidationError(
            f"Missing required columns: {', '.join(missing_columns)}"
        )
    return True


def clean_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """カラム名をクリーンアップ（空白除去）
    
    Args:
        df: DataFrame
        
    Returns:
        クリーンアップされたDataFrame
    """
    df.columns = df.columns.str.strip()
    return df


def calculate_data_stats(df: pd.DataFrame) -> dict:
    """データの統計情報を計算
    
    Args:
        df: DataFrame
        
    Returns:
        統計情報の辞書
    """
    # レースごとにグループ化
    race_groups = df.groupby(['競馬場', '開催年', '開催日', 'レース番号'])
    total_races = len(race_groups)
    
    # 日付範囲
    dates = df['開催日'].astype(str).unique()
    date_range = {
        "start": min(dates) if len(dates) > 0 else "",
        "end": max(dates) if len(dates) > 0 else ""
    }
    
    # 競馬場リスト
    racecourses = df['競馬場'].unique().tolist()
    
    # 芝/ダート
    surfaces = df['芝ダ区分'].unique().tolist()
    
    # 距離範囲
    distances = df['距離'].dropna()
    distance_range = {
        "min": int(distances.min()) if len(distances) > 0 else 0,
        "max": int(distances.max()) if len(distances) > 0 else 0
    }
    
    # 予測精度（予測1位が実際に1-3位に入った割合）
    pred_1st = df[df['予測順位'] == 1]
    if len(pred_1st) > 0:
        rank1_hit = len(pred_1st[pred_1st['確定着順'] == 1])
        rank1_3_hit = len(pred_1st[pred_1st['確定着順'] <= 3])
        rank1_hit_rate = rank1_hit / len(pred_1st)
        rank1_3_hit_rate = rank1_3_hit / len(pred_1st)
    else:
        rank1_hit_rate = 0.0
        rank1_3_hit_rate = 0.0
    
    # 平均予測誤差
    prediction_errors = (df['確定着順'] - df['予測順位']).abs()
    avg_prediction_error = prediction_errors.mean()
    
    return {
        "totalRaces": total_races,
        "totalHorses": len(df),
        "averageHorsesPerRace": len(df) / total_races if total_races > 0 else 0,
        "dateRange": date_range,
        "racecourses": racecourses,
        "surfaces": surfaces,
        "distanceRange": distance_range,
        "predictionAccuracy": {
            "rank1HitRate": round(rank1_hit_rate, 3),
            "rank1_3HitRate": round(rank1_3_hit_rate, 3),
            "averagePredictionError": round(avg_prediction_error, 2)
        }
    }


def get_preview_data(df: pd.DataFrame, limit: int = 20, offset: int = 0) -> dict:
    """プレビュー用のデータを取得
    
    Args:
        df: DataFrame
        limit: 取得件数
        offset: オフセット
        
    Returns:
        データのリスト
    """
    preview_df = df.iloc[offset:offset + limit]
    # NaNをNoneに変換
    rows = preview_df.where(pd.notna(preview_df), None).to_dict('records')
    
    return {
        "rows": rows,
        "total": len(df),
        "limit": limit,
        "offset": offset
    }
