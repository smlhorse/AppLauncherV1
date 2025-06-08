#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
易經算命程式的主要應用程式
"""

import os
import sys
import datetime
import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from functools import wraps

# 添加專案根目錄到系統路徑
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(current_dir))))
sys.path.append(root_dir)

import config
from routes.iching_routes import iching_bp

# 建立 Flask 應用程式
app = Flask(__name__)
# 擴展 CORS 設定，確保所有來源都可以訪問 API，並支援所有必要的方法和頭信息
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  # 允許所有來源
        "methods": ["GET", "POST", "OPTIONS", "HEAD"],  # 支持的 HTTP 方法
        "allow_headers": ["Content-Type", "Authorization", "X-App-ID", "Accept"],  # 支持的頭信息
        "max_age": 3600  # 預檢請求結果的緩存時間（秒）
    }
})

# 註冊藍圖
app.register_blueprint(iching_bp)

# 添加健康檢查端點
@app.route('/api/health', methods=['GET'])
def health_check():
    """健康檢查端點"""
    # 獲取服務器 IP 地址
    import socket
    hostname = socket.gethostname()
    try:
        # 嘗試獲取本地 IP 地址
        local_ip = socket.gethostbyname(hostname)
    except:
        local_ip = "未知"
    
    # 返回詳細的健康狀態信息
    return jsonify({
        'status': 'ok', 
        'message': 'API server is running',
        'timestamp': datetime.datetime.now().isoformat(),
        'hostname': hostname,
        'ip': local_ip,
        'port': config.PORT
    }), 200

# 檢查資料檔案是否存在
@app.before_first_request
def check_data_files():
    """檢查必要的資料檔案是否存在"""
    required_files = [
        config.EIGHT_GUA_PATH,
        config.SIXTY_FOUR_GUA_PATH
    ]
    
    for file_path in required_files:
        if not os.path.exists(file_path):
            app.logger.error(f"找不到必要的資料檔案 {file_path}")
            return jsonify({"error": "Server configuration error: Missing data files"}), 500

# 首頁
@app.route('/')
def home():
    """首頁路由"""
    return jsonify({
        'message': '易經算命程式 API',
        'version': '1.0.0',
        'endpoints': [
            '/api/iching/calculate'
        ]
    })

# 健康檢查端點 (API 路徑版本)
@app.route('/api/health')
def api_health():
    """API健康檢查"""
    return jsonify({
        'status': 'ok',
        'time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'service': 'iching-api',
        'version': '1.0.0'
    })

# 健康檢查端點 (根路徑版本，適用於移動應用)
@app.route('/health')
def health():
    """API健康檢查 (根路徑版本)"""
    return jsonify({
        'status': 'ok',
        'time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'service': 'iching-api',
        'version': '1.0.0'
    })

# 錯誤處理
@app.errorhandler(404)
def not_found(error):
    """處理 404 錯誤"""
    return jsonify({'error': 'Not Found'}), 404

@app.errorhandler(500)
def server_error(error):
    """處理 500 錯誤"""
    return jsonify({'error': 'Internal Server Error'}), 500

# 加入路由調試助手
@app.route('/debug/routes', methods=['GET'])
def debug_routes():
    """顯示所有註冊的路由，用於調試"""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': ','.join(rule.methods),
            'route': str(rule)
        })
    return jsonify(routes)

# 打印所有已註冊的路由，用於調試
def print_registered_routes():
    """打印所有已註冊的路由"""
    print("\n=== 已註冊的路由 ===")
    for rule in app.url_map.iter_rules():
        print(f"路由: {rule}, 端點: {rule.endpoint}, 方法: {rule.methods}")
    print("=====================\n")

# 主程式進入點
if __name__ == '__main__':
    # 確保日誌目錄存在
    os.makedirs(config.USER_INPUT_LOGS_DIR, exist_ok=True)
    os.makedirs(config.ERROR_LOGS_DIR, exist_ok=True)
    
    # 啟用調試模式
    app.debug = True
    
    # 打印註冊的路由
    print_registered_routes()
    
    print(f"易經算命程式 API 啟動於 http://localhost:{config.PORT}")
    print(f"調試路由列表: http://localhost:{config.PORT}/debug/routes")
    app.run(host='0.0.0.0', port=config.PORT, debug=True)
