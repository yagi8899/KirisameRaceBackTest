"""アップロードAPIテスト"""
import requests
import json
import sys

# アップロードテスト
print("=== TSVファイルアップロードテスト ===", file=sys.stderr)
url = "http://localhost:8000/api/upload"
file_path = "predicted_results/predicted_results_all.tsv"

try:
    with open(file_path, 'rb') as f:
        files = {'file': ('predicted_results_all.tsv', f, 'text/tab-separated-values')}
        response = requests.post(url, files=files)

    print(f"ステータスコード: {response.status_code}", file=sys.stderr)
    result = response.json()
    print(json.dumps(result, indent=2, ensure_ascii=False))

    if response.status_code == 200 and result.get('success'):
        file_id = result['data']['fileId']
        print(f"\n✅ アップロード成功！ File ID: {file_id}", file=sys.stderr)
        
        # プレビューテスト
        print("\n=== データプレビューテスト ===", file=sys.stderr)
        preview_url = f"http://localhost:8000/api/upload/{file_id}/preview?limit=3"
        preview_response = requests.get(preview_url)
        print(f"ステータスコード: {preview_response.status_code}", file=sys.stderr)
        
        if preview_response.status_code == 200:
            preview_data = preview_response.json()
            print(f"\n取得件数: {len(preview_data['data']['rows'])}/{preview_data['data']['total']}", file=sys.stderr)
            print("\n✅ プレビュー取得成功！", file=sys.stderr)
        else:
            print(f"❌ プレビュー取得失敗: {preview_response.text}", file=sys.stderr)
    else:
        print(f"❌ アップロード失敗", file=sys.stderr)
except Exception as e:
    print(f"❌ エラー: {e}", file=sys.stderr)
    sys.exit(1)
