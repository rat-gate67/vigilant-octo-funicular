from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンからのリクエストを許可
    allow_credentials=True,
    allow_methods=["GET"],  # GETメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)


# Blockstream APIのエンドポイント
BLOCKSTREAM_API_URL = "https://blockstream.info/api"

@app.get("/latest_block")
async def get_latest_block():
    try:
        # 最新のブロック高さを取得
        height_response = requests.get(f"{BLOCKSTREAM_API_URL}/blocks/tip/height")
        if height_response.status_code != 200:
            raise HTTPException(status_code=height_response.status_code, detail="Failed to fetch block height")
        latest_block_height = height_response.text

        # 最新のブロックハッシュを取得
        hash_response = requests.get(f"{BLOCKSTREAM_API_URL}/block-height/{latest_block_height}")
        if hash_response.status_code != 200:
            raise HTTPException(status_code=hash_response.status_code, detail="Failed to fetch block hash")
        latest_block_hash = hash_response.text

        # ブロックの詳細情報を取得
        block_response = requests.get(f"{BLOCKSTREAM_API_URL}/block/{latest_block_hash}")
        if block_response.status_code != 200:
            raise HTTPException(status_code=block_response.status_code, detail="Failed to fetch block data")
        block_data = block_response.json()

        return {
            "block_height": latest_block_height,
            "block_hash": latest_block_hash,
            "block_data": block_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

