// Service worker CRM — минимальный, СПЕЦИАЛЬНО без кеширования бандла.
//
// Зачем вообще нужен: без обработчика fetch Android не считает сайт приложением
// и не предлагает «Установить». С ним ярлык ставится как настоящее приложение
// (свой значок, запуск без адресной строки).
//
// Почему не кешируем JS/CSS: деплой бывает по несколько раз в день, а закешированный
// бандл означал бы, что сотрудники сидят на старой версии CRM и не понимают, почему
// «у всех есть, а у меня нет». Данные и так живут в Supabase, офлайн-режим смысла
// не имеет — без сети CRM всё равно пустая.
//
// Единственное, что делаем офлайн: показываем понятную заглушку вместо
// «страница недоступна», чтобы человек в цеху понял, что дело в интернете.

const OFFLINE_HTML = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Нет интернета</title>
<style>
  body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;
       background:#E5ECEB;color:#2E4644;font-family:Manrope,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
       text-align:center;padding:24px}
  .t{font-size:19px;font-weight:800;margin-bottom:8px}
  .s{font-size:14px;color:#536966;line-height:1.5;max-width:280px}
</style></head><body><div>
<div style="font-size:44px;margin-bottom:10px">📡</div>
<div class="t">Нет интернета</div>
<div class="s">Print 360 работает только онлайн. Проверьте wi-fi или мобильный интернет и обновите страницу.</div>
</div></body></html>`;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  // Переходы по страницам: сеть, а при её отсутствии — заглушка.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => new Response(OFFLINE_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }))
    );
  }
  // Всё остальное отдаём браузеру как обычно — не вмешиваемся.
});
