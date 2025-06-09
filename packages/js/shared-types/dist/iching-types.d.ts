/**
 * 易經算命程式的共用型別定義
 */
export type DivinationType = 'personal' | 'pair';
export interface DivinationRequest {
    divination_type: DivinationType;
    nameA: string;
    nameB: string;
    person_numberA: string;
    person_numberB: string;
}
export interface StrokeInfo {
    character: string;
    stroke: number;
}
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
export interface LogEntry {
    timestamp: string;
    input_value: any;
}
