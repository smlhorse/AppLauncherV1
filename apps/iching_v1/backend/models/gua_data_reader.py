#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
易經算命程式的卦象資料讀取模組
"""

import os
import json
import config

class GuaDataReader:
    """
    處理卦象資料讀取的類別
    """
    
    def __init__(self):
        """初始化卦象資料讀取器"""
        self.eight_gua_data = self._load_json_data(config.EIGHT_GUA_PATH)
        self.sixty_four_gua_data = self._load_json_data(config.SIXTY_FOUR_GUA_PATH)
        
    def _load_json_data(self, file_path):
        """
        讀取 JSON 資料檔案
        
        Args:
            file_path: JSON 檔案路徑
            
        Returns:
            dict: 讀取的 JSON 資料
        """
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                # 處理 JSON 檔案開頭可能的註解行
                content = file.read()
                if content.startswith("//"):
                    # 去除第一行註解
                    content = "\n".join(content.split("\n")[1:])
                return json.loads(content)
        except Exception as e:
            print(f"無法讀取卦象資料: {str(e)}")
            return {}
    
    def get_eight_gua(self, gua_id):
        """
        根據 ID 獲取八卦資料
        
        Args:
            gua_id: 八卦的 ID
            
        Returns:
            dict: 八卦的資料
        """
        return self.eight_gua_data.get(str(gua_id), {})
    
    def get_sixty_four_gua_by_id(self, gua_id):
        """
        根據 ID 獲取六十四卦資料
        
        Args:
            gua_id: 六十四卦的 ID
            
        Returns:
            dict: 六十四卦的資料
        """
        return self.sixty_four_gua_data.get(str(gua_id), {})
    
    def get_sixty_four_gua_by_heaven_earth(self, heaven_id, earth_id):
        """
        根據上下卦 ID 獲取六十四卦資料
        
        Args:
            heaven_id: 上卦 ID
            earth_id: 下卦 ID
            
        Returns:
            dict: 六十四卦的資料
        """
        for gua_id, gua_data in self.sixty_four_gua_data.items():
            if (gua_data.get("id_heaven") == heaven_id and
                    gua_data.get("id_earth") == earth_id):
                return gua_data
        return {}
    
    def get_sixty_four_gua_by_binary(self, binary):
        """
        根據二進位表示獲取六十四卦資料
        
        Args:
            binary: 卦象的二進位表示
            
        Returns:
            dict: 六十四卦的資料
        """
        for gua_id, gua_data in self.sixty_four_gua_data.items():
            if gua_data.get("binary") == binary:
                return gua_data
        return {}
