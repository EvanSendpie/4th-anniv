/*  *//**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          4th Anniversary Website · app.js                   ║
 * ║                                                              ║
 * ║  AnniversaryEngine: the single primary seam for all          ║
 * ║  application state. DOM wiring is separate (bottom).        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import CONFIG from './config.js';

/* ═══════════════════════════════════════════════════════════════
   AUDIO ENGINE · synthesised SFX via Web Audio API + BGM
   ═══════════════════════════════════════════════════════════════ */
const AudioEngine = (() => {
  let ctx = null;
  let bgm = null;
  let bgmPlaying = false;
  let audioUnlocked = false;
  let musicUIHandler = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playTone(freq, type = 'sine', duration = 0.12, gain = 0.25, startDelay = 0) {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const vol = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + startDelay);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, c.currentTime + startDelay + duration);
      vol.gain.setValueAtTime(gain, c.currentTime + startDelay);
      vol.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startDelay + duration);
      osc.connect(vol);
      vol.connect(c.destination);
      osc.start(c.currentTime + startDelay);
      osc.stop(c.currentTime + startDelay + duration + 0.02);
    } catch (_) {}
  }

  // Synthesized romantic music box background music loop (used when bgmUrl is empty or fails)
  let synthLoopTimer = null;
  let synthStep = 0;
  // A tender, romantic melody progression
  const synthMelody = [
    { f: 587.33, d: 0.35 }, { f: 739.99, d: 0.35 }, { f: 880.00, d: 0.35 }, { f: 1174.66, d: 0.5 },
    { f: 440.00, d: 0.35 }, { f: 554.37, d: 0.35 }, { f: 659.25, d: 0.35 }, { f: 880.00, d: 0.5 },
    { f: 493.88, d: 0.35 }, { f: 587.33, d: 0.35 }, { f: 739.99, d: 0.35 }, { f: 987.77, d: 0.5 },
    { f: 369.99, d: 0.35 }, { f: 440.00, d: 0.35 }, { f: 554.37, d: 0.35 }, { f: 739.99, d: 0.5 },
    { f: 392.00, d: 0.35 }, { f: 493.88, d: 0.35 }, { f: 587.33, d: 0.35 }, { f: 783.99, d: 0.5 },
    { f: 293.66, d: 0.35 }, { f: 369.99, d: 0.35 }, { f: 440.00, d: 0.35 }, { f: 587.33, d: 0.5 },
    { f: 392.00, d: 0.35 }, { f: 493.88, d: 0.35 }, { f: 587.33, d: 0.35 }, { f: 783.99, d: 0.5 },
    { f: 440.00, d: 0.35 }, { f: 554.37, d: 0.35 }, { f: 659.25, d: 0.35 }, { f: 880.00, d: 0.6 }
  ];

  function playSynthNote(freq, dur = 0.45) {
    if (!bgmPlaying) return;
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const vol = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, c.currentTime);
      vol.gain.setValueAtTime(0.001, c.currentTime);
      vol.gain.linearRampToValueAtTime(0.07, c.currentTime + 0.02);
      vol.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      osc.connect(vol);
      vol.connect(c.destination);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + dur + 0.05);
    } catch (_) {}
  }

  function runSynthBGM() {
    if (!bgmPlaying) return;
    const note = synthMelody[synthStep % synthMelody.length];
    playSynthNote(note.f, note.d * 1.4);
    synthStep++;
    synthLoopTimer = setTimeout(runSynthBGM, 440);
  }

  function startSynthBGM() {
    if (synthLoopTimer) clearTimeout(synthLoopTimer);
    bgmPlaying = true;
    runSynthBGM();
  }

  function stopSynthBGM() {
    if (synthLoopTimer) {
      clearTimeout(synthLoopTimer);
      synthLoopTimer = null;
    }
  }

  const SFX = {
    keyClick: () => playTone(880, 'sine', 0.08, 0.18),
    unlock: () => {
      [523, 659, 784, 1046].forEach((f, i) => playTone(f, 'sine', 0.18, 0.22, i * 0.1));
    },
    wrong: () => {
      playTone(220, 'square', 0.15, 0.2);
      playTone(180, 'square', 0.15, 0.2, 0.12);
    },
    hint: () => playTone(660, 'triangle', 0.2, 0.2),
    correct: () => {
      [523, 659, 784].forEach((f, i) => playTone(f, 'sine', 0.15, 0.22, i * 0.08));
    },
    wrong_quiz: () => {
      playTone(300, 'sawtooth', 0.15, 0.25);
    },
    pop: () => playTone(700, 'sine', 0.06, 0.3),
    catch_heart: () => {
      playTone(880, 'sine', 0.07, 0.3);
      playTone(1100, 'sine', 0.07, 0.2, 0.05);
    },
    victory: () => {
      const notes = [523, 587, 659, 698, 784, 880, 988, 1046];
      notes.forEach((f, i) => playTone(f, 'sine', 0.22, 0.25, i * 0.07));
    },
    celebration: () => {
      const chord = [523, 659, 784, 1046];
      chord.forEach(f => playTone(f, 'sine', 0.5, 0.2));
      setTimeout(() => chord.forEach(f => playTone(f * 1.5, 'sine', 0.5, 0.15)), 400);
    },
    boing: () => {
      playTone(200, 'sine', 0.15, 0.3);
      playTone(400, 'sine', 0.08, 0.15, 0.1);
    },
    letterOpen: () => {
      [330, 415, 523, 659].forEach((f, i) => playTone(f, 'triangle', 0.2, 0.2, i * 0.12));
    },
  };

  function initBGM() {
    if (!CONFIG.bgmUrl || bgm) return;
    bgm = new Audio(CONFIG.bgmUrl);
    bgm.loop = true;
    bgm.volume = 0.2;
  }

  function setMusicUIHandler(handler) {
    musicUIHandler = handler;
  }

  function notifyMusicUI(playing) {
    if (typeof musicUIHandler === 'function') {
      musicUIHandler(playing);
    }
  }

  function startBGM() {
    audioUnlocked = true;
    const c = getCtx();
    if (c && c.state === 'suspended') c.resume().catch(() => {});
    initBGM();
    if (bgm) {
      bgm.play().then(() => {
        bgmPlaying = true;
        notifyMusicUI(true);
      }).catch(() => {
        startSynthBGM();
        notifyMusicUI(true);
      });
    } else {
      startSynthBGM();
      notifyMusicUI(true);
    }
  }

  function toggleBGM() {
    audioUnlocked = true;
    const c = getCtx();
    if (c && c.state === 'suspended') c.resume().catch(() => {});
    if (bgm) {
      if (bgmPlaying) {
        bgm.pause();
        bgmPlaying = false;
      } else {
        bgm.play().then(() => {
          bgmPlaying = true;
          notifyMusicUI(true);
        }).catch(() => {
          startSynthBGM();
          notifyMusicUI(true);
        });
        bgmPlaying = true;
      }
    } else {
      if (bgmPlaying) {
        stopSynthBGM();
        bgmPlaying = false;
      } else {
        startSynthBGM();
        bgmPlaying = true;
      }
    }
    notifyMusicUI(bgmPlaying);
    return bgmPlaying;
  }

  function isBGMPlaying() { return bgmPlaying; }

  return { SFX, startBGM, toggleBGM, isBGMPlaying, setMusicUIHandler, getCtx };
})();

/* ═══════════════════════════════════════════════════════════════
   CONFETTI ENGINE
   ═══════════════════════════════════════════════════════════════ */
const ConfettiEngine = (() => {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let running = false;
  let animId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const COLORS = ['#cc785c','#a9583e','#efe9de','#6c6a64','#2f7d32','#c2710a'];

  function burst(x, y, count = 100) {
    resize();
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x ?? canvas.width / 2,
        y: y ?? canvas.height / 3,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 4) * 8,
        size: Math.random() * 14 + 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        gravity: 0.35 + Math.random() * 0.2,
        life: 1,
        decay: 0.012 + Math.random() * 0.012,
      });
    }
    if (!running) startLoop();
  }

  function startLoop() {
    running = true;
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life > 0);
      for (const p of particles) {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life -= p.decay;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (particles.length > 0) {
        animId = requestAnimationFrame(frame);
      } else {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animId = requestAnimationFrame(frame);
  }

  return { burst };
})();

/* ═══════════════════════════════════════════════════════════════
   ANNIVERSARY ENGINE · Primary Seam
   All state and transitions; no DOM coupling.
   ═══════════════════════════════════════════════════════════════ */
const AnniversaryEngine = (() => {

  /* ── Passcode ── */
  let pinBuffer = '';
  const PASSCODE = String(CONFIG.passcode);

  function enterDigit(digit) {
    if (pinBuffer.length >= PASSCODE.length) return { action: 'noop' };
    pinBuffer += String(digit);
    if (pinBuffer.length === PASSCODE.length) {
      if (pinBuffer === PASSCODE) {
        pinBuffer = '';
        return { action: 'unlock' };
      } else {
        pinBuffer = '';
        return { action: 'wrong' };
      }
    }
    return { action: 'digit', filled: pinBuffer.length };
  }

  function deleteDigit() {
    if (pinBuffer.length > 0) {
      pinBuffer = pinBuffer.slice(0, -1);
      return { action: 'delete', filled: pinBuffer.length };
    }
    return { action: 'noop' };
  }

  function getPinFilled() { return pinBuffer.length; }

  /* ── Love Duration ── */
  function calculateLoveDuration() {
    const start = new Date(CONFIG.anniversaryDate + 'T00:00:00');
    const now = new Date();
    const diffMs = now - start;
    const totalSec = Math.max(0, Math.floor(diffMs / 1000));
    const days    = Math.floor(totalSec / 86400);
    const hours   = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return { days, hours, minutes, seconds };
  }

  /* ── Quiz ── */
  const quizQuestions = CONFIG.quizQuestions;
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;

  function getQuizQuestion() {
    return quizQuestions[quizIndex] ?? null;
  }

  function answerQuiz(optionIndex) {
    if (quizAnswered) return { action: 'already_answered' };
    const q = quizQuestions[quizIndex];
    const correct = optionIndex === q.answer;
    if (correct) quizScore++;
    quizAnswered = true;
    return {
      action: correct ? 'correct' : 'wrong',
      correctIndex: q.answer,
      explanation: q.explanation,
      score: quizScore,
    };
  }

  function advanceQuiz() {
    quizIndex++;
    quizAnswered = false;
    if (quizIndex >= quizQuestions.length) {
      return { action: 'complete', score: quizScore, total: quizQuestions.length };
    }
    return {
      action: 'next',
      index: quizIndex,
      total: quizQuestions.length,
      question: quizQuestions[quizIndex],
    };
  }

  function getQuizProgress() {
    return { index: quizIndex, total: quizQuestions.length };
  }

  /* ── Heart Catcher ── */
  const HEART_TARGET = CONFIG.heartGame.targetScore;
  let heartScore = 0;

  function catchHeart() {
    heartScore++;
    const won = heartScore >= HEART_TARGET;
    return { score: heartScore, target: HEART_TARGET, won };
  }

  function resetHeartGame() { heartScore = 0; }

  /* ── Sliding Puzzle ── */
  // Generates a solvable 3x3 puzzle state
  function generateSolvablePuzzle() {
    let tiles = [0,1,2,3,4,5,6,7,8]; // 8 = empty
    do { shuffleArr(tiles); } while (!isSolvable(tiles) || isSolved(tiles));
    return tiles;
  }

  function shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function isSolvable(tiles) {
    // Count inversions (excluding empty tile 8)
    let inv = 0;
    const t = tiles.filter(x => x !== 8);
    for (let i = 0; i < t.length - 1; i++)
      for (let j = i + 1; j < t.length; j++)
        if (t[i] > t[j]) inv++;
    return inv % 2 === 0;
  }

  function isSolved(tiles) {
    return tiles.every((v, i) => v === i);
  }

  function slideTile(tiles, index) {
    const emptyIdx = tiles.indexOf(8);
    const canSlide = [emptyIdx - 1, emptyIdx + 1, emptyIdx - 3, emptyIdx + 3];
    // Prevent wrapping between rows
    const validMoves = canSlide.filter(i => {
      if (i < 0 || i > 8) return false;
      if ((emptyIdx % 3 === 0 && i === emptyIdx - 1) ||
          (emptyIdx % 3 === 2 && i === emptyIdx + 1)) return false;
      return true;
    });
    if (!validMoves.includes(index)) return { moved: false, tiles };
    const newTiles = [...tiles];
    [newTiles[emptyIdx], newTiles[index]] = [newTiles[index], newTiles[emptyIdx]];
    return { moved: true, tiles: newTiles, solved: isSolved(newTiles) };
  }

  /* ── No Button Evasion ── */
  function computeEvasion(btnRect, pointerX, pointerY, containerRect) {
    const margin = 20;
    const cw = containerRect.width;
    const ch = containerRect.height;
    const bw = btnRect.width;
    const bh = btnRect.height;
    let x = btnRect.left - containerRect.left;
    let y = btnRect.top - containerRect.top;

    // Try several candidate positions, pick furthest from pointer
    const candidates = [];
    for (let attempt = 0; attempt < 20; attempt++) {
      const cx = margin + Math.random() * (cw - bw - margin * 2);
      const cy = margin + Math.random() * (ch - bh - margin * 2);
      const distFromPointer = Math.hypot(
        cx + bw / 2 - (pointerX - containerRect.left),
        cy + bh / 2 - (pointerY - containerRect.top)
      );
      candidates.push({ cx, cy, d: distFromPointer });
    }
    candidates.sort((a, b) => b.d - a.d);
    return { left: candidates[0].cx, top: candidates[0].cy };
  }

  return {
    enterDigit, deleteDigit, getPinFilled,
    calculateLoveDuration,
    getQuizQuestion, answerQuiz, advanceQuiz, getQuizProgress,
    catchHeart, resetHeartGame,
    generateSolvablePuzzle, slideTile,
    computeEvasion,
    HEART_TARGET,
    quizTotal: () => quizQuestions.length,
  };
})();

/* ═══════════════════════════════════════════════════════════════
   DOM WIRING · SECTION 1: PASSCODE GATE
   ═══════════════════════════════════════════════════════════════ */
(function initGate() {
  const gateSection   = document.getElementById('section-passcode');
  const mainContent   = document.getElementById('main-content');
  const pinDisplay    = document.getElementById('pin-display');
  const gateMessage   = document.getElementById('gate-message');
  const musicCtrl     = document.getElementById('music-controller');
  let isUnlocking = false;

  const PASSCODE_LENGTH = String(CONFIG.passcode).length;

  function renderPinDots() {
    pinDisplay.innerHTML = '';
    for (let i = 0; i < PASSCODE_LENGTH; i++) {
      const dot = document.createElement('span');
      dot.className = 'pin-dot';
      dot.dataset.index = i;
      pinDisplay.appendChild(dot);
    }
  }
  renderPinDots();
  const pinDots = pinDisplay.querySelectorAll('.pin-dot');

  function updateDots(filled) {
    pinDots.forEach((dot, i) => dot.classList.toggle('filled', i < filled));
  }

  function showMessage(msg, isError = false) {
    gateMessage.textContent = msg;
    gateMessage.style.color = isError ? 'var(--pink-deep)' : 'var(--lavender-deep)';
  }

  function shakePin() {
    pinDisplay.classList.remove('shake');
    void pinDisplay.offsetWidth;
    pinDisplay.classList.add('shake');
  }

  function unlock() {
    if (isUnlocking) return;
    isUnlocking = true;
    AudioEngine.SFX.unlock();
    AudioEngine.startBGM();
    gateSection.classList.add('unlocking');
    musicCtrl.classList.remove('hidden');
    setTimeout(() => {
      gateSection.classList.add('hidden');
      mainContent.classList.remove('hidden');
      window.dispatchEvent(new Event('resize'));
    }, 700);
  }

  function processDelete() {
    if (isUnlocking) return;
    AudioEngine.SFX.keyClick();
    const result = AnniversaryEngine.deleteDigit();
    if (result.action !== 'noop') updateDots(result.filled);
    showMessage('');
  }

  function processDigit(digit) {
    if (isUnlocking) return;

    AudioEngine.SFX.keyClick();
    const result = AnniversaryEngine.enterDigit(digit);

    if (result.action === 'digit') {
      updateDots(result.filled);
      showMessage('');
    } else if (result.action === 'unlock') {
      updateDots(PASSCODE_LENGTH);
      showMessage(`Kodenya cocok. Selamat datang, ${CONFIG.partnerName}`);
      setTimeout(unlock, 400);
    } else if (result.action === 'wrong') {
      AudioEngine.SFX.wrong();
      updateDots(0);
      shakePin();
      showMessage('Kodenya belum pas, coba lagi', true);
    }
  }

  document.getElementById('keypad').addEventListener('click', (e) => {
    const btn = e.target.closest('.key-btn');
    if (!btn) return;

    if (btn.id === 'key-hint') {
      AudioEngine.SFX.hint();
      if (gateMessage.textContent === CONFIG.hint) {
        showMessage('');
      } else {
        showMessage(CONFIG.hint);
      }
      return;
    }
    if (btn.id === 'key-delete') {
      processDelete();
      return;
    }
    if (btn.dataset.digit != null) processDigit(btn.dataset.digit);
  });

  document.addEventListener('keydown', (e) => {
    if (isUnlocking || gateSection.classList.contains('hidden') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      processDigit(e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      processDelete();
    } else if (e.key === '?') {
      e.preventDefault();
      AudioEngine.SFX.hint();
      showMessage(gateMessage.textContent === CONFIG.hint ? '' : CONFIG.hint);
    }
  });
})();

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: HERO & LIVE COUNTER + Music Controller
   ═══════════════════════════════════════════════════════════════ */
(function initHero() {
  // Personalise names
  document.getElementById('hero-partner-name').textContent = CONFIG.partnerName;
  document.getElementById('letter-sender-name').textContent = CONFIG.yourName;

  // Live counter
  function tick() {
    const { days, hours, minutes, seconds } = AnniversaryEngine.calculateLoveDuration();
    document.getElementById('counter-days').textContent    = String(days).padStart(4, '0');
    document.getElementById('counter-hours').textContent   = String(hours).padStart(2, '0');
    document.getElementById('counter-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('counter-seconds').textContent = String(seconds).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);

  // Music toggle
  const musicBtn  = document.getElementById('btn-music-toggle');
  const musicIcon = musicBtn.querySelector('.music-icon');

  function updateMusicUI(playing) {
    if (!musicBtn || !musicIcon) return;
    musicIcon.innerHTML = playing
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l12-2v13M9 18c0 1.7-1.6 3-3.5 3S2 20.7 2 19s1.6-3 3.5-3S9 16.3 9 18Zm12-2c0 1.7-1.6 3-3.5 3S14 17.7 14 16s1.6-3 3.5-3 3.5 1.3 3.5 3Z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4 20 20M9 18V9.5M9 9.5 21 7v9M9 9.5 4 10.3v7.2"/></svg>';
    musicBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    musicBtn.setAttribute('title', playing ? 'Matikan musik' : 'Putar musik');
    musicBtn.classList.toggle('paused', !playing);
  }

  AudioEngine.setMusicUIHandler(updateMusicUI);
  updateMusicUI(AudioEngine.isBGMPlaying());

  musicBtn.addEventListener('click', () => {
    AudioEngine.toggleBGM();
  });
})();

/* ═══════════════════════════════════════════════════════════════
   PARTICLES BACKGROUND
   ═══════════════════════════════════════════════════════════════ */
(function initParticles() {
  const bg = document.getElementById('particles-bg');
  for (let i = 0; i < 16; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDuration = (8 + Math.random() * 12) + 's';
    el.style.animationDelay    = (Math.random() * 10) + 's';
    el.style.setProperty('--particle-size', (4 + Math.random() * 8) + 'px');
    bg.appendChild(el);
  }
})();

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: VERTICAL STORYLINE ROAD
   ═══════════════════════════════════════════════════════════════ */
(function initStoryline() {
  const road = document.getElementById('storyline-road');

  CONFIG.storyline.forEach((chapter, idx) => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.setAttribute('aria-label', `${chapter.year}: ${chapter.title}`);

    const dot = document.createElement('div');
    dot.className = 'chapter-dot';
    dot.textContent = String(idx + 1).padStart(2, '0');

    const content = document.createElement('div');
    content.className = 'chapter-content';

    // Photo
    let photoHTML;
    if (chapter.photo) {
      photoHTML = `<div class="chapter-photo"><img src="${chapter.photo}" alt="Kenangan ${chapter.year}" loading="lazy"/></div>`;
    } else {
      photoHTML = `<div class="chapter-photo"><div class="photo-placeholder">Foto kenangan ${chapter.year} akan muncul di sini.<br/><small>Tambahkan file foto di config.js</small></div></div>`;
    }

    const memoriesHTML = chapter.memories
      .map(m => `<li>${m}</li>`)
      .join('');

    content.innerHTML = `
      <span class="chapter-year-badge">${chapter.year}</span>
      <h3 class="chapter-title">${chapter.title}</h3>
      <p class="chapter-date">${chapter.date}</p>
      ${photoHTML}
      <p class="chapter-story">${chapter.story}</p>
      <ul class="chapter-memories">${memoriesHTML}</ul>
    `;

    card.appendChild(dot);
    card.appendChild(content);
    road.appendChild(card);
  });

  // Scroll reveal for cards
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.15 }
  );

  road.querySelectorAll('.chapter-card').forEach(c => observer.observe(c));

  // Animated timeline line on scroll
  function updateTimelineLine() {
    const roadRect = road.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // How far the viewport midpoint has scrolled through the road
    const roadTop = roadRect.top;
    const roadHeight = roadRect.height;
    const scrolledInto = viewportHeight * 0.5 - roadTop;
    const progress = Math.max(0, Math.min(1, scrolledInto / roadHeight));
    const lineHeight = progress * roadHeight;

    road.style.setProperty('--timeline-progress', lineHeight + 'px');
    // Use the ::after pseudo-element height
    const afterStyle = road.querySelector('.timeline-progress-line');
    // Directly set via inline style on a real element is cleaner, but
    // we can use CSS custom property approach:
    road.style.setProperty('--tl-height', lineHeight + 'px');
  }

  // We'll use a direct style setter since ::after can't be styled inline.
  // Override ::after height via a <style> element for performance.
  const tlStyle = document.createElement('style');
  tlStyle.id = 'timeline-progress-style';
  document.head.appendChild(tlStyle);

  function updateTimelineProgress() {
    if (!road) return;
    const roadRect = road.getBoundingClientRect();
    if (!roadRect.height) return;
    const viewportMid = window.innerHeight * 0.6;
    const scrolledInto = viewportMid - roadRect.top;
    const progress = Math.max(0, Math.min(1, scrolledInto / roadRect.height));
    const lineHeight = Math.round(progress * roadRect.height);
    tlStyle.textContent = `.storyline-road::after { height: ${lineHeight}px; }`;
  }

  window.addEventListener('scroll', updateTimelineProgress, { passive: true });
  window.addEventListener('resize', updateTimelineProgress, { passive: true });
  // Initial call
  setTimeout(updateTimelineProgress, 100);
})();

/* ═══════════════════════════════════════════════════════════════
   SECTION 4: MEMORY QUIZ
   ═══════════════════════════════════════════════════════════════ */
(function initQuiz() {
  const quizCard     = document.getElementById('quiz-card');
  const questionEl   = document.getElementById('quiz-question');
  const optionsEl    = document.getElementById('quiz-options');
  const feedbackEl   = document.getElementById('quiz-feedback');
  const nextBtn      = document.getElementById('btn-quiz-next');
  const progressFill = document.getElementById('quiz-progress-fill');
  const progressText = document.getElementById('quiz-progress-text');
  const completeEl   = document.getElementById('quiz-complete');
  const scoreText    = document.getElementById('quiz-score-text');
  const albumSection = document.getElementById('section-album');

  function renderQuestion() {
    const q = AnniversaryEngine.getQuizQuestion();
    if (!q) return;
    const { index, total } = AnniversaryEngine.getQuizProgress();

    progressFill.style.transform = `scaleX(${index / total})`;
    progressText.textContent = `Pertanyaan ${index + 1} dari ${total}`;
    questionEl.textContent = q.question;

    feedbackEl.classList.add('hidden');
    nextBtn.classList.add('hidden');

    optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.id = `quiz-option-${i}`;
      btn.textContent = opt;
      btn.setAttribute('aria-label', opt);
      btn.addEventListener('click', () => handleAnswer(i), { once: true });
      optionsEl.appendChild(btn);
    });
  }

  function handleAnswer(idx) {
    const result = AnniversaryEngine.answerQuiz(idx);
    if (result.action === 'already_answered') return;

    // Disable all options
    optionsEl.querySelectorAll('.quiz-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === result.correctIndex) btn.classList.add('correct');
      if (i === idx && result.action === 'wrong') btn.classList.add('wrong');
    });

    feedbackEl.textContent = result.explanation;
    feedbackEl.classList.remove('hidden');
    nextBtn.classList.remove('hidden');

    if (result.action === 'correct') {
      AudioEngine.SFX.correct();
    } else {
      AudioEngine.SFX.wrong_quiz();
    }
  }

  nextBtn.addEventListener('click', () => {
    const result = AnniversaryEngine.advanceQuiz();
    if (result.action === 'complete') {
      quizCard.classList.add('hidden');
      completeEl.classList.remove('hidden');
      albumSection.classList.remove('hidden');
      const total = result.total;
      const score = result.score;
      scoreText.textContent = score === total
        ? `Skor: ${score}/${total}, ingatanmu juara.`
        : `Skor: ${score}/${total}.`;
      AudioEngine.SFX.victory();
      ConfettiEngine.burst();
    } else {
      renderQuestion();
    }
  });

  renderQuestion();
})();

/* Photo album lightbox */
(function initAlbum() {
  const lightbox = document.getElementById('album-lightbox');
  const lightboxImage = document.getElementById('album-lightbox-image');
  const albumGrid = document.getElementById('album-grid');
  let lastTrigger = null;

  CONFIG.albumPhotos.forEach((src, index) => {
    const photo = document.createElement('button');
    const image = document.createElement('img');
    const number = document.createElement('span');
    const photoNumber = String(index + 1).padStart(2, '0');

    photo.className = 'album-photo';
    photo.type = 'button';
    photo.dataset.photo = src;
    photo.setAttribute('aria-label', `Perbesar foto kenangan ${index + 1}`);
    image.src = src;
    image.alt = `Foto kenangan ${index + 1}`;
    image.width = 1280;
    image.height = 960;
    image.loading = 'lazy';
    number.textContent = photoNumber;
    photo.append(image, number);
    albumGrid.appendChild(photo);

    photo.addEventListener('click', () => {
      lastTrigger = photo;
      lightboxImage.src = src;
      lightboxImage.alt = image.alt;
      lightbox.classList.remove('hidden');
      lightbox.focus();
    });
  });

  function closeLightbox() {
    if (lightbox.classList.contains('hidden')) return;
    lightbox.classList.add('hidden');
    lightboxImage.removeAttribute('src');
    lastTrigger?.focus();
  }

  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
})();

/* ═══════════════════════════════════════════════════════════════
   SECTION 5: CATCH THE LOVE HEARTS GAME
   ═══════════════════════════════════════════════════════════════ */
(function initHeartsGame() {
  const arena       = document.getElementById('hearts-arena');
  const basket      = document.getElementById('hearts-basket');
  const scoreEl     = document.getElementById('hearts-score');
  const targetEl    = document.getElementById('hearts-target');
  const progressEl  = document.getElementById('hearts-progress');
  const startBtn    = document.getElementById('btn-hearts-start');
  const stopBtn     = document.getElementById('btn-hearts-stop');
  const restartBtn  = document.getElementById('btn-hearts-restart');
  const victoryEl   = document.getElementById('hearts-victory');
  const gameSection = document.getElementById('section-game-hearts');

  const BASKET_WIDTH = 60;

  let running = false;
  let spawnInterval = null;
  let basketX = 50; // percentage
  let rafId = null;
  let fallingItems = [];

  targetEl.textContent = AnniversaryEngine.HEART_TARGET;

  function getBasketRect() {
    return {
      left: (basketX / 100) * arena.clientWidth - BASKET_WIDTH / 2,
      right: (basketX / 100) * arena.clientWidth + BASKET_WIDTH / 2,
      top: arena.clientHeight - 80,
      bottom: arena.clientHeight - 20,
    };
  }

  function moveBasketTo(clientX) {
    const rect = arena.getBoundingClientRect();
    const relX = clientX - rect.left;
    basketX = Math.max(5, Math.min(95, (relX / rect.width) * 100));
    basket.style.left = basketX + '%';
  }

  // Mouse
  arena.addEventListener('mousemove', e => { if (running) moveBasketTo(e.clientX); });
  // Touch
  arena.addEventListener('touchmove', e => {
    if (!running) return;
    e.preventDefault();
    moveBasketTo(e.touches[0].clientX);
  }, { passive: false });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!running) return;
    if (e.key === 'ArrowLeft')  basketX = Math.max(5, basketX - 5);
    if (e.key === 'ArrowRight') basketX = Math.min(95, basketX + 5);
    basket.style.left = basketX + '%';
  });

  function spawnItem() {
    const el = document.createElement('div');
    el.className = 'falling-item';
    const leftPct = 5 + Math.random() * 90;
    el.style.left = leftPct + '%';
    const speed = 2.5 + Math.random() * 2;
    el.style.animationDuration = speed + 's';
    arena.appendChild(el);
    fallingItems.push({ el, leftPct, speed, startTime: performance.now() });
  }

  function checkCollisions() {
    const br = getBasketRect();
    const now = performance.now();
    fallingItems = fallingItems.filter(item => {
      const arenaH = arena.clientHeight;
      const elapsed = (now - item.startTime) / 1000;
      const progress = elapsed / item.speed;
      const itemY = progress * (arenaH + 40) - 40;
      const itemX = (item.leftPct / 100) * arena.clientWidth;

      if (itemY > arenaH + 10) {
        item.el.remove();
        return false;
      }

      if (itemY >= br.top && itemY <= br.bottom + 20 &&
          itemX >= br.left - 20 && itemX <= br.right + 20) {
        item.el.remove();
        AudioEngine.SFX.catch_heart();
        const result = AnniversaryEngine.catchHeart();
        scoreEl.textContent = result.score;
        progressEl.style.transform = `scaleX(${Math.min(1, result.score / result.target)})`;
        if (result.won) {
          stopGame();
          showVictory();
        }
        return false;
      }
      return true;
    });
  }

  function gameLoop() {
    if (!running) return;
    checkCollisions();
    rafId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    AnniversaryEngine.resetHeartGame();
    scoreEl.textContent = '0';
    progressEl.style.transform = 'scaleX(0)';
    fallingItems.forEach(i => i.el.remove());
    fallingItems = [];
    running = true;
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
    restartBtn.classList.add('hidden');
    victoryEl.classList.add('hidden');
    spawnInterval = setInterval(spawnItem, 900);
    spawnItem();
    rafId = requestAnimationFrame(gameLoop);
  }

  function stopGame() {
    running = false;
    clearInterval(spawnInterval);
    cancelAnimationFrame(rafId);
  }

  function showVictory() {
    AudioEngine.SFX.victory();
    ConfettiEngine.burst();
    victoryEl.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
    fallingItems.forEach(i => i.el.remove());
    fallingItems = [];
  }

  startBtn.addEventListener('click', startGame);

  stopBtn.addEventListener('click', () => {
    stopGame();
    stopBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
    // Clear remaining falling items
    fallingItems.forEach(i => i.el.remove());
    fallingItems = [];
  });

  restartBtn.addEventListener('click', () => {
    stopGame();
    setTimeout(startGame, 100);
  });
})();

/* ═══════════════════════════════════════════════════════════════
   SECTION 6: LOVE PHOTO PUZZLE
   ═══════════════════════════════════════════════════════════════ */
(function initPuzzle() {
  const board       = document.getElementById('puzzle-board');
  const preview     = document.getElementById('puzzle-preview');
  const startBtn    = document.getElementById('btn-puzzle-start');
  const resetBtn    = document.getElementById('btn-puzzle-reset');
  const hintBtn     = document.getElementById('btn-puzzle-hint');
  const victoryEl   = document.getElementById('puzzle-victory');

  let tiles = [0,1,2,3,4,5,6,7,8];
  let gameStarted = false;

  const puzzleImages = CONFIG.puzzleImages ?? [];
  let IMG = puzzleImages[Math.floor(Math.random() * puzzleImages.length)] ?? '';
  const GRID = 3;
  const PASTEL_COLORS = ['#efe9de','#faf9f5','#cc785c','#a9583e','#6c6a64','#2f7d32'];
  let imageReady = false;

  function renderPreview() {
    if (imageReady) {
      const image = document.createElement('img');
      image.src = IMG;
      image.alt = 'Preview foto puzzle';
      preview.replaceChildren(image);
    } else {
      preview.innerHTML = '<div class="puzzle-fallback-preview"><strong>Kenangan</strong><small>Tambahkan foto di config.js</small></div>';
    }
  }

  function setPuzzleImage(src) {
    IMG = src;
    imageReady = false;
    renderPreview();

    if (!IMG) {
      renderBoard();
      return;
    }

    const image = new Image();
    image.addEventListener('load', () => {
      if (IMG !== src) return;
      imageReady = true;
      renderPreview();
      renderBoard();
    });
    image.addEventListener('error', () => {
      if (IMG !== src) return;
      imageReady = false;
      renderPreview();
      renderBoard();
    });
    image.src = IMG;
  }

  function getNextPuzzleImage() {
    if (puzzleImages.length < 2) return puzzleImages[0] ?? '';
    const otherImages = puzzleImages.filter((image) => image !== IMG);
    const options = otherImages.length ? otherImages : puzzleImages;
    return options[Math.floor(Math.random() * options.length)];
  }

  setPuzzleImage(IMG);
  renderPreview();

  function renderBoard() {
    board.innerHTML = '';
    tiles.forEach((val, idx) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'puzzle-tile' + (val === 8 ? ' empty-tile' : '');
      tile.id = `puzzle-tile-${idx}`;
      tile.setAttribute('role', 'gridcell');
      tile.setAttribute('aria-label', val === 8 ? 'Kotak kosong' : `Potongan puzzle ${val + 1}`);
      tile.disabled = val === 8 || !gameStarted;

      if (val !== 8) {
        if (imageReady) {
          const row = Math.floor(val / GRID);
          const col = val % GRID;
          tile.style.backgroundImage = `url(${IMG})`;
          tile.style.backgroundSize  = `${GRID * 100}% ${GRID * 100}%`;
          tile.style.backgroundPosition = `${(col / (GRID-1)) * 100}% ${(row / (GRID-1)) * 100}%`;
        } else {
          // Numbered fallback remains playable until a photo is configured.
          tile.style.background = PASTEL_COLORS[val % PASTEL_COLORS.length];
          tile.innerHTML = `<span style="font-size:1.4rem;font-family:'Inter',sans-serif;font-weight:600;color:#181715">${val + 1}</span>`;
        }

        if (gameStarted) {
          tile.addEventListener('click', () => handleTileClick(idx));
        }
      }

      board.appendChild(tile);
    });
  }

  function handleTileClick(idx) {
    if (!gameStarted) return;
    const result = AnniversaryEngine.slideTile(tiles, idx);
    if (result.moved) {
      AudioEngine.SFX.pop();
      tiles = result.tiles;
      renderBoard();
      if (result.solved) {
        gameStarted = false;
        board.querySelectorAll('.puzzle-tile').forEach(t => {
          t.classList.add('solved');
          t.disabled = true;
        });
        AudioEngine.SFX.victory();
        ConfettiEngine.burst();
        setTimeout(() => victoryEl.classList.remove('hidden'), 500);
      }
    }
  }

  startBtn.addEventListener('click', () => {
    setPuzzleImage(getNextPuzzleImage());
    tiles = AnniversaryEngine.generateSolvablePuzzle();
    gameStarted = true;
    startBtn.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    hintBtn.classList.remove('hidden');
    victoryEl.classList.add('hidden');
    renderBoard();
  });

  resetBtn.addEventListener('click', () => {
    setPuzzleImage(getNextPuzzleImage());
    tiles = AnniversaryEngine.generateSolvablePuzzle();
    victoryEl.classList.add('hidden');
    gameStarted = true;
    renderBoard();
  });

  let hintVisible = false;
  hintBtn.addEventListener('click', () => {
    hintVisible = !hintVisible;
    preview.style.boxShadow = hintVisible ? '0 0 0 4px var(--pink-deep)' : '';
    hintBtn.textContent = hintVisible ? 'Sembunyikan Petunjuk' : 'Lihat Petunjuk';
    AudioEngine.SFX.hint();
  });

  renderBoard();
})();

/* ═══════════════════════════════════════════════════════════════
   SECTION 7: GRAND FINALE · LOVE LETTER & PROPOSAL
   ═══════════════════════════════════════════════════════════════ */
(function initFinale() {
  const envelope        = document.getElementById('envelope');
  const loveLetter      = document.getElementById('love-letter');
  const letterBody      = document.getElementById('letter-body');
  const proposalSection = document.getElementById('proposal-section');
  const btnYes          = document.getElementById('btn-yes');
  const btnNo           = document.getElementById('btn-no');
  const btnNoContainer  = document.getElementById('proposal-buttons');
  const celebration     = document.getElementById('yes-celebration');
  const celebMsg        = document.getElementById('celebration-message');

  // Inject letter paragraphs
  letterBody.innerHTML = CONFIG.letterParagraphs
    .map(p => `<p>${p}</p>`)
    .join('');

  // Open envelope on click / keyboard
  function openEnvelope() {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    envelope.setAttribute('aria-expanded', 'true');
    AudioEngine.SFX.letterOpen();
    setTimeout(() => {
      loveLetter.classList.remove('hidden');
      loveLetter.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });

  // "No" button evasion: starts in flow, dodges on interaction
  let noPlaced = false;

  function getYesRect() {
    return btnYes.getBoundingClientRect();
  }

  function placeNoBtn(pointerX, pointerY) {
    btnNoContainer.style.position = 'relative';
    btnNoContainer.style.minHeight = '150px';

    if (!noPlaced) {
      btnNo.style.position = 'absolute';
      btnNo.style.zIndex = '15';
      noPlaced = true;
    }

    const containerRect = btnNoContainer.getBoundingClientRect();
    const yesRect = getYesRect();

    const margin = 12;
    const cw = Math.max(containerRect.width, 260);
    const ch = Math.max(containerRect.height, 140);
    const bw = Math.max(btnNo.offsetWidth, 90);
    const bh = Math.max(btnNo.offsetHeight, 44);

    // Fallback coordinates if pointer is missing
    const px = (typeof pointerX === 'number' && !isNaN(pointerX)) ? pointerX : (containerRect.left + cw / 2);
    const py = (typeof pointerY === 'number' && !isNaN(pointerY)) ? pointerY : (containerRect.top + ch / 2);

    // Convert yes button rect to container-relative coords
    const yesRelLeft = yesRect.left - containerRect.left;
    const yesRelTop = yesRect.top - containerRect.top;
    const yesRelRight = yesRelLeft + yesRect.width;
    const yesRelBottom = yesRelTop + yesRect.height;

    const maxX = Math.max(0, cw - bw - margin * 2);
    const maxY = Math.max(0, ch - bh - margin * 2);

    // Generate candidates that don't overlap with the yes button
    const candidates = [];
    for (let attempt = 0; attempt < 50; attempt++) {
      const cx = margin + Math.random() * maxX;
      const cy = margin + Math.random() * maxY;

      const noRight = cx + bw;
      const noBottom = cy + bh;
      const overlapsYes = !(noRight + 12 < yesRelLeft ||
                            cx - 12 > yesRelRight ||
                            noBottom + 12 < yesRelTop ||
                            cy - 12 > yesRelBottom);

      if (overlapsYes) continue;

      const distFromPointer = Math.hypot(
        cx + bw / 2 - (px - containerRect.left),
        cy + bh / 2 - (py - containerRect.top)
      );
      candidates.push({ cx, cy, d: distFromPointer });
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.d - a.d);
      btnNo.style.left = Math.round(candidates[0].cx) + 'px';
      btnNo.style.top  = Math.round(candidates[0].cy) + 'px';
    } else {
      // Fallback: place in corner furthest from pointer
      const farLeft = (px - containerRect.left) > cw / 2 ? margin : Math.max(margin, cw - bw - margin);
      const farTop = (py - containerRect.top) > ch / 2 ? margin : Math.max(margin, ch - bh - margin);
      btnNo.style.left = Math.round(farLeft) + 'px';
      btnNo.style.top = Math.round(farTop) + 'px';
    }
  }

  btnNo.addEventListener('mouseenter', e => {
    AudioEngine.SFX.boing();
    placeNoBtn(e.clientX, e.clientY);
  });

  btnNo.addEventListener('touchstart', e => {
    e.preventDefault();
    AudioEngine.SFX.boing();
    const touch = e.touches[0];
    placeNoBtn(touch ? touch.clientX : null, touch ? touch.clientY : null);
  }, { passive: false });

  btnNo.addEventListener('click', e => {
    e.preventDefault();
    AudioEngine.SFX.boing();
    placeNoBtn(e.clientX, e.clientY);
  });

  // "Yes" button
  btnYes.addEventListener('click', () => {
    celebration.classList.remove('hidden');
    celebMsg.textContent = `Terima kasih sudah memilih untuk terus jalan bareng aku, ${CONFIG.partnerName}. Mari buat cerita baru lagi.`;
    AudioEngine.SFX.celebration();
    ConfettiEngine.burst(null, null, 200);
    setTimeout(() => ConfettiEngine.burst(null, null, 150), 600);
    setTimeout(() => ConfettiEngine.burst(null, null, 150), 1200);
  });

  // Tap celebration anywhere to close
  celebration.addEventListener('click', () => {
    celebration.classList.add('hidden');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !celebration.classList.contains('hidden')) {
      celebration.classList.add('hidden');
    }
  });
})();

/* Scroll to top */
(function initScrollTop() {
  const button = document.getElementById('btn-scroll-top');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateVisibility() {
    button.classList.toggle('is-visible', window.scrollY > 480);
  }

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });
  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
})();

/* ═══════════════════════════════════════════════════════════════
   GAME SECTION SCROLL-REVEAL ANIMATIONS
   ═══════════════════════════════════════════════════════════════ */
(function initGameReveal() {
  const revealTargets = document.querySelectorAll(
    '.section-game .section-header, ' +
    '.section-game .game-container, ' +
    '.section-quiz .section-header, ' +
    '.section-quiz .quiz-card, ' +
    '.section-quiz .quiz-complete, ' +
    '.section-finale .section-header, ' +
    '.section-finale .finale-inner'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('game-revealed');
        revealObserver.unobserve(e.target);
      }
    }),
    { threshold: 0.1 }
  );

  revealTargets.forEach(el => revealObserver.observe(el));
})();
