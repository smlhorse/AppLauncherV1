import React, { useState } from 'react';
import type { DivinationType, DivinationRequest, DivinationResponse } from '@applauncher/shared-types';
import { IChingApiClient } from '@applauncher/api-client';

const defaultRequest: DivinationRequest = {
  divination_type: 'personal',
  nameA: '',
  nameB: '',
  person_numberA: '',
  person_numberB: '',
};

export default function HomePage() {
  const [tab, setTab] = useState<DivinationType>('personal');
  const [form, setForm] = useState<DivinationRequest>(defaultRequest);
  const [result, setResult] = useState<DivinationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleTabChange = (type: DivinationType) => {
    setTab(type);
    // 切換標籤時保留使用者填寫的資訊，僅更新占卜類型
    setForm({ ...form, divination_type: type });
    setResult(null);
    setError('');
  };
  
  // 清除表單資料的處理函數
  const handleClearForm = () => {
    setForm({ ...defaultRequest, divination_type: tab });
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // 驗證表單：姓名或數字至少填寫一個，可同時填寫
  function validateForm(): string | null {
    if (tab === 'personal') {
      const hasName = form.nameA.trim() || form.nameB.trim();
      const hasNumber = form.person_numberA.trim();
      if (!hasName && !hasNumber) return '請至少輸入姓名或數字';
    } else {
      const hasName = form.nameA.trim() || form.nameB.trim();
      const hasNumber = form.person_numberA.trim() || form.person_numberB.trim();
      if (!hasName && !hasNumber) return '請至少輸入姓名或數字';
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    const validationMsg = validateForm();
    if (validationMsg) {
      setError(validationMsg);
      return;
    }
    setLoading(true);
    try {
      const res = await IChingApiClient.calculate(form);
      setResult(res);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'API 請求失敗');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ maxWidth: 800, width: '90%', margin: '40px auto', padding: 0, background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', borderRadius: 16, boxShadow: '0 4px 24px #dbeafe', minHeight: '100vh' }}>
      <div style={{ padding: '32px 20px', borderRadius: 16, background: '#fff', boxShadow: '0 2px 8px #e0e7ef', margin: 0 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32, color: '#1976d2', letterSpacing: 2, fontWeight: 700, fontSize: 32 }}>易經算命程式</h1>
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => handleTabChange('personal')}
            style={{
              fontWeight: tab === 'personal' ? 'bold' : 'normal',
              padding: '8px 32px',
              borderRadius: 8,
              border: tab === 'personal' ? '2px solid #1976d2' : '1px solid #bdbdbd',
              background: tab === 'personal' ? '#e3f2fd' : '#f8fafc',
              color: tab === 'personal' ? '#1976d2' : '#333',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: tab === 'personal' ? '0 2px 8px #e3f2fd' : 'none',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#e3f2fd')}
            onMouseOut={e => (e.currentTarget.style.background = tab === 'personal' ? '#e3f2fd' : '#f8fafc')}
          >
            個人占卜
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('pair')}
            style={{
              fontWeight: tab === 'pair' ? 'bold' : 'normal',
              padding: '8px 32px',
              borderRadius: 8,
              border: tab === 'pair' ? '2px solid #1976d2' : '1px solid #bdbdbd',
              background: tab === 'pair' ? '#e3f2fd' : '#f8fafc',
              color: tab === 'pair' ? '#1976d2' : '#333',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: tab === 'pair' ? '0 2px 8px #e3f2fd' : 'none',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#e3f2fd')}
            onMouseOut={e => (e.currentTarget.style.background = tab === 'pair' ? '#e3f2fd' : '#f8fafc')}
          >
            配對占卜
          </button>
        </div>        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }} autoComplete="off">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tab === 'personal' ? (
              <>                <FormField label="姓" name="nameA" value={form.nameA} onChange={handleChange} />
                <FormField label="名" name="nameB" value={form.nameB} onChange={handleChange} />
                <FormField label="數字" name="person_numberA" value={form.person_numberA} onChange={handleChange} />
                <div style={{ fontSize: 12, color: '#888', marginBottom: 0 }}>請至少填寫姓名或數字</div>
              </>
            ) : (
              <>                <FormField label="姓名A" name="nameA" value={form.nameA} onChange={handleChange} />
                <FormField label="姓名B" name="nameB" value={form.nameB} onChange={handleChange} />
                <FormField label="數字A" name="person_numberA" value={form.person_numberA} onChange={handleChange} />
                <FormField label="數字B" name="person_numberB" value={form.person_numberB} onChange={handleChange} />
                <div style={{ fontSize: 12, color: '#888', marginBottom: 0 }}>請至少填寫姓名或數字</div>
              </>
            )}            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: 12, 
              marginTop: 8 
            }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                  flex: 3,
                padding: '10px 0',
                borderRadius: 8,
                background: loading ? '#bdbdbd' : '#1976d2',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold',
                fontSize: 18,
                letterSpacing: 2,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px #e3f2fd',
                transition: 'all 0.2s',
              }}
            >
              {loading ? '計算中...' : '開始占卜'}
            </button>
              
              <button
                type="button"
                onClick={handleClearForm}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 8,
                  background: '#f5f5f5',
                  color: '#666',
                  border: '1px solid #ddd',
                  fontWeight: 'bold',
                  fontSize: 16,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                清除
              </button>
            </div>
          </div>
        </form>
        {error && <div style={{ color: 'red', marginBottom: 12, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        {result && (
          <div style={{ marginTop: 24, background: '#f8fafc', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e0e7ef' }}>
            <h2 style={{ color: '#1976d2', marginBottom: 16 }}>結果</h2>            <div style={{ marginBottom: 16, border: '1px solid #e0e7ef', padding: 12, borderRadius: 8, background: '#fff' }}>
              <h3 style={{ color: '#333', marginBottom: 10, borderBottom: '1px solid #e0e7ef', paddingBottom: 8 }}>筆劃資訊</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ padding: 8, backgroundColor: '#f0f7ff', borderRadius: 6 }}>
                  <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 4 }}>A: {result.stroke_info.A.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.stroke_info.A.stroke.map((s, i) => (
                      <div key={i} style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4, 
                        backgroundColor: '#e3f2fd', 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <span style={{ fontSize: 18 }}>{s.character}</span>
                        <span style={{ fontSize: 14, color: '#666' }}>({s.stroke})</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: 8, backgroundColor: '#f0f7ff', borderRadius: 6 }}>
                  <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 4 }}>B: {result.stroke_info.B.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.stroke_info.B.stroke.map((s, i) => (
                      <div key={i} style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4, 
                        backgroundColor: '#e3f2fd', 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <span style={{ fontSize: 18 }}>{s.character}</span>
                        <span style={{ fontSize: 14, color: '#666' }}>({s.stroke})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>            <div style={{ marginTop: 16 }}>
              <h3 style={{ color: '#333', marginBottom: 8, background: '#e3f2fd', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}>本卦</h3>
              <GuaInfoView gua={result.gua_info.current_gua} type="current" />
            </div>
            <div style={{ marginTop: 16 }}>
              <h3 style={{ color: '#333', marginBottom: 8, background: '#fff3e0', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}>變卦</h3>
              <GuaInfoView gua={result.gua_info.changing_gua} type="changing" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <label style={{ 
        fontWeight: 500, 
        color: '#333', 
        marginBottom: 4,
        display: 'flex',
        alignItems: 'center' 
      }}>
        <span style={{ 
          display: 'inline-block', 
          width: 4, 
          height: 16, 
          backgroundColor: '#1976d2', 
          marginRight: 6, 
          borderRadius: 2 
        }}></span>
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        autoComplete="off"
        style={{
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid #bdbdbd',
          fontSize: 16,
          outline: 'none',
          transition: 'all 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05) inset'
        }}
        onFocus={e => {
          e.currentTarget.style.border = '1.5px solid #1976d2';
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(25,118,210,0.1)';
        }}
        onBlur={e => {
          e.currentTarget.style.border = '1px solid #bdbdbd';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05) inset';
        }}
      />
    </div>
  );
}

function GuaInfoView({ gua, type = 'current' }: { gua: any, type?: 'current' | 'changing' }) {
  if (!gua) return <div style={{ color: '#888', fontStyle: 'italic' }}>無資料</div>;
  
  // 判斷是本卦還是變卦來使用不同的配色
  const borderColor = type === 'current' ? '#b3e0ff' : '#ffe0b2';
  const headingColor = type === 'current' ? '#1976d2' : '#e65100';
  const shadowColor = type === 'current' ? '#e3f2fd' : '#fff3e0';
  
  return (
    <div style={{ 
      border: `1.5px solid ${borderColor}`, 
      borderRadius: 8, 
      padding: 16, 
      marginBottom: 8, 
      background: '#fff', 
      boxShadow: `0 2px 8px ${shadowColor}`
    }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 20, marginBottom: 16 }}>
        {/* 左側卦象 */}
        <div style={{ minWidth: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderBinary(gua.binary, type)}
        </div>
        
        {/* 右側卦名與資訊 */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: 600, 
            fontSize: 24, 
            color: headingColor, 
            marginBottom: 12,
            borderBottom: `1px solid ${borderColor}`,
            paddingBottom: 8
          }}>{gua.name}</div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 12
          }}>
            <div style={{ color: '#333', marginBottom: 4 }}><b>上卦：</b>{gua.name_heaven}（{gua.binary_heaven}）</div>
            <div style={{ color: '#333', marginBottom: 4 }}><b>下卦：</b>{gua.name_earth}（{gua.binary_earth}）</div>
            <div style={{ color: '#555', marginBottom: 4 }}><b>五行：</b>上卦：{gua.natural_heaven}</div>
            <div style={{ color: '#555', marginBottom: 4 }}><b>五行：</b>下卦：{gua.natural_earth}</div>
          </div>
        </div>
      </div>
      
      {/* 解釋部分維持不變 */}
      <div style={{ 
        color: '#444', 
        marginTop: 16, 
        borderTop: `1px solid ${borderColor}`, 
        paddingTop: 12 
      }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>解釋：</div>
        <pre style={{ 
          whiteSpace: 'pre-wrap', 
          fontFamily: 'inherit', 
          background: type === 'current' ? '#f0f7ff' : '#fff8e1', 
          borderRadius: 4, 
          padding: 12, 
          margin: 0 
        }}>{gua.description}</pre>
      </div>
    </div>
  );
}

function renderBinary(binary: string, type: 'current' | 'changing' = 'current') {
  // 0: 陰爻（虛線），1: 陽爻（實線）
  // 根據卦的類型設定不同顏色
  const yangColor = type === 'current' ? '#1976d2' : '#e65100';
  const yinColor = type === 'current' ? '#666' : '#996600';
  
  // 反轉爻序列，使其從下往上顯示（符合易經傳統順序）
  const reversedBinary = [...binary].reverse();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      {reversedBinary.map((b, i) => (
        <div 
          key={i} 
          style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '70px',
            height: '14px',
            position: 'relative'
          }}
        >
          {b === '1' ? (
            // 陽爻：實線
            <div style={{ 
              height: '6px', 
              width: '100%', 
              backgroundColor: yangColor, 
              borderRadius: '2px'
            }} />
          ) : (
            // 陰爻：虛線
            <>
              <div style={{ 
                height: '6px', 
                width: '40%', 
                backgroundColor: yinColor, 
                borderRadius: '2px',
                marginRight: '20%'
              }} />
              <div style={{ 
                height: '6px', 
                width: '40%', 
                backgroundColor: yinColor, 
                borderRadius: '2px' 
              }} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
