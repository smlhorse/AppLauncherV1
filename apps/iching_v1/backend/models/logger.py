#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
易經算命程式的日誌模組
"""

import os
import json
import logging
from datetime import datetime
import config

class Logger:
    """
    處理日誌記錄功能的類別
    """
    def __init__(self):
        self.user_input_log_dir = config.USER_INPUT_LOGS_DIR
        self.error_log_dir = config.ERROR_LOGS_DIR
        self._setup_loggers()

    def _setup_loggers(self):
        """
        設定日誌記錄器
        """
        # 確保日誌目錄存在
        os.makedirs(self.user_input_log_dir, exist_ok=True)
        os.makedirs(self.error_log_dir, exist_ok=True)

        # 設定錯誤日誌
        self.error_logger = logging.getLogger("iching_v1_error")
        self.error_logger.setLevel(logging.ERROR)
        
        error_log_file = os.path.join(self.error_log_dir, f"iching_v1_{datetime.now().strftime('%Y%m%d')}.log")
        
        error_handler = logging.FileHandler(error_log_file, encoding="utf-8")
        error_handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
        self.error_logger.addHandler(error_handler)

    def log_user_input(self, input_data):
        """
        記錄使用者輸入資訊
        
        Args:
            input_data: 使用者輸入的資料
        
        Returns:
            記錄的日誌資訊，包含時間戳記和輸入值
        """
        timestamp = datetime.now().isoformat()
        log_entry = {"timestamp": timestamp, "input_value": input_data}
        
        try:
            # 使用當天日期作為檔名
            today = datetime.now().strftime("%Y%m%d")
            log_file_path = os.path.join(self.user_input_log_dir, f"{today}.log")
            
            # 寫入日誌
            with open(log_file_path, "a", encoding="utf-8") as log_file:
                log_file.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
                
            return log_entry
        except Exception as e:
            self.log_error(f"無法記錄使用者輸入: {str(e)}")
            return log_entry

    def log_error(self, error_message):
        """
        記錄錯誤訊息
        
        Args:
            error_message: 錯誤訊息內容
        """
        self.error_logger.error(error_message)
