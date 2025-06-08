/**
 * 易經算命程式的 API 客戶端
 */

import axios from 'axios';
import type { DivinationRequest, DivinationResponse } from '@applauncher/shared-types';
import { getApiBaseUrl } from './config';

// API 基礎 URL 現在從配置系統獲取
const API_BASE_URL = getApiBaseUrl();

// 獲取應用ID，如果從移動端運行則嘗試從app-config導入
let APP_ID = 'iching-default-app-id';

try {
  // 動態導入應用配置
  if (typeof require !== 'undefined') {
    const appConfig = require('../../../apps/iching_v1/frontend/mobile/src/api-servers.js').APP_CONFIG;
    if (appConfig && appConfig.appId) {
      APP_ID = appConfig.appId;
    }
  }
} catch (e) {
  // 忽略錯誤，使用預設APP_ID
  console.warn('未找到應用配置，使用預設APP_ID');
}

/**
 * 易經算命 API 客戶端
 */
export class IChingApiClient {
  /**
   * 發送占卜請求
   * 
   * @param request - 占卜請求資料
   * @returns 占卜結果
   */
  static async calculate(request: DivinationRequest): Promise<DivinationResponse> {
    try {
      const response = await axios.post<DivinationResponse>(
        `${API_BASE_URL}/iching/calculate`, 
        request
      );
      return response.data;
    } catch (error) {
      console.error('占卜請求失敗:', error);
      throw error;
    }
  }
}
