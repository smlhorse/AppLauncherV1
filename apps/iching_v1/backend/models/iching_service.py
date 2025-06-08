#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
易經算命程式的主要服務模組
"""

from .value_converter import ValueConverter
from .gua_calculator import GuaCalculator
from .logger import Logger

class IChingService:
    """
    處理易經算命的主要服務類別
    """
    
    def __init__(self):
        """初始化易經服務"""
        self.value_converter = ValueConverter()
        self.gua_calculator = GuaCalculator()
        self.logger = Logger()
    
    def _extract_input_data(self, data):
        """
        從請求資料中提取輸入資訊
        
        Args:
            data: 請求資料字典
            
        Returns:
            tuple: (是否個人占卜, 姓名A, 姓名B, 數字A, 數字B, 是否使用姓名, 是否使用數字)
        """
        divination_type = data.get('divination_type', 'personal')
        is_personal = divination_type == 'personal'
        
        name_a = data.get('nameA', '')
        name_b = data.get('nameB', '')
        person_number_a = data.get('person_numberA', '')
        person_number_b = data.get('person_numberB', '')
        
        use_name = bool(name_a or name_b)
        use_number = bool(person_number_a or person_number_b)
        
        return is_personal, name_a, name_b, person_number_a, person_number_b, use_name, use_number
    
    def _calculate_heaven_earth_values(self, is_personal, use_name, use_number, 
                                      name_a, name_b, person_number_a, person_number_b):
        """
        計算天地數值和用於變爻的輸入字串
        
        Args:
            is_personal: 是否為個人占卜
            use_name: 是否使用姓名
            use_number: 是否使用數字
            name_a: 姓名A
            name_b: 姓名B
            person_number_a: 數字A
            person_number_b: 數字B
            
        Returns:
            tuple: (天數, 地數, 用於變爻的輸入)
        """
        if is_personal:
            # 個人占卜
            if use_name:
                heaven_value, earth_value = self.value_converter.split_personal_input({
                    'nameA': name_a,
                    'nameB': name_b
                }, is_name=True)
                input_for_change = f"{name_a}{name_b}"
            elif use_number:
                heaven_value, earth_value = self.value_converter.split_personal_input(
                    person_number_a, is_name=False
                )
                input_for_change = person_number_a
            else:
                heaven_value, earth_value = 0, 0
                input_for_change = ""
        else:
            # 配對占卜
            if use_name:
                heaven_value, earth_value = self.value_converter.split_pair_input(name_a, name_b)
                input_for_change = f"{name_a}{name_b}"
            elif use_number:
                heaven_value, earth_value = self.value_converter.split_pair_input(
                    person_number_a, person_number_b
                )
                input_for_change = f"{person_number_a}{person_number_b}"
            else:
                heaven_value, earth_value = 0, 0
                input_for_change = ""
                
        return heaven_value, earth_value, input_for_change
    
    def _get_stroke_info(self, use_name, use_number, is_personal, name_a, name_b, person_number_a, person_number_b):
        """
        獲取筆劃資訊
        
        Args:
            use_name: 是否使用姓名
            use_number: 是否使用數字
            is_personal: 是否為個人占卜
            name_a: 姓名A
            name_b: 姓名B
            person_number_a: 數字A
            person_number_b: 數字B
            
        Returns:
            dict: 筆劃資訊
        """
        if use_name:
            return self.gua_calculator.calculate_stroke_info(name_a, name_b, is_personal=is_personal)
        elif use_number:
            if is_personal:
                return {
                    "A": {"name": person_number_a, "stroke": [{"character": person_number_a, "stroke": person_number_a}]},
                    "B": {"name": "", "stroke": []}
                }
            else:
                return {
                    "A": {"name": person_number_a, "stroke": [{"character": person_number_a, "stroke": person_number_a}]},
                    "B": {"name": person_number_b, "stroke": [{"character": person_number_b, "stroke": person_number_b}]}
                }
        else:
            return {}
    
    def calculate_divination(self, data):
        """
        計算占卜結果
        
        Args:
            data: 占卜請求資料
                - divination_type: 占卜類型 ('personal' 或 'pair')
                - nameA: 姓氏或第一個人的名字
                - nameB: 名字或第二個人的名字
                - person_numberA: 個人數字或第一個人的數字
                - person_numberB: 空值或第二個人的數字
            
        Returns:
            dict: 占卜結果
        """
        try:
            # 記錄使用者輸入
            log_entry = self.logger.log_user_input(data)
            
            # 提取輸入資料
            is_personal, name_a, name_b, person_number_a, person_number_b, use_name, use_number = self._extract_input_data(data)
            
            # 計算天地數值
            heaven_value, earth_value, input_for_change = self._calculate_heaven_earth_values(
                is_personal, use_name, use_number, name_a, name_b, person_number_a, person_number_b
            )
            
            # 計算總和，用於變爻
            total_value = self.value_converter.convert_to_value(input_for_change)
            
            # 計算本卦
            current_gua = self.gua_calculator.calculate_current_gua(heaven_value, earth_value)
            
            # 計算變爻位置
            change_position = self.gua_calculator.calculate_change_position(total_value)
            
            # 計算變卦
            changing_gua = self.gua_calculator.calculate_changing_gua(current_gua, change_position)
            
            # 計算筆劃資訊
            stroke_info = self._get_stroke_info(
                use_name, use_number, is_personal, name_a, name_b, person_number_a, person_number_b
            )
            
            # 整理結果
            result = {
                "stroke_info": stroke_info,
                "gua_info": {
                    "current_gua": current_gua,
                    "changing_gua": changing_gua,
                    "change_position": change_position
                },
                "logs": [log_entry]
            }
            
            return result
        
        except Exception as e:
            # 記錄錯誤並重新拋出
            self.logger.log_error(f"計算占卜結果時發生錯誤: {str(e)}")
            raise