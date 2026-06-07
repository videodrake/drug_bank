/* ============================================================
 * 약물 학습기 — 체계적 학습 구조
 * 홈 · 학습(단원/레슨) · 복습(SRS) · 퀴즈(인터리빙) · 어간
 * 레슨 흐름: 정독 학습 → 연습문제 → 80%↑ 마스터
 * ============================================================ */
(() => {
  const NEW_PER_DAY = 20;
  const PASS = 80;

  const allIds = () => DRUGS.map(d => d.id);
  const byId = id => DRUGS.find(d => d.id === id);
  const categories = () => [...new Set(DRUGS.map(d => d.category))];
  const allClasses = () => [...new Set(DRUGS.map(d => d.klass))];
  const drugsInClass = k => DRUGS.filter(d => d.klass === k);
  const classesInCategory = c => [...new Set(DRUGS.filter(d => d.category === c).map(d => d.klass))];
  const classCategory = k => drugsInClass(k)[0].category;
  const esc = s => String(s).replace(/"/g, '&quot;');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);

  /* ---------- 네비게이션 ---------- */
  document.getElementById('tabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab'); if (!btn) return; showView(btn.dataset.view);
  });
  function showView(name) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === name));
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
    if (name === 'home') renderHome();
    if (name === 'learn') renderCurriculum();
    if (name === 'review') startReview();
    if (name === 'quiz') startQuiz();
    if (name === 'stems') renderStems();
    window.scrollTo(0, 0);
  }

  /* ---------- 홈 ---------- */
  function nextLesson() {
    return allClasses().find(k => Progress.status(k) !== 'mastered') || null;
  }
  function renderHome() {
    const ks = allClasses();
    const sum = Progress.summary(ks);
    const srs = SRS.stats(allIds());
    const learnedToday = Progress.todayLearned(), goal = Progress.goal();
    const goalPct = Math.min(100, Math.round(learnedToday / goal * 100));
    const streak = Progress.streak();
    const next = nextLesson();
    // 마스터/학습한 레슨에 속한 약물 수
    const coveredDrugs = ks.reduce((acc, k) => acc + (Progress.status(k) !== 'new' ? drugsInClass(k).length : 0), 0);

    const continueCard = next
      ? `<div class="home-cta">
           <div class="cta-label">${sum.mastered + sum.studied > 0 ? '이어서 학습' : '여기서 시작하세요'}</div>
           <div class="cta-lesson">${next}</div>
           <div class="cta-meta">${classCategory(next)} · ${drugsInClass(next).length}종 · ${statusLabel(Progress.status(next))}</div>
           <button class="btn primary full" id="homeContinue">📖 학습 시작</button>
         </div>`
      : `<div class="home-cta done">
           <div class="cta-label">🎉 모든 레슨 마스터!</div>
           <div class="cta-lesson">대단해요</div>
           <div class="cta-meta">이제 복습으로 오래 기억하세요.</div>
           <button class="btn primary full" id="homeReview">🔁 복습하러 가기</button>
         </div>`;

    document.getElementById('homeArea').innerHTML = `
      <div class="home-top">
        <div class="streak"><span class="fire">🔥</span><b>${streak}</b><span class="muted small">일 연속</span></div>
        <div class="goal">
          <div class="goal-row"><span>오늘의 목표</span><span class="muted">${learnedToday} / ${goal}</span></div>
          <div class="bar"><span style="width:${goalPct}%"></span></div>
        </div>
      </div>
      ${continueCard}
      <div class="stat-grid">
        <div class="stat learned"><div class="num">${sum.mastered}</div><div class="label">마스터한 레슨</div></div>
        <div class="stat"><div class="num">${sum.total}</div><div class="label">전체 레슨</div></div>
        <div class="stat"><div class="num">${coveredDrugs}</div><div class="label">학습한 약물</div></div>
        <div class="stat due"><div class="num">${srs.dueCount}</div><div class="label">복습 대기</div></div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>단원별 진도</h3><span class="muted small" id="goLearn">학습 탭 →</span></div>
        <div id="homeProgress"></div>
      </div>
      <div class="panel howto">
        <h3>학습 순서</h3>
        <ol class="steps">
          <li><b>학습</b>: 레슨(계열)을 골라 약을 하나씩 정독해요.</li>
          <li><b>연습문제</b>: 레슨 끝에 바로 풀어 ${PASS}% 이상이면 <b>✓ 마스터</b>.</li>
          <li><b>복습</b>: 헷갈리는 약은 복습 탭에서 간격반복으로 굳혀요.</li>
        </ol>
      </div>`;

    // 단원별 진도 바
    document.getElementById('homeProgress').innerHTML = categories().map(cat => {
      const cks = classesInCategory(cat);
      const cs = Progress.summary(cks);
      const pct = cks.length ? Math.round(cs.mastered / cks.length * 100) : 0;
      return `<div class="cat-row">
        <div class="name">${cat}</div>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <div class="pct">${cs.mastered}/${cks.length}</div>
      </div>`;
    }).join('');

    const c = document.getElementById('homeContinue'); if (c) c.onclick = () => startLesson(next);
    const r = document.getElementById('homeReview'); if (r) r.onclick = () => showView('review');
    document.getElementById('goLearn').onclick = () => showView('learn');
    updateBadges();
  }
  function statusLabel(st) { return st === 'mastered' ? '✓ 마스터' : st === 'studied' ? '학습함 · 연습 필요' : '미시작'; }

  /* ---------- 학습 (커리큘럼) ---------- */
  function renderCurriculum() {
    const wrap = document.getElementById('curriculum');
    wrap.innerHTML = categories().map(cat => {
      const cks = classesInCategory(cat);
      const cs = Progress.summary(cks);
      const lessons = cks.map(k => {
        const drugs = drugsInClass(k);
        const proto = drugs.find(d => d.isPrototype) || drugs[0];
        const st = Progress.status(k);
        const icon = st === 'mastered' ? '✓' : st === 'studied' ? '◐' : '○';
        return `<button class="lesson ${st}" data-lesson="${esc(k)}">
            <span class="lesson-ic">${icon}</span>
            <span class="lesson-main">
              <span class="lesson-name">${k}</span>
              <span class="lesson-sub">${drugs.length}종 · 대표 ${proto.generic}${Progress.lesson(k).quizBest ? ' · 최고 ' + Progress.lesson(k).quizBest + '%' : ''}</span>
            </span>
            <span class="lesson-go">▸</span>
          </button>`;
      }).join('');
      const pct = cks.length ? Math.round(cs.mastered / cks.length * 100) : 0;
      return `<div class="unit">
        <div class="unit-head" data-unit>
          <div class="unit-title">${cat}</div>
          <div class="unit-prog"><div class="bar"><span style="width:${pct}%"></span></div><span class="pct">${cs.mastered}/${cks.length}</span></div>
          <span class="caret">▾</span>
        </div>
        <div class="unit-body">${lessons}</div>
      </div>`;
    }).join('');

    wrap.querySelectorAll('.unit-head').forEach(h => h.onclick = () => h.parentElement.classList.toggle('open'));
    wrap.querySelectorAll('[data-lesson]').forEach(b => b.onclick = () => startLesson(b.dataset.lesson));
    // 첫 단원은 펼쳐두기
    const first = wrap.querySelector('.unit'); if (first) first.classList.add('open');
  }

  /* ---------- 레슨 흐름 (학습 → 연습 → 결과) ---------- */
  let L = null; // { klass, drugs, phase, sIdx, q, qIdx, correct, answered }
  function startLesson(klass) {
    const drugs = drugsInClass(klass);
    if (!drugs.length) return;
    L = { klass, drugs, phase: 'study', sIdx: 0, seen: new Set(), q: [], qIdx: 0, correct: 0, answered: false };
    document.getElementById('studyOverlay').hidden = false;
    document.body.style.overflow = 'hidden';
    renderLesson();
  }
  function closeLesson() {
    document.getElementById('studyOverlay').hidden = true;
    document.body.style.overflow = '';
    L = null;
  }
  function lessonBar(title) {
    return `<div class="study-bar">
      <span class="study-klass">${title}</span>
      <button class="study-x" id="lessonClose" aria-label="닫기">✕</button>
    </div>`;
  }
  function renderLesson() {
    if (!L) return;
    if (L.phase === 'study') return renderStudyPhase();
    if (L.phase === 'practice') return renderPracticePhase();
    if (L.phase === 'result') return renderResultPhase();
  }

  // 1) 정독 학습
  function renderStudyPhase() {
    const inner = document.getElementById('studyInner');
    const d = L.drugs[L.sIdx];
    const last = L.sIdx === L.drugs.length - 1;
    const pct = (L.sIdx + 1) / L.drugs.length * 100;
    if (!L.seen.has(d.id)) { L.seen.add(d.id); Progress.addLearned(1); }
    inner.innerHTML = `
      ${lessonBar(L.klass)}
      <div class="phase-tag">1단계 · 정독 학습 &nbsp;|&nbsp; ${L.sIdx + 1} / ${L.drugs.length}</div>
      <div class="study-prog"><span style="width:${pct}%"></span></div>
      <div class="study-scroll">
        <div class="study-card">
          <div class="ctop"><span class="ccat">${d.category} · ${d.klass}</span><span class="cstem">${d.stem || ''}</span></div>
          <div class="study-name">${d.generic}
            ${d.isPrototype ? '<span class="proto-flag">프로토타입</span>' : ''}
            <span class="en">${d.genericEn}${d.brand ? ' · ' + d.brand : ''}</span>
          </div>
          <div class="study-detail">
            <div class="row"><span class="k">작용기전</span> ${d.moa}</div>
            <div class="row"><span class="k">적응증</span> ${d.indication}</div>
            <div class="row"><span class="k">부작용</span> ${d.sideEffects}</div>
            <div class="row"><span class="k">금기·주의</span> ${d.contraindication}</div>
            <div class="row"><span class="k">용법용량</span> ${d.dose}</div>
            ${d.note ? `<div class="row"><span class="k">메모</span> ${d.note}</div>` : ''}
          </div>
        </div>
      </div>
      <div class="study-nav">
        <button class="btn ghost" id="sPrev" ${L.sIdx === 0 ? 'disabled' : ''}>← 이전</button>
        <button class="btn primary" id="sNext">${last ? '연습문제 →' : '다음 →'}</button>
      </div>`;
    document.getElementById('lessonClose').onclick = closeLesson;
    document.getElementById('sPrev').onclick = () => { if (L.sIdx > 0) { L.sIdx--; renderLesson(); } };
    document.getElementById('sNext').onclick = () => {
      if (last) { Progress.markStudied(L.klass); buildPractice(); L.phase = 'practice'; L.qIdx = 0; L.correct = 0; }
      else L.sIdx++;
      renderLesson();
    };
  }

  // 연습문제 생성
  function buildPractice() {
    const pool = L.drugs;
    const qs = [];
    pool.forEach(d => {
      const useClass = Math.random() < 0.4;
      if (useClass) {
        const others = sample(allClasses().filter(k => k !== d.klass), 3);
        qs.push({ q: `<b>${d.generic}</b> (${d.genericEn}) 의 계열은?`, hint: d.stem ? '어간 힌트: ' + d.stem : '', answer: d.klass, opts: shuffle([d.klass, ...others]) });
      } else {
        const others = sample(DRUGS.filter(x => x.indication !== d.indication).map(x => x.indication), 3);
        qs.push({ q: `<b>${d.generic}</b> 의 주요 적응증은?`, hint: d.klass, answer: d.indication, opts: shuffle([d.indication, ...new Set(others)].slice(0, 4)) });
      }
    });
    L.q = shuffle(qs).slice(0, Math.min(8, qs.length));
  }

  // 2) 연습문제
  function renderPracticePhase() {
    const inner = document.getElementById('studyInner');
    const item = L.q[L.qIdx];
    inner.innerHTML = `
      ${lessonBar(L.klass + ' · 연습')}
      <div class="phase-tag">2단계 · 연습문제 &nbsp;|&nbsp; ${L.qIdx + 1} / ${L.q.length} &nbsp;|&nbsp; 맞힘 ${L.correct}</div>
      <div class="study-prog"><span style="width:${(L.qIdx) / L.q.length * 100}%"></span></div>
      <div class="study-scroll">
        <div class="quiz-q"><div class="qtext">${item.q}</div>${item.hint ? `<div class="qsub">${item.hint}</div>` : ''}</div>
        <div class="quiz-opts" id="pOpts">
          ${item.opts.map(o => `<button class="opt" data-o="${esc(o)}">${o}</button>`).join('')}
        </div>
      </div>`;
    document.getElementById('lessonClose').onclick = closeLesson;
    document.getElementById('pOpts').onclick = e => {
      const b = e.target.closest('.opt'); if (!b || L.answered) return;
      L.answered = true;
      const picked = b.dataset.o, ok = picked === item.answer;
      if (ok) L.correct++;
      document.querySelectorAll('#pOpts .opt').forEach(o => {
        o.disabled = true;
        if (o.dataset.o === item.answer) o.classList.add('correct');
        else if (o === b) o.classList.add('wrong');
      });
      const nav = document.createElement('div');
      nav.className = 'study-nav one';
      nav.innerHTML = `<button class="btn primary" id="pNext">${L.qIdx === L.q.length - 1 ? '결과 보기 →' : '다음 →'}</button>`;
      document.querySelector('.study-scroll').appendChild(nav);
      document.getElementById('pNext').onclick = () => {
        L.answered = false;
        if (L.qIdx === L.q.length - 1) { L.phase = 'result'; }
        else L.qIdx++;
        renderLesson();
      };
    };
  }

  // 3) 결과
  function renderResultPhase() {
    const inner = document.getElementById('studyInner');
    const pct = Math.round(L.correct / L.q.length * 100);
    Progress.recordQuiz(L.klass, pct);
    const mastered = Progress.status(L.klass) === 'mastered';
    inner.innerHTML = `
      ${lessonBar(L.klass + ' · 결과')}
      <div class="result">
        <div class="big">${mastered ? '🎉' : pct >= PASS ? '🎉' : '💪'}</div>
        <div class="result-score ${pct >= PASS ? 'pass' : 'fail'}">${pct}%</div>
        <div class="result-sub">${L.correct} / ${L.q.length} 정답</div>
        <h3>${mastered ? `${L.klass} 마스터!` : pct >= PASS ? '통과!' : '조금만 더!'}</h3>
        <p class="muted">${pct >= PASS ? '잘했어요. 복습 탭에서 간격반복으로 오래 기억하세요.' : `${PASS}% 이상이면 마스터예요. 다시 학습하거나 한 번 더 풀어보세요.`}</p>
        <div class="hero-btns" style="justify-content:center;margin-top:18px">
          ${pct >= PASS
            ? `<button class="btn primary" id="rNext">다음 레슨 →</button><button class="btn ghost" id="rClose">학습 목록</button>`
            : `<button class="btn primary" id="rRetry">다시 풀기</button><button class="btn ghost" id="rStudy">다시 학습</button>`}
        </div>
      </div>`;
    document.getElementById('lessonClose').onclick = closeLesson;
    const rRetry = document.getElementById('rRetry'); if (rRetry) rRetry.onclick = () => { buildPractice(); L.phase = 'practice'; L.qIdx = 0; L.correct = 0; renderLesson(); };
    const rStudy = document.getElementById('rStudy'); if (rStudy) rStudy.onclick = () => { L.phase = 'study'; L.sIdx = 0; renderLesson(); };
    const rClose = document.getElementById('rClose'); if (rClose) rClose.onclick = () => { closeLesson(); showView('learn'); };
    const rNext = document.getElementById('rNext'); if (rNext) rNext.onclick = () => {
      const nk = nextLesson();
      if (nk) startLesson(nk); else { closeLesson(); showView('home'); }
    };
  }

  /* ---------- 복습 (SRS 플래시카드) ---------- */
  let queue = [], qIdx = 0, done = 0;
  function startReview() { queue = SRS.buildQueue(allIds(), NEW_PER_DAY); qIdx = 0; done = 0; renderCard(); }
  function renderCard() {
    const area = document.getElementById('reviewArea');
    if (qIdx >= queue.length) {
      area.innerHTML = `<div class="empty">
        <div class="big">${done > 0 ? '🎉' : '🌱'}</div>
        <h3>${done > 0 ? '오늘 복습 완료!' : '복습 대기 없음'}</h3>
        <p class="muted">${done > 0 ? done + '장을 복습했습니다. 다음 복습일이 자동 배치됐어요.' : '학습 탭에서 레슨을 먼저 익히면 복습 카드가 쌓입니다.'}</p>
        <div class="hero-btns" style="justify-content:center;margin-top:18px">
          <button class="btn primary" id="rvLearn">학습하러 가기</button>
          <button class="btn ghost" id="rvQuiz">퀴즈 풀기</button>
        </div>
      </div>`;
      document.getElementById('rvLearn').onclick = () => showView('learn');
      document.getElementById('rvQuiz').onclick = () => showView('quiz');
      updateBadges(); return;
    }
    const d = byId(queue[qIdx]);
    const isNew = SRS.isNew(d.id);
    area.innerHTML = `<div class="flash-wrap">
      <div class="progress-line"><span>${qIdx + 1} / ${queue.length}</span><span>${isNew ? '🆕 신규' : '🔁 복습'} · ${d.category}</span></div>
      <div class="card" id="card">
        <div class="ctop"><span class="ccat">${d.klass}</span><span class="cstem">${d.stem || ''}</span></div>
        <div class="front">${d.generic}<span class="en">${d.genericEn}${d.brand ? ' · ' + d.brand : ''}</span></div>
        <div class="back">
          <div class="row"><span class="k">계열/MOA</span> ${d.moa}</div>
          <div class="row"><span class="k">적응증</span> ${d.indication}</div>
          <div class="row"><span class="k">부작용</span> ${d.sideEffects}</div>
          <div class="row"><span class="k">금기</span> ${d.contraindication}</div>
          <div class="row"><span class="k">용량</span> ${d.dose}</div>
        </div>
      </div>
      <button class="btn primary full" id="flipBtn" style="margin-top:16px">답 확인 (먼저 떠올려 보세요)</button>
      <div class="btn-row" id="rateRow" style="display:none">
        <button class="btn rate again" data-q="0">Again<small>다시</small></button>
        <button class="btn rate hard" data-q="1">Hard<small>어려움</small></button>
        <button class="btn rate good" data-q="2">Good<small>좋음</small></button>
        <button class="btn rate easy" data-q="3">Easy<small>쉬움</small></button>
      </div>
    </div>`;
    const flip = () => {
      const card = document.getElementById('card');
      if (card.classList.contains('flipped')) return;
      card.classList.add('flipped');
      document.getElementById('flipBtn').style.display = 'none';
      document.getElementById('rateRow').style.display = 'grid';
    };
    document.getElementById('flipBtn').onclick = flip;
    document.getElementById('card').addEventListener('click', flip);
    document.getElementById('rateRow').onclick = e => {
      const b = e.target.closest('.btn.rate'); if (!b) return;
      SRS.rate(d.id, +b.dataset.q); Progress.addLearned(1);
      done++; qIdx++; renderCard(); updateBadges();
    };
  }

  /* ---------- 어간 사전 ---------- */
  function renderStems() {
    document.getElementById('stemGrid').innerHTML = STEMS.map(s => `
      <div class="stem-card ${s.warn ? 'warn-stem' : ''}">
        <div class="s">${s.stem}</div><div class="c">${s.klass}</div><div class="ex">${s.ex}</div>
        ${s.note ? `<div class="flag">⚠ ${s.note}</div>` : ''}
      </div>`).join('');
  }

  /* ---------- 랜덤 퀴즈 (인터리빙) ---------- */
  let quizScore = 0, quizTotal = 0;
  function startQuiz() { quizScore = 0; quizTotal = 0; nextQuiz(); }
  function nextQuiz() {
    const area = document.getElementById('quizArea');
    if (DRUGS.length < 4) { area.innerHTML = `<div class="empty"><div class="big">🧩</div>약물이 더 필요합니다.</div>`; return; }
    const d = DRUGS[Math.floor(Math.random() * DRUGS.length)];
    const mode = Math.random() < 0.5 ? 'class' : 'indication';
    const qText = mode === 'class' ? `<b>${d.generic}</b> (${d.genericEn}) 의 계열은?` : `<b>${d.generic}</b> 의 주 적응증으로 옳은 것은?`;
    const correct = mode === 'class' ? d.klass : d.indication;
    const distractors = sample(DRUGS.filter(x => (mode === 'class' ? x.klass !== d.klass : x.indication !== d.indication)).map(x => mode === 'class' ? x.klass : x.indication), 3);
    const opts = shuffle([correct, ...new Set(distractors)].slice(0, 4));
    area.innerHTML = `<div class="quiz-wrap">
      <div class="quiz-score">점수 ${quizScore} / ${quizTotal}</div>
      <div class="quiz-q"><div class="qtext">${qText}</div><div class="qsub">${mode === 'class' ? '어간 힌트: ' + (d.stem || '없음') : d.klass}</div></div>
      <div class="quiz-opts">${opts.map(o => `<button class="opt" data-o="${esc(o)}">${o}</button>`).join('')}</div>
    </div>`;
    area.querySelector('.quiz-opts').onclick = e => {
      const b = e.target.closest('.opt'); if (!b) return;
      quizTotal++;
      area.querySelectorAll('.opt').forEach(o => { o.disabled = true; if (o.dataset.o === correct) o.classList.add('correct'); else if (o === b) o.classList.add('wrong'); });
      if (b.dataset.o === correct) quizScore++;
      setTimeout(nextQuiz, 1100);
    };
  }

  /* ---------- 공통 ---------- */
  function updateBadges() {
    const srs = SRS.stats(allIds());
    const due = srs.dueCount + Math.min(srs.newCount, NEW_PER_DAY);
    document.getElementById('dueBadge').textContent = due > 999 ? 999 : due;
    const ks = allClasses(); const sum = Progress.summary(ks);
    document.getElementById('footStats').textContent =
      `레슨 마스터 ${sum.mastered}/${sum.total} · 복습대기 ${srs.dueCount} · 🔥${Progress.streak()}일`;
  }

  document.getElementById('resetBtn').onclick = () => {
    if (confirm('모든 학습 기록(진도·간격반복)을 초기화할까요?')) { SRS.reset(); Progress.reset(); showView('home'); }
  };

  /* ---------- 부팅 ---------- */
  renderHome();
})();
