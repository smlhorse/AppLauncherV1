/**
 * 易經算命程式的共用型別定義
 */

// 占卜類型定義
export type DivinationType = 'personal' | 'pair';

// 占卜請求資料介面
export interface DivinationRequest {
  divination_type: DivinationType;
  nameA: string;
  nameB: string;
  person_numberA: string;
  person_numberB: string;
}

// 筆劃資訊介面
export interface StrokeInfo {
  character: string;
  stroke: number;
}

// 占卜結果介面
export interface DivinationResponse {
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

// 卦象資訊介面
export interface GuaInfo {
  id: number;
  id_heaven: number;
  id_earth: number;
  binary: string;
  name: string;
  binary_heaven: string;
  name_heaven: string;
  natural_heaven: string;
  binary_earth: string;
  name_earth: string;
  natural_earth: string;
  description: string;
}

// 日誌條目介面
export interface LogEntry {
  timestamp: string;
  input_value: any;
}