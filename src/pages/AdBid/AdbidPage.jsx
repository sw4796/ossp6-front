import React, { useState } from "react";
import "../../styles/ad-bid.css";

const TIME_SLOTS = [
  "00:00 - 02:00", "02:00 - 04:00", "04:00 - 06:00", "06:00 - 08:00",
  "08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00",
  "16:00 - 18:00", "18:00 - 20:00", "20:00 - 22:00", "22:00 - 24:00"
];
const AVERAGE_BIDS = [45000,40000,38000,55000,85000,70000,68000,65000,75000,88000,65000,50000];
const COMPETITION = [
  "낮음", "매우 낮음", "매우 낮음", "보통", "매우 높음", "높음",
  "높음", "보통", "높음", "매우 높음", "보통", "낮음"
];

function AdBidPage() {
  const [slotState, setSlotState] = useState(
    TIME_SLOTS.map(() => ({ enabled: false, auto: false, bid: "" }))
  );
  const [allTime, setAllTime] = useState(false);
  const [terms, setTerms] = useState(false);
  const [autoBid, setAutoBid] = useState(false);
  const [maxBidLimit, setMaxBidLimit] = useState("");
  const [bidStrategy, setBidStrategy] = useState("balanced");

  const selectedSlots = slotState.map((s, i) => s.enabled ? i : null).filter(i => i !== null);
  const totalHours = selectedSlots.length * 2;
  const dailyCost = selectedSlots.reduce((acc, i) => acc + (parseInt(slotState[i].bid) || 0), 0);
  const totalCost = dailyCost * 30;

  // 전체 토글
  const handleAllTimeToggle = (checked) => {
    setAllTime(checked);
    setSlotState(slotState.map((s, i) => ({
      ...s,
      enabled: checked,
      bid: checked ? AVERAGE_BIDS[i] : ""
    })));
  };

  // 개별 시간대 토글
  const handleSlotToggle = (idx, checked) => {
    setSlotState(slotState.map((s, i) =>
      i === idx
        ? { ...s, enabled: checked, bid: checked ? AVERAGE_BIDS[idx] : "" }
        : s
    ));
  };

  // 입찰가 입력
  const handleBidInput = (idx, val) => {
    setSlotState(slotState.map((s, i) =>
      i === idx ? { ...s, bid: val } : s
    ));
  };

  // 경쟁률 컬러
  const getCompetitionClass = (str) => {
    if (str === "매우 높음") return "ad-bid-competition-red";
    if (str === "높음") return "ad-bid-competition-orange";
    if (str === "보통") return "ad-bid-competition-yellow";
    if (str === "낮음") return "ad-bid-competition-green";
    return "ad-bid-competition-darkgreen";
  };

  return (
    <div className="ad-bid-root">
      {/* 헤더 */}
      <header className="ad-bid-header">
        <div className="ad-bid-header-inner">
          <div className="flex items-center">
            <span className="ad-bid-header-title">광고 입찰 시스템</span>
          </div>
          <div className="flex items-center">
            <span style={{ fontWeight: 500 }}>김민준</span>
          </div>
        </div>
      </header>

      {/* 입찰 설정 */}
      <main>
        <div className="ad-bid-section">
          <div className="ad-bid-setting-top">
            <span className="ad-bid-title-xl">입찰 설정</span>
            <div className="ad-bid-toggles">
              <label className="ad-bid-checkbox-label">
                <input
                  type="checkbox"
                  checked={autoBid}
                  onChange={e => setAutoBid(e.target.checked)}
                />
                <span style={{ marginLeft: 8 }}>자동 입찰 사용</span>
              </label>
              <label className="ad-bid-checkbox-label">
                <input
                  type="checkbox"
                  checked={allTime}
                  onChange={e => handleAllTimeToggle(e.target.checked)}
                  style={{ marginLeft: 8 }}
                />
                <span style={{ marginLeft: 8 }}>전체 시간대 적용</span>
              </label>
            </div>
          </div>
          {autoBid && (
            <div style={{ marginBottom: 24, background: "#f3f4f6", padding: 16, borderRadius: 12 }}>
              <div style={{ marginBottom: 16 }}>
                <label className="ad-bid-info-label" style={{ display: "block", marginBottom: 6 }}>최대 입찰가 제한</label>
                <input
                  type="number"
                  value={maxBidLimit}
                  onChange={e => setMaxBidLimit(e.target.value)}
                  className="ad-bid-input"
                  placeholder="시간당 최대 입찰가"
                />
              </div>
              <div>
                <label className="ad-bid-info-label" style={{ display: "block", marginBottom: 6 }}>입찰 전략</label>
                <div className="ad-bid-strategies">
                  {[
                    { key: "aggressive", label: "적극적", desc: "평균가 +10%" },
                    { key: "balanced", label: "균형", desc: "평균가 기준" },
                    { key: "conservative", label: "보수적", desc: "평균가 -10%" }
                  ].map(opt => (
                    <label key={opt.key} className={`ad-bid-strategy${bidStrategy === opt.key ? " selected" : ""}`}>
                      <input
                        type="radio"
                        name="bidStrategy"
                        checked={bidStrategy === opt.key}
                        onChange={() => setBidStrategy(opt.key)}
                        style={{ marginRight: 6 }}
                      />
                      <span>{opt.label}</span>
                      <span style={{ marginLeft: 8, color: "#6b7280", fontSize: 12 }}>{opt.desc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 시간대별 입찰 */}
          <div className="ad-bid-grid">
            {TIME_SLOTS.map((slot, i) => (
              <div key={i} className="ad-bid-slot">
                <div className="ad-bid-slot-top">
                  <span className="ad-bid-slot-title">{slot}</span>
                  <input
                    type="checkbox"
                    checked={slotState[i].enabled}
                    onChange={e => handleSlotToggle(i, e.target.checked)}
                  />
                </div>
                <input
                  type="number"
                  className="ad-bid-input"
                  placeholder="입찰가 입력"
                  value={slotState[i].bid}
                  disabled={!slotState[i].enabled}
                  onChange={e => handleBidInput(i, e.target.value)}
                />
              </div>
            ))}
          </div>
          {/* 안내 문구 */}
          <div style={{ marginTop: 24, color: "#6b7280", fontSize: 15 }}>
            선택한 시간대에만 광고가 노출됩니다. 시간대별로 다른 입찰가를 설정할 수 있습니다.
          </div>
        </div>

        {/* 입찰 요약 */}
        <div className="ad-bid-section">
          <h2 className="ad-bid-title-xl" style={{ marginBottom: 16 }}>입찰 요약</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="ad-bid-summary-table">
              <thead>
                <tr>
                  <th>시간대</th>
                  <th>입찰가</th>
                  <th>평균 입찰가</th>
                  <th>경쟁률</th>
                </tr>
              </thead>
              <tbody>
                {selectedSlots.map(idx => (
                  <tr key={idx}>
                    <td>{TIME_SLOTS[idx]}</td>
                    <td>₩{Number(slotState[idx].bid || 0).toLocaleString()}</td>
                    <td>₩{AVERAGE_BIDS[idx].toLocaleString()}</td>
                    <td><span className={getCompetitionClass(COMPETITION[idx])}>{COMPETITION[idx]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 요약 정보 */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, marginTop: 24 }}>
            <div className="ad-bid-info-row">
              <span className="ad-bid-info-label">총 선택 시간</span>
              <span className="ad-bid-info-value">{totalHours}시간</span>
            </div>
            <div className="ad-bid-info-row">
              <span className="ad-bid-info-label">일일 예상 비용</span>
              <span className="ad-bid-info-value">₩{dailyCost.toLocaleString()}</span>
            </div>
            <div className="ad-bid-info-row" style={{ marginBottom: 16 }}>
              <span className="ad-bid-info-label">30일 총 예상 비용</span>
              <span className="ad-bid-info-value" style={{ color: "#4F46E5", fontWeight: 700, fontSize: 18 }}>₩{totalCost.toLocaleString()}</span>
            </div>
            <div className="ad-bid-terms">
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={terms}
                onChange={e => setTerms(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              <span>입찰 규정 및 약관에 동의합니다</span>
            </div>
            <div className="ad-bid-btns">
              <button
                className="ad-bid-btn"
                type="button"
              >
                임시 저장
              </button>
              <button
                className="ad-bid-btn submit"
                type="button"
                disabled={!(terms && selectedSlots.length > 0)}
                onClick={() => {
                  if (terms && selectedSlots.length > 0) {
                    alert("입찰이 성공적으로 제출되었습니다!");
                  }
                }}
              >
                입찰 제출하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdBidPage;

