#!/bin/bash
# 開発サーバー安定化スクリプト
# 使い方: ./scripts/dev-server.sh

PORT=3000
PROJECT_DIR="/Users/m.kubota/code/mote-iq"

# 色付き出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 モテIQ 開発サーバー起動スクリプト${NC}"
echo "=================================="

# 既存のNextプロセスを終了
cleanup() {
    echo -e "${YELLOW}🧹 既存のプロセスをクリーンアップ中...${NC}"
    pkill -f "next-server" 2>/dev/null
    pkill -f "next dev" 2>/dev/null
    lsof -ti :$PORT | xargs kill -9 2>/dev/null
    sleep 2
}

# サーバー起動
start_server() {
    echo -e "${GREEN}🔄 サーバーを起動中 (ポート: $PORT)...${NC}"
    cd "$PROJECT_DIR"
    npm run dev
}

# メイン処理
cleanup
start_server
