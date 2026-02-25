// ═══════════════════════════════════════════════════════════════════════════
//  SmartMixer PWA – app.js
// ═══════════════════════════════════════════════════════════════════════════

// ─── Recipe Database ────────────────────────────────────────────────────────
const RECIPES = [
  {
    id: 'vanilla_cake',
    name: 'Vanilla Sponge',
    emoji: '🎂',
    tags: ['classic', 'low-fat'],
    cal_per_slice: 280,
    servings: 8,
    stages: [
      {
        name: 'Cream butter & sugar',
        speed: 60, duration: 120,
        ingredients: [
          { name: 'Unsalted Butter', grams: 200, color: '#f9d84b' },
          { name: 'Caster Sugar',    grams: 200, color: '#fff8dc' }
        ]
      },
      {
        name: 'Add eggs & vanilla',
        speed: 40, duration: 60,
        ingredients: [
          { name: 'Eggs (large)',    grams: 150, color: '#ffd59e' },
          { name: 'Vanilla Extract', grams: 10,  color: '#8b4513' }
        ]
      },
      {
        name: 'Fold in flour & milk',
        speed: 25, duration: 90,
        ingredients: [
          { name: 'Self-Raising Flour', grams: 200, color: '#f5f5dc' },
          { name: 'Whole Milk',         grams: 60,  color: '#fff' }
        ]
      }
    ]
  },
  {
    id: 'chocolate_cake',
    name: 'Dark Chocolate Cake',
    emoji: '🍫',
    tags: ['indulgent'],
    cal_per_slice: 420,
    servings: 10,
    stages: [
      {
        name: 'Mix dry ingredients',
        speed: 30, duration: 60,
        ingredients: [
          { name: 'Plain Flour',    grams: 250, color: '#f5f5dc' },
          { name: 'Cocoa Powder',   grams: 75,  color: '#3d1a00' },
          { name: 'Baking Powder',  grams: 10,  color: '#fff' },
          { name: 'Salt',           grams: 5,   color: '#fff' }
        ]
      },
      {
        name: 'Cream wet ingredients',
        speed: 70, duration: 120,
        ingredients: [
          { name: 'Butter',         grams: 175, color: '#f9d84b' },
          { name: 'Brown Sugar',    grams: 350, color: '#c4882a' }
        ]
      },
      {
        name: 'Combine & beat',
        speed: 50, duration: 90,
        ingredients: [
          { name: 'Eggs',           grams: 200, color: '#ffd59e' },
          { name: 'Buttermilk',     grams: 240, color: '#fffdd0' },
          { name: 'Hot Water',      grams: 240, color: '#add8e6' }
        ]
      }
    ]
  },
  {
    id: 'banana_bread',
    name: 'Banana Bread',
    emoji: '🍌',
    tags: ['healthy', 'low-sugar'],
    cal_per_slice: 195,
    servings: 10,
    stages: [
      {
        name: 'Mash bananas',
        speed: 20, duration: 45,
        ingredients: [
          { name: 'Ripe Bananas',   grams: 300, color: '#ffe135' }
        ]
      },
      {
        name: 'Mix wet ingredients',
        speed: 40, duration: 60,
        ingredients: [
          { name: 'Butter (melted)', grams: 80,  color: '#f9d84b' },
          { name: 'Honey',           grams: 80,  color: '#ffa500' },
          { name: 'Eggs',            grams: 100, color: '#ffd59e' },
          { name: 'Vanilla Extract', grams: 5,   color: '#8b4513' }
        ]
      },
      {
        name: 'Fold in flour & spices',
        speed: 20, duration: 60,
        ingredients: [
          { name: 'Whole Wheat Flour', grams: 190, color: '#c8a96e' },
          { name: 'Baking Soda',       grams: 5,   color: '#fff' },
          { name: 'Cinnamon',          grams: 5,   color: '#8b4513' }
        ]
      }
    ]
  },
  {
    id: 'lemon_drizzle',
    name: 'Lemon Drizzle',
    emoji: '🍋',
    tags: ['low-fat', 'classic'],
    cal_per_slice: 230,
    servings: 8,
    stages: [
      {
        name: 'Beat butter & sugar',
        speed: 65, duration: 120,
        ingredients: [
          { name: 'Butter',         grams: 175, color: '#f9d84b' },
          { name: 'Caster Sugar',   grams: 175, color: '#fff8dc' }
        ]
      },
      {
        name: 'Add eggs & zest',
        speed: 45, duration: 60,
        ingredients: [
          { name: 'Eggs',           grams: 150, color: '#ffd59e' },
          { name: 'Lemon Zest',     grams: 15,  color: '#fef08a' }
        ]
      },
      {
        name: 'Fold in flour & juice',
        speed: 20, duration: 60,
        ingredients: [
          { name: 'Self-Raising Flour', grams: 175, color: '#f5f5dc' },
          { name: 'Lemon Juice',        grams: 45,  color: '#fef9c3' }
        ]
      }
    ]
  }
];

// ─── BMI Recommendation Logic ────────────────────────────────────────────────
function bmiCategory(bmi) {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25)   return 'normal';
  if (bmi < 30)   return 'overweight';
  return 'obese';
}

function recommendRecipes(bmi) {
  const cat = bmiCategory(bmi);
  const tagPriority = {
    underweight: ['indulgent', 'classic'],
    normal:      ['classic', 'low-fat', 'healthy'],
    overweight:  ['low-fat', 'healthy', 'low-sugar'],
    obese:       ['low-sugar', 'healthy', 'low-fat']
  }[cat];

  return [...RECIPES].sort((a, b) => {
    const aScore = a.tags.reduce((s, t) => s + (tagPriority.indexOf(t) === -1 ? 99 : tagPriority.indexOf(t)), 0);
    const bScore = b.tags.reduce((s, t) => s + (tagPriority.indexOf(t) === -1 ? 99 : tagPriority.indexOf(t)), 0);
    return aScore - bScore;
  });
}

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  screen: 'splash',       // splash | bmi | recipes | cook | mixing
  bmi: null,
  recipe: null,
  stageIdx: 0,
  ingredientIdx: 0,
  currentWeight: 0,
  targetWeight: 0,
  mixerStatus: 'idle',
  mixerSpeed: 0,
  connectionType: null,   // 'ws' | 'ble' | null
  ws: null,
  bleChar: { notify: null, write: null },
  cameraStream: null,
  cookTimer: null,
  cookTimeLeft: 0,
  cameraVerified: false,
};

// ─── Connection Helpers ──────────────────────────────────────────────────────
async function connectWebSocket(ip) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(`ws://${ip}:81`);
    ws.onopen = () => {
      state.ws = ws;
      state.connectionType = 'ws';
      ws.onmessage = e => handleIncoming(e.data);
      ws.onclose = () => { state.connectionType = null; updateConnectionBadge(); };
      res();
    };
    ws.onerror = () => rej(new Error('WebSocket connection failed'));
    setTimeout(() => rej(new Error('Timeout')), 5000);
  });
}

async function connectBLE() {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ name: 'SmartMixer' }],
    optionalServices: ['12345678-1234-1234-1234-123456789abc']
  });
  const server  = await device.gatt.connect();
  const service = await server.getPrimaryService('12345678-1234-1234-1234-123456789abc');

  state.bleChar.write  = await service.getCharacteristic('12345678-1234-1234-1234-123456789ab1');
  state.bleChar.notify = await service.getCharacteristic('12345678-1234-1234-1234-123456789ab0');

  await state.bleChar.notify.startNotifications();
  state.bleChar.notify.addEventListener('characteristicvaluechanged', e => {
    const text = new TextDecoder().decode(e.target.value);
    handleIncoming(text);
  });

  device.addEventListener('gattserverdisconnected', () => {
    state.connectionType = null;
    updateConnectionBadge();
  });

  state.connectionType = 'ble';
}

function sendCommand(obj) {
  const json = JSON.stringify(obj);
  if (state.connectionType === 'ws' && state.ws) {
    state.ws.send(json);
  } else if (state.connectionType === 'ble' && state.bleChar.write) {
    const enc = new TextEncoder().encode(json);
    state.bleChar.write.writeValue(enc).catch(console.error);
  }
}

function handleIncoming(raw) {
  try {
    const data = JSON.parse(raw);
    if (data.weight !== undefined) {
      state.currentWeight = data.weight;
      state.mixerStatus   = data.status || 'idle';
      state.mixerSpeed    = data.speed  || 0;
      updateWeightDisplay();
    }
  } catch {}
}

// ─── Camera / AI Ingredient Check ────────────────────────────────────────────
async function startCamera() {
  try {
    state.cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const video = document.getElementById('camera-feed');
    if (video) { video.srcObject = state.cameraStream; video.play(); }
  } catch { /* camera not available */ }
}

function stopCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach(t => t.stop());
    state.cameraStream = null;
  }
}

// Simulated AI verification (in production, send frame to backend ML model)
function aiVerifyIngredient(expectedName) {
  return new Promise(resolve => {
    // Simulate a 1.5s "analysis" then probabilistic pass
    setTimeout(() => resolve(Math.random() > 0.15), 1500);
  });
}

// ─── Cooking Flow ─────────────────────────────────────────────────────────────
function currentStage()      { return state.recipe.stages[state.stageIdx]; }
function currentIngredient() { return currentStage().ingredients[state.ingredientIdx]; }

function isAllIngredientsAdded() {
  return state.currentWeight >= currentIngredient().grams * 0.97;
}

async function advanceIngredient() {
  const stage = currentStage();
  state.ingredientIdx++;
  if (state.ingredientIdx >= stage.ingredients.length) {
    // All ingredients for this stage done – start mixing
    startMixingStage();
  } else {
    renderCookScreen();
  }
}

function startMixingStage() {
  const stage = currentStage();
  state.screen = 'mixing';
  state.cookTimeLeft = stage.duration;
  sendCommand({ cmd: 'start', speed: stage.speed });
  renderMixingScreen();

  state.cookTimer = setInterval(() => {
    state.cookTimeLeft--;
    updateTimerDisplay();
    if (state.cookTimeLeft <= 0) {
      clearInterval(state.cookTimer);
      sendCommand({ cmd: 'stop' });
      state.stageIdx++;
      if (state.stageIdx >= state.recipe.stages.length) {
        showFinished();
      } else {
        state.ingredientIdx = 0;
        sendCommand({ cmd: 'tare' });
        state.screen = 'cook';
        renderCookScreen();
      }
    }
  }, 1000);
}

function showFinished() {
  document.getElementById('app').innerHTML = finishedHTML();
}

// ─── Render Functions ─────────────────────────────────────────────────────────
function render() {
  const app = document.getElementById('app');
  switch (state.screen) {
    case 'splash':  app.innerHTML = splashHTML();   break;
    case 'bmi':     app.innerHTML = bmiHTML();      break;
    case 'recipes': app.innerHTML = recipesHTML();  break;
    case 'cook':    renderCookScreen();             break;
    case 'mixing':  renderMixingScreen();           break;
  }
  attachEventListeners();
}

// ─── Screen HTMLs ─────────────────────────────────────────────────────────────
function splashHTML() {
  return `
  <div class="screen splash-screen">
    <div class="splash-bg"></div>
    <div class="splash-content">
      <div class="logo-ring">
        <svg viewBox="0 0 120 120" class="logo-svg">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="8 4" class="spin-slow"/>
          <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="48">🥣</text>
        </svg>
      </div>
      <h1 class="brand">SmartMixer</h1>
      <p class="tagline">AI-powered baking, precisely measured.</p>

      <div class="connect-card">
        <p class="connect-label">Connect to your mixer</p>
        <div class="connect-row">
          <div class="input-group">
            <label>Wi-Fi IP Address</label>
            <input id="ip-input" type="text" placeholder="192.168.1.42" value="192.168.1.42"/>
          </div>
          <button class="btn btn-primary" id="btn-ws">Connect Wi-Fi</button>
        </div>
        <div class="divider"><span>or</span></div>
        <button class="btn btn-secondary" id="btn-ble">
          <span class="ble-icon">⬡</span> Connect via Bluetooth
        </button>
        <button class="btn btn-ghost" id="btn-skip">Continue without mixer (demo)</button>
      </div>

      <div id="conn-badge" class="conn-badge hidden"></div>
    </div>
  </div>`;
}

function bmiHTML() {
  return `
  <div class="screen bmi-screen">
    <div class="bmi-deco"></div>
    <div class="form-panel">
      <button class="back-btn" id="btn-back">←</button>
      <h2>Personalise Recipes</h2>
      <p class="sub">Enter your details for tailored recommendations</p>

      <div class="bmi-fields">
        <div class="field-row">
          <div class="field">
            <label>Weight (kg)</label>
            <input id="weight-kg" type="number" placeholder="70" min="30" max="250"/>
          </div>
          <div class="field">
            <label>Height (cm)</label>
            <input id="height-cm" type="number" placeholder="170" min="100" max="250"/>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>Age</label>
            <input id="age" type="number" placeholder="30" min="10" max="100"/>
          </div>
          <div class="field">
            <label>Sex</label>
            <select id="sex">
              <option value="m">Male</option>
              <option value="f">Female</option>
            </select>
          </div>
        </div>
      </div>

      <div id="bmi-result" class="bmi-result hidden"></div>
      <button class="btn btn-primary full-width" id="btn-calc-bmi">Calculate & Find Recipes</button>
      <button class="btn btn-ghost full-width" id="btn-skip-bmi">Skip – show all recipes</button>
    </div>
  </div>`;
}

function recipesHTML() {
  const list = state.bmi ? recommendRecipes(state.bmi) : RECIPES;
  const cat  = state.bmi ? bmiCategory(state.bmi) : null;

  return `
  <div class="screen recipes-screen">
    <div class="recipes-header">
      <button class="back-btn" id="btn-back">←</button>
      <h2>Choose a Recipe</h2>
      ${cat ? `<span class="bmi-tag">${cat}</span>` : ''}
    </div>

    <div class="recipe-grid">
      ${list.map(r => `
        <div class="recipe-card" data-id="${r.id}">
          <div class="recipe-emoji">${r.emoji}</div>
          <div class="recipe-info">
            <h3>${r.name}</h3>
            <p>${r.cal_per_slice} kcal/slice · ${r.servings} servings</p>
            <div class="recipe-tags">
              ${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
          </div>
          <div class="recipe-stages">
            ${r.stages.length} stage${r.stages.length > 1 ? 's' : ''}
          </div>
          <button class="btn btn-primary recipe-btn" data-id="${r.id}">Start →</button>
        </div>
      `).join('')}
    </div>
  </div>`;
}

function cookHTML() {
  const stage = currentStage();
  const ing   = currentIngredient();
  const totalIngredients = state.recipe.stages.reduce((s,st) => s + st.ingredients.length, 0);
  const doneIngredients  = state.recipe.stages.slice(0, state.stageIdx)
    .reduce((s,st) => s + st.ingredients.length, 0) + state.ingredientIdx;
  const progress = Math.round((doneIngredients / totalIngredients) * 100);

  return `
  <div class="screen cook-screen">
    <div class="cook-header">
      <button class="back-btn" id="btn-back">←</button>
      <div class="cook-title">
        <h2>${state.recipe.emoji} ${state.recipe.name}</h2>
        <span class="stage-label">Stage ${state.stageIdx + 1}/${state.recipe.stages.length}: ${stage.name}</span>
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" style="width:${progress}%"></div>
    </div>

    <div class="cook-body">
      <!-- Camera panel -->
      <div class="camera-panel">
        <video id="camera-feed" autoplay playsinline muted></video>
        <div class="camera-overlay" id="camera-overlay">
          <div class="scan-box"></div>
          <span class="scan-label">Detecting ingredient…</span>
        </div>
        <div id="verify-badge" class="verify-badge hidden"></div>
      </div>

      <!-- Ingredient info -->
      <div class="ingredient-panel">
        <div class="ingredient-color" style="background:${ing.color}"></div>
        <div class="ingredient-details">
          <h3 class="ingredient-name">${ing.name}</h3>
          <p class="ingredient-target">Target: <strong>${ing.grams} g</strong></p>
        </div>

        <!-- Weight gauge -->
        <div class="weight-gauge">
          <div class="gauge-ring">
            <svg viewBox="0 0 100 100" class="gauge-svg">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#222" stroke-width="8"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent)" stroke-width="8"
                stroke-dasharray="${Math.min((state.currentWeight / ing.grams) * 251.2, 251.2)} 251.2"
                stroke-dashoffset="62.8" stroke-linecap="round" class="gauge-arc" id="gauge-arc"/>
            </svg>
            <div class="gauge-value">
              <span id="weight-display">${state.currentWeight.toFixed(1)}</span>
              <small>g</small>
            </div>
          </div>
        </div>

        <div id="ai-status" class="ai-status">
          <span class="ai-dot pulse"></span> Camera verifying ingredient…
        </div>

        <button class="btn btn-primary full-width" id="btn-verify" disabled>
          Confirm & Add Next Ingredient
        </button>
        <button class="btn btn-ghost full-width" id="btn-tare">Tare Scale</button>
      </div>

      <!-- All ingredients for this stage -->
      <div class="stage-overview">
        <p class="stage-overview-label">This stage</p>
        ${stage.ingredients.map((ig, i) => `
          <div class="stage-ing ${i < state.ingredientIdx ? 'done' : i === state.ingredientIdx ? 'current' : ''}">
            <div class="ing-dot" style="background:${ig.color}"></div>
            <span>${ig.name}</span>
            <span class="ing-g">${ig.grams}g</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}

function mixingHTML() {
  const stage = currentStage();
  return `
  <div class="screen mixing-screen">
    <div class="mixing-bg">
      <div class="orbit-ring r1"></div>
      <div class="orbit-ring r2"></div>
      <div class="orbit-ring r3"></div>
    </div>
    <div class="mixing-content">
      <div class="mixing-icon">⚙️</div>
      <h2>Mixing…</h2>
      <p class="mixing-stage">${stage.name}</p>

      <div class="timer-display" id="timer-display">
        ${formatTime(state.cookTimeLeft)}
      </div>

      <div class="speed-control">
        <p>Speed: <strong id="speed-label">${stage.speed}%</strong></p>
        <input type="range" id="speed-slider" min="0" max="100" value="${stage.speed}" class="speed-slider"/>
      </div>

      <button class="btn btn-danger" id="btn-stop-mix">⏹ Stop</button>
    </div>
  </div>`;
}

function finishedHTML() {
  return `
  <div class="screen finished-screen">
    <div class="confetti-bg"></div>
    <div class="finished-content">
      <div class="finished-icon">🎉</div>
      <h2>Baking Complete!</h2>
      <p>Your <strong>${state.recipe.name}</strong> is ready for the oven.</p>
      <p class="tip">Pour batter into prepared tin and bake at 180°C for 25–30 min.</p>
      <button class="btn btn-primary" id="btn-new-recipe">Bake Another →</button>
    </div>
  </div>`;
}

// ─── Render helpers ───────────────────────────────────────────────────────────
function renderCookScreen() {
  document.getElementById('app').innerHTML = cookHTML();
  attachEventListeners();
  startCamera();
  runAIVerification();
}

function renderMixingScreen() {
  document.getElementById('app').innerHTML = mixingHTML();
  attachEventListeners();
}

function updateWeightDisplay() {
  const el = document.getElementById('weight-display');
  if (!el) return;
  el.textContent = state.currentWeight.toFixed(1);

  const arc = document.getElementById('gauge-arc');
  if (arc) {
    const pct = Math.min(state.currentWeight / currentIngredient().grams, 1);
    arc.setAttribute('stroke-dasharray', `${pct * 251.2} 251.2`);
  }

  // Enable verify button if weight is within 3% of target
  const btn = document.getElementById('btn-verify');
  if (btn && isAllIngredientsAdded() && state.cameraVerified) {
    btn.disabled = false;
    btn.classList.add('ready');
  }
}

function updateTimerDisplay() {
  const el = document.getElementById('timer-display');
  if (el) el.textContent = formatTime(state.cookTimeLeft);
}

function updateConnectionBadge() {
  const badge = document.getElementById('conn-badge');
  if (!badge) return;
  if (state.connectionType) {
    badge.textContent = `✓ Connected via ${state.connectionType === 'ws' ? 'Wi-Fi' : 'Bluetooth'}`;
    badge.className = 'conn-badge connected';
  } else {
    badge.className = 'conn-badge hidden';
  }
}

async function runAIVerification() {
  state.cameraVerified = false;
  const overlay = document.getElementById('camera-overlay');
  const badge   = document.getElementById('verify-badge');
  const aiStatus = document.getElementById('ai-status');

  if (overlay) overlay.style.display = 'flex';
  const ok = await aiVerifyIngredient(currentIngredient().name);

  if (overlay) overlay.style.display = 'none';
  state.cameraVerified = ok;

  if (badge) {
    badge.className = `verify-badge ${ok ? 'ok' : 'fail'}`;
    badge.textContent = ok ? '✓ Correct ingredient detected' : '✗ Ingredient not recognised – check bowl';
  }
  if (aiStatus) {
    aiStatus.innerHTML = ok
      ? '<span class="ai-dot ok"></span> Ingredient verified by AI'
      : '<span class="ai-dot fail"></span> Verification failed – reposition ingredient';
  }

  if (ok && isAllIngredientsAdded()) {
    const btn = document.getElementById('btn-verify');
    if (btn) { btn.disabled = false; btn.classList.add('ready'); }
  }
}

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

// ─── Event Listeners ──────────────────────────────────────────────────────────
function attachEventListeners() {
  on('btn-ws', 'click', async () => {
    const ip = document.getElementById('ip-input')?.value?.trim();
    if (!ip) return toast('Enter an IP address');
    try {
      showLoader('Connecting…');
      await connectWebSocket(ip);
      hideLoader();
      updateConnectionBadge();
      toast('Connected via Wi-Fi!');
    } catch(e) { hideLoader(); toast('Connection failed: ' + e.message, true); }
  });

  on('btn-ble', 'click', async () => {
    if (!navigator.bluetooth) return toast('Bluetooth not available in this browser', true);
    try {
      showLoader('Scanning…');
      await connectBLE();
      hideLoader();
      updateConnectionBadge();
      toast('Connected via Bluetooth!');
    } catch(e) { hideLoader(); toast(e.message, true); }
  });

  on('btn-skip', 'click', () => { state.screen = 'bmi'; render(); });
  on('btn-back', 'click', () => {
    stopCamera();
    if (state.cookTimer) clearInterval(state.cookTimer);
    const prev = { bmi:'splash', recipes:'bmi', cook:'recipes', mixing:'cook' };
    state.screen = prev[state.screen] || 'splash';
    if (state.screen === 'cook') { state.screen = 'recipes'; }
    render();
  });

  on('btn-calc-bmi', 'click', () => {
    const w = parseFloat(document.getElementById('weight-kg')?.value);
    const h = parseFloat(document.getElementById('height-cm')?.value) / 100;
    if (!w || !h) return toast('Please enter weight and height');
    state.bmi = w / (h * h);
    const cat = bmiCategory(state.bmi);
    const el  = document.getElementById('bmi-result');
    if (el) {
      el.className = `bmi-result show cat-${cat}`;
      el.innerHTML = `BMI: <strong>${state.bmi.toFixed(1)}</strong> — <em>${cat}</em>`;
    }
    setTimeout(() => { state.screen = 'recipes'; render(); }, 800);
  });

  on('btn-skip-bmi', 'click', () => { state.screen = 'recipes'; render(); });

  // Recipe selection
  document.querySelectorAll('.recipe-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id;
      state.recipe       = RECIPES.find(r => r.id === id);
      state.stageIdx     = 0;
      state.ingredientIdx = 0;
      state.screen       = 'cook';
      sendCommand({ cmd: 'tare' });
      renderCookScreen();
    });
  });

  on('btn-verify', 'click', () => {
    stopCamera();
    advanceIngredient();
  });

  on('btn-tare', 'click', () => {
    sendCommand({ cmd: 'tare' });
    toast('Scale tared');
  });

  on('btn-stop-mix', 'click', () => {
    if (state.cookTimer) clearInterval(state.cookTimer);
    sendCommand({ cmd: 'stop' });
    state.stageIdx++;
    if (state.stageIdx >= state.recipe.stages.length) {
      showFinished();
    } else {
      state.ingredientIdx = 0;
      state.screen = 'cook';
      renderCookScreen();
    }
  });

  on('speed-slider', 'input', e => {
    const spd = parseInt(e.target.value);
    document.getElementById('speed-label').textContent = spd + '%';
    sendCommand({ cmd: 'setSpeed', speed: spd });
  });

  on('btn-new-recipe', 'click', () => {
    state.recipe = null;
    state.stageIdx = 0;
    state.screen = 'recipes';
    render();
  });
}

function on(id, event, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, fn);
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function toast(msg, err = false) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = 'toast ' + (err ? 'toast-err' : 'toast-ok');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = 'toast'; }, 3000);
}

function showLoader(msg = 'Loading…') {
  let el = document.getElementById('loader');
  if (!el) { el = document.createElement('div'); el.id = 'loader'; document.body.appendChild(el); }
  el.textContent = msg;
  el.className = 'loader show';
}

function hideLoader() {
  const el = document.getElementById('loader');
  if (el) el.className = 'loader';
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

render();
