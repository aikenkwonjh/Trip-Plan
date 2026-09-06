'use client';

import { useState } from 'react';

export default function Home() {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!city.trim()) {
      setError('도시 이름을 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, days: Number(days) }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '요청 처리 중 오류가 발생했습니다.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Trip Plan</h1>
      <p className="subtitle">도시와 여행 일수를 입력하면 인기 할것들과 일정을 만들어드려요.</p>

      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="city">여행지 (도시명)</label>
          <input
            id="city"
            type="text"
            placeholder="예: 도쿄, 파리, 제주도"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="days">여행 일수</label>
          <input
            id="days"
            type="number"
            min="1"
            max="14"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '생성 중...' : '추천 받기'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">AI가 {city} 여행 정보를 분석하고 있어요...</div>}

      {result && (
        <>
          <section>
            <h2>{result.city} 인기 할것들 TOP {result.topActivities?.length || 10}</h2>
            <div className="activity-list">
              {result.topActivities?.map((item, idx) => (
                <div className="activity-card" key={idx}>
                  <span className="rank">#{idx + 1}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>{result.days}일 여행 일정</h2>
            {result.itinerary?.map((day, idx) => (
              <div className="day-block" key={idx}>
                <h3>Day {day.day}</h3>
                <ul>
                  {day.activities?.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
