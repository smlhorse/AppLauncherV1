#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
易經算命程式的路由設定
"""

from flask import Blueprint, request, jsonify
from models.iching_service import IChingService
from models.logger import Logger

# 建立藍圖
iching_bp = Blueprint('iching', __name__, url_prefix='/api/iching')

# 初始化服務和日誌 (使用單例模式)
iching_service = IChingService()
logger = Logger()

@iching_bp.route('/calculate', methods=['POST'])
def calculate():
    """
    計算易經卦象的 API 端點
    
    請求:
        JSON 格式，包含以下欄位：
            - divination_type: "personal" 或 "pair" (個人或配對占卜)
            - nameA: 個人占卜為姓氏、配對占卜時為第一位的姓名
            - nameB: 個人占卜為名字、配對占卜時為第二位的姓名
            - person_numberA: 個人占卜為輸入的數字、配對占卜時為第一位的數字
            - person_numberB: 個人占卜為空值、配對占卜時為第二位的數字
    
    回應:
        JSON 格式，包含卦象資訊
    """
    try:
        # 獲取請求資料
        data = request.get_json(silent=True)
        
        # 驗證請求資料存在
        if not data:
            return jsonify({'error': 'Invalid JSON data'}), 400
            
        # 驗證必要欄位是否存在
        if 'divination_type' not in data:
            return jsonify({'error': 'Missing required field: divination_type'}), 400
            
        # 檢查輸入資料是否有效
        name_a = data.get('nameA', '')
        name_b = data.get('nameB', '')
        person_number_a = data.get('person_numberA', '')
        person_number_b = data.get('person_numberB', '')
        
        # 確保至少提供一個輸入值
        if not any([name_a, name_b, person_number_a, person_number_b]):
            return jsonify({'error': 'At least one input value is required (name or number)'}), 400
        
        # 檢查占卜類型是否有效
        if data['divination_type'] not in ['personal', 'pair']:
            return jsonify({'error': 'Invalid divination_type. Must be "personal" or "pair"'}), 400
        
        # 計算卦象
        result = iching_service.calculate_divination(data)
        
        return jsonify(result)
    
    except ValueError as e:
        # 處理資料驗證錯誤
        logger.log_error(f"資料驗證錯誤: {str(e)}")
        return jsonify({'error': f'Validation error: {str(e)}'}), 400
        
    except Exception as e:
        # 記錄其他錯誤
        logger.log_error(f"計算過程錯誤: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500