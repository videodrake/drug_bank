/* ============================================================
 * 약물 어간(stem) 사전 — USAN/INN 표준
 * 어간 ~30개로 수백 개 약의 계열을 추론 (내장 니모닉)
 * warn: 단일 계열을 보장하지 않는 주의 어간
 * ============================================================ */
const STEMS = [
  // 심혈관계
  { stem: '-olol',     klass: '베타차단제 (β-blocker)',        ex: 'metoprolol, atenolol, propranolol' },
  { stem: '-pril',     klass: 'ACE 억제제',                    ex: 'lisinopril, enalapril, ramipril' },
  { stem: '-sartan',   klass: 'ARB (안지오텐신 II 차단제)',     ex: 'losartan, valsartan, olmesartan' },
  { stem: '-dipine',   klass: '칼슘채널차단제 (DHP)',          ex: 'amlodipine, nifedipine, felodipine' },
  { stem: '-statin',   klass: '스타틴 (HMG-CoA 환원효소 억제)', ex: 'atorvastatin, rosuvastatin, simvastatin' },
  { stem: '-parin',    klass: '헤파린계 항응고제',              ex: 'enoxaparin, dalteparin' },
  { stem: '-xaban',    klass: 'DOAC (Xa 인자 억제)',            ex: 'apixaban, rivaroxaban, edoxaban' },
  { stem: '-gatran',   klass: 'DOAC (직접 트롬빈 억제)',        ex: 'dabigatran' },
  // 소화기·대사
  { stem: '-prazole',  klass: 'PPI (양성자펌프억제제)',         ex: 'omeprazole, esomeprazole, rabeprazole' },
  { stem: '-tidine',   klass: 'H2 수용체 차단제',               ex: 'famotidine, ranitidine, cimetidine' },
  { stem: '-gliptin',  klass: 'DPP-4 억제제',                  ex: 'sitagliptin, linagliptin, saxagliptin' },
  { stem: '-glitazone',klass: 'TZD (PPAR-γ 작용제)',           ex: 'pioglitazone, rosiglitazone' },
  { stem: '-gliflozin',klass: 'SGLT2 억제제',                  ex: 'dapagliflozin, empagliflozin' },
  { stem: '-tide',     klass: 'GLP-1 유사체/펩타이드',          ex: 'semaglutide, liraglutide, dulaglutide' },
  // 항감염
  { stem: '-cillin',   klass: '페니실린계 항생제',              ex: 'amoxicillin, ampicillin, piperacillin' },
  { stem: '-floxacin', klass: '플루오로퀴놀론',                 ex: 'ciprofloxacin, levofloxacin, moxifloxacin' },
  { stem: '-cycline',  klass: '테트라사이클린계',               ex: 'doxycycline, minocycline, tetracycline' },
  { stem: '-conazole', klass: '항진균제 (아졸계)',              ex: 'fluconazole, ketoconazole, itraconazole' },
  { stem: '-vir',      klass: '항바이러스제',                   ex: 'acyclovir, oseltamivir, ritonavir' },
  { stem: '-thromycin',klass: '매크로라이드',                   ex: 'erythromycin, azithromycin, clarithromycin' },
  { stem: '-mycin/-micin', klass: '미생물 유래 항생제',          ex: 'gentamicin, vancomycin, tobramycin', warn: true, note: '단일 계열 아님 — 아미노글리코사이드·글리코펩타이드 등 혼재 (매크로라이드는 -thromycin)' },
  // 신경·정신·통증
  { stem: '-azepam',   klass: '벤조디아제핀',                   ex: 'diazepam, lorazepam, clonazepam' },
  { stem: '-azolam',   klass: '벤조디아제핀',                   ex: 'alprazolam, midazolam, triazolam' },
  { stem: '-triptan',  klass: '편두통 치료제 (5-HT1 작용제)',   ex: 'sumatriptan, rizatriptan, zolmitriptan' },
  { stem: '-caine',    klass: '국소마취제',                     ex: 'lidocaine, bupivacaine, ropivacaine' },
  // 호흡기·기타
  { stem: '-terol',    klass: 'β2 작용제 (기관지확장)',         ex: 'salbutamol, salmeterol, formoterol' },
  { stem: '-afil',     klass: 'PDE5 억제제',                    ex: 'sildenafil, tadalafil, vardenafil' },
  { stem: '-dronate',  klass: '비스포스포네이트',               ex: 'alendronate, risedronate, ibandronate' },
  { stem: '-steride',  klass: '5α-환원효소 억제제',             ex: 'finasteride, dutasteride' },
  { stem: '-iramine',  klass: '항히스타민 (1세대)',             ex: 'chlorpheniramine, brompheniramine' },
  { stem: '-lamide',   klass: '탄산탈수효소 억제제',            ex: 'acetazolamide, dorzolamide' },
  // 안과·소화기
  { stem: '-prost',    klass: '프로스타글란딘 유사체',           ex: 'latanoprost, travoprost, misoprostol' },
  { stem: '-setron',   klass: '5-HT3 길항 항구토제',            ex: 'ondansetron, granisetron, palonosetron' },
  // 표적치료·생물의약품
  { stem: '-tinib',    klass: '티로신 키나제 억제제',           ex: 'imatinib, gefitinib, dasatinib' },
  { stem: '-mab',      klass: '단클론항체',                     ex: 'rituximab, trastuzumab, adalimumab', warn: true, note: '2022년부터 신규 명명은 -tug/-bart/-mig/-ment로 분화' },
];
