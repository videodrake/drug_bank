/* ============================================================
 * SRS 엔진 — SM-2 기반 간격반복 (인출연습 평가용)
 * 카드 상태를 localStorage에 영속화한다.
 * 평가: 0=Again(실패) 1=Hard 2=Good 3=Easy
 * ============================================================ */
const SRS = (() => {
  const KEY = 'drugSrsState_v1';
  const DAY = 86400000; // ms

  // { id: { ease, interval(일), reps, lapses, due(ts), last(ts) } }
  let state = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch { return {}; }
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }

  function get(id) {
    return state[id] || { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: 0, last: 0 };
  }

  // 신규 카드: state에 기록이 없는 약물
  function isNew(id) { return !state[id]; }

  // 오늘(자정 기준) 복습 대상인가
  function isDue(id) {
    const c = state[id];
    if (!c) return false;
    return c.due <= Date.now();
  }

  // 평가 반영 (SM-2)
  function rate(id, q) {
    const c = get(id);
    const now = Date.now();

    if (q === 0) {
      // 실패 → 처음부터, 10분 뒤 다시
      c.lapses += 1;
      c.reps = 0;
      c.interval = 0;
      c.due = now + 10 * 60 * 1000;
    } else {
      // ease 조정 (SM-2 공식, q 1..3 → quality 3..5로 매핑)
      const quality = q + 2; // 1→3, 2→4, 3→5
      c.ease = Math.max(1.3, c.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      c.reps += 1;
      if (c.reps === 1) c.interval = 1;
      else if (c.reps === 2) c.interval = q === 1 ? 3 : 6;
      else c.interval = Math.round(c.interval * c.ease * (q === 1 ? 0.7 : q === 3 ? 1.3 : 1));
      c.interval = Math.max(1, c.interval);
      c.due = now + c.interval * DAY;
    }
    c.last = now;
    state[id] = c;
    save();
    return c;
  }

  // 통계
  function stats(allIds) {
    let learned = 0, dueCount = 0, newCount = 0;
    const now = Date.now();
    allIds.forEach(id => {
      const c = state[id];
      if (!c) { newCount++; return; }
      if (c.reps >= 1 && c.interval >= 1) learned++;
      if (c.due <= now) dueCount++;
    });
    return { learned, dueCount, newCount, total: allIds.length };
  }

  // 오늘 복습 큐: due 카드 + 신규 일부 (간격반복 + 점진 도입)
  function buildQueue(allIds, newPerDay = 20) {
    const now = Date.now();
    const due = [], fresh = [];
    allIds.forEach(id => {
      const c = state[id];
      if (!c) fresh.push(id);
      else if (c.due <= now) due.push(id);
    });
    // due는 마감 임박 순
    due.sort((a, b) => state[a].due - state[b].due);
    // 신규는 정의 순서대로 newPerDay개
    const queue = due.concat(fresh.slice(0, newPerDay));
    return queue;
  }

  function reset() { state = {}; localStorage.removeItem(KEY); }

  return { get, isNew, isDue, rate, stats, buildQueue, reset };
})();
