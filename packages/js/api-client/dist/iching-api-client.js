"use strict";
/**
 * 易經算命程式的 API 客戶端
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IChingApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
// API 基礎 URL
const API_BASE_URL = 'http://localhost:8001/api';
/**
 * 易經算命 API 客戶端
 */
class IChingApiClient {
    /**
     * 發送占卜請求
     *
     * @param request - 占卜請求資料
     * @returns 占卜結果
     */
    static async calculate(request) {
        try {
            const response = await axios_1.default.post(`${API_BASE_URL}/iching/calculate`, request);
            return response.data;
        }
        catch (error) {
            console.error('占卜請求失敗:', error);
            throw error;
        }
    }
}
exports.IChingApiClient = IChingApiClient;
