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

  // 임상 보강 정보(details.js 오버레이)
  const dEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const detailOf = id => (typeof DRUG_DETAILS !== 'undefined' ? DRUG_DETAILS[id] : null);
  function detailRows(d) {
    const x = detailOf(d.id); if (!x) return '';
    return `
      <div class="row"><span class="k">상호작용</span> ${dEsc(x.interactions)}</div>
      <div class="row"><span class="k">임부·수유</span> ${dEsc(x.pregnancy)}</div>
      <div class="row"><span class="k">신·간 조절</span> ${dEsc(x.renal)}</div>
      <div class="row"><span class="k">복약지도</span> ${dEsc(x.counseling)}</div>`;
  }

  // 원형 진행 링 (SVG)
  function ringSVG(pct, top, bot) {
    const r = 42, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return `<svg class="ring" viewBox="0 0 100 100" width="98" height="98" aria-hidden="true">
      <circle class="ring-bg" cx="50" cy="50" r="${r}"></circle>
      <circle class="ring-fg" cx="50" cy="50" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"></circle>
      <text class="ring-top" x="50" y="50">${top}</text>
      <text class="ring-bot" x="50" y="66">${bot}</text>
    </svg>`;
  }
  // 컨페티 (라이브러리 없이)
  function confetti() {
    const wrap = document.createElement('div'); wrap.className = 'confetti';
    const colors = ['#5b8def', '#2dd4bf', '#34d399', '#fbbf24', '#f87171', '#f0b429'];
    for (let i = 0; i < 80; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.35).toFixed(2) + 's';
      p.style.animationDuration = (1.4 + Math.random() * 0.9).toFixed(2) + 's';
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 2600);
  }

  /* ---------- 레슨 구성 ----------
     다종 계열 = 그 자체 레슨. 1종짜리 계열들은 '기전/효능군' 키워드로 묶음.
     레슨: { id, title, cat, drugs[], multi } — id는 첫 약물 id 기반(안정적) */
  const CHUNK = 6;
  // klass에서 기전·효능군 추출 (위에서부터 먼저 매칭)
  const GROUPS = [
    [/이뇨/, '이뇨제'],
    [/항응고|헤파린|DOAC|비타민K 길항/, '항응고제'],
    [/항혈소판/, '항혈소판제'],
    [/지혈|섬유소/, '지혈제'],
    [/질산염|강심|항부정맥|If 전류/, '심장·부정맥약'],
    [/지질|스타틴|피브|콜레스테롤/, '이상지질혈증약'],
    [/α1|α2|혈관확장|ARNI|레닌/, '기타 혈압약'],
    [/인슐린/, '인슐린'],
    [/갑상선/, '갑상선약'],
    [/글루코코르티코이드|코르티코|광물코르티코/, '스테로이드'],
    [/에스트로겐|프로게스|안드로겐|피임|성장호르몬|옥시토신|배란|항이뇨호르몬/, '호르몬제'],
    [/비타민|엽산|철분|적혈구생성/, '비타민·조혈제'],
    [/칼륨|칼슘|마그네슘|중탄산|알칼리|전해질|수액/, '전해질·수액'],
    [/백신/, '백신'],
    [/면역억제|칼시뉴린|IMPDH|퓨린/, '면역억제제'],
    [/생물학적|단클론|TNF|IL-6|RANKL/, '생물학적제제'],
    [/항암|알킬화|항대사|미세소관|안트라|백금|GnRH|아로마타제|SERM|키나제|관문|CDK|면역조절|안드로겐 합성|항안드로겐/, '항암제'],
    [/오피오이드|마취|진해|거담|점액/, '진통·마취·호흡'],
    [/NSAID|해열|통풍|근이완|DMARD|레티노이드/, '소염·근골격'],
    [/완하|지사|제산|점막보호|운동촉진|5-ASA|담즙|소포|항구토|진경|장관/, '소화기 기타'],
    [/SSRI|SNRI|TCA|항우울|항정신병|기분|수면|항불안|자극제|치매|NMDA|콜린에스터|파킨슨|항전간|편두통/, '신경·정신 기타'],
    [/점안|녹내장|산동|윤활/, '안과 점안'],
    [/방광|전립선|5α|PDE5|결석/, '비뇨·생식 기타'],
    [/항진균|항바이러스|항결핵|요로 항균|살충|국소 항생|린코사마이드|아미노글리코사이드|글리코펩타이드|니트로|설폰아미드/, '기타 항감염'],
  ];
  function groupKey(d) {
    const k = d.klass || '';
    for (const [re, label] of GROUPS) if (re.test(k)) return label;
    return d.category + ' 기타';
  }
  let _lessons = null;
  function buildLessons() {
    if (_lessons) return _lessons;
    const byCat = {}; const flat = [];
    categories().forEach(cat => {
      const lessons = []; const singles = [];
      classesInCategory(cat).forEach(k => {
        const ds = drugsInClass(k);
        if (ds.length >= 2) lessons.push({ id: 'L:' + ds[0].id, title: k, cat, drugs: ds, multi: true });
        else singles.push(ds[0]);
      });
      // 1종짜리들을 기전군으로 묶음. 1종뿐인 기전군은 '○○ 기타'로 합쳐 파편화 방지
      const groups = new Map();
      singles.forEach(d => { const key = groupKey(d); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(d); });
      const leftover = [];
      const named = [];
      groups.forEach((ds, key) => { if (ds.length >= 2) named.push([key, ds]); else leftover.push(ds[0]); });
      if (leftover.length) named.push([cat + ' 기타', leftover]);
      named.forEach(([key, ds]) => {
        const parts = Math.ceil(ds.length / CHUNK);
        for (let i = 0; i < ds.length; i += CHUNK) {
          const chunk = ds.slice(i, i + CHUNK);
          const title = key + (parts > 1 ? ` (${Math.floor(i / CHUNK) + 1})` : '');
          lessons.push({ id: 'L:' + chunk[0].id, title, cat, drugs: chunk, multi: false });
        }
      });
      byCat[cat] = lessons; lessons.forEach(l => flat.push(l));
    });
    _lessons = { byCat, flat, map: Object.fromEntries(flat.map(l => [l.id, l])) };
    return _lessons;
  }
  const lessonsOf = cat => buildLessons().byCat[cat] || [];
  const allLessons = () => buildLessons().flat;
  const lessonIds = () => allLessons().map(l => l.id);
  const lessonById = id => buildLessons().map[id];

  /* ---------- 네비게이션 ---------- */
  document.getElementById('tabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab'); if (!btn) return; showView(btn.dataset.view);
  });
  function showView(name) {
    stopFlow();
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === name));
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
    if (name === 'home') renderHome();
    if (name === 'learn') renderCurriculum();
    if (name === 'review') startReview();
    if (name === 'quiz') startQuiz();
    if (name === 'flow') startFlow();
    if (name === 'mechanism') renderMechanism();
    if (name === 'stems') renderStems();
    window.scrollTo(0, 0);
  }

  /* ---------- 홈 ---------- */
  function nextLesson() {
    return allLessons().find(l => Progress.status(l.id) !== 'mastered') || null;
  }
  function renderHome() {
    const ids = lessonIds();
    const sum = Progress.summary(ids);
    const srs = SRS.stats(allIds());
    const learnedToday = Progress.todayLearned(), goal = Progress.goal();
    const goalPct = Math.min(100, Math.round(learnedToday / goal * 100));
    const streak = Progress.streak();
    const next = nextLesson();
    // 마스터/학습한 레슨에 속한 약물 수
    const coveredDrugs = allLessons().reduce((acc, l) => acc + (Progress.status(l.id) !== 'new' ? l.drugs.length : 0), 0);

    const continueCard = next
      ? `<div class="home-cta">
           <div class="cta-label">${sum.mastered + sum.studied > 0 ? '이어서 학습' : '여기서 시작하세요'}</div>
           <div class="cta-lesson">${next.title}</div>
           <div class="cta-meta">${next.cat} · ${next.drugs.length}종 · ${statusLabel(Progress.status(next.id))}</div>
           <button class="btn primary full" id="homeContinue">📖 학습 시작</button>
         </div>`
      : `<div class="home-cta done">
           <div class="cta-label">🎉 모든 레슨 마스터!</div>
           <div class="cta-lesson">대단해요</div>
           <div class="cta-meta">이제 복습으로 오래 기억하세요.</div>
           <button class="btn primary full" id="homeReview">🔁 복습하러 가기</button>
         </div>`;

    const masteryPct = sum.total ? Math.round(sum.mastered / sum.total * 100) : 0;
    document.getElementById('homeArea').innerHTML = `
      <div class="home-hero">
        ${ringSVG(masteryPct, masteryPct + '%', '마스터')}
        <div class="home-hero-side">
          <div class="streak"><span class="fire">🔥</span><b>${streak}</b><span class="muted small">일 연속</span></div>
          <div class="goal">
            <div class="goal-row"><span>오늘의 목표</span><span class="muted">${learnedToday} / ${goal}</span></div>
            <div class="bar"><span style="width:${goalPct}%"></span></div>
          </div>
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
      const lids = lessonsOf(cat).map(l => l.id);
      const cs = Progress.summary(lids);
      const pct = lids.length ? Math.round(cs.mastered / lids.length * 100) : 0;
      return `<div class="cat-row">
        <div class="name">${cat}</div>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <div class="pct">${cs.mastered}/${lids.length}</div>
      </div>`;
    }).join('');

    const c = document.getElementById('homeContinue'); if (c) c.onclick = () => startLesson(next.id);
    const r = document.getElementById('homeReview'); if (r) r.onclick = () => showView('review');
    document.getElementById('goLearn').onclick = () => showView('learn');
    updateBadges();
  }
  function statusLabel(st) { return st === 'mastered' ? '✓ 마스터' : st === 'studied' ? '학습함 · 연습 필요' : '미시작'; }

  /* ---------- 학습 (커리큘럼) ---------- */
  function renderCurriculum() {
    const wrap = document.getElementById('curriculum');
    wrap.innerHTML = categories().map((cat, ci) => {
      const lessons = lessonsOf(cat);
      const cs = Progress.summary(lessons.map(l => l.id));
      const rows = lessons.map((l, i) => {
        const proto = l.drugs.find(d => d.isPrototype) || l.drugs[0];
        const st = Progress.status(l.id);
        const best = Progress.lesson(l.id).quizBest;
        const icon = st === 'mastered' ? '✓' : st === 'studied' ? '◐' : (i + 1);
        const sub = l.multi
          ? `${l.drugs.length}종 · 대표 ${proto.generic}`
          : `${l.drugs.length}종 · ${l.drugs.slice(0, 3).map(d => d.generic).join(', ')}${l.drugs.length > 3 ? '…' : ''}`;
        return `<button class="lesson ${st}" data-lesson="${esc(l.id)}">
            <span class="lesson-ic">${icon}</span>
            <span class="lesson-main">
              <span class="lesson-name">${l.title}</span>
              <span class="lesson-sub">${sub}${best ? ' · 최고 ' + best + '%' : ''}</span>
            </span>
            <span class="lesson-go">▸</span>
          </button>`;
      }).join('');
      const pct = lessons.length ? Math.round(cs.mastered / lessons.length * 100) : 0;
      const opened = ci === 0 ? ' open' : '';
      return `<div class="unit${opened}">
        <div class="unit-head" data-unit>
          <div class="unit-title">${cat}</div>
          <div class="unit-prog"><div class="bar"><span style="width:${pct}%"></span></div><span class="pct">${cs.mastered}/${lessons.length}</span></div>
          <span class="caret">▾</span>
        </div>
        <div class="unit-body">${rows}</div>
      </div>`;
    }).join('');

    wrap.querySelectorAll('.unit-head').forEach(h => h.onclick = () => h.parentElement.classList.toggle('open'));
    wrap.querySelectorAll('[data-lesson]').forEach(b => b.onclick = () => startLesson(b.dataset.lesson));
  }

  /* ---------- 레슨 흐름 (학습 → 연습 → 결과) ---------- */
  let L = null; // { id, title, drugs, phase, sIdx, q, qIdx, correct, answered }
  function startLesson(id) {
    const lesson = lessonById(id);
    if (!lesson || !lesson.drugs.length) return;
    L = { id, title: lesson.title, drugs: lesson.drugs, phase: 'study', sIdx: 0, seen: new Set(), q: [], qIdx: 0, correct: 0, answered: false };
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
      ${lessonBar(L.title)}
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
            ${detailRows(d)}
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
      if (last) { Progress.markStudied(L.id); buildPractice(); L.phase = 'practice'; L.qIdx = 0; L.correct = 0; }
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
      ${lessonBar(L.title + ` · 연습`)}
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
    const wasMastered = Progress.status(L.id) === 'mastered';
    Progress.recordQuiz(L.id, pct);
    const mastered = Progress.status(L.id) === 'mastered';
    if (pct >= PASS && (!wasMastered)) confetti();
    inner.innerHTML = `
      ${lessonBar(L.title + ` · 결과`)}
      <div class="result">
        <div class="big">${mastered ? '🎉' : pct >= PASS ? '🎉' : '💪'}</div>
        <div class="result-score ${pct >= PASS ? 'pass' : 'fail'}">${pct}%</div>
        <div class="result-sub">${L.correct} / ${L.q.length} 정답</div>
        <h3>${mastered ? `${L.title} 마스터!` : pct >= PASS ? '통과!' : '조금만 더!'}</h3>
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
      if (nk) startLesson(nk.id); else { closeLesson(); showView('home'); }
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
          ${detailRows(d)}
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

  /* ---------- 쏙쏙 (자동 흘려보기) ---------- */
  const CATCOLORS = ['#5b8def', '#2dd4bf', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#f0b429', '#38bdf8', '#fb923c', '#4ade80', '#e879f9', '#22d3ee'];
  const catColor = cat => CATCOLORS[categories().indexOf(cat) % CATCOLORS.length];
  const SPEEDS = [{ label: '느리게', ms: 6000 }, { label: '보통', ms: 4000 }, { label: '빠르게', ms: 2500 }];
  let F = { pool: [], idx: 0, playing: true, speedI: 1, scope: '전체', timer: null };

  function flowPoolFor(scope) {
    if (scope === '복습 대기') {
      const due = allIds().filter(id => SRS.isDue(id));
      return (due.length ? due : allIds());
    }
    if (scope === '전체') return allIds();
    return DRUGS.filter(d => d.category === scope).map(d => d.id);
  }
  function stopFlow() { if (F.timer) { clearTimeout(F.timer); F.timer = null; } }
  function startFlow() {
    F.pool = shuffle(flowPoolFor(F.scope));
    F.idx = 0; F.playing = true;
    renderFlowShell();
    renderFlowCard();
    scheduleFlow();
  }
  function scheduleFlow() {
    stopFlow();
    if (!F.playing) return;
    F.timer = setTimeout(() => { advanceFlow(1); }, SPEEDS[F.speedI].ms);
  }
  function advanceFlow(dir) {
    if (!F.pool.length) return;
    F.idx = (F.idx + dir + F.pool.length) % F.pool.length;
    renderFlowCard();
    scheduleFlow();
  }
  function renderFlowShell() {
    const scopes = ['전체', ...categories(), '복습 대기'];
    document.getElementById('flowArea').innerHTML = `
      <div class="flow-scopes" id="flowScopes">
        ${scopes.map(s => `<button class="chip ${s === F.scope ? 'active' : ''}" data-scope="${esc(s)}">${s}</button>`).join('')}
      </div>
      <div class="flow-stage" id="flowStage"></div>
      <div class="flow-controls">
        <button class="fbtn" id="flowPrev" aria-label="이전">⏮</button>
        <button class="fbtn play" id="flowPlay" aria-label="재생/정지">⏸</button>
        <button class="fbtn" id="flowNext" aria-label="다음">⏭</button>
        <button class="fbtn" id="flowSpeed">${SPEEDS[F.speedI].label}</button>
      </div>`;
    document.getElementById('flowScopes').onclick = e => {
      const b = e.target.closest('[data-scope]'); if (!b) return;
      F.scope = b.dataset.scope; startFlow();
    };
    document.getElementById('flowPrev').onclick = () => { F.playing && (F.playing = true); advanceFlow(-1); };
    document.getElementById('flowNext').onclick = () => advanceFlow(1);
    document.getElementById('flowPlay').onclick = togglePlay;
    document.getElementById('flowSpeed').onclick = () => { F.speedI = (F.speedI + 1) % SPEEDS.length; document.getElementById('flowSpeed').textContent = SPEEDS[F.speedI].label; scheduleFlow(); };
  }
  function togglePlay() {
    F.playing = !F.playing;
    document.getElementById('flowPlay').textContent = F.playing ? '⏸' : '▶';
    if (F.playing) scheduleFlow(); else stopFlow();
    const bar = document.querySelector('.flow-timer > span');
    if (bar && !F.playing) { bar.style.animation = 'none'; }
    else if (bar && F.playing) renderFlowCard();
  }
  function renderFlowCard() {
    const stage = document.getElementById('flowStage');
    if (!stage) return;
    if (!F.pool.length) { stage.innerHTML = `<div class="empty"><div class="big">🌱</div>표시할 약물이 없습니다.</div>`; return; }
    const d = byId(F.pool[F.idx]);
    const col = catColor(d.category);
    const dur = F.playing ? SPEEDS[F.speedI].ms : 0;
    stage.innerHTML = `
      <div class="flow-card" id="flowCard" style="--cat:${col}">
        <div class="flow-timer"><span style="${dur ? `animation-duration:${dur}ms` : 'width:0'}"></span></div>
        <div class="flow-top">
          <span class="flow-cat" style="background:${col}22;color:${col};border-color:${col}55">${d.category}</span>
          ${d.stem ? `<span class="flow-stem">${d.stem}</span>` : ''}
        </div>
        <div class="flow-name">${d.generic}<span class="en">${d.genericEn}${d.brand ? ' · ' + d.brand : ''}</span></div>
        <div class="flow-klass">${d.klass}${d.isPrototype ? ' <span class="proto-flag">대표</span>' : ''}</div>
        <div class="flow-facts">
          <div><span class="k">기전</span>${oneLine(d.moa)}</div>
          <div><span class="k">적응증</span>${oneLine(d.indication)}</div>
          <div class="warn"><span class="k">주의</span>${oneLine(d.contraindication)}</div>
          ${detailOf(d.id) ? `<div><span class="k">복약</span>${dEsc(oneLine(detailOf(d.id).counseling))}</div>` : ''}
        </div>
        <div class="flow-count">${F.idx + 1} / ${F.pool.length} · 탭하면 일시정지</div>
      </div>`;
    document.getElementById('flowCard').onclick = togglePlay;
  }
  function oneLine(s) { const t = String(s).split(/[,(·]/)[0].trim(); return t.length > 42 ? t.slice(0, 42) + '…' : t; }

  /* ---------- 기전 다이어그램 ---------- */
  let mechSys = '전체';
  function renderMechanism() {
    if (typeof MECHANISMS === 'undefined') return;
    const systems = ['전체', ...new Set(MECHANISMS.map(m => m.sys))];
    document.getElementById('mechFilter').innerHTML = systems.map(s =>
      `<button class="chip ${s === mechSys ? 'active' : ''}" data-sys="${esc(s)}">${s}</button>`).join('');
    document.getElementById('mechFilter').onclick = e => {
      const c = e.target.closest('.chip'); if (!c) return; mechSys = c.dataset.sys; renderMechanism();
    };
    const list = mechSys === '전체' ? MECHANISMS : MECHANISMS.filter(m => m.sys === mechSys);
    const md = typeof MECH_DRUGS !== 'undefined' ? MECH_DRUGS : {};
    document.getElementById('mechList').innerHTML = list.map(m => `
      <div class="mech-card">
        <div class="mech-h">
          <span class="mech-sys">${m.sys}</span>
          <h3>${m.title}</h3>
        </div>
        <div class="mech-classes">${m.classes}</div>
        <div class="mech-diagram" data-mech="${m.id}"><div class="zoom-hint">🔍 탭하면 크게</div>${m.svg}</div>
        <p class="mech-desc">${m.desc}</p>
        <ul class="mech-points">${m.points.map(p => `<li>${p}</li>`).join('')}</ul>
        ${(md[m.id] || []).length ? `<div class="mech-drugs"><div class="md-title">이 기전의 약물 (한글 · 일반명)</div>
          ${md[m.id].map(g => `<div class="md-row"><span class="md-role">${g.role}</span><span class="md-list">${g.list}</span></div>`).join('')}
        </div>` : ''}
      </div>`).join('');
    // 다이어그램 탭 → 전체화면 확대
    document.querySelectorAll('#mechList .mech-diagram').forEach(el => {
      el.onclick = () => openMechZoom(el.querySelector('svg').outerHTML);
    });
  }
  function openMechZoom(svgHTML) {
    const wrap = document.createElement('div');
    wrap.className = 'mech-zoom';
    wrap.innerHTML = `<button class="mz-close" aria-label="닫기">✕</button><div class="mz-body">${svgHTML}</div><div class="mz-hint">가로로 돌리면 더 큽니다 · 빈 곳을 탭해 닫기</div>`;
    wrap.onclick = () => wrap.remove();
    document.body.appendChild(wrap);
  }

  /* ---------- 어간 사전 ---------- */
  function renderStems() {
    document.getElementById('stemGrid').innerHTML = STEMS.map(s => `
      <div class="stem-card ${s.warn ? 'warn-stem' : ''}">
        <div class="s">${s.stem}</div><div class="c">${s.klass}</div><div class="ex">${s.ex}</div>
        ${s.note ? `<div class="flag">⚠ ${s.note}</div>` : ''}
      </div>`).join('');
  }

  /* ---------- 랜덤 퀴즈 (인터리빙, 10문제 세션) ---------- */
  const QUIZ_N = 10;
  let quizScore = 0, quizNum = 0, quizWrong = [];
  function startQuiz() {
    const area = document.getElementById('quizArea');
    const st = Progress.quizStats();
    area.innerHTML = `<div class="quiz-wrap">
      <div class="quiz-intro">
        <div class="big">📝</div>
        <h3>랜덤 퀴즈 ${QUIZ_N}문제</h3>
        <p class="muted">여러 계열을 섞어 출제합니다. 약물명 → 계열 / 적응증을 맞혀보세요.</p>
        <div class="quiz-stats-row">
          <div><b>${st.sessions}</b><span>세션</span></div>
          <div><b>${st.acc}%</b><span>평균 정답률</span></div>
          <div><b>${st.best}%</b><span>최고</span></div>
        </div>
        <button class="btn primary full" id="quizStart" style="margin-top:16px">시작하기</button>
      </div>
    </div>`;
    document.getElementById('quizStart').onclick = () => { quizScore = 0; quizNum = 0; quizWrong = []; nextQuiz(); };
  }
  function nextQuiz() {
    const area = document.getElementById('quizArea');
    if (DRUGS.length < 4) { area.innerHTML = `<div class="empty"><div class="big">🧩</div>약물이 더 필요합니다.</div>`; return; }
    if (quizNum >= QUIZ_N) return renderQuizResult();
    const d = DRUGS[Math.floor(Math.random() * DRUGS.length)];
    const mode = Math.random() < 0.5 ? 'class' : 'indication';
    const qText = mode === 'class' ? `<b>${d.generic}</b> (${d.genericEn}) 의 계열은?` : `<b>${d.generic}</b> 의 주 적응증으로 옳은 것은?`;
    const correct = mode === 'class' ? d.klass : d.indication;
    const distractors = sample(DRUGS.filter(x => (mode === 'class' ? x.klass !== d.klass : x.indication !== d.indication)).map(x => mode === 'class' ? x.klass : x.indication), 3);
    const opts = shuffle([correct, ...new Set(distractors)].slice(0, 4));
    area.innerHTML = `<div class="quiz-wrap">
      <div class="progress-line"><span>${quizNum + 1} / ${QUIZ_N}</span><span>맞힘 ${quizScore}</span></div>
      <div class="study-prog"><span style="width:${quizNum / QUIZ_N * 100}%"></span></div>
      <div class="quiz-q"><div class="qtext">${qText}</div><div class="qsub">${mode === 'class' ? '어간 힌트: ' + (d.stem || '없음') : d.klass}</div></div>
      <div class="quiz-opts">${opts.map(o => `<button class="opt" data-o="${esc(o)}">${o}</button>`).join('')}</div>
    </div>`;
    area.querySelector('.quiz-opts').onclick = e => {
      const b = e.target.closest('.opt'); if (!b || b.disabled) return;
      const ok = b.dataset.o === correct;
      area.querySelectorAll('.opt').forEach(o => { o.disabled = true; if (o.dataset.o === correct) o.classList.add('correct'); else if (o === b) o.classList.add('wrong'); });
      if (ok) quizScore++; else quizWrong.push({ name: d.generic, ans: correct });
      quizNum++;
      setTimeout(nextQuiz, ok ? 700 : 1300);
    };
  }
  function renderQuizResult() {
    const area = document.getElementById('quizArea');
    const pct = Math.round(quizScore / QUIZ_N * 100);
    Progress.recordQuizSession(quizScore, QUIZ_N);
    if (pct >= 90) confetti();
    const st = Progress.quizStats();
    const wrongHTML = quizWrong.length
      ? `<div class="wrong-list"><div class="wl-title">틀린 문제</div>${quizWrong.map(w => `<div class="wl-row"><span>${w.name}</span><span class="muted">${w.ans}</span></div>`).join('')}</div>`
      : `<p class="muted">전부 정답! 완벽해요 🎯</p>`;
    area.innerHTML = `<div class="quiz-wrap">
      <div class="result">
        <div class="big">${pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : '💪'}</div>
        <div class="result-score ${pct >= 70 ? 'pass' : 'fail'}">${pct}%</div>
        <div class="result-sub">${quizScore} / ${QUIZ_N} 정답</div>
        <div class="quiz-stats-row" style="margin-top:14px">
          <div><b>${st.sessions}</b><span>총 세션</span></div>
          <div><b>${st.acc}%</b><span>평균</span></div>
          <div><b>${st.best}%</b><span>최고</span></div>
        </div>
      </div>
      ${wrongHTML}
      <div class="hero-btns" style="justify-content:center;margin-top:18px">
        <button class="btn primary" id="qAgain">다시 풀기</button>
        <button class="btn ghost" id="qHome">홈으로</button>
      </div>
    </div>`;
    document.getElementById('qAgain').onclick = () => { quizScore = 0; quizNum = 0; quizWrong = []; nextQuiz(); };
    document.getElementById('qHome').onclick = () => showView('home');
  }

  /* ---------- 공통 ---------- */
  function updateBadges() {
    const srs = SRS.stats(allIds());
    const due = srs.dueCount + Math.min(srs.newCount, NEW_PER_DAY);
    document.getElementById('dueBadge').textContent = due > 999 ? 999 : due;
    const sum = Progress.summary(lessonIds());
    document.getElementById('footStats').textContent =
      `레슨 마스터 ${sum.mastered}/${sum.total} · 복습대기 ${srs.dueCount} · 🔥${Progress.streak()}일`;
  }

  document.getElementById('resetBtn').onclick = () => {
    if (confirm('모든 학습 기록(진도·간격반복)을 초기화할까요?')) { SRS.reset(); Progress.reset(); showView('home'); }
  };

  /* ---------- 부팅 ---------- */
  renderHome();
})();
