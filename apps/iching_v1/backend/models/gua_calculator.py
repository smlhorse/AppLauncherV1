#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
易經算命程式的卦象計算模組
"""

from functools import lru_cache
from .value_converter import ValueConverter
from .gua_data_reader import GuaDataReader


class GuaCalculator:
    """
    處理卦象計算的類別
    """
    
    def __init__(self):
        """初始化卦象計算器"""
        self.data_reader = GuaDataReader()
    
    @staticmethod
    @lru_cache(maxsize=64)
    def calculate_gua_numbers(heaven_value, earth_value):
        """
        計算上下卦的數字
        
        Args:
            heaven_value: 天數值
            earth_value: 地數值
            
        Returns:
            tuple: (上卦數, 下卦數)
        """
        heaven_num = heaven_value % 8 or 8
        earth_num = earth_value % 8 or 8
        
        return heaven_num, earth_num

    @staticmethod
    @lru_cache(maxsize=128)
    def calculate_change_position(total_value):
        """
        計算變爻位置
        
        Args:
            total_value: 總數值
            
        Returns:
            int: 變爻位置 (1-6)
        """
        return total_value % 6 or 6
    
    @lru_cache(maxsize=64)
    def calculate_current_gua(self, heaven_value, earth_value):
        """
        計算本卦
        
        Args:
            heaven_value: 天數值
            earth_value: 地數值
            
        Returns:
            dict: 本卦資料
        """
        # 計算上下卦數
        heaven_num, earth_num = self.calculate_gua_numbers(heaven_value, earth_value)
        
        # 獲取對應的六十四卦資料
        return self.data_reader.get_sixty_four_gua_by_heaven_earth(heaven_num, earth_num)
    
    def calculate_changing_gua(self, current_gua, change_position):
        """
        計算變卦
        
        Args:
            current_gua: 本卦資料
            change_position: 變爻位置
            
        Returns:
            dict: 變卦資料
        """
        if not current_gua or 'binary' not in current_gua:
            return {}
        
        # 獲取本卦的二進位表示
        binary = current_gua['binary']
        
        # 變爻位置是從下往上數，所以需要反轉位置
        reversed_position = 6 - change_position  # 0-based indexing
        
        if 0 <= reversed_position < len(binary):
            # 使用 XOR 來切換爻的值: '0' -> '1', '1' -> '0'
            # 將二進位字串轉成列表，修改後再合併回字串
            binary_list = list(binary)
            binary_list[reversed_position] = '1' if binary_list[reversed_position] == '0' else '0'
            new_binary = ''.join(binary_list)
            
            # 獲取對應的變卦資料
            return self.data_reader.get_sixty_four_gua_by_binary(new_binary)
            
        return {}
    
    def calculate_stroke_info(self, name_a, name_b=None, is_personal=True):
        """
        計算輸入值的筆劃資訊
        
        Args:
            name_a: 姓氏或第一個人的名字
            name_b: 名字或第二個人的名字
            is_personal: 是否為個人占卜
            
        Returns:
            dict: 筆劃資訊
        """
        # 初始化結果結構
        stroke_info = {
            "A": {"name": name_a, "stroke": []},
            "B": {"name": name_b, "stroke": []}
        }
        
        # 處理單個字元的函數
        def process_character(char):
            if not char.strip():  # 忽略空白
                return None
                
            # 判斷是否為中文字符
            is_chinese = 0x4E00 <= ord(char) <= 0x9FFF
            stroke = ValueConverter.get_strokes_for_chinese(char) if is_chinese else ValueConverter.convert_to_value(char)
            
            return {
                "character": char,
                "stroke": stroke
            }
        
        # 計算A的筆劃資訊
        stroke_info["A"]["stroke"] = [
            result for char in name_a 
            if (result := process_character(char)) is not None
        ]
                
        # 計算B的筆劃資訊
        if name_b:
            stroke_info["B"]["stroke"] = [
                result for char in name_b 
                if (result := process_character(char)) is not None
            ]
                
        return stroke_info
