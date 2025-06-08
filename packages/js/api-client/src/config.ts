/**
 * API 客戶端配置
 */

// 環境變量
export type Environment = 'development' | 'production' | 'mobile';

// API 配置介面
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;  // 請求超時時間（毫秒）
  retries?: number;  // 重試次數
}

// 定義可能在不同環境中的全局變數
declare const global: any;

// 定義全局變數以儲存 API 服務器信息
interface Window {
  PREFERRED_IP?: string;
  API_SERVERS?: string[];
}

// 不同環境的 API 配置
const configs: Record<Environment, ApiConfig> = {
  development: {
    baseUrl: 'http://localhost:8001/api',
  },
  production: {
    baseUrl: '/api', // 相對路徑用於生產環境
  },  mobile: {
    // 動態生成的 API URL，支持多種網絡環境
    // 若有自動檢測到的 IP，會優先使用該 IP
    baseUrl: typeof window !== 'undefined' && window.PREFERRED_IP 
      ? `http://${window.PREFERRED_IP}:8001/api` 
      : 'http://172.20.10.2:8001/api',
  },
};

// 獲取當前環境
export function getCurrentEnvironment(): Environment {
  // 在 React Native/Expo 環境中，始終使用 mobile 配置
  if (typeof global !== 'undefined' && (global.navigator?.product === 'ReactNative' || global.__expo)) {
    return 'mobile';
  }
  
  // 在瀏覽器中檢查是否為生產環境
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'production';
  }
  
  // React Native 環境檢測 (可在 app.json 中配置)
  if (typeof global !== 'undefined' && global.__DEV__ === false) {
    return 'production';
  }
  
  return 'development';
}

// 獲取當前環境的 API 配置
export function getApiConfig(): ApiConfig {
  const env = getCurrentEnvironment();
  return configs[env];
}

// 獲取 API 基礎 URL
export function getApiBaseUrl(): string {
  const env = getCurrentEnvironment();
  let baseUrl = configs[env].baseUrl;
  
  // 在移動環境中嘗試多個可能的 IP 地址
  if (env === 'mobile') {
    // 為了防止連接超時，我們會在運行時嘗試多個可能的 IP 地址
    // 這些是常見的熱點 IP 地址模式
    const commonIPs = [
      'http://172.20.10.2:8001/api',  // 常見的 iPhone 熱點 IP
      'http://192.168.43.1:8001/api', // 常見的 Android 熱點 IP
      'http://192.168.1.2:8001/api',  // 常見的家庭網絡 IP
      'http://10.0.0.2:8001/api',     // 常見的辦公網絡 IP
      'http://localhost:8001/api'     // 本機測試 IP
    ];
    
    // 我們可以使用一個全局變量來存儲找到的有效 IP
    if (typeof global !== 'undefined' && global.__VALID_API_URL__) {
      return global.__VALID_API_URL__;
    }
    
    // 設置一個超時函數來嘗試每個 IP 直到找到有效的
    setTimeout(async () => {
      for (const ip of commonIPs) {
        try {          // 嘗試連接到健康檢查端點
          // 注意：我們嘗試多個可能的端點路徑，因為API設計可能有所不同
          const endpoints = ['/health', '/api/health', '/api/iching/health'];
          let success = false;
          
          for (const endpoint of endpoints) {
            try {
              const endpointUrl = ip.endsWith('/api') ? `${ip.slice(0, -4)}${endpoint}` : `${ip}${endpoint}`;
              const response = await fetch(endpointUrl, { 
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                // 較短的超時時間以更快地嘗試下一個 IP
                signal: AbortSignal.timeout(1000) 
              });
              
              if (response.ok) {
                success = true;
                console.log(`找到有效的 API 端點: ${endpointUrl}`);
                break;
              }
            } catch (err) {
              console.log(`端點 ${endpoint} 連接失敗`);
            }
          }
          
          const response = success ? { ok: true } : { ok: false };
          
          if (response.ok) {
            console.log(`找到有效的 API 端點: ${ip}`);
            // 儲存有效的 IP 供將來使用
            if (typeof global !== 'undefined') {
              global.__VALID_API_URL__ = ip;
            }
            break;
          }
        } catch (err) {
          console.log(`IP ${ip} 連接失敗，嘗試下一個...`);
        }
      }
    }, 0);
  }
  
  return baseUrl;
}
