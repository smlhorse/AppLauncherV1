/**
 * 易經算命程式的 API 客戶端
 */
import type { DivinationRequest, DivinationResponse } from '@applauncher/shared-types';
/**
 * 易經算命 API 客戶端
 */
export declare class IChingApiClient {
    /**
     * 發送占卜請求
     *
     * @param request - 占卜請求資料
     * @returns 占卜結果
     */
    static calculate(request: DivinationRequest): Promise<DivinationResponse>;
}
