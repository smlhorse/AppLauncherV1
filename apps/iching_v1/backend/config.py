#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
易經算命程式的配置模組
"""

import os

# 主要設定
PORT = 8001  # 後端 Port
DEBUG = False  # 生產環境中應設為 False

# API 配置
ALLOWED_APP_IDS = [
    "62d9f698-3c89-4624-a58f-a2b7e7b6e22d",  # 主要 App ID
    "iching-mobile-app-2025",                # 舊的 App ID (兼容性)
    "iching-app-id-2025"                     # 測試 App ID
]

# 設定 ROOT_DIR 為程式的主目錄
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# 資料來源路徑
DATA_DIR = os.path.join(ROOT_DIR, 'data')
EIGHT_GUA_PATH = os.path.join(DATA_DIR, '_8Gua_mapping.json')
SIXTY_FOUR_GUA_PATH = os.path.join(DATA_DIR, '_64Gua_mapping.json')

# 日誌路徑
LOGS_DIR = os.path.join(ROOT_DIR, 'logs')
USER_INPUT_LOGS_DIR = os.path.join(LOGS_DIR, 'userInputLogs')
ERROR_LOGS_DIR = os.path.join(LOGS_DIR, 'errorLogs')

# 確保日誌目錄存在
os.makedirs(USER_INPUT_LOGS_DIR, exist_ok=True)
os.makedirs(ERROR_LOGS_DIR, exist_ok=True)