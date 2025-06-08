"""
易經算命程式的數值轉換模組
"""

import re
from functools import lru_cache

class ValueConverter:
    """
    處理輸入值轉換為數值的類別
    """
    @staticmethod
    @lru_cache(maxsize=1024)
    def get_strokes_for_chinese(character: str) -> int | None:
        """
        優先用 strokes 套件取得中文字筆劃，失敗時回傳 None
        """
        try:
            from strokes import strokes
            return strokes(character)
        except Exception:
            return None
    
    
    @staticmethod
    @lru_cache(maxsize=128)
    def calculate_string_strokes(input_string: str) -> int:
        """
        計算字符串中所有字符的筆劃總和
        使用 lru_cache 優化重複計算
        """
        if not input_string:
            return 0
            
        total_strokes = 0
        for char in input_string:
            if 0x4E00 <= ord(char) <= 0x9FFF:  # 中文字符範圍
                strokes = ValueConverter.get_strokes_for_chinese(char)
                total_strokes += strokes if strokes is not None else 0
            elif char.isalpha():
                total_strokes += 1  # 英文字符，默認為 1
            elif char.isdigit():
                total_strokes += int(char)  # 數字，直接使用其值
            # 其他字符默認為 0，不需要加入計算
                
        return total_strokes
    
    @staticmethod
    @lru_cache(maxsize=256)
    def convert_to_value(input_val):
        """
        將輸入值轉換為數值
        
        Args:
            input_val: 輸入的值，可以是數字或文字
            
        Returns:
            int: 轉換後的數值
        """
        # 去除所有空白字符並轉為字串
        input_val = str(input_val).strip()
        
        if not input_val:
            return 0
        
        # 判斷是否為數值型態
        if re.match(r"^[0-9]+$", input_val):
            # 若為數值，將每個數字加總
            return sum(int(digit) for digit in input_val)
        
        # 判斷是否為純英文
        if re.match(r"^[a-zA-Z]+$", input_val):
            return len(input_val)  # 返回字符數量，比固定返回1更有意義
        
        # 若為中文或混合字符，計算筆劃總和
        return ValueConverter.calculate_string_strokes(input_val)
    
    @staticmethod
    def split_personal_input(input_val, is_name=True):
        """
        將個人輸入值拆分為天數和地數
        
        Args:
            input_val: 輸入值
            is_name: 是否為姓名
            
        Returns:
            tuple: (天數, 地數)
        """
        if is_name:
            # 姓為天，名為地
            if isinstance(input_val, dict):
                heaven = input_val.get("nameA", "")
                earth = input_val.get("nameB", "")
            else:
                # 若只提供一個字串，取第一個字作為姓
                heaven = input_val[0] if input_val else ""
                earth = input_val[1:] if len(input_val) > 1 else ""
        else:
            # 數字的情況，按照長度一分為二
            input_str = str(input_val)
            length = len(input_str)
            
            # 前半部分為天，後半部分為地
            mid_point = length // 2
            if length % 2 != 0:  # 無法整除
                # 前半少，後半多
                heaven = input_str[:mid_point]
                earth = input_str[mid_point:]
            else:
                heaven = input_str[:mid_point]
                earth = input_str[mid_point:]
        
        # 轉換為數值
        heaven_value = ValueConverter.convert_to_value(heaven)
        earth_value = ValueConverter.convert_to_value(earth)
        
        return heaven_value, earth_value
    
    @staticmethod
    def split_pair_input(input_a, input_b):
        """
        將配對輸入值拆分為天數和地數
        
        Args:
            input_a: 第一個輸入值
            input_b: 第二個輸入值
            
        Returns:
            tuple: (天數, 地數)
        """
        # A為天，B為地
        heaven_value = ValueConverter.convert_to_value(input_a)
        earth_value = ValueConverter.convert_to_value(input_b)
        
        return heaven_value, earth_value




