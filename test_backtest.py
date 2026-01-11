"""バックテストAPIテスト"""
import requests
import json
import sys

# まずアップロード
print("=== Step 1: TSVファイルアップロード ===", file=sys.stderr)
upload_url = "http://localhost:8000/api/upload"
file_path = "predicted_results/predicted_results_all.tsv"

try:
    with open(file_path, 'rb') as f:
        files = {'file': ('predicted_results_all.tsv', f, 'text/tab-separated-values')}
        upload_response = requests.post(upload_url, files=files)
    
    if upload_response.status_code != 200:
        print(f"❌ アップロード失敗: {upload_response.status_code}", file=sys.stderr)
        sys.exit(1)
    
    upload_result = upload_response.json()
    file_id = upload_result['data']['fileId']
    print(f"✅ アップロード成功！ File ID: {file_id}", file=sys.stderr)
    
    # バックテスト実行
    print("\n=== Step 2: バックテスト実行（WIN戦略） ===", file=sys.stderr)
    backtest_url = "http://localhost:8000/api/backtest"
    backtest_request = {
        "fileId": file_id,
        "strategy": {
            "strategyType": "WIN",
            "betAmount": 100,
            "minOdds": 1.0,
            "maxOdds": 100.0
        }
    }
    
    backtest_response = requests.post(
        backtest_url,
        json=backtest_request,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"ステータスコード: {backtest_response.status_code}", file=sys.stderr)
    
    if backtest_response.status_code == 200:
        backtest_result = backtest_response.json()
        
        # サマリ表示
        summary = backtest_result['data']['summary']
        print("\n=== バックテスト結果サマリ ===", file=sys.stderr)
        print(f"総レース数: {summary['totalRaces']}", file=sys.stderr)
        print(f"購入レース数: {summary['betRaces']}", file=sys.stderr)
        print(f"総購入数: {summary['totalBets']}", file=sys.stderr)
        print(f"総投資額: ¥{summary['totalInvestment']:,.0f}", file=sys.stderr)
        print(f"総払戻額: ¥{summary['totalPayout']:,.0f}", file=sys.stderr)
        print(f"総利益: ¥{summary['totalProfit']:,.0f}", file=sys.stderr)
        print(f"ROI: {summary['roi']:.1f}%", file=sys.stderr)
        print(f"的中率: {summary['hitRate']:.1f}%", file=sys.stderr)
        print(f"的中数: {summary['hitCount']}/{summary['totalBets']}", file=sys.stderr)
        print(f"平均オッズ: {summary['averageOdds']:.2f}倍", file=sys.stderr)
        print(f"1着的中数: {summary['winCount']}", file=sys.stderr)
        print(f"3着以内的中数: {summary['placeCount']}", file=sys.stderr)
        
        # 最初の3件の詳細を表示
        details = backtest_result['data']['details']
        print(f"\n=== 最初の3件の購入詳細 ===", file=sys.stderr)
        for i, detail in enumerate(details[:3], 1):
            print(f"\n{i}. {detail['raceId']}", file=sys.stderr)
            print(f"   馬番: {detail['馬番']}番, オッズ: {detail['オッズ']}倍", file=sys.stderr)
            print(f"   結果: {detail['実際の着順']}着, 的中: {'○' if detail['的中'] else '×'}", file=sys.stderr)
            print(f"   利益: ¥{detail['利益']:,.0f}", file=sys.stderr)
        
        print(f"\n✅ バックテスト成功！", file=sys.stderr)
        
        # 結果をJSON出力
        print(json.dumps(backtest_result, indent=2, ensure_ascii=False))
    else:
        print(f"❌ バックテスト失敗: {backtest_response.text}", file=sys.stderr)
        sys.exit(1)

except Exception as e:
    print(f"❌ エラー: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)
