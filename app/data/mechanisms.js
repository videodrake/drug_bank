/* ============================================================
 * 약물 계열별 작용 기전 다이어그램 (인라인 SVG, 외부 이미지 없음)
 * 화살표(→)는 경로, 빨강 ✕ 는 약물의 차단 지점.
 * 공용 마커 #ah(화살촉)는 index.html 상단 defs에 정의.
 * ============================================================ */
const MECHANISMS = [
{
  id: 'raas', sys: '심혈관', title: 'RAAS 축 (고혈압·심부전)',
  classes: 'ACE억제제(-pril) · ARB(-sartan) · 알도스테론길항제 · ARNI · 직접레닌억제제',
  desc: '레닌-안지오텐신-알도스테론 축은 혈압을 올린다. 각 약은 이 축의 서로 다른 단계를 차단해 혈압을 낮춘다.',
  points: [
    'ACE억제제: 안지오텐신 I→II 전환 차단. 브래디키닌 축적으로 마른기침',
    'ARB: 안지오텐신 II의 AT1 수용체를 직접 차단(기침 적음)',
    '알도스테론 길항제(스피로노락톤): 나트륨 재흡수↓·칼륨 보존',
    'ARNI(사쿠비트릴): 네프릴리신 억제로 이뇨펩타이드↑ + ARB',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 330">
    <rect class="box" x="100" y="8" width="160" height="32" rx="8"/><text x="180" y="29" text-anchor="middle">안지오텐시노겐</text>
    <line class="flow" x1="180" y1="40" x2="180" y2="62" marker-end="url(#ah)"/>
    <text class="lbl" x="196" y="56">레닌</text>
    <rect class="box" x="110" y="64" width="140" height="32" rx="8"/><text x="180" y="85" text-anchor="middle">안지오텐신 I</text>
    <line class="flow" x1="180" y1="96" x2="180" y2="120" marker-end="url(#ah)"/>
    <text class="lbl" x="196" y="113">ACE(전환효소)</text>
    <text class="blk" x="150" y="116" text-anchor="middle">✕</text><text class="drug" x="92" y="116" text-anchor="end">ACE억제제</text>
    <rect class="box acc-b" x="108" y="122" width="144" height="32" rx="8"/><text x="180" y="143" text-anchor="middle">안지오텐신 II</text>
    <line class="flow" x1="180" y1="154" x2="180" y2="178" marker-end="url(#ah)"/>
    <text class="blk" x="150" y="174" text-anchor="middle">✕</text><text class="drug" x="92" y="174" text-anchor="end">ARB</text>
    <rect class="box tgt" x="120" y="180" width="120" height="32" rx="8"/><text x="180" y="201" text-anchor="middle">AT1 수용체</text>
    <line class="flow" x1="140" y1="212" x2="100" y2="240" marker-end="url(#ah)"/>
    <line class="flow" x1="220" y1="212" x2="260" y2="240" marker-end="url(#ah)"/>
    <rect class="box" x="20" y="242" width="150" height="32" rx="8"/><text x="95" y="263" text-anchor="middle">혈관 수축</text>
    <rect class="box" x="190" y="242" width="150" height="32" rx="8"/><text x="265" y="263" text-anchor="middle">알도스테론 분비</text>
    <text class="blk" x="190" y="262" text-anchor="middle">✕</text><text class="drug" x="265" y="292" text-anchor="middle">알도스테론 길항제</text>
    <line class="flow" x1="95" y1="274" x2="150" y2="300" marker-end="url(#ah)"/>
    <line class="flow" x1="250" y1="296" x2="210" y2="312" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="120" y="300" width="120" height="26" rx="8"/><text x="180" y="318" text-anchor="middle">혈압 ↑</text>
  </svg>`
},
{
  id: 'adrenergic', sys: '심혈관', title: '교감신경 수용체',
  classes: '베타차단제(-olol) · α1차단제 · 중추α2작용제 · β2작용제(-terol)',
  desc: '교감신경 수용체는 장기마다 다르다. 약물은 특정 수용체를 차단하거나 자극한다.',
  points: [
    'β1(심장): 차단 시 심박수·수축력↓ → 베타차단제',
    'α1(혈관): 차단 시 혈관확장 → α1차단제(-osin), 전립선에도 작용',
    'α2(중추): 자극 시 교감유출↓ → 클로니딘·메틸도파',
    'β2(기관지): 자극 시 기관지확장 → 천식·COPD β2작용제',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 250">
    <rect class="box acc-b" x="130" y="8" width="100" height="30" rx="8"/><text x="180" y="28" text-anchor="middle">교감신경</text>
    <line class="flow" x1="150" y1="38" x2="70" y2="64" marker-end="url(#ah)"/>
    <line class="flow" x1="180" y1="38" x2="180" y2="64" marker-end="url(#ah)"/>
    <line class="flow" x1="210" y1="38" x2="290" y2="64" marker-end="url(#ah)"/>
    <rect class="box" x="14" y="66" width="120" height="46" rx="8"/><text x="74" y="86" text-anchor="middle">심장 β1</text><text class="lbl" x="74" y="102" text-anchor="middle">심박·수축력↑</text>
    <rect class="box" x="120" y="66" width="120" height="46" rx="8"/><text x="180" y="86" text-anchor="middle">혈관 α1</text><text class="lbl" x="180" y="102" text-anchor="middle">혈관 수축</text>
    <rect class="box" x="246" y="66" width="100" height="46" rx="8"/><text x="296" y="86" text-anchor="middle">기관지 β2</text><text class="lbl" x="296" y="102" text-anchor="middle">기관지 확장</text>
    <text class="blk" x="74" y="130" text-anchor="middle">✕</text><text class="drug" x="74" y="150" text-anchor="middle">베타차단제</text>
    <text class="blk" x="180" y="130" text-anchor="middle">✕</text><text class="drug" x="180" y="150" text-anchor="middle">α1차단제</text>
    <text class="acc" x="296" y="132" text-anchor="middle" font-size="15">＋</text><text class="drug" x="296" y="150" text-anchor="middle" style="fill:var(--good)">β2작용제</text>
    <rect class="box" x="40" y="186" width="280" height="48" rx="8"/>
    <text x="180" y="206" text-anchor="middle">중추 α2 자극 → 교감 유출 ↓</text>
    <text class="drug" x="180" y="226" text-anchor="middle" style="fill:var(--good)">＋ 클로니딘 · 메틸도파</text>
  </svg>`
},
{
  id: 'nephron', sys: '심혈관', title: '신장 네프론과 이뇨제',
  classes: '루프 · 티아지드 · 칼륨보존 · 탄산탈수효소억제 · SGLT2',
  desc: '이뇨제는 네프론의 서로 다른 부위에서 나트륨 재흡수를 막아 소변량을 늘린다.',
  points: [
    '근위세뇨관: 탄산탈수효소억제제(아세타졸아미드), SGLT2억제제(요당 배설)',
    '헨레고리 상행각: 루프이뇨제(가장 강력) — Na-K-2Cl 차단',
    '원위세뇨관: 티아지드 — Na-Cl 차단',
    '집합관: 칼륨보존이뇨제(스피로노락톤) — 알도스테론 길항',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 250">
    <path d="M40 30 C 40 120, 120 120, 120 60 C 120 20, 200 20, 200 90 L 200 220" fill="none" stroke="#5b8def" stroke-width="14" opacity="0.35"/>
    <text class="lbl" x="40" y="22">사구체→</text>
    <text class="drug" x="150" y="48" text-anchor="start" style="fill:var(--good)">근위: CAI · SGLT2</text>
    <line class="flow" x1="150" y1="52" x2="128" y2="58" marker-end="url(#ah)"/>
    <text class="drug" x="40" y="150" text-anchor="start">헨레: 루프이뇨제</text>
    <line class="flow" x1="78" y1="140" x2="70" y2="100" marker-end="url(#ah)"/>
    <text class="drug" x="214" y="120" text-anchor="start">원위: 티아지드</text>
    <line class="flow" x1="212" y1="116" x2="202" y2="120" marker-end="url(#ah)"/>
    <text class="drug" x="214" y="190" text-anchor="start">집합관: K보존</text>
    <line class="flow" x1="212" y1="186" x2="202" y2="186" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="150" y="214" width="120" height="28" rx="8"/><text x="210" y="233" text-anchor="middle">소변 배설 ↑</text>
  </svg>`
},
{
  id: 'statin', sys: '대사', title: '콜레스테롤 합성과 스타틴',
  classes: '스타틴(-statin) · 에제티미브 · 피브레이트 · PCSK9억제제',
  desc: '간의 콜레스테롤 합성 경로를 막으면 LDL 수용체가 늘어 혈중 LDL을 제거한다.',
  points: [
    '스타틴: HMG-CoA 환원효소 차단 → 합성↓ → LDL수용체↑ → 혈중 LDL↓',
    '에제티미브: 장에서 콜레스테롤 흡수 차단(NPC1L1)',
    '피브레이트: PPAR-α 활성 → 중성지방↓',
    '야간 합성 활발 → 일부 스타틴은 저녁 복용',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 270">
    <rect class="box" x="110" y="8" width="140" height="30" rx="8"/><text x="180" y="28" text-anchor="middle">아세틸-CoA</text>
    <line class="flow" x1="180" y1="38" x2="180" y2="60" marker-end="url(#ah)"/>
    <rect class="box" x="110" y="62" width="140" height="30" rx="8"/><text x="180" y="82" text-anchor="middle">HMG-CoA</text>
    <line class="flow" x1="180" y1="92" x2="180" y2="116" marker-end="url(#ah)"/>
    <text class="lbl" x="196" y="109">HMG-CoA 환원효소</text>
    <text class="blk" x="150" y="112" text-anchor="middle">✕</text><text class="drug" x="92" y="112" text-anchor="end">스타틴</text>
    <rect class="box" x="118" y="118" width="124" height="30" rx="8"/><text x="180" y="138" text-anchor="middle">메발론산</text>
    <line class="flow" x1="180" y1="148" x2="180" y2="170" marker-end="url(#ah)"/>
    <rect class="box acc-b" x="120" y="172" width="120" height="30" rx="8"/><text x="180" y="192" text-anchor="middle">콜레스테롤</text>
    <line class="flow" x1="180" y1="202" x2="180" y2="224" marker-end="url(#ah)"/>
    <rect class="box tgt" x="96" y="226" width="168" height="34" rx="8"/><text x="180" y="241" text-anchor="middle">간 LDL 수용체 ↑</text><text class="lbl" x="180" y="255" text-anchor="middle">→ 혈중 LDL ↓</text>
    <text class="drug" x="300" y="138" text-anchor="middle">에제티미브</text><text class="lbl" x="300" y="154" text-anchor="middle">장 흡수 ✕</text>
  </svg>`
},
{
  id: 'coag', sys: '혈액', title: '응고 캐스케이드와 항응고제',
  classes: '와파린 · 헤파린/LMWH · DOAC(-xaban, -gatran)',
  desc: '응고는 여러 인자가 연쇄적으로 활성화되어 피브린 그물을 만든다. 항응고제는 각기 다른 지점을 막는다.',
  points: [
    '와파린: 비타민K 의존 인자(II·VII·IX·X) 간 합성 차단 — INR 모니터',
    '헤파린/LMWH: 안티트롬빈 활성화 → Xa·트롬빈 억제',
    '-xaban(아픽사반 등): Xa 인자 직접 억제',
    '다비가트란(-gatran): 트롬빈(IIa) 직접 억제',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 250">
    <rect class="box" x="20" y="8" width="150" height="30" rx="8"/><text x="95" y="28" text-anchor="middle">내인계</text>
    <rect class="box" x="190" y="8" width="150" height="30" rx="8"/><text x="265" y="28" text-anchor="middle">외인계</text>
    <line class="flow" x1="95" y1="38" x2="170" y2="64" marker-end="url(#ah)"/>
    <line class="flow" x1="265" y1="38" x2="190" y2="64" marker-end="url(#ah)"/>
    <rect class="box tgt" x="140" y="66" width="80" height="32" rx="8"/><text x="180" y="87" text-anchor="middle">Xa 인자</text>
    <text class="blk" x="118" y="88" text-anchor="middle">✕</text><text class="drug" x="112" y="88" text-anchor="end">-xaban</text>
    <text class="drug" x="244" y="84" text-anchor="start">헤파린</text><text class="lbl" x="244" y="98" text-anchor="start">(AT 경유)</text>
    <line class="flow" x1="180" y1="98" x2="180" y2="122" marker-end="url(#ah)"/>
    <rect class="box acc-b" x="135" y="124" width="90" height="32" rx="8"/><text x="180" y="145" text-anchor="middle">트롬빈(IIa)</text>
    <text class="blk" x="120" y="146" text-anchor="middle">✕</text><text class="drug" x="114" y="146" text-anchor="end">다비가트란</text>
    <line class="flow" x1="180" y1="156" x2="180" y2="180" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="135" y="182" width="90" height="30" rx="8"/><text x="180" y="202" text-anchor="middle">피브린(혈전)</text>
    <rect class="box" x="20" y="218" width="320" height="28" rx="8" style="fill:none;stroke-dasharray:4 3"/>
    <text class="drug" x="180" y="237" text-anchor="middle">와파린 ✕ II·VII·IX·X 합성(비타민K 의존)</text>
  </svg>`
},
{
  id: 'platelet', sys: '혈액', title: '혈소판 활성화와 항혈소판제',
  classes: '아스피린 · P2Y12억제제(클로피도그렐 등)',
  desc: '혈소판은 여러 경로로 활성화되어 응집한다. 항혈소판제는 활성화 신호를 차단한다.',
  points: [
    '아스피린: COX-1 비가역 억제 → 트롬복산 A2(TXA2)↓',
    'P2Y12억제제: ADP 수용체 차단(클로피도그렐·티카그렐러·프라수그렐)',
    '두 경로 모두 GPIIb/IIIa 활성 → 응집을 줄임',
    '관상동맥 스텐트 후 보통 두 약 병용(이중항혈소판요법)',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 210">
    <rect class="box acc-b" x="120" y="86" width="120" height="40" rx="10"/><text x="180" y="111" text-anchor="middle">혈소판</text>
    <rect class="box" x="20" y="10" width="150" height="32" rx="8"/><text x="95" y="31" text-anchor="middle">COX-1 → TXA2</text>
    <text class="blk" x="95" y="60" text-anchor="middle">✕</text><text class="drug" x="150" y="58" text-anchor="start">아스피린</text>
    <line class="flow" x1="95" y1="64" x2="140" y2="92" marker-end="url(#ah)"/>
    <rect class="box" x="190" y="10" width="150" height="32" rx="8"/><text x="265" y="31" text-anchor="middle">ADP → P2Y12</text>
    <text class="blk" x="265" y="60" text-anchor="middle">✕</text><text class="drug" x="210" y="58" text-anchor="end">P2Y12억제제</text>
    <line class="flow" x1="265" y1="64" x2="220" y2="92" marker-end="url(#ah)"/>
    <line class="flow" x1="180" y1="126" x2="180" y2="152" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="110" y="154" width="140" height="34" rx="8"/><text x="180" y="175" text-anchor="middle">GPIIb/IIIa → 응집</text>
  </svg>`
},
{
  id: 'acid', sys: '소화기', title: '위산 분비와 억제제',
  classes: 'PPI(-prazole) · H2차단제(-tidine) · 제산제',
  desc: '위벽세포는 세 신호로 자극되어 양성자펌프로 위산을 낸다. 약은 신호나 펌프를 막는다.',
  points: [
    '히스타민(H2)·가스트린·아세틸콜린(M3)이 벽세포를 자극',
    'H2차단제: 히스타민 H2 수용체 차단(중간 강도)',
    'PPI: 최종 단계인 H+/K+-ATPase(양성자펌프) 비가역 차단(가장 강력)',
    '제산제: 이미 분비된 위산을 중화(즉효·단기)',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 240">
    <text class="lbl" x="40" y="20">자극 신호</text>
    <rect class="box" x="20" y="26" width="100" height="28" rx="8"/><text x="70" y="45" text-anchor="middle">히스타민</text>
    <rect class="box" x="130" y="26" width="100" height="28" rx="8"/><text x="180" y="45" text-anchor="middle">가스트린</text>
    <rect class="box" x="240" y="26" width="100" height="28" rx="8"/><text x="290" y="45" text-anchor="middle">ACh(M3)</text>
    <text class="blk" x="70" y="74" text-anchor="middle">✕</text><text class="drug" x="92" y="73" text-anchor="start">H2차단제</text>
    <line class="flow" x1="70" y1="78" x2="150" y2="104" marker-end="url(#ah)"/>
    <line class="flow" x1="180" y1="54" x2="180" y2="104" marker-end="url(#ah)"/>
    <line class="flow" x1="290" y1="54" x2="210" y2="104" marker-end="url(#ah)"/>
    <rect class="box acc-b" x="110" y="106" width="140" height="34" rx="8"/><text x="180" y="127" text-anchor="middle">위벽세포</text>
    <line class="flow" x1="180" y1="140" x2="180" y2="164" marker-end="url(#ah)"/>
    <text class="blk" x="150" y="160" text-anchor="middle">✕</text><text class="drug" x="92" y="160" text-anchor="end">PPI</text>
    <rect class="box tgt" x="96" y="166" width="168" height="32" rx="8"/><text x="180" y="187" text-anchor="middle">H+/K+-ATPase(양성자펌프)</text>
    <line class="flow" x1="180" y1="198" x2="180" y2="216" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="135" y="210" width="90" height="26" rx="8"/><text x="180" y="228" text-anchor="middle">위산 분비</text>
  </svg>`
},
{
  id: 'diabetes', sys: '대사', title: '혈당 조절과 당뇨약',
  classes: '메트포르민 · SU · DPP4/GLP1 · SGLT2 · TZD · α-GI · 인슐린',
  desc: '당뇨약은 여러 장기에서 서로 다른 방식으로 혈당을 낮춘다.',
  points: [
    '췌장 β세포: 설포닐우레아(인슐린분비↑), 인크레틴(DPP4억제·GLP1작용)',
    '간: 메트포르민 — 포도당 신생 억제(1차 약)',
    '근육·지방: TZD — 인슐린 감수성↑',
    '신장: SGLT2억제제 — 포도당 재흡수 차단(요당↑) / 장: α-GI 흡수 지연',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 240">
    <rect class="box bad-b" x="120" y="100" width="120" height="38" rx="10"/><text x="180" y="124" text-anchor="middle">혈당 ↓ 목표</text>
    <rect class="box" x="10" y="14" width="150" height="40" rx="8"/><text x="85" y="34" text-anchor="middle">췌장 β세포</text><text class="drug" x="85" y="49" text-anchor="middle">SU·DPP4·GLP1</text>
    <rect class="box" x="200" y="14" width="150" height="40" rx="8"/><text x="275" y="34" text-anchor="middle">간</text><text class="drug" x="275" y="49" text-anchor="middle">메트포르민</text>
    <rect class="box" x="10" y="184" width="150" height="42" rx="8"/><text x="85" y="204" text-anchor="middle">근육·지방</text><text class="drug" x="85" y="219" text-anchor="middle">TZD(감수성↑)</text>
    <rect class="box" x="200" y="184" width="150" height="42" rx="8"/><text x="275" y="204" text-anchor="middle">신장 / 장</text><text class="drug" x="275" y="219" text-anchor="middle">SGLT2 · α-GI</text>
    <line class="flow" x1="120" y1="60" x2="150" y2="98" marker-end="url(#ah)"/>
    <line class="flow" x1="250" y1="60" x2="215" y2="98" marker-end="url(#ah)"/>
    <line class="flow" x1="120" y1="182" x2="150" y2="142" marker-end="url(#ah)"/>
    <line class="flow" x1="250" y1="182" x2="215" y2="142" marker-end="url(#ah)"/>
    <text class="lbl" x="180" y="166" text-anchor="middle">+ 인슐린 주사(직접 보충)</text>
  </svg>`
},
{
  id: 'cox', sys: '통증', title: '아라키돈산–COX 경로 (소염진통)',
  classes: 'NSAID · 선택적 COX-2억제제 · 스테로이드 · 아세트아미노펜',
  desc: '세포막 인지질에서 프로스타글란딘이 만들어져 통증·염증·발열을 일으킨다. 약은 단계별로 차단한다.',
  points: [
    '스테로이드: 포스포리파제 A2 차단(상류) → 광범위 항염',
    'NSAID: COX-1/COX-2 억제 → 프로스타글란딘↓ (위장·신장 부작용)',
    '콕시브: COX-2 선택적(위장 부작용↓, 심혈관 위험)',
    '아세트아미노펜: 주로 중추 작용(말초 소염 거의 없음)',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 250">
    <rect class="box" x="100" y="8" width="160" height="30" rx="8"/><text x="180" y="28" text-anchor="middle">막 인지질</text>
    <line class="flow" x1="180" y1="38" x2="180" y2="62" marker-end="url(#ah)"/>
    <text class="lbl" x="196" y="55">PLA2</text>
    <text class="blk" x="150" y="58" text-anchor="middle">✕</text><text class="drug" x="92" y="58" text-anchor="end">스테로이드</text>
    <rect class="box acc-b" x="108" y="64" width="144" height="30" rx="8"/><text x="180" y="84" text-anchor="middle">아라키돈산</text>
    <line class="flow" x1="180" y1="94" x2="180" y2="118" marker-end="url(#ah)"/>
    <text class="lbl" x="200" y="111">COX-1 / COX-2</text>
    <text class="blk" x="150" y="114" text-anchor="middle">✕</text><text class="drug" x="92" y="114" text-anchor="end">NSAID</text>
    <rect class="box tgt" x="100" y="120" width="160" height="32" rx="8"/><text x="180" y="141" text-anchor="middle">프로스타글란딘</text>
    <line class="flow" x1="130" y1="152" x2="80" y2="186" marker-end="url(#ah)"/>
    <line class="flow" x1="180" y1="152" x2="180" y2="186" marker-end="url(#ah)"/>
    <line class="flow" x1="230" y1="152" x2="280" y2="186" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="18" y="188" width="110" height="28" rx="8"/><text x="73" y="207" text-anchor="middle">통증·발열</text>
    <rect class="box" x="132" y="188" width="96" height="28" rx="8"/><text x="180" y="207" text-anchor="middle">위점막 보호</text>
    <rect class="box" x="232" y="188" width="110" height="28" rx="8"/><text x="287" y="207" text-anchor="middle">신혈류 유지</text>
    <text class="lbl" x="180" y="236" text-anchor="middle">※ COX 억제 → 진통이지만 위점막·신장 보호도 ↓(부작용)</text>
  </svg>`
},
{
  id: 'synapse', sys: '신경정신', title: '모노아민 시냅스와 항우울제',
  classes: 'SSRI · SNRI · TCA · MAOI · 벤조디아제핀(GABA)',
  desc: '세로토닌·노르에피네프린은 분비 후 재흡수·분해된다. 항우울제는 재흡수나 분해를 막아 농도를 높인다.',
  points: [
    'SSRI: 세로토닌 재흡수 수송체 차단 → 시냅스 5-HT↑',
    'SNRI: 세로토닌 + 노르에피네프린 재흡수 차단',
    'TCA: 재흡수 차단 + 항콜린·항히스타민(부작용 많음)',
    'MAOI: 분해효소(MAO) 차단 / 벤조: GABA-A 강화(별도 억제계)',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 230">
    <rect class="box acc-b" x="20" y="20" width="320" height="40" rx="10"/><text x="180" y="44" text-anchor="middle">시냅스전 뉴런 (신경전달물질 분비)</text>
    <line class="flow" x1="180" y1="60" x2="180" y2="86" marker-end="url(#ah)"/>
    <rect class="box tgt" x="90" y="88" width="180" height="34" rx="8"/><text x="180" y="109" text-anchor="middle">시냅스 틈 (5-HT · NE)</text>
    <line class="flow" x1="120" y1="122" x2="90" y2="150"/><text class="lbl" x="70" y="146">재흡수</text>
    <text class="blk" x="92" y="150" text-anchor="middle">✕</text><text class="drug" x="80" y="170" text-anchor="middle">SSRI·SNRI·TCA</text>
    <line class="flow" x1="250" y1="122" x2="280" y2="150"/><text class="lbl" x="276" y="146">MAO 분해</text>
    <text class="blk" x="282" y="150" text-anchor="middle">✕</text><text class="drug" x="290" y="170" text-anchor="middle">MAOI</text>
    <line class="flow" x1="180" y1="122" x2="180" y2="150" marker-end="url(#ah)"/>
    <rect class="box" x="120" y="152" width="120" height="32" rx="8"/><text x="180" y="173" text-anchor="middle">시냅스후 수용체</text>
    <text class="lbl" x="180" y="208" text-anchor="middle">벤조디아제핀: 별개로 GABA-A 강화 → 진정·항불안</text>
  </svg>`
},
{
  id: 'antibiotics', sys: '항감염', title: '항생제 작용 부위',
  classes: 'β-락탐 · 글리코펩타이드 · 아미노글리코사이드 · 테트라/매크로라이드 · 퀴놀론 · 설파',
  desc: '항생제는 세균의 세포벽·단백합성(리보솜)·핵산·엽산 합성 등 서로 다른 표적을 공격한다.',
  points: [
    '세포벽: β-락탐(페니실린·세팔로스포린), 반코마이신',
    '30S 리보솜: 아미노글리코사이드, 테트라사이클린',
    '50S 리보솜: 매크로라이드, 린코사마이드, 리네졸리드',
    'DNA gyrase: 퀴놀론 / RNA중합효소: 리팜핀 / 엽산: 설파+트리메토프림',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 250">
    <rect x="40" y="30" width="280" height="190" rx="40" fill="none" stroke="#5b8def" stroke-width="10" opacity="0.35"/>
    <text class="drug" x="180" y="22" text-anchor="middle">세포벽: β-락탐 · 반코마이신</text>
    <line class="flow" x1="120" y1="26" x2="80" y2="40" marker-end="url(#ah)"/>
    <rect class="box tgt" x="110" y="58" width="140" height="30" rx="8"/><text x="180" y="78" text-anchor="middle">30S 리보솜</text>
    <text class="drug" x="180" y="104" text-anchor="middle">아미노글리코사이드·테트라</text>
    <rect class="box tgt" x="110" y="114" width="140" height="30" rx="8"/><text x="180" y="134" text-anchor="middle">50S 리보솜</text>
    <text class="drug" x="180" y="160" text-anchor="middle">매크로라이드·린코사마이드</text>
    <rect class="box acc-b" x="120" y="168" width="120" height="30" rx="8"/><text x="180" y="188" text-anchor="middle">DNA / 엽산</text>
    <text class="drug" x="180" y="214" text-anchor="middle">퀴놀론 · 리팜핀 · 설파+TMP</text>
  </svg>`
},
{
  id: 'airway', sys: '호흡기', title: '기도 평활근과 천식·COPD약',
  classes: 'β2작용제(SABA/LABA) · 항콜린제(LAMA) · 흡입스테로이드 · 류코트리엔억제제',
  desc: '기관지 수축과 염증을 약물이 각각 완화한다 — 확장제(증상)와 항염제(원인).',
  points: [
    'β2작용제: 평활근 이완 → 빠른 확장(SABA) / 지속(LABA)',
    '항콜린제(LAMA): 무스카린 M3 차단 → 확장(특히 COPD)',
    '흡입 스테로이드(ICS): 기도 염증 억제(천식 유지의 핵심)',
    '류코트리엔 수용체 길항제: 염증·수축 매개 차단(예방)',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 220">
    <circle cx="180" cy="110" r="70" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="180" cy="110" r="46" fill="none" stroke="#5b8def" stroke-width="14" opacity="0.4"/>
    <text class="lbl" x="180" y="114" text-anchor="middle">기관지 내강</text>
    <text class="drug" x="180" y="20" text-anchor="middle" style="fill:var(--good)">β2작용제 → 평활근 이완(확장)</text>
    <line class="flow" x1="180" y1="26" x2="180" y2="44" marker-end="url(#ah)"/>
    <text class="drug" x="14" y="110" text-anchor="start" style="fill:var(--good)">LAMA</text><text class="lbl" x="14" y="125" text-anchor="start">M3 차단</text>
    <line class="flow" x1="50" y1="110" x2="112" y2="110" marker-end="url(#ah)"/>
    <text class="drug" x="346" y="110" text-anchor="end">ICS</text><text class="lbl" x="346" y="125" text-anchor="end">염증 억제</text>
    <line class="flow" x1="310" y1="110" x2="250" y2="110" marker-end="url(#ah)"/>
    <text class="drug" x="180" y="200" text-anchor="middle">류코트리엔 억제제(LTRA) → 염증·수축 예방</text>
    <line class="flow" x1="180" y1="196" x2="180" y2="178" marker-end="url(#ah)"/>
  </svg>`
},
];

/* 기전별 실제 약물 매칭 (한글 + 영문 일반명) — DB 300종 기준 */
const MECH_DRUGS = {
  raas: [
    { role: 'ACE억제제', list: '에날라프릴(Enalapril) · 리시노프릴(Lisinopril) · 라미프릴(Ramipril)' },
    { role: 'ARB', list: '로사르탄(Losartan) · 발사르탄(Valsartan) · 텔미사르탄(Telmisartan)' },
    { role: '알도스테론 길항제', list: '스피로노락톤(Spironolactone) · 에플레레논(Eplerenone)' },
    { role: 'ARNI', list: '사쿠비트릴/발사르탄(Sacubitril/Valsartan)' },
  ],
  adrenergic: [
    { role: '베타차단제(β1)', list: '메토프롤롤(Metoprolol) · 비소프롤롤(Bisoprolol) · 카르베딜롤(Carvedilol) · 아테놀롤(Atenolol) · 프로프라놀롤(Propranolol) · 네비볼롤(Nebivolol)' },
    { role: 'α1 차단제', list: '독사조신(Doxazosin) · 탐스로신(Tamsulosin) · 알푸조신(Alfuzosin)' },
    { role: '중추 α2 작용제', list: '클로니딘(Clonidine) · 메틸도파(Methyldopa)' },
    { role: 'β2 작용제', list: '살부타몰(Salbutamol) · 살메테롤(Salmeterol) · 포르모테롤(Formoterol)' },
  ],
  nephron: [
    { role: '루프 이뇨제', list: '푸로세미드(Furosemide) · 토르세미드(Torsemide)' },
    { role: '티아지드', list: '하이드로클로로티아지드(Hydrochlorothiazide) · 인다파미드(Indapamide)' },
    { role: '칼륨보존', list: '스피로노락톤(Spironolactone) · 에플레레논(Eplerenone)' },
    { role: '탄산탈수효소억제', list: '아세타졸아미드(Acetazolamide)' },
    { role: 'SGLT2 억제제', list: '다파글리플로진(Dapagliflozin) · 엠파글리플로진(Empagliflozin)' },
  ],
  statin: [
    { role: '스타틴', list: '아토르바스타틴(Atorvastatin) · 로수바스타틴(Rosuvastatin) · 심바스타틴(Simvastatin)' },
    { role: '흡수 억제(NPC1L1)', list: '에제티미브(Ezetimibe)' },
    { role: '피브레이트(TG)', list: '페노피브레이트(Fenofibrate)' },
  ],
  coag: [
    { role: '비타민K 길항', list: '와파린(Warfarin)' },
    { role: '헤파린/LMWH', list: '헤파린(Heparin) · 에녹사파린(Enoxaparin)' },
    { role: 'Xa 억제(-xaban)', list: '아픽사반(Apixaban) · 리바록사반(Rivaroxaban)' },
    { role: '트롬빈 억제(-gatran)', list: '다비가트란(Dabigatran)' },
  ],
  platelet: [
    { role: 'COX-1 → TXA2', list: '아스피린(Aspirin)' },
    { role: 'P2Y12 억제', list: '클로피도그렐(Clopidogrel) · 티카그렐러(Ticagrelor) · 프라수그렐(Prasugrel)' },
  ],
  acid: [
    { role: 'PPI(양성자펌프)', list: '오메프라졸(Omeprazole) · 에스오메프라졸(Esomeprazole) · 판토프라졸(Pantoprazole) · 란소프라졸(Lansoprazole)' },
    { role: 'H2 차단제', list: '파모티딘(Famotidine)' },
    { role: '제산제(중화)', list: '알마게이트(Almagate)' },
  ],
  diabetes: [
    { role: '비구아나이드(간)', list: '메트포르민(Metformin)' },
    { role: '설포닐우레아(췌장)', list: '글리메피리드(Glimepiride) · 글리클라지드(Gliclazide)' },
    { role: 'DPP-4 억제제', list: '시타글립틴(Sitagliptin) · 리나글립틴(Linagliptin)' },
    { role: 'GLP-1 작용제', list: '세마글루티드(Semaglutide) · 둘라글루티드(Dulaglutide)' },
    { role: 'SGLT2 억제제(신장)', list: '다파글리플로진(Dapagliflozin) · 엠파글리플로진(Empagliflozin)' },
    { role: 'TZD(감수성)', list: '피오글리타존(Pioglitazone)' },
    { role: 'α-글루코시다제(장)', list: '아카보스(Acarbose)' },
    { role: '인슐린', list: '글라진(Glargine) · 아스파트(Aspart) · NPH' },
  ],
  cox: [
    { role: '비선택 NSAID', list: '이부프로펜(Ibuprofen) · 나프록센(Naproxen) · 디클로페낙(Diclofenac) · 케토롤락(Ketorolac)' },
    { role: 'COX-2 선택', list: '세레콕시브(Celecoxib)' },
    { role: '스테로이드(PLA2)', list: '프레드니솔론(Prednisolone) · 덱사메타손(Dexamethasone)' },
    { role: '해열진통(중추)', list: '아세트아미노펜(Acetaminophen)' },
  ],
  synapse: [
    { role: 'SSRI', list: '에스시탈로프람(Escitalopram) · 설트랄린(Sertraline) · 플루옥세틴(Fluoxetine) · 파록세틴(Paroxetine) · 시탈로프람(Citalopram)' },
    { role: 'SNRI', list: '벤라팍신(Venlafaxine) · 둘록세틴(Duloxetine)' },
    { role: 'TCA', list: '아미트립틸린(Amitriptyline) · 노르트립틸린(Nortriptyline)' },
    { role: '벤조디아제핀(GABA)', list: '로라제팜(Lorazepam) · 알프라졸람(Alprazolam) · 디아제팜(Diazepam)' },
  ],
  antibiotics: [
    { role: '세포벽 β-락탐', list: '아목시실린(Amoxicillin) · 세팔렉신(Cephalexin) · 세프트리악손(Ceftriaxone)' },
    { role: '세포벽 글리코펩타이드', list: '반코마이신(Vancomycin)' },
    { role: '30S 리보솜', list: '겐타마이신(Gentamicin) · 독시사이클린(Doxycycline)' },
    { role: '50S 리보솜', list: '아지트로마이신(Azithromycin) · 클린다마이신(Clindamycin) · 리네졸리드(Linezolid)' },
    { role: 'DNA gyrase(퀴놀론)', list: '시프로플록사신(Ciprofloxacin) · 레보플록사신(Levofloxacin)' },
    { role: '엽산 합성', list: '트리메토프림/설파메톡사졸(TMP/SMX)' },
  ],
  airway: [
    { role: 'SABA(속효 β2)', list: '살부타몰(Salbutamol)' },
    { role: 'LABA(지속 β2)', list: '살메테롤(Salmeterol) · 포르모테롤(Formoterol)' },
    { role: 'LAMA(항콜린)', list: '티오트로피움(Tiotropium) · 이프라트로피움(Ipratropium)' },
    { role: 'ICS(흡입스테로이드)', list: '부데소니드(Budesonide) · 플루티카손(Fluticasone)' },
    { role: '류코트리엔 억제제', list: '몬테루카스트(Montelukast)' },
  ],
};
