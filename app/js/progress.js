/* ============================================================
 * Progress — 레슨 마스터/진도, 일일 목표, 연속학습(스트릭)
 * localStorage 영속화. 일반 학습앱식 진행 관리.
 *   lessons[klass] = { studied, quizBest(0~100), mastered, ts }
 *   daily = { date 'YYYY-MM-DD', learned }
 *   streak = { count, last 'YYYY-MM-DD' }
 * ============================================================ */
const Progress = (() => {
  const KEY = 'drugProgress_v1';
  const DAILY_GOAL = 20;

  let s = load();
  function blank() { return { lessons: {}, daily: { date: '', learned: 0 }, streak: { count: 0, last: '' }, quiz: { total: 0, correct: 0, sessions: 0, best: 0 } }; }
  function load() {
    try { const o = JSON.parse(localStorage.getItem(KEY)); if (!o || !o.lessons) return blank(); if (!o.quiz) o.quiz = { total: 0, correct: 0, sessions: 0, best: 0 }; return o; }
    catch { return blank(); }
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(s)); }
  function today() {
    const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
  function yesterday() {
    const d = new Date(Date.now() - 86400000); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  function lesson(k) { return s.lessons[k] || { studied: false, quizBest: 0, mastered: false, ts: 0 }; }
  function updateMastery(k) {
    const l = s.lessons[k];
    if (l && l.studied && l.quizBest >= 80) l.mastered = true;
  }
  function markStudied(k) {
    const l = lesson(k); l.studied = true; l.ts = Date.now();
    s.lessons[k] = l; updateMastery(k); save();
  }
  function recordQuiz(k, pct) {
    const l = lesson(k); l.quizBest = Math.max(l.quizBest, Math.round(pct));
    s.lessons[k] = l; updateMastery(k); save();
  }
  function status(k) {
    const l = lesson(k);
    if (l.mastered) return 'mastered';
    if (l.studied) return 'studied';
    return 'new';
  }

  // 일일 목표 + 스트릭
  function touchStreak() {
    const t = today();
    if (s.streak.last === t) return;
    s.streak.count = (s.streak.last === yesterday()) ? s.streak.count + 1 : 1;
    s.streak.last = t;
  }
  function addLearned(n) {
    const t = today();
    if (s.daily.date !== t) s.daily = { date: t, learned: 0 };
    s.daily.learned += n;
    touchStreak();
    save();
  }
  function todayLearned() { return s.daily.date === today() ? s.daily.learned : 0; }
  function goal() { return DAILY_GOAL; }
  function streak() {
    return (s.streak.last === today() || s.streak.last === yesterday()) ? s.streak.count : 0;
  }

  function summary(klasses) {
    let mastered = 0, studied = 0;
    klasses.forEach(k => { const st = status(k); if (st === 'mastered') mastered++; else if (st === 'studied') studied++; });
    return { mastered, studied, total: klasses.length };
  }

  // 랜덤 퀴즈 누적 통계
  function recordQuizSession(correct, total) {
    s.quiz.total += total; s.quiz.correct += correct; s.quiz.sessions += 1;
    const pct = total ? Math.round(correct / total * 100) : 0;
    if (pct > s.quiz.best) s.quiz.best = pct;
    save();
  }
  function quizStats() {
    const q = s.quiz || { total: 0, correct: 0, sessions: 0, best: 0 };
    return { ...q, acc: q.total ? Math.round(q.correct / q.total * 100) : 0 };
  }

  function reset() { s = blank(); localStorage.removeItem(KEY); }

  return { lesson, markStudied, recordQuiz, status, addLearned, todayLearned, goal, streak, summary, recordQuizSession, quizStats, reset };
})();
