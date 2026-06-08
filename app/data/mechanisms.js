/* ============================================================
 * 약물 계열별 작용 기전 다이어그램 (인라인 SVG, 외부 이미지 없음)
 * → 작용 경로 / 빨강 ✕ = 차단 지점 / 초록 ＋ = 활성(작용제)
 * 박스·작용점에 대표 약물명(한글)을 직접 표기. 전체 매칭은 MECH_DRUGS 표 참고.
 * 공용 화살촉 마커 #ah 는 index.html 상단 defs.
 * ============================================================ */
const MECHANISMS = [
{
  id: 'raas', sys: '심혈관', title: 'RAAS 축 (고혈압·심부전)',
  classes: 'ACE억제제(-pril) · ARB(-sartan) · 알도스테론길항제 · ARNI',
  desc: '레닌–안지오텐신–알도스테론 축은 혈압을 올린다. 각 약은 이 축의 서로 다른 단계를 차단한다.',
  points: [
    'ACE억제제: 안지오텐신 I→II 전환 차단. 브래디키닌 축적 → 마른기침',
    'ARB: 안지오텐신 II의 AT1 수용체 직접 차단(기침 적음)',
    '알도스테론 길항제: 나트륨 재흡수↓·칼륨 보존',
    'ARNI(사쿠비트릴+발사르탄): 이뇨펩타이드↑ + AT1 차단',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 360">
    <rect class="box" x="95" y="8" width="170" height="34" rx="9"/><text x="180" y="30" text-anchor="middle" font-size="15">안지오텐시노겐</text>
    <line class="flow" x1="180" y1="42" x2="180" y2="64" marker-end="url(#ah)"/><text class="lbl" x="192" y="58">레닌</text>
    <rect class="box" x="110" y="66" width="140" height="34" rx="9"/><text x="180" y="88" text-anchor="middle" font-size="15">안지오텐신 I</text>
    <line class="flow" x1="180" y1="100" x2="180" y2="126" marker-end="url(#ah)"/>
    <text class="lbl" x="196" y="116">ACE</text>
    <text class="blk" x="150" y="120" text-anchor="middle">✕</text>
    <text class="drug" x="138" y="111" text-anchor="end">ACE억제제</text><text class="drug2" x="138" y="126" text-anchor="end">에날라프릴·라미프릴</text>
    <rect class="box acc-b" x="108" y="128" width="144" height="34" rx="9"/><text x="180" y="150" text-anchor="middle" font-size="15">안지오텐신 II</text>
    <line class="flow" x1="180" y1="162" x2="180" y2="188" marker-end="url(#ah)"/>
    <text class="blk" x="150" y="182" text-anchor="middle">✕</text>
    <text class="drug" x="138" y="173" text-anchor="end">ARB</text><text class="drug2" x="138" y="188" text-anchor="end">로사르탄·발사르탄</text>
    <rect class="box tgt" x="118" y="190" width="124" height="34" rx="9"/><text x="180" y="212" text-anchor="middle" font-size="15">AT1 수용체</text>
    <line class="flow" x1="150" y1="224" x2="95" y2="256" marker-end="url(#ah)"/>
    <line class="flow" x1="210" y1="224" x2="265" y2="256" marker-end="url(#ah)"/>
    <rect class="box" x="14" y="258" width="150" height="34" rx="9"/><text x="89" y="280" text-anchor="middle">혈관 수축</text>
    <rect class="box" x="196" y="258" width="150" height="34" rx="9"/><text x="271" y="280" text-anchor="middle">알도스테론 분비</text>
    <text class="blk" x="196" y="280" text-anchor="middle">✕</text><text class="drug" x="271" y="306" text-anchor="middle">스피로노락톤·에플레레논</text>
    <line class="flow" x1="89" y1="292" x2="150" y2="322" marker-end="url(#ah)"/>
    <line class="flow" x1="255" y1="312" x2="210" y2="324" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="120" y="324" width="120" height="30" rx="9"/><text x="180" y="344" text-anchor="middle" font-size="15">혈압 ↑</text>
  </svg>`
},
{
  id: 'adrenergic', sys: '심혈관', title: '교감신경 수용체',
  classes: '베타차단제(-olol) · α1차단제 · 중추α2작용제 · β2작용제(-terol)',
  desc: '교감신경 수용체는 장기마다 다르다. 약물은 특정 수용체를 차단하거나 자극한다.',
  points: [
    'β1(심장): 차단 → 심박수·수축력↓ → 베타차단제',
    'α1(혈관): 차단 → 혈관확장 → α1차단제(전립선에도)',
    'α2(중추): 자극 → 교감유출↓ → 클로니딘·메틸도파',
    'β2(기관지): 자극 → 기관지확장 → β2작용제',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 280">
    <rect class="box acc-b" x="125" y="8" width="110" height="32" rx="9"/><text x="180" y="29" text-anchor="middle" font-size="15">교감신경</text>
    <line class="flow" x1="150" y1="40" x2="74" y2="66" marker-end="url(#ah)"/>
    <line class="flow" x1="180" y1="40" x2="180" y2="66" marker-end="url(#ah)"/>
    <line class="flow" x1="210" y1="40" x2="286" y2="66" marker-end="url(#ah)"/>
    <rect class="box" x="14" y="68" width="120" height="48" rx="9"/><text x="74" y="89" text-anchor="middle">심장 β1</text><text class="lbl" x="74" y="106" text-anchor="middle">심박·수축력↑</text>
    <rect class="box" x="120" y="68" width="120" height="48" rx="9"/><text x="180" y="89" text-anchor="middle">혈관 α1</text><text class="lbl" x="180" y="106" text-anchor="middle">혈관 수축</text>
    <rect class="box" x="246" y="68" width="100" height="48" rx="9"/><text x="296" y="89" text-anchor="middle">기관지 β2</text><text class="lbl" x="296" y="106" text-anchor="middle">기관지 확장</text>
    <text class="blk" x="74" y="140" text-anchor="middle">✕</text><text class="drug" x="74" y="160" text-anchor="middle">베타차단제</text><text class="drug2" x="74" y="175" text-anchor="middle">메토프롤롤·비소프롤롤</text>
    <text class="blk" x="180" y="140" text-anchor="middle">✕</text><text class="drug" x="180" y="160" text-anchor="middle">α1차단제</text><text class="drug2" x="180" y="175" text-anchor="middle">독사조신·탐스로신</text>
    <text class="acc" x="296" y="142" text-anchor="middle" font-size="18">＋</text><text class="ok" x="296" y="160" text-anchor="middle">β2작용제</text><text class="drug2" x="296" y="175" text-anchor="middle">살부타몰·살메테롤</text>
    <rect class="box" x="40" y="206" width="280" height="56" rx="9"/>
    <text x="180" y="228" text-anchor="middle">중추 α2 자극 → 교감 유출 ↓</text>
    <text class="ok" x="180" y="249" text-anchor="middle">＋ 클로니딘 · 메틸도파</text>
  </svg>`
},
{
  id: 'nephron', sys: '심혈관', title: '신장 네프론과 이뇨제',
  classes: '루프 · 티아지드 · 칼륨보존 · 탄산탈수효소억제 · SGLT2',
  desc: '이뇨제는 네프론의 서로 다른 부위에서 나트륨 재흡수를 막아 소변량을 늘린다.',
  points: [
    '근위세뇨관: 탄산탈수효소억제(아세타졸아미드), SGLT2(요당 배설)',
    '헨레고리 상행각: 루프이뇨제(가장 강력)',
    '원위세뇨관: 티아지드',
    '집합관: 칼륨보존이뇨제(알도스테론 길항)',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 290">
    <path d="M40 34 C 40 130, 120 130, 120 64 C 120 22, 200 22, 200 96 L 200 250" fill="none" stroke="#5b8def" stroke-width="16" opacity="0.32"/>
    <text class="lbl" x="40" y="24">사구체 →</text>
    <text class="ok" x="146" y="50" text-anchor="start">근위: 탄산탈수효소억제 · SGLT2</text><text class="drug2" x="146" y="65" text-anchor="start">아세타졸아미드 · 다파글리플로진</text>
    <line class="flow" x1="146" y1="56" x2="126" y2="62" marker-end="url(#ah)"/>
    <text class="ok" x="36" y="160" text-anchor="start">헨레: 루프이뇨제</text><text class="drug2" x="36" y="175" text-anchor="start">푸로세미드 · 토르세미드</text>
    <line class="flow" x1="84" y1="150" x2="74" y2="110" marker-end="url(#ah)"/>
    <text class="ok" x="216" y="120" text-anchor="start">원위: 티아지드</text><text class="drug2" x="216" y="135" text-anchor="start">HCTZ · 인다파미드</text>
    <line class="flow" x1="214" y1="124" x2="202" y2="126" marker-end="url(#ah)"/>
    <text class="ok" x="216" y="210" text-anchor="start">집합관: 칼륨보존</text><text class="drug2" x="216" y="225" text-anchor="start">스피로노락톤</text>
    <line class="flow" x1="214" y1="206" x2="202" y2="206" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="140" y="252" width="140" height="32" rx="9"/><text x="210" y="273" text-anchor="middle" font-size="15">소변 배설 ↑</text>
  </svg>`
},
{
  id: 'statin', sys: '대사', title: '콜레스테롤 합성과 스타틴',
  classes: '스타틴(-statin) · 에제티미브 · 피브레이트',
  desc: '간의 콜레스테롤 합성을 막으면 LDL 수용체가 늘어 혈중 LDL을 제거한다.',
  points: [
    '스타틴: HMG-CoA 환원효소 차단 → LDL수용체↑ → 혈중 LDL↓',
    '에제티미브: 장에서 콜레스테롤 흡수 차단',
    '피브레이트: 중성지방↓ (PPAR-α)',
    '야간 합성 활발 → 일부 스타틴 저녁 복용',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 320">
    <rect class="box" x="110" y="8" width="140" height="32" rx="9"/><text x="180" y="29" text-anchor="middle">아세틸-CoA</text>
    <line class="flow" x1="180" y1="40" x2="180" y2="62" marker-end="url(#ah)"/>
    <rect class="box" x="110" y="64" width="140" height="32" rx="9"/><text x="180" y="85" text-anchor="middle">HMG-CoA</text>
    <line class="flow" x1="180" y1="96" x2="180" y2="124" marker-end="url(#ah)"/>
    <text class="lbl" x="200" y="116">HMG-CoA 환원효소</text>
    <text class="blk" x="150" y="120" text-anchor="middle">✕</text>
    <text class="drug" x="138" y="111" text-anchor="end">스타틴</text><text class="drug2" x="138" y="126" text-anchor="end">아토르바·로수바스타틴</text>
    <rect class="box" x="118" y="126" width="124" height="32" rx="9"/><text x="180" y="147" text-anchor="middle">메발론산</text>
    <line class="flow" x1="180" y1="158" x2="180" y2="182" marker-end="url(#ah)"/>
    <rect class="box acc-b" x="120" y="184" width="120" height="32" rx="9"/><text x="180" y="205" text-anchor="middle">콜레스테롤</text>
    <line class="flow" x1="180" y1="216" x2="180" y2="244" marker-end="url(#ah)"/>
    <rect class="box tgt" x="92" y="246" width="176" height="42" rx="9"/><text x="180" y="266" text-anchor="middle" font-size="15">간 LDL 수용체 ↑</text><text class="lbl" x="180" y="282" text-anchor="middle">→ 혈중 LDL ↓</text>
    <text class="drug" x="300" y="138" text-anchor="middle">에제티미브</text><text class="lbl" x="300" y="153" text-anchor="middle">장 흡수 ✕</text>
    <text class="drug2" x="180" y="306" text-anchor="middle">피브레이트(페노피브레이트) → 중성지방↓</text>
  </svg>`
},
{
  id: 'coag', sys: '혈액', title: '응고 캐스케이드와 항응고제',
  classes: '와파린 · 헤파린/LMWH · DOAC(-xaban, -gatran)',
  desc: '응고인자가 연쇄 활성화되어 피브린 그물을 만든다. 항응고제는 각기 다른 지점을 막는다.',
  points: [
    '와파린: 비타민K 의존인자(II·VII·IX·X) 합성 차단 — INR 모니터',
    '헤파린/LMWH: 안티트롬빈 활성화 → Xa·트롬빈 억제',
    '-xaban: Xa 인자 직접 억제',
    '다비가트란: 트롬빈(IIa) 직접 억제',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 280">
    <rect class="box" x="20" y="8" width="150" height="32" rx="9"/><text x="95" y="29" text-anchor="middle">내인계</text>
    <rect class="box" x="190" y="8" width="150" height="32" rx="9"/><text x="265" y="29" text-anchor="middle">외인계</text>
    <line class="flow" x1="95" y1="40" x2="168" y2="66" marker-end="url(#ah)"/>
    <line class="flow" x1="265" y1="40" x2="192" y2="66" marker-end="url(#ah)"/>
    <rect class="box tgt" x="135" y="68" width="90" height="34" rx="9"/><text x="180" y="90" text-anchor="middle" font-size="15">Xa 인자</text>
    <text class="blk" x="116" y="92" text-anchor="middle">✕</text><text class="drug" x="104" y="84" text-anchor="end">-xaban</text><text class="drug2" x="104" y="99" text-anchor="end">아픽사반·리바록사반</text>
    <text class="drug" x="244" y="82" text-anchor="start">헤파린·에녹사파린</text><text class="lbl" x="244" y="97" text-anchor="start">(AT 경유)</text>
    <line class="flow" x1="180" y1="102" x2="180" y2="128" marker-end="url(#ah)"/>
    <rect class="box acc-b" x="130" y="130" width="100" height="34" rx="9"/><text x="180" y="152" text-anchor="middle" font-size="15">트롬빈(IIa)</text>
    <text class="blk" x="114" y="154" text-anchor="middle">✕</text><text class="drug" x="102" y="146" text-anchor="end">-gatran</text><text class="drug2" x="102" y="161" text-anchor="end">다비가트란</text>
    <line class="flow" x1="180" y1="164" x2="180" y2="190" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="130" y="192" width="100" height="32" rx="9"/><text x="180" y="213" text-anchor="middle">피브린(혈전)</text>
    <rect class="box" x="20" y="240" width="320" height="32" rx="9" style="fill:none;stroke-dasharray:4 3"/>
    <text class="drug" x="180" y="260" text-anchor="middle">와파린 ✕ II·VII·IX·X 합성 (비타민K 의존)</text>
  </svg>`
},
{
  id: 'platelet', sys: '혈액', title: '혈소판 활성화와 항혈소판제',
  classes: '아스피린 · P2Y12억제제',
  desc: '혈소판은 여러 경로로 활성화되어 응집한다. 항혈소판제는 활성화 신호를 차단한다.',
  points: [
    '아스피린: COX-1 비가역 억제 → 트롬복산 A2↓',
    'P2Y12억제제: ADP 수용체 차단',
    '두 경로 모두 GPIIb/IIIa 활성 → 응집',
    '스텐트 후 보통 두 약 병용(이중항혈소판요법)',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 230">
    <rect class="box acc-b" x="120" y="92" width="120" height="42" rx="11"/><text x="180" y="118" text-anchor="middle" font-size="15">혈소판</text>
    <rect class="box" x="20" y="10" width="150" height="34" rx="9"/><text x="95" y="32" text-anchor="middle">COX-1 → TXA2</text>
    <text class="blk" x="95" y="64" text-anchor="middle">✕</text><text class="drug" x="150" y="60" text-anchor="start">아스피린</text>
    <line class="flow" x1="95" y1="68" x2="140" y2="98" marker-end="url(#ah)"/>
    <rect class="box" x="190" y="10" width="150" height="34" rx="9"/><text x="265" y="32" text-anchor="middle">ADP → P2Y12</text>
    <text class="blk" x="265" y="64" text-anchor="middle">✕</text><text class="drug" x="210" y="58" text-anchor="end">P2Y12억제제</text><text class="drug2" x="210" y="73" text-anchor="end">클로피도그렐·티카그렐러</text>
    <line class="flow" x1="265" y1="68" x2="220" y2="98" marker-end="url(#ah)"/>
    <line class="flow" x1="180" y1="134" x2="180" y2="160" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="105" y="162" width="150" height="36" rx="9"/><text x="180" y="185" text-anchor="middle" font-size="15">GPIIb/IIIa → 응집</text>
  </svg>`
},
{
  id: 'acid', sys: '소화기', title: '위산 분비와 억제제',
  classes: 'PPI(-prazole) · H2차단제(-tidine) · 제산제',
  desc: '위벽세포는 세 신호로 자극되어 양성자펌프로 위산을 낸다. 약은 신호나 펌프를 막는다.',
  points: [
    '히스타민(H2)·가스트린·아세틸콜린이 벽세포 자극',
    'H2차단제: 히스타민 H2 수용체 차단(중간)',
    'PPI: H+/K+-ATPase(양성자펌프) 비가역 차단(가장 강력)',
    '제산제: 분비된 위산 중화(즉효·단기)',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 270">
    <rect class="box" x="18" y="26" width="100" height="30" rx="8"/><text x="68" y="46" text-anchor="middle">히스타민</text>
    <rect class="box" x="130" y="26" width="100" height="30" rx="8"/><text x="180" y="46" text-anchor="middle">가스트린</text>
    <rect class="box" x="242" y="26" width="100" height="30" rx="8"/><text x="292" y="46" text-anchor="middle">ACh(M3)</text>
    <text class="blk" x="68" y="78" text-anchor="middle">✕</text><text class="drug" x="92" y="72" text-anchor="start">H2차단제</text><text class="drug2" x="92" y="87" text-anchor="start">파모티딘</text>
    <line class="flow" x1="68" y1="82" x2="150" y2="110" marker-end="url(#ah)"/>
    <line class="flow" x1="180" y1="56" x2="180" y2="110" marker-end="url(#ah)"/>
    <line class="flow" x1="292" y1="56" x2="210" y2="110" marker-end="url(#ah)"/>
    <rect class="box acc-b" x="110" y="112" width="140" height="34" rx="9"/><text x="180" y="134" text-anchor="middle" font-size="15">위벽세포</text>
    <line class="flow" x1="180" y1="146" x2="180" y2="174" marker-end="url(#ah)"/>
    <text class="blk" x="148" y="170" text-anchor="middle">✕</text>
    <text class="drug" x="136" y="161" text-anchor="end">PPI</text><text class="drug2" x="136" y="176" text-anchor="end">오메프라졸·판토프라졸</text>
    <rect class="box tgt" x="84" y="176" width="192" height="36" rx="9"/><text x="180" y="199" text-anchor="middle" font-size="15">H+/K+-ATPase (양성자펌프)</text>
    <line class="flow" x1="180" y1="212" x2="180" y2="234" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="130" y="236" width="100" height="28" rx="9"/><text x="180" y="255" text-anchor="middle">위산 분비</text>
  </svg>`
},
{
  id: 'diabetes', sys: '대사', title: '혈당 조절과 당뇨약',
  classes: '메트포르민 · SU · DPP4/GLP1 · SGLT2 · TZD · α-GI · 인슐린',
  desc: '당뇨약은 여러 장기에서 서로 다른 방식으로 혈당을 낮춘다.',
  points: [
    '췌장: 설포닐우레아(분비↑), 인크레틴(DPP4·GLP1)',
    '간: 메트포르민(포도당 신생↓) — 1차약',
    '근육·지방: TZD(감수성↑)',
    '신장: SGLT2(요당↑) / 장: α-GI(흡수 지연) / 인슐린 보충',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 260">
    <rect class="box bad-b" x="120" y="108" width="120" height="44" rx="12"/><text x="180" y="135" text-anchor="middle" font-size="16">혈당 ↓</text>
    <rect class="box" x="8" y="14" width="160" height="46" rx="9"/><text x="88" y="34" text-anchor="middle">췌장 β세포</text><text class="drug2" x="88" y="51" text-anchor="middle">글리메피리드·시타글립틴</text>
    <rect class="box" x="192" y="14" width="160" height="46" rx="9"/><text x="272" y="34" text-anchor="middle">간</text><text class="drug2" x="272" y="51" text-anchor="middle">메트포르민</text>
    <rect class="box" x="8" y="200" width="160" height="48" rx="9"/><text x="88" y="220" text-anchor="middle">근육·지방</text><text class="drug2" x="88" y="237" text-anchor="middle">피오글리타존(TZD)</text>
    <rect class="box" x="192" y="200" width="160" height="48" rx="9"/><text x="272" y="220" text-anchor="middle">신장 / 장</text><text class="drug2" x="272" y="237" text-anchor="middle">다파글리플로진 · 아카보스</text>
    <line class="flow" x1="120" y1="64" x2="150" y2="104" marker-end="url(#ah)"/>
    <line class="flow" x1="250" y1="64" x2="216" y2="104" marker-end="url(#ah)"/>
    <line class="flow" x1="120" y1="196" x2="150" y2="156" marker-end="url(#ah)"/>
    <line class="flow" x1="250" y1="196" x2="216" y2="156" marker-end="url(#ah)"/>
    <text class="ok" x="180" y="182" text-anchor="middle">＋ 인슐린 주사(직접 보충)</text>
  </svg>`
},
{
  id: 'cox', sys: '통증', title: '아라키돈산–COX 경로 (소염진통)',
  classes: 'NSAID · 선택적 COX-2억제제 · 스테로이드 · 아세트아미노펜',
  desc: '막 인지질에서 프로스타글란딘이 만들어져 통증·염증·발열을 일으킨다.',
  points: [
    '스테로이드: 포스포리파제 A2 차단(상류)',
    'NSAID: COX-1/2 억제 → 위장·신장 부작용',
    '콕시브: COX-2 선택(위장↓, 심혈관 위험)',
    '아세트아미노펜: 주로 중추 작용',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 290">
    <rect class="box" x="100" y="8" width="160" height="32" rx="9"/><text x="180" y="29" text-anchor="middle">막 인지질</text>
    <line class="flow" x1="180" y1="40" x2="180" y2="64" marker-end="url(#ah)"/><text class="lbl" x="196" y="57">PLA2</text>
    <text class="blk" x="150" y="60" text-anchor="middle">✕</text><text class="drug" x="138" y="51" text-anchor="end">스테로이드</text><text class="drug2" x="138" y="66" text-anchor="end">프레드니솔론·덱사메타손</text>
    <rect class="box acc-b" x="108" y="66" width="144" height="32" rx="9"/><text x="180" y="87" text-anchor="middle">아라키돈산</text>
    <line class="flow" x1="180" y1="98" x2="180" y2="124" marker-end="url(#ah)"/><text class="lbl" x="202" y="116">COX-1 / COX-2</text>
    <text class="blk" x="150" y="120" text-anchor="middle">✕</text><text class="drug" x="138" y="111" text-anchor="end">NSAID</text><text class="drug2" x="138" y="126" text-anchor="end">이부프로펜·나프록센·세레콕시브</text>
    <rect class="box tgt" x="100" y="126" width="160" height="34" rx="9"/><text x="180" y="148" text-anchor="middle" font-size="15">프로스타글란딘</text>
    <line class="flow" x1="130" y1="160" x2="80" y2="196" marker-end="url(#ah)"/>
    <line class="flow" x1="180" y1="160" x2="180" y2="196" marker-end="url(#ah)"/>
    <line class="flow" x1="230" y1="160" x2="280" y2="196" marker-end="url(#ah)"/>
    <rect class="box bad-b" x="18" y="198" width="110" height="30" rx="9"/><text x="73" y="218" text-anchor="middle">통증·발열</text>
    <rect class="box" x="132" y="198" width="96" height="30" rx="9"/><text x="180" y="218" text-anchor="middle">위점막 보호</text>
    <rect class="box" x="232" y="198" width="110" height="30" rx="9"/><text x="287" y="218" text-anchor="middle">신혈류 유지</text>
    <text class="lbl" x="180" y="252" text-anchor="middle">아세트아미노펜은 중추 작용(말초 소염 거의 없음)</text>
    <text class="lbl" x="180" y="272" text-anchor="middle">※ COX 억제 → 위점막·신장 보호도 ↓(부작용)</text>
  </svg>`
},
{
  id: 'synapse', sys: '신경정신', title: '모노아민 시냅스와 항우울제',
  classes: 'SSRI · SNRI · TCA · 벤조디아제핀(GABA)',
  desc: '세로토닌·노르에피네프린은 분비 후 재흡수·분해된다. 항우울제는 이를 막아 농도를 높인다.',
  points: [
    'SSRI: 세로토닌 재흡수 차단 → 시냅스 5-HT↑',
    'SNRI: 세로토닌 + 노르에피네프린 재흡수 차단',
    'TCA: 재흡수 차단 + 항콜린·항히스타민',
    '벤조: GABA-A 강화(별도 억제계)',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 250">
    <rect class="box acc-b" x="20" y="20" width="320" height="40" rx="11"/><text x="180" y="45" text-anchor="middle" font-size="15">시냅스전 뉴런 (5-HT · NE 분비)</text>
    <line class="flow" x1="180" y1="60" x2="180" y2="88" marker-end="url(#ah)"/>
    <rect class="box tgt" x="90" y="90" width="180" height="36" rx="9"/><text x="180" y="113" text-anchor="middle" font-size="15">시냅스 틈</text>
    <line class="flow" x1="120" y1="126" x2="88" y2="156"/><text class="lbl" x="66" y="150">재흡수</text>
    <text class="blk" x="90" y="158" text-anchor="middle">✕</text>
    <text class="drug" x="80" y="178" text-anchor="middle">SSRI·SNRI·TCA</text><text class="drug2" x="80" y="193" text-anchor="middle">에스시탈로프람·벤라팍신</text>
    <line class="flow" x1="180" y1="126" x2="180" y2="156" marker-end="url(#ah)"/>
    <rect class="box" x="120" y="158" width="120" height="34" rx="9"/><text x="180" y="180" text-anchor="middle">시냅스후 수용체</text>
    <text class="lbl" x="180" y="222" text-anchor="middle">벤조디아제핀(로라제팜·디아제팜): GABA-A 강화 → 진정·항불안</text>
  </svg>`
},
{
  id: 'antibiotics', sys: '항감염', title: '항생제 작용 부위',
  classes: 'β-락탐 · 글리코펩타이드 · 아미노글리코사이드 · 매크로라이드 · 퀴놀론 · 설파',
  desc: '항생제는 세균의 세포벽·리보솜·핵산·엽산 합성 등 서로 다른 표적을 공격한다.',
  points: [
    '세포벽: β-락탐(페니실린·세팔로스포린), 반코마이신',
    '30S 리보솜: 아미노글리코사이드, 테트라사이클린',
    '50S 리보솜: 매크로라이드, 린코사마이드, 리네졸리드',
    'DNA gyrase: 퀴놀론 / 엽산: 설파+트리메토프림',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 270">
    <rect x="40" y="40" width="280" height="200" rx="44" fill="none" stroke="#5b8def" stroke-width="11" opacity="0.32"/>
    <text class="drug" x="180" y="22" text-anchor="middle">세포벽: β-락탐 · 반코마이신</text><text class="drug2" x="180" y="37" text-anchor="middle">아목시실린 · 세프트리악손</text>
    <line class="flow" x1="120" y1="40" x2="80" y2="56" marker-end="url(#ah)"/>
    <rect class="box tgt" x="110" y="66" width="140" height="30" rx="8"/><text x="180" y="86" text-anchor="middle">30S 리보솜</text>
    <text class="drug2" x="180" y="110" text-anchor="middle">겐타마이신 · 독시사이클린</text>
    <rect class="box tgt" x="110" y="118" width="140" height="30" rx="8"/><text x="180" y="138" text-anchor="middle">50S 리보솜</text>
    <text class="drug2" x="180" y="162" text-anchor="middle">아지트로마이신 · 클린다마이신</text>
    <rect class="box acc-b" x="120" y="170" width="120" height="30" rx="8"/><text x="180" y="190" text-anchor="middle">DNA / 엽산</text>
    <text class="drug2" x="180" y="214" text-anchor="middle">시프로플록사신 · TMP/SMX</text>
  </svg>`
},
{
  id: 'airway', sys: '호흡기', title: '기도 평활근과 천식·COPD약',
  classes: 'β2작용제 · 항콜린제(LAMA) · 흡입스테로이드 · 류코트리엔억제제',
  desc: '기관지 수축과 염증을 약물이 각각 완화한다 — 확장제(증상)와 항염제(원인).',
  points: [
    'β2작용제: 평활근 이완 → 확장(SABA 속효 / LABA 지속)',
    '항콜린제(LAMA): M3 차단 → 확장(특히 COPD)',
    '흡입 스테로이드(ICS): 기도 염증 억제(천식 유지 핵심)',
    '류코트리엔 억제제: 염증·수축 예방',
  ],
  svg: `<svg class="mech-svg" viewBox="0 0 360 250">
    <circle cx="180" cy="120" r="74" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="180" cy="120" r="48" fill="none" stroke="#5b8def" stroke-width="15" opacity="0.4"/>
    <text class="lbl" x="180" y="124" text-anchor="middle">기관지 내강</text>
    <text class="ok" x="180" y="20" text-anchor="middle">β2작용제 → 평활근 이완</text><text class="drug2" x="180" y="35" text-anchor="middle">살부타몰 · 살메테롤</text>
    <line class="flow" x1="180" y1="40" x2="180" y2="56" marker-end="url(#ah)"/>
    <text class="ok" x="12" y="116" text-anchor="start">LAMA</text><text class="drug2" x="12" y="131" text-anchor="start">티오트로피움</text>
    <line class="flow" x1="58" y1="118" x2="108" y2="120" marker-end="url(#ah)"/>
    <text class="ok" x="348" y="116" text-anchor="end">ICS</text><text class="drug2" x="348" y="131" text-anchor="end">부데소니드</text>
    <line class="flow" x1="306" y1="118" x2="256" y2="120" marker-end="url(#ah)"/>
    <text class="drug2" x="180" y="214" text-anchor="middle">류코트리엔 억제제(몬테루카스트) → 염증·수축 예방</text>
    <line class="flow" x1="180" y1="210" x2="180" y2="194" marker-end="url(#ah)"/>
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
