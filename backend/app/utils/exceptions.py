"""カスタム例外"""


class FileFormatError(Exception):
    """ファイル形式エラー"""
    pass


class ValidationError(Exception):
    """バリデーションエラー"""
    pass


class DataNotFoundError(Exception):
    """データが見つからない"""
    pass


class StrategyExecutionError(Exception):
    """戦略実行エラー"""
    pass
