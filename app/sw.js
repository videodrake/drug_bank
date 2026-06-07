/* 서비스워커 — 앱 셸 캐시 (오프라인 학습 지원) */
const CACHE = 'drug-study-v6';
const ASSETS = [
  '.',
  'index.html',
  'css/style.css',
  'js/srs.js',
  'js/progress.js',
  'js/app.js',
  'data/drugs.js',
  'data/stems.js',
  'icon.svg',
  'manifest.json',
];

// 설치 시 앱 셸 캐싱
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

// 구버전 캐시 정리
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 동일 출처 GET: 캐시 우선, 네트워크 폴백 후 캐시 갱신
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
