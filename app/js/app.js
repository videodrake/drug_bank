/* ============================================================
 * 앱 로직 — 뷰 렌더링 / 네비게이션 / 플래시카드 / 퀴즈
 * 학습법: 계열 청킹 · 간격반복 · 인출연습 · 어간 · 인터리빙
 * ============================================================ */
(() => {
  const allIds = () => DRUGS.map(d => d.id);
  const byId = id => DRUGS.find(d => d.id === id);
  const categories = () => [...new Set(DRUGS.map(d => d.category))];
  const NEW_PER_DAY = 20;

  /* ---------- 네비게이션 ---------- */
  const tabs = document.getElementById('tabs');
  tabs.addEventListener('click', e => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    showView(btn.dataset.view);
  });

  function showView(name) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === name));
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
    if (name === 'dashboard') renderDashboard();
    if (name === 'classes') renderClasses();
    if (name === 'review') startReview();
    if (name === 'stems') renderStems();
    if (name === 'quiz') startQuiz();
  }

  /* ---------- 대시보드 ---------- */
  function renderDashboard() {
    const s = SRS.stats(allIds());

    // 첫 진입 안내 + 시작 CTA
    const todayCount = Math.min(s.dueCount, 9999) + Math.min(s.newCount, NEW_PER_DAY);
    const firstTime = s.learned === 0 && s.dueCount === 0;
    let heroHTML;
    if (firstTime) {
      heroHTML = `
        <div class="hero">
          <div class="hero-tag">👋 처음 오셨네요</div>
          <h2 class="hero-title">약물 ${s.total}종, 외우지 말고 꺼내며 익혀요</h2>
          <p class="hero-sub">계열로 묶고(청킹) · 매일 조금씩 간격을 두고 복습(간격반복)하는 방식입니다.<br>아래 버튼만 누르면 바로 시작돼요.</p>
          <div class="hero-btns">
            <button class="btn primary" id="heroStart">▶ 오늘 학습 시작 (${todayCount}장)</button>
            <button class="btn ghost" id="heroBrowse">계열 먼저 둘러보기</button>
          </div>
        </div>`;
    } else if (todayCount > 0) {
      heroHTML = `
        <div class="hero">
          <div class="hero-tag">오늘의 학습</div>
          <h2 class="hero-title">복습할 카드 ${todayCount}장이 준비됐어요</h2>
          <p class="hero-sub">먼저 떠올리고 → 탭해서 확인 → 기억한 만큼 평가하면 됩니다.</p>
          <div class="hero-btns">
            <button class="btn primary" id="heroStart">▶ 오늘 학습 시작 (${todayCount}장)</button>
            <button class="btn ghost" id="heroBrowse">계열 학습 보기</button>
          </div>
        </div>`;
    } else {
      heroHTML = `
        <div class="hero">
          <div class="hero-tag">🎉 오늘 할 복습 완료</div>
          <h2 class="hero-title">잘하고 있어요! 학습 완료 ${s.learned}/${s.total}종</h2>
          <p class="hero-sub">오늘 예정된 복습을 모두 끝냈습니다. 새 계열을 둘러보거나 퀴즈로 점검해 보세요.</p>
          <div class="hero-btns">
            <button class="btn primary" id="heroBrowse">계열 학습 둘러보기</button>
            <button class="btn ghost" id="heroQuiz">인터리빙 퀴즈</button>
          </div>
        </div>`;
    }
    document.getElementById('heroCta').innerHTML = heroHTML;
    const bind = (id, view) => { const el = document.getElementById(id); if (el) el.onclick = () => showView(view); };
    bind('heroStart', 'review');
    bind('heroBrowse', 'classes');
    bind('heroQuiz', 'quiz');
    // 처음 사용자에겐 사용법 패널을 강조, 익숙해지면 접어둠
    const howto = document.getElementById('howtoPanel');
    if (howto) howto.style.display = firstTime ? '' : 'none';

    document.getElementById('statGrid').innerHTML = `
      <div class="stat"><div class="num">${s.total}</div><div class="label">전체 약물</div></div>
      <div class="stat due"><div class="num">${s.dueCount}</div><div class="label">오늘 복습 대기</div></div>
      <div class="stat learned"><div class="num">${s.learned}</div><div class="label">학습 완료</div></div>
      <div class="stat"><div class="num">${s.newCount}</div><div class="label">미학습</div></div>
    `;
    // 카테고리별 진행률(학습완료 비율)
    const wrap = document.getElementById('categoryProgress');
    wrap.innerHTML = categories().map(cat => {
      const ids = DRUGS.filter(d => d.category === cat).map(d => d.id);
      const cs = SRS.stats(ids);
      const pct = ids.length ? Math.round(cs.learned / ids.length * 100) : 0;
      return `<div class="cat-row">
        <div class="name">${cat}</div>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <div class="pct">${cs.learned}/${ids.length}</div>
      </div>`;
    }).join('');
    updateBadges();
  }

  /* ---------- 계열 학습 (청킹 + 프로토타입) ---------- */
  let activeCat = '전체';
  function renderClasses() {
    const filter = document.getElementById('categoryFilter');
    const cats = ['전체', ...categories()];
    filter.innerHTML = cats.map(c =>
      `<button class="chip ${c === activeCat ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');
    filter.onclick = e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      activeCat = chip.dataset.cat;
      renderClasses();
    };

    // 계열별 그룹화
    const pool = activeCat === '전체' ? DRUGS : DRUGS.filter(d => d.category === activeCat);
    const groups = {};
    pool.forEach(d => { (groups[d.klass] ??= []).push(d); });

    const list = document.getElementById('classList');
    list.innerHTML = Object.entries(groups).map(([klass, drugs]) => {
      const proto = drugs.find(d => d.isPrototype) || drugs[0];
      const stem = drugs[0].stem || '';
      const rows = drugs.map(d => drugRow(d)).join('');
      return `<div class="class-card" data-klass="${esc(klass)}">
        <div class="head">
          ${stem ? `<span class="stem-tag">${stem}</span>` : ''}
          <div>
            <div class="cname">${klass}</div>
            <div class="cmeta">${drugs[0].category} · 대표약 ${proto.generic}</div>
          </div>
          <span class="count">${drugs.length}종</span>
          <span class="caret">▸</span>
        </div>
        <div class="class-body">
          <div class="moa-line"><b>MOA</b> · ${proto.moa}</div>
          ${rows}
        </div>
      </div>`;
    }).join('') || `<div class="empty"><div class="big">📭</div>이 카테고리에 약물이 아직 없습니다.</div>`;

    list.querySelectorAll('.class-card .head').forEach(h => {
      h.onclick = () => h.parentElement.classList.toggle('open');
    });
    list.querySelectorAll('.drug-row .dn').forEach(dn => {
      dn.onclick = () => dn.closest('.drug-row').classList.toggle('show');
    });
  }

  function drugRow(d) {
    return `<div class="drug-row ${d.isPrototype ? 'proto' : ''}">
      <div class="dn" style="cursor:pointer">${d.generic}<span class="en">${d.genericEn}</span>
        ${d.isPrototype ? '<span class="proto-flag">프로토타입</span>' : ''}</div>
      <div class="brand">${d.brand || ''}</div>
      <div class="detail">
        <div><span class="k">적응증</span>${d.indication}</div>
        <div><span class="k">부작용</span>${d.sideEffects}</div>
        <div><span class="k">금기</span>${d.contraindication}</div>
        <div><span class="k">용량</span>${d.dose}</div>
        ${d.note ? `<div><span class="k">메모</span>${d.note}</div>` : ''}
      </div>
    </div>`;
  }

  /* ---------- 복습 (간격반복 + 인출연습 플래시카드) ---------- */
  let queue = [], qIdx = 0, done = 0;
  function startReview() {
    queue = SRS.buildQueue(allIds(), NEW_PER_DAY);
    qIdx = 0; done = 0;
    renderCard();
  }

  function renderCard() {
    const area = document.getElementById('reviewArea');
    if (qIdx >= queue.length) {
      const msg = done > 0
        ? `${done}장을 학습했습니다. 간격반복 큐가 다음 복습일을 자동 배치했습니다.`
        : `지금은 복습할 카드가 없습니다. 계열 학습에서 새 약물을 둘러보세요.`;
      area.innerHTML = `<div class="empty">
        <div class="big">🎉</div>
        <h3>${done > 0 ? '오늘 복습 완료!' : '복습 대기 없음'}</h3>
        <p class="muted">${msg}</p>
        <div class="hero-btns" style="justify-content:center;margin-top:18px">
          <button class="btn primary" id="doneClasses">계열 학습 보기</button>
          <button class="btn ghost" id="doneQuiz">퀴즈로 점검</button>
        </div>
      </div>`;
      const c = document.getElementById('doneClasses'); if (c) c.onclick = () => showView('classes');
      const q = document.getElementById('doneQuiz'); if (q) q.onclick = () => showView('quiz');
      updateBadges();
      return;
    }
    const d = byId(queue[qIdx]);
    const isNew = SRS.isNew(d.id);
    area.innerHTML = `<div class="flash-wrap">
      <div class="progress-line">
        <span>${qIdx + 1} / ${queue.length}</span>
        <span>${isNew ? '🆕 신규' : '🔁 복습'} · ${d.category}</span>
      </div>
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
        <button class="btn rate hard"  data-q="1">Hard<small>어려움</small></button>
        <button class="btn rate good"  data-q="2">Good<small>좋음</small></button>
        <button class="btn rate easy"  data-q="3">Easy<small>쉬움</small></button>
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
    // 모바일: 카드 아무 곳이나 탭하면 뒤집기
    document.getElementById('card').addEventListener('click', flip);
    document.getElementById('rateRow').onclick = e => {
      const b = e.target.closest('.btn.rate');
      if (!b) return;
      SRS.rate(d.id, +b.dataset.q);
      done++; qIdx++;
      renderCard();
      updateBadges();
    };
  }

  /* ---------- 어간 사전 ---------- */
  function renderStems() {
    document.getElementById('stemGrid').innerHTML = STEMS.map(s => `
      <div class="stem-card ${s.warn ? 'warn-stem' : ''}">
        <div class="s">${s.stem}</div>
        <div class="c">${s.klass}</div>
        <div class="ex">${s.ex}</div>
        ${s.note ? `<div class="flag">⚠ ${s.note}</div>` : ''}
      </div>`).join('');
  }

  /* ---------- 인터리빙 퀴즈 ---------- */
  let quizScore = 0, quizTotal = 0;
  function startQuiz() {
    quizScore = 0; quizTotal = 0;
    nextQuiz();
  }
  function nextQuiz() {
    const area = document.getElementById('quizArea');
    if (DRUGS.length < 4) {
      area.innerHTML = `<div class="empty"><div class="big">🧩</div>퀴즈를 출제하려면 약물이 4개 이상 필요합니다.</div>`;
      return;
    }
    // 인터리빙: 전체 풀에서 무작위 — 여러 계열이 섞임
    const d = DRUGS[Math.floor(Math.random() * DRUGS.length)];
    const mode = Math.random() < 0.5 ? 'class' : 'indication';
    const qText = mode === 'class'
      ? `<b>${d.generic}</b> (${d.genericEn}) 의 계열은?`
      : `<b>${d.generic}</b> 의 주 적응증으로 옳은 것은?`;
    const correct = mode === 'class' ? d.klass : d.indication;
    const distractors = sample(
      DRUGS.filter(x => (mode === 'class' ? x.klass !== d.klass : x.indication !== d.indication))
           .map(x => mode === 'class' ? x.klass : x.indication),
      3);
    const opts = shuffle([correct, ...new Set(distractors)].slice(0, 4));

    area.innerHTML = `<div class="quiz-wrap">
      <div class="quiz-score">점수 ${quizScore} / ${quizTotal}</div>
      <div class="quiz-q">
        <div class="qtext">${qText}</div>
        <div class="qsub">${mode === 'class' ? '어간 힌트: ' + (d.stem || '없음') : d.klass}</div>
      </div>
      <div class="quiz-opts">
        ${opts.map(o => `<button class="opt" data-o="${esc(o)}">${o}</button>`).join('')}
      </div>
    </div>`;

    area.querySelector('.quiz-opts').onclick = e => {
      const b = e.target.closest('.opt');
      if (!b) return;
      quizTotal++;
      const picked = b.dataset.o;
      area.querySelectorAll('.opt').forEach(o => {
        o.disabled = true;
        if (o.dataset.o === correct) o.classList.add('correct');
        else if (o === b) o.classList.add('wrong');
      });
      if (picked === correct) quizScore++;
      setTimeout(nextQuiz, 1100);
    };
  }

  /* ---------- 유틸 ---------- */
  function updateBadges() {
    const s = SRS.stats(allIds());
    const badge = document.getElementById('dueBadge');
    badge.textContent = s.dueCount + s.newCount > 0 ? Math.min(s.dueCount + Math.min(s.newCount, NEW_PER_DAY), 999) : 0;
    document.getElementById('footStats').textContent =
      `전체 ${s.total}종 · 학습 ${s.learned} · 복습대기 ${s.dueCount} · 미학습 ${s.newCount}`;
  }
  function esc(s) { return String(s).replace(/"/g, '&quot;'); }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function sample(a, n) { return shuffle(a).slice(0, n); }

  /* ---------- 초기화 버튼 ---------- */
  document.getElementById('resetBtn').onclick = () => {
    if (confirm('모든 학습 기록(간격반복 진행)을 초기화할까요?')) {
      SRS.reset();
      showView('dashboard');
    }
  };

  /* ---------- 부팅 ---------- */
  renderDashboard();
})();
