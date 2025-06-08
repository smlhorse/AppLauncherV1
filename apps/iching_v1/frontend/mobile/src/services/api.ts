import { DivinationRequest, DivinationResponse } from '@applauncher/shared-types';
import axios from 'axios';
import { API_URL } from '@env';

/**
 * 易經算命 API 服務
 */
export const apiService = {
  /**
   * 發送占卜請求
   * @param request 占卜請求數據
   * @returns 占卜結果
   */
  calculate: async (request: DivinationRequest): Promise<DivinationResponse> => {
    try {
      const response = await axios.post<DivinationResponse>(
        `${API_URL}/calculate`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('占卜請求失敗:', error);
      throw error;
    }
  }
};
