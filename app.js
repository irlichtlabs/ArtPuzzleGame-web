'use strict';

/** Taps this soon after a screen appears are ignored, so a lingering finger can't answer it. */
var TAP_HOLD_MS = 800;

var game = new Game(PAINTINGS);
var round = null;
var answered = false;
var imageReady = false;
var acceptTapsAt = 0;
var multiTouchUntil = 0;

var $ = function (id) { return document.getElementById(id); };
var painting = $('painting');
var questionPanel = $('questionPanel');
var answerPanel = $('answerPanel');
var answerButtons = [$('answerA'), $('answerB')];

function src(p) { return 'paintings/' + p.id + '.jpg'; }
function captionOf(p) { return '«' + p.title + '», ' + p.date; }

function holdTaps() { acceptTapsAt = Date.now() + TAP_HOLD_MS; }
// A tap made while a second finger touched the screen doesn't count.
function tapAllowed() { var now = Date.now(); return now >= acceptTapsAt && now >= multiTouchUntil; }

function showNextRound() {
  round = game.nextRound();
  answered = false;
  answerPanel.hidden = true;
  answerPanel.classList.remove('shown');
  questionPanel.hidden = false;
  for (var i = 0; i < answerButtons.length; i++) {
    answerButtons[i].textContent = round.options[i].name;
    fitText(answerButtons[i], 30, 20);
  }
  painting.classList.remove('shown');
  var p = round.painting;
  imageReady = false;
  painting.alt = 'Картина';
  $('imageError').hidden = true;
  answerButtons.forEach(function (b) { b.disabled = true; });
  painting.onload = function () {
    if (round.painting !== p) return;
    imageReady = true;
    painting.classList.add('shown');
    $('imageError').hidden = true;
    answerButtons.forEach(function (b) { b.disabled = false; });
    holdTaps();
  };
  painting.onerror = function () { if (round.painting === p) $('imageError').hidden = false; };
  painting.src = src(p);
  holdTaps();
}

function onAnswer(index) {
  if (!round || !imageReady || answered || !tapAllowed()) return;
  answered = true;
  var chosen = round.options[index];
  var answer = round.painting.artist;

  // The same calm reveal either way: never a "wrong", a miss just shows one more painting.
  $('headline').textContent = (chosen === answer ? 'Да, это ' : 'Это ') + answer.name;
  $('caption').textContent = captionOf(round.painting);
  painting.alt = answer.name + '. ' + captionOf(round.painting);
  if (chosen === answer) {
    $('otherRow').hidden = true;
  } else {
    var example = game.exampleBy(chosen);
    $('otherHeadline').textContent = 'А так писал ' + chosen.name;
    $('otherCaption').textContent = captionOf(example);
    $('otherPainting').src = src(example);
    $('otherPainting').alt = chosen.name + '. ' + captionOf(example);
    $('otherRow').hidden = false;
  }
  questionPanel.hidden = true;
  answerPanel.hidden = false;
  void answerPanel.offsetWidth;
  answerPanel.classList.add('shown');
  holdTaps();
}

/** Shrinks a button label until it fits in two lines (like Android's autosize). */
function fitText(el, max, min) {
  var size = max;
  el.style.fontSize = size + 'px';
  while (size > min && (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)) {
    size -= 1;
    el.style.fontSize = size + 'px';
  }
}

answerButtons.forEach(function (b, i) { b.addEventListener('click', function () { onAnswer(i); }); });
$('next').addEventListener('click', function () { if (answered && tapAllowed()) showNextRound(); });
$('retryPainting').addEventListener('click', function () {
  $('imageError').hidden = true;
  painting.src = src(round.painting) + '?retry=' + Date.now();
});

document.addEventListener('touchstart', function (e) {
  if (e.touches.length > 1) {
    multiTouchUntil = Date.now() + 1000 * 60;
    e.preventDefault();
  }
}, { passive: false });
document.addEventListener('touchend', function (e) {
  if (e.touches.length === 0 && multiTouchUntil > Date.now()) multiTouchUntil = Date.now() + 500;
});
// No pinch zoom, no long-press menus.
document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
window.addEventListener('resize', function () {
  answerButtons.forEach(function (b) { fitText(b, 30, 20); });
});

// Keep the screen on while playing (Safari 16.4+; older versions simply skip it).
function keepAwake() {
  if (navigator.wakeLock && document.visibilityState === 'visible') {
    navigator.wakeLock.request('screen').catch(function () {});
  }
}
document.addEventListener('visibilitychange', keepAwake);
keepAwake();

// Opened as a page in Safari (not from the Home Screen): show how to add it.
var standalone = window.navigator.standalone === true ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
if (!standalone && /iPhone|iPad|iPod/.test(navigator.userAgent)) $('installHint').hidden = false;

var offlineReady = false;
var updateWaiting = false;
function offlineStatus(text, retry) {
  $('offlineStatus').textContent = text;
  $('retryOffline').hidden = !retry;
}
function offlineFailure() {
  offlineStatus(offlineReady ? 'Игра сохранена. Не удалось загрузить обновление.' :
    'Пока нужна сеть: не все картины сохранены.', true);
}
function checkOffline() {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CHECK_OFFLINE' });
  }
}
$('retryOffline').addEventListener('click', function () { location.reload(); });
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'OFFLINE_STATUS') return;
    offlineReady = event.data.ready === true;
    if (updateWaiting) return;
    if (offlineReady) offlineStatus('Готово к игре без интернета', false);
    else offlineFailure();
  });
  navigator.serviceWorker.addEventListener('controllerchange', checkOffline);
  navigator.serviceWorker.register('sw.js').then(function (registration) {
    function showUpdate() {
      updateWaiting = true;
      offlineStatus('Обновление готово. Закройте игру и откройте снова.', false);
    }
    function watch(worker) {
      if (!worker) return;
      function changed() {
        if (worker.state === 'redundant') offlineFailure();
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate();
        if (worker.state === 'activated') checkOffline();
      }
      worker.addEventListener('statechange', changed);
      changed();
    }
    if (registration.waiting) showUpdate();
    watch(registration.installing);
    registration.addEventListener('updatefound', function () { watch(registration.installing); });
    checkOffline();
  }).catch(offlineFailure);
} else {
  offlineStatus('В этом браузере игра работает только с интернетом.', false);
}

showNextRound();

// Layout checks: `?demoAnswer=1` or `2` answers that option once taps are allowed.
var demo = /[?&]demoAnswer=([12])/.exec(location.search);
if (demo) setTimeout(function () { onAnswer(Number(demo[1]) - 1); }, TAP_HOLD_MS + 100);
