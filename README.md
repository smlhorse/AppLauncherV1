# AppLauncherV1 - 易經算命應用程式 詳細規格文件

**版本**: 1.0.0  
**作者**: smlhorse  
**建立日期**: 2025年6月8日  
**最後更新**: 2025年6月9日  
**可見性**: Private（私有儲存庫）

---

## 📋 目錄
1. [應用概述](#應用概述)
2. [系統架構](#系統架構)
3. [技術棧](#技術棧)
4. [專案結構](#專案結構)
5. [核心功能模組](#核心功能模組)
6. [API 規格](#api-規格)
7. [資料模型](#資料模型)
8. [環境配置](#環境配置)
9. [部署與運行](#部署與運行)
10. [開發指南](#開發指南)

---

## 應用概述

### 用途
**AppLauncherV1** 是一個多平台易經算命應用程式，提供個人占卜和配對占卜服務。應用支持通過姓名或數字進行占卜計算，並返回詳細的易經卦象結果。

### 核心特性
- ✅ **雙模式占卜**: 個人占卜 (Personal) 和配對占卜 (Pair)
- ✅ **多種輸入方式**: 支持中文姓名、英文名字和數字輸入
- ✅ **多平台支持**: Web、Mobile (iOS/Android) 和後端 API
- ✅ **卦象計算**: 自動計算本卦、變卦和變爻位置
- ✅ **完整日誌系統**: 記錄用戶輸入和系統錯誤
- ✅ **跨平台 API**: REST API 後端服務

---

## 系統架構

### 整��架構圖
```
┌─────────────────────────────────────────────────┐
│           Frontend Layer (多平台)               │
├─────────────┬──────────────┬────────────────────┤
│   Web App   │  Mobile App  │   其他客戶端      │
│  (Next.js)  │   (Expo)     │                    │
└──────┬──────┴──────┬───────┴────────────────────┘
       │             │
       └─────────────┼────────────────────────┐
                     │                        │
              ┌──────▼─────────┐        ┌────▼──────────┐
              │  API Client    │        │ Shared Layer  │
              │ (@applauncher/ │        │  - Types      │
              │   api-client)  │        │  - Utils      │
              └──────┬─────────┘        └───────────────┘
                     │
         ┌───────────▼───────────┐
         │   Backend API Server  │
         │   (Flask - Python)    │
         │   Port: 8001          │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   Data Layer          │
         │ - I Ching Data        │
         │ - Logs                │
         └───────────────────────┘
```

### 架構層級
1. **表現層** (Presentation)
   - Web 前端 (Next.js)
   - Mobile 前端 (React Native + Expo)

2. **業務層** (Business Logic)
   - API 客戶端 (@applauncher/api-client)
   - 易經服務 (IChingService)
   - 卦象計算 (GuaCalculator)
   - 數值轉換 (ValueConverter)

3. **數據層** (Data)
   - 易經資料 (8卦和64卦映射)
   - 日誌系統

---

## 技術棧

### 後端 (Backend)
| 組件 | 技術 | 版本 |
|------|------|------|
| 框架 | Flask | 2.x |
| 語言 | Python | 3.8+ |
| CORS | flask-cors | Latest |
| 套件管理 | pip | Latest |

### 前端 - Web (Frontend Web)
| 組件 | 技術 | 版本 |
|------|------|------|
| 框架 | Next.js | 14.2.3 |
| UI框架 | React | 18.2.0 |
| 語言 | TypeScript | 5.4.5 |
| 包管理 | pnpm | Latest |

### 前端 - Mobile (Frontend Mobile)
| 組件 | 技術 | 版本 |
|------|------|------|
| 框架 | Expo | ~53.0.10 |
| UI框架 | React Native | 0.79.3 |
| 語言 | TypeScript | ~5.8.3 |
| 包管理 | pnpm | Latest |

### 共享層 (Shared)
| 模塊 | 用途 | 技術 |
|------|------|------|
| @applauncher/shared-types | 類型定義 | TypeScript |
| @applauncher/shared-utils | 工具函數 | TypeScript |
| @applauncher/api-client | API 客戶端 | Axios + TypeScript |

### 開發工具
- **Monorepo 管理**: pnpm workspace
- **類型檢查**: TypeScript
- **語言**: Python (Backend), TypeScript (Frontend)

---

## 專案結構

### 整體目錄結構
```
AppLauncherV1/
├── apps/                          # 應用程式
│   └── iching_v1/
│       ├── backend/               # Python 後端服務
│       │   ├── app.py            # Flask 主應用
│       │   ├── config.py          # 配置文件
│       │   ├── models/            # 業務邏輯層
│       │   │   ├── iching_service.py      # 易經服務
│       │   │   ├── gua_calculator.py      # 卦象計算
│       │   │   ├── value_converter.py     # 數值轉換
│       │   │   ├── gua_data_reader.py     # 資料讀取
│       │   │   └── logger.py              # 日誌模組
│       │   ├── routes/            # 路由層
│       │   │   └── iching_routes.py       # 易經 API 路由
│       │   └── __init__.py
│       └── frontend/              # 前端應用
│           ├── web/              # Web 應用 (Next.js)
│           │   ├── app/
│           │   ├── package.json
│           │   └── tsconfig.json
│           └── mobile/           # Mobile 應用 (Expo)
│               ├── src/
│               ├── app.json
│               ├── package.json
│               └── tsconfig.json
├── packages/js/                   # 共享 JavaScript 包
│   ├── api-client/               # API 客戶端包
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── config.ts
│   │   │   └── iching-api-client.ts
│   │   └── package.json
│   ├── shared-types/             # 類型定義包
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── iching-types.ts
│   │   └── package.json
│   └── shared-utils/             # 工具函數包
│       ├── src/
│       └── package.json
├── data/                          # 資料檔案
│   ├── _8Gua_mapping.json         # 8卦映射
│   └── _64Gua_mapping.json        # 64卦映射
├── logs/                          # 日誌目錄
│   ├── userInputLogs/             # 用戶輸入日誌
│   └── errorLogs/                 # 錯誤日誌
├── package.json                   # Root package.json
├── pnpm-workspace.yaml            # pnpm workspace 配置
├── pnpm-lock.yaml                 # 依賴版本鎖定
└── start-all.ps1                  # 啟動腳本 (PowerShell)
```

### 主要檔案說明

#### 根目錄配置
- **package.json**: 定義項目元數據、scripts 和工作區配置
- **pnpm-workspace.yaml**: 定義 monorepo 工作區結構
- **start-all.ps1**: Windows PowerShell 啟動腳本

#### 後端結構
```
apps/iching_v1/backend/
├── app.py                    # Flask 應用主入口
├── config.py                 # 全局配置
├── models/
│   ├── iching_service.py    # 核心業務邏輯
│   ├── gua_calculator.py    # 卦象計算引擎
│   ├── value_converter.py   # 輸入轉換器
│   ├── gua_data_reader.py   # 資料讀取
│   └── logger.py            # 日誌系統
└── routes/
    └── iching_routes.py     # API 路由定義
```

---

## 核心功能模組

### 1. 易經服務 (IChingService)

**位置**: `apps/iching_v1/backend/models/iching_service.py`

**職責**:
- 協調占卜流程
- 提取輸入數據
- 計算天地數值
- 日誌記錄

**主要方法**:
```python
def calculate_divination(data) -> dict
  # 計算占卜結果
  # 返回包含卦象資訊的字典

def _extract_input_data(data) -> tuple
  # 提取占卜類型和輸入資訊

def _calculate_heaven_earth_values(...) -> tuple
  # 根據輸入類型計算天地數值
```

### 2. 卦象計算 (GuaCalculator)

**位置**: `apps/iching_v1/backend/models/gua_calculator.py`

**職責**:
- 計算卦象
- 計算變爻位置
- 求取本卦和變卦

**核心算法**:
```
本卦計算:
- 天數 = 天值 % 8 或 8
- 地數 = 地值 % 8 或 8
- 根據天地數查表獲取 64 卦

變爻計算:
- 變爻位置 = (天值 + 地值) % 6 或 6
- 將本卦二進位在該位置翻轉得到變卦
```

**快取優化**: 使用 `@lru_cache` 優化重複計算

### 3. 數值轉換 (ValueConverter)

**位置**: `apps/iching_v1/backend/models/value_converter.py`

**轉換規則**:

| 輸入類型 | 轉換規則 |
|---------|--------|
| 純數字 | 各位數字相加 (e.g., "123" → 1+2+3 = 6) |
| 純英文 | 字符數量 (e.g., "Tom" → 3) |
| 中文字 | 筆劃總和 (e.g., "王" → 4筆) |
| 混合 | 加總所有轉換值 |

**特性**:
- 使用 `strokes` 套件精確獲取中文筆劃
- 實現快取機制提升性能
- 支持多種字符類型

### 4. 資料讀取 (GuaDataReader)

**位置**: `apps/iching_v1/backend/models/gua_data_reader.py`

**職責**:
- 加載和解析易經資料
- 提供查詢接口

**查詢方法**:
```python
get_eight_gua(gua_id)                          # 按ID查8卦
get_sixty_four_gua_by_id(gua_id)              # 按ID查64卦
get_sixty_four_gua_by_heaven_earth(h_id, e_id)  # 按上下卦查64卦
get_sixty_four_gua_by_binary(binary)          # 按二進位查卦
```

### 5. 日誌系統 (Logger)

**位置**: `apps/iching_v1/backend/models/logger.py`

**功能**:
- 記錄用戶輸入
- 記錄系統錯誤

**日誌結構**:
```
logs/
├── userInputLogs/
│   ├── 20250609.log
│   ├── 20250610.log
│   └── ...
└── errorLogs/
    ├── iching_v1_20250609.log
    └── ...
```

**日誌格式**:
```json
{
  "timestamp": "2025-06-09T10:30:45.123456",
  "input_value": {
    "divination_type": "personal",
    "nameA": "王",
    "nameB": "小明"
  }
}
```

---

## API 規格

### 基礎信息
- **協議**: HTTP/REST
- **主機**: localhost (開發環境)
- **端口**: 8001
- **API 基礎路徑**: `/api`
- **數據格式**: JSON

### 健康檢查

**端點**: `GET /api/health`

**回應**:
```json
{
  "status": "ok",
  "message": "API server is running",
  "timestamp": "2025-06-09T10:30:45.123456",
  "hostname": "desktop",
  "ip": "192.168.1.100",
  "port": 8001
}
```

### 易經占卜計算

**端點**: `POST /api/iching/calculate`

#### 請求格式

```typescript
interface DivinationRequest {
  divination_type: 'personal' | 'pair';
  nameA: string;              // 個人占卜為姓氏，配對為第一人姓名
  nameB: string;              // 個人占卜為名字，配對為第二人姓名
  person_numberA: string;     // 個人占卜為數字，配對為第一人數字
  person_numberB: string;     // 個人占卜為空值，配對為第二人數字
}
```

#### 請求示例

**個人占卜示例**:
```json
{
  "divination_type": "personal",
  "nameA": "王",
  "nameB": "小明",
  "person_numberA": "2024",
  "person_numberB": ""
}
```

**配對占卜示例**:
```json
{
  "divination_type": "pair",
  "nameA": "王小明",
  "nameB": "李明",
  "person_numberA": "19850315",
  "person_numberB": "19870820"
}
```

#### 回應格式

```typescript
interface DivinationResponse {
  stroke_info: {
    A: {
      name: string;
      stroke: StrokeInfo[];
    };
    B: {
      name: string;
      stroke: StrokeInfo[];
    };
  };
  gua_info: {
    current_gua: GuaInfo;
    changing_gua: GuaInfo;
  };
  logs: LogEntry[];
}
```

#### 回應示例
```json
{
  "stroke_info": {
    "A": {
      "name": "王小明",
      "stroke": [
        {"character": "王", "stroke": 4},
        {"character": "小", "stroke": 3},
        {"character": "明", "stroke": 8}
      ]
    },
    "B": {
      "name": "李明",
      "stroke": [
        {"character": "李", "stroke": 7},
        {"character": "明", "stroke": 8}
      ]
    }
  },
  "gua_info": {
    "current_gua": {
      "id": 1,
      "id_heaven": 1,
      "id_earth": 1,
      "binary": "111111",
      "name": "乾",
      "binary_heaven": "111",
      "name_heaven": "乾",
      "natural_heaven": "天",
      "binary_earth": "111",
      "name_earth": "乾",
      "natural_earth": "天",
      "description": "元亨利貞..."
    },
    "changing_gua": {
      "id": 2,
      "id_heaven": 2,
      "id_earth": 1,
      "binary": "011111",
      "name": "坤",
      "description": "..."
    }
  },
  "logs": [
    {
      "timestamp": "2025-06-09T10:30:45.123456",
      "input_value": {...}
    }
  ]
}
```

#### 卦象資訊結構

```typescript
interface GuaInfo {
  id: number;                    // 卦象 ID (1-64)
  id_heaven: number;             // 上卦 ID (1-8)
  id_earth: number;              // 下卦 ID (1-8)
  binary: string;                // 二進位表示 (6位)
  name: string;                  // 卦象名稱 (中文)
  binary_heaven: string;         // 上卦二進位
  name_heaven: string;           // 上卦名稱
  natural_heaven: string;        // 上卦自然屬性
  binary_earth: string;          // 下卦二進位
  name_earth: string;            // 下卦名稱
  natural_earth: string;         // 下卦自然屬性
  description: string;           // 卦象描述
}
```

### 錯誤處理

#### 錯誤回應格式
```json
{
  "error": "錯誤說明信息"
}
```

#### 常見錯誤

| 狀態碼 | 錯誤信息 | 原因 |
|------|---------|------|
| 400 | Invalid JSON data | 請求不是有效的 JSON |
| 400 | Missing required field: divination_type | 缺少必要字段 |
| 400 | Invalid divination_type | divination_type 不是 "personal" 或 "pair" |
| 400 | At least one input value is required | 沒有提供任何輸入值 |
| 500 | Server configuration error | 缺少資料檔案 |

### CORS 配置
```
允許所有來源 (*)
允許方法: GET, POST, OPTIONS, HEAD
允許頭: Content-Type, Authorization, X-App-ID, Accept
預檢快取: 3600秒
```

---

## 資料模型

### DivinationType (占卜類型)
```typescript
type DivinationType = 'personal' | 'pair';

// personal: 個人占卜 (基於單人姓名或數字)
// pair:     配對占卜 (基於兩人信息)
```

### StrokeInfo (筆劃信息)
```typescript
interface StrokeInfo {
  character: string;  // 字符
  stroke: number;     // 筆劃數
}
```

### LogEntry (日誌條目)
```typescript
interface LogEntry {
  timestamp: string;  // ISO 8601 時間戳
  input_value: any;   // 輸入值
}
```

### GuaInfo (卦象信息)
包含卦象的完整信息，包括 ID、名稱、二進位表示、所屬天地及描述。

---

## 環境配置

### 後端配置 (config.py)

```python
# 主要設定
PORT = 8001                    # 後端服務端口
DEBUG = False                  # 調試模式 (生產設為 False)

# API 配置
ALLOWED_APP_IDS = [
    "62d9f698-3c89-4624-a58f-a2b7e7b6e22d",
    "iching-mobile-app-2025",
    "iching-app-id-2025"
]

# 路徑配置
ROOT_DIR = "..."               # 項目根目錄
DATA_DIR = f"{ROOT_DIR}/data"
EIGHT_GUA_PATH = f"{DATA_DIR}/_8Gua_mapping.json"
SIXTY_FOUR_GUA_PATH = f"{DATA_DIR}/_64Gua_mapping.json"

# 日誌路徑
LOGS_DIR = f"{ROOT_DIR}/logs"
USER_INPUT_LOGS_DIR = f"{LOGS_DIR}/userInputLogs"
ERROR_LOGS_DIR = f"{LOGS_DIR}/errorLogs"
```

### 前端環境配置

#### Web 前端 (Next.js)
```
開發: http://localhost:3000
API: http://localhost:8001/api
```

#### Mobile 前端 (Expo)
```
開發: http://localhost:19000 (Expo Metro Bundler)
API: http://172.20.10.2:8001/api (iPhone 熱點)
    http://10.0.0.x:8001/api (Android 模擬器)
```

### API 客戶端配置

```typescript
// 環境配置
type Environment = 'development' | 'production' | 'mobile';

// 配置對應
{
  development: {
    baseUrl: 'http://localhost:8001/api'
  },
  production: {
    baseUrl: '/api'  // 相對路徑
  },
  mobile: {
    baseUrl: 'http://172.20.10.2:8001/api'  // 默認
    // 支持動態 IP 檢測
  }
}
```

---

## 部署與運行

### 前置要求
- **Python** 3.8+
- **Node.js** 18+
- **pnpm** (最新版本)
- **Git**

### 安裝依賴

#### 1. 克隆儲存庫
```bash
git clone https://github.com/smlhorse/AppLauncherV1.git
cd AppLauncherV1
```

#### 2. 安裝全局依賴
```bash
pnpm install
```

#### 3. 安裝後端依賴 (Python)
```bash
cd apps/iching_v1/backend
pip install flask flask-cors strokes
```

### 啟動應用

#### 選項 1: 使用 PowerShell 腳本 (Windows)
```powershell
.\start-all.ps1
```

#### 選項 2: 手動啟動

**啟動後端**:
```bash
cd apps/iching_v1/backend
python app.py
# 服務運行於 http://localhost:8001
```

**啟動 Web 前端**:
```bash
pnpm dev:web
# 服務運行於 http://localhost:3000
```

**啟動 Mobile 前端**:
```bash
pnpm dev:mobile
# 在 Expo Go 中查看
```

#### 選項 3: 使用 npm scripts

```bash
# 全部構建
pnpm build

# 個別啟動
pnpm start:backend      # 啟動後端
pnpm start:web          # 啟動 Web
pnpm dev:mobile         # 啟動 Mobile

# Android/iOS
pnpm android            # Android 模擬器/真機
pnpm ios                # iOS 模擬器
```

### 測試 API

使用 curl 或 Postman 測試:

```bash
# 健康檢查
curl http://localhost:8001/api/health

# 占卜計算
curl -X POST http://localhost:8001/api/iching/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "divination_type": "personal",
    "nameA": "王",
    "nameB": "小明",
    "person_numberA": "",
    "person_numberB": ""
  }'
```

### 構建生產版本

#### Web
```bash
pnpm build:web
pnpm start:web
```

#### Mobile
```bash
# iOS
pnpm ios --production

# Android
pnpm android --production
```

---

## 開發指南

### Monorepo 結構說明

本項目使用 pnpm workspace 管理 monorepo 結構:

```yaml
# pnpm-workspace.yaml
packages:
  - apps/iching_v1/frontend/web
  - apps/iching_v1/frontend/mobile
  - packages/js/*
```

### 工作區間依賴

```json
// package.json
{
  "dependencies": {
    "@applauncher/shared-types": "workspace:*",
    "@applauncher/api-client": "workspace:*"
  }
}
```

### 常用開發命令

```bash
# 單個工作區命令
pnpm --filter web dev
pnpm --filter mobile build
pnpm --filter api-client build

# 遞歸命令
pnpm -r build                 # 全部構建
pnpm -r lint                  # 全部檢查
pnpm -r test                  # 全部測試

# 查看依賴樹
pnpm list

# 清理
pnpm -r clean
rm -rf node_modules pnpm-lock.yaml
```

### 代碼結構最佳實踐

#### 後端 (Python)
- 模型層 (`models/`): 業務邏輯
- 路由層 (`routes/`): API 端點
- 配置層 (`config.py`): 全局配置
- 使用 Blueprint 組織路由
- 使用日誌系統記錄操作

#### 前端 (TypeScript)
- 類型安全: 充分使用 TypeScript 類型
- 模塊化: 使用 packages 共享代碼
- 環境配置: 區分 development/production
- API 客戶端: 統一通過 @applauncher/api-client

### 擴展指南

#### 添加新卦象計算類型

1. 在 `iching-types.ts` 中擴展 `DivinationType`
2. 在 `ValueConverter` 中添加新的轉換規則
3. 在 `IChingService` 中添加新邏輯
4. 添加對應的資料檔案

#### 添加新的 API 端點

1. 在 `iching_routes.py` 中定義新路由
2. 在對應的 service 中實現邏輯
3. 定義 TypeScript 類型接口
4. 更新 API 文檔

#### 支持新的前端平台

1. 在 `apps/` 下創建新平台目錄
2. 引用共享的 packages
3. 配置對應的環境變量

---

## 質量保證

### 測試覆蓋

- [ ] 單元測試 (后端)
- [ ] 集成測試 (API)
- [ ] E2E 測試 (前端)
- [ ] 跨平台測試

### 代碼質量

- [ ] TypeScript strict 模式
- [ ] Python type hints
- [ ] ESLint 規則
- [ ] 代碼注釋完善

### 性能優化

- [ ] LRU 快取 (後端計算)
- [ ] 資料預加載
- [ ] API 響應最小化
- [ ] 懶加載支持

---

## 常見問題 (FAQ)

### Q: 如何修改 API 端口?
A: 編輯 `apps/iching_v1/backend/config.py`, 修改 `PORT` 變量

### Q: Mobile 端無法連接 API?
A: 檢查 IP 配置，參考 `packages/js/api-client/src/config.ts`

### Q: 如何添加新的易經資料?
A: 編輯 `data/_64Gua_mapping.json` 或 `data/_8Gua_mapping.json`

### Q: 支持哪些中文輸入?
A: 支持任意 Unicode 中文字符，使用 `strokes` 套件計算筆劃

---

## 相關資源

- **GitHub**: https://github.com/smlhorse/AppLauncherV1
- **Flask 文檔**: https://flask.palletsprojects.com/
- **Next.js 文檔**: https://nextjs.org/docs
- **Expo 文檔**: https://docs.expo.dev/
- **pnpm 文檔**: https://pnpm.io/

---

## 版本歷史

| 版本 | 日期 | 說明 |
|------|------|------|
| 1.0.0 | 2025-06-09 | 初始發佈 |

---

## 授權

ISC License

---

**最後更新**: 2026-02-12
**規格文件版本**: 1.0
```

這份詳細規格文件涵蓋了：

✅ **完整的系統架構** - 多層次架構圖和說明  
✅ **技術棧詳情** - 所有技術和版本信息  
✅ **專案結構** - 完整的目錄樹和文件說明  
✅ **核心模組** - 5個主要功能模組的詳細說明  
✅ **API 規格** - 完整的 REST API 文檔  
✅ **資料模型** - TypeScript 類型定義  
✅ **環境配置** - 開發/測試環境配置  
✅ **部署指南** - 完整的安裝和運行步驟  
✅ **開發指南** - 開發者須知和最佳實踐
