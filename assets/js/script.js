console.log("Script loaded - version 1.0");

// ========== SYSTEM TŁUMACZEŃ ==========
let currentLanguage = 'pl'; // 'pl' lub 'en'
let translations = {};

// Ładowanie tłumaczeń z pliku JSON
async function loadTranslations(lang) {
  try {
    const response = await fetch(`assets/lang/${lang}.json`);
    translations = await response.json();
    applyTranslations();
  } catch (error) {
    console.error('Błąd ładowania tłumaczeń:', error);
    // Fallback - próbuj załadować angielski
    if (lang !== 'en') {
      try {
        const response = await fetch(`assets/lang/en.json`);
        translations = await response.json();
        applyTranslations();
      } catch (e) {
        console.error('Nie można załadować żadnych tłumaczeń');
      }
    }
  }
}

// Aplikowanie tłumaczeń do wszystkich elementów z data-i18n
function applyTranslations() {
  // Tłumaczenie elementów HTML z atrybutem data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const keys = element.getAttribute('data-i18n').split('.');
    let value = translations;
    
    for (const key of keys) {
      if (value && value[key]) {
        value = value[key];
      } else {
        value = null;
        break;
      }
    }
    
    if (value && typeof value === 'string') {
      // Sprawdź czy element ma HTML (np. <br>)
      if (value.includes('<br>')) {
        element.innerHTML = value;
      } else {
        element.textContent = value;
      }
    }
  });
  
  // Aktualizacja napisów w wynikach (dla starego kodu)
  if (translations.status) {
    // Nic nie robimy tutaj - updateStatus() będzie używać tłumaczeń
  }
}

// Przełączanie języka
function toggleLanguage(event) {
  if (event) event.preventDefault();
  
  playSound('click');
  
  const langIcon = document.getElementById('langIcon');
  
  if (currentLanguage === 'pl') {
    currentLanguage = 'en';
    langIcon.style.backgroundImage = "url('assets/images/en.png')";
    loadTranslations('en');
  } else {
    currentLanguage = 'pl';
    langIcon.style.backgroundImage = "url('assets/images/pl.png')";
    loadTranslations('pl');
  }
  
  // Zapisz wybór języka do localStorage
  try {
    localStorage.setItem('hf_intercept_language', currentLanguage);
  } catch (e) {}
    
  return false;
}

// ========== DŹWIĘKI ==========
const sounds = {};
const soundFiles = {
  clear: 'assets/sounds/clear.wav',
  click: 'assets/sounds/click.wav', 
  error: 'assets/sounds/error.wav',
  success: 'assets/sounds/success.wav',
  tick: 'assets/sounds/tick.wav'
};

function loadSounds() {
  for (const [name, url] of Object.entries(soundFiles)) {
    sounds[name] = new Audio(url);
    sounds[name].load();
  }
}

function playSound(soundName) {
  if (!sounds[soundName]) return;
  try {
    const sound = sounds[soundName];
    sound.currentTime = 0;
    sound.play().catch(e => {});
  } catch (e) {}
}

window.addEventListener('DOMContentLoaded', function() {
  loadSounds();
  
  // Ładujemy domyślny język z localStorage
  try {
    const savedLang = localStorage.getItem('hf_intercept_language');
    if (savedLang && (savedLang === 'pl' || savedLang === 'en')) {
      currentLanguage = savedLang;
      const langIcon = document.getElementById('langIcon');
      langIcon.style.backgroundImage = `url('assets/images/${currentLanguage}.png')`;
    }
  } catch (e) {}
  
  // Ładujemy tłumaczenia
  loadTranslations(currentLanguage);
  
  // INICJALIZACJA DŹWIĘKU NA STARCIE
  setTimeout(() => {
    try {
      const initSound = new Audio('assets/sounds/tick.wav');
      initSound.volume = 0.01;
      initSound.play().catch(() => {});
      setTimeout(() => { initSound.pause(); }, 100);
    } catch(e) {}
  }, 300);
});

// ========== STAN APLIKACJI ==========
let showMissileHighlights = false; // Czy pokazywać podświetlenia rakiet
let computeButtonState = 'off'; // Stan przycisku COMPUTE: 'off', 'temporary', 'on'
let selectedMissileKey = null; // Wybrana rakieta

// ========== RESET APP STATE ==========
function resetAppState() {
  // Wyłącz podświetlenia rakiet
  showMissileHighlights = false;
  document.querySelectorAll(".missile-item").forEach(item => {
    item.classList.remove("highlight-compatible");
    item.classList.remove("active");
  });
  
  // Resetuj wybór rakiety
  selectedMissileKey = null;
  document.getElementById("rakieta").value = "";
  
  // Wyłącz przycisk COMPUTE
  document.querySelector('.key-wide').classList.remove('confirmed');
  
  // Zresetuj status do białego napisu
  updateStatus("status.enterData", "neutral");
  
  // Wyłącz menu rakiet
  const missileMenu = document.getElementById('missileMenu');
  if (missileMenu) {
    missileMenu.classList.add('disabled');
    missileMenu.classList.remove('enabled');
  }
}

// ========== MISSILE CONFIGURATION ==========
const missiles = {
  "Kh15": { 
    speed: 900, 
    range: 1600, 
    arming: 100, 
    guidance: "Pośrednie naprowadzanie", 
    guidanceEN: "WAYPOINT GUIDANCE",
    fuse: "Zapalnik zbliżeniowy", 
    fuseEN: "PROXIMITY FUSE",
    warhead: "Burząca", 
    warheadEN: "HIGH-EXPLOSIVE",
    armingText: "100 km od startu", 
    context: "Ataki strategiczne na cele naziemne i okręty", 
    name: "KH-15 CRUISE MISSILE" 
  },
  "Kh15N": { 
    speed: 900, 
    range: 1600, 
    arming: 100, 
    guidance: "Pośrednie naprowadzanie", 
    guidanceEN: "WAYPOINT GUIDANCE",
    fuse: "Zapalnik zbliżeniowy", 
    fuseEN: "PROXIMITY FUSE",
    warhead: "Jądrowa", 
    warheadEN: "NUCLEAR",
    armingText: "100 km od startu", 
    context: "Broń strategiczna, niszczenie miast i flot", 
    name: "KH-15N NUCLEAR CRUISE MISSILE" 
  },
  "Kh15P": { 
    speed: 900, 
    range: 1600, 
    arming: 100, 
    guidance: "Pośrednie naprowadzanie", 
    guidanceEN: "WAYPOINT GUIDANCE",
    fuse: "Zapalnik zbliżeniowy", 
    fuseEN: "PROXIMITY FUSE",
    warhead: "Przeciwradiacyjna", 
    warheadEN: "ANTI-RADIATION",
    armingText: "100 km od startu", 
    context: "Neutralizacja radarów i systemów obrony", 
    name: "KH-15P ANTI-RADIATION MISSILE" 
  },
  "Kh22": { 
    speed: 1200, 
    range: 2500, 
    arming: 100, 
    guidance: "Pośrednie naprowadzanie", 
    guidanceEN: "WAYPOINT GUIDANCE",
    fuse: "Zapalnik zbliżeniowy", 
    fuseEN: "PROXIMITY FUSE",
    warhead: "Burząca", 
    warheadEN: "HIGH-EXPLOSIVE",
    armingText: "100 km od startu", 
    context: "Ataki dalekiego zasięgu na flotę i cele strategiczne", 
    name: "KH-22 CRUISE MISSILE" 
  },
  "Kh22N": { 
    speed: 1200, 
    range: 2500, 
    arming: 100, 
    guidance: "Pośrednie naprowadzanie", 
    guidanceEN: "WAYPOINT GUIDANCE",
    fuse: "Zapalnik zbliżeniowy", 
    fuseEN: "PROXIMITY FUSE",
    warhead: "Jądrowa", 
    warheadEN: "NUCLEAR",
    armingText: "100 km od startu", 
    context: "Broń strategiczna, niszczenie dużych obszarów", 
    name: "KH-22N NUCLEAR CRUISE MISSILE" 
  },
  "A100": { 
    speed: 4000, 
    range: 400, 
    arming: 0, 
    guidance: "Bezpośrednie naprowadzanie", 
    guidanceEN: "DIRECT GUIDANCE",
    fuse: "Zapalnik zbliżeniowy", 
    fuseEN: "PROXIMITY FUSE",
    warhead: "Odłamkowa", 
    warheadEN: "FRAGMENTATION",
    armingText: "Natychmiastowa gotowość", 
    context: "Obrona przeciwlotnicza, zwalczanie samolotów i rakiet", 
    name: "A-100 TACTICAL MISSILE" 
  },
  "A100N": { 
    speed: 4000, 
    range: 400, 
    arming: 0, 
    guidance: "Bezpośrednie naprowadzanie", 
    guidanceEN: "DIRECT GUIDANCE",
    fuse: "Zapalnik zbliżeniowy", 
    fuseEN: "PROXIMITY FUSE",
    warhead: "Jądrowa", 
    warheadEN: "NUCLEAR",
    armingText: "Natychmiastowa gotowość", 
    context: "Szybkie uderzenia nuklearne", 
    name: "A-100N NUCLEAR MISSILE" 
  },
  "R9": { 
    speed: 5000, 
    range: 200, 
    arming: 0, 
    guidance: "Bezpośrednie naprowadzanie", 
    guidanceEN: "DIRECT GUIDANCE",
    fuse: "Zapalnik zbliżeniowy", 
    fuseEN: "PROXIMITY FUSE",
    warhead: "Odłamkowa", 
    warheadEN: "FRAGMENTATION",
    armingText: "Natychmiastowa gotowość", 
    context: "Obrona baz i flot przed pociskami i samolotami", 
    name: "R-9 SPRINT POINT DEFENSE" 
  },
  "R3": { 
    speed: 8280, 
    range: 2000, 
    arming: 0, 
    guidance: "Naprowadzanie inercyjne", 
    guidanceEN: "INERTIAL GUIDANCE",
    fuse: "Zapalnik uderzeniowy", 
    fuseEN: "IMPACT FUSE",
    warhead: "Burząca", 
    warheadEN: "HIGH-EXPLOSIVE",
    armingText: "Brak korekt w locie", 
    context: "Ataki balistyczne na cele stacjonarne", 
    name: "R-3 BALLISTIC MISSILE" 
  },
  "R3N": { 
    speed: 8280, 
    range: 2000, 
    arming: 0, 
    guidance: "Naprowadzanie inercyjne", 
    guidanceEN: "INERTIAL GUIDANCE",
    fuse: "Zapalnik uderzeniowy", 
    fuseEN: "IMPACT FUSE",
    warhead: "Jądrowa", 
    warheadEN: "NUCLEAR",
    armingText: "Brak korekt w locie", 
    context: "Strategiczne uderzenia nuklearne", 
    name: "R-3N NUCLEAR BALLISTIC MISSILE" 
  },
  "R5": { 
    speed: 2000, 
    range: 30, 
    arming: 0, 
    guidance: "Naprowadzanie na podczerwień", 
    guidanceEN: "HEAT-SEEKING",
    fuse: "Zapalnik zbliżeniowy", 
    fuseEN: "PROXIMITY FUSE",
    warhead: "Odłamkowa", 
    warheadEN: "FRAGMENTATION",
    armingText: "Natychmiastowa gotowość", 
    context: "Walka powietrzna w zasięgu wzroku", 
    name: "R-5 ZENITH AIR-TO-AIR" 
  },
  "K13": { 
    speed: 2000, 
    range: 30, 
    arming: 0, 
    guidance: "Naprowadzanie na podczerwień", 
    guidanceEN: "HEAT-SEEKING",
    fuse: "Zapalnik zbliżeniowy", 
    fuseEN: "PROXIMITY FUSE",
    warhead: "Odłamkowa", 
    warheadEN: "FRAGMENTATION",
    armingText: "Natychmiastowa gotowość", 
    context: "Walka powietrzna, zwalczanie celów powietrznych", 
    name: "K-13 AIR-TO-AIR MISSILE" 
  },
  "S13": { 
    speed: 1500, 
    range: 20, 
    arming: 0, 
    guidance: "Brak naprowadzania", 
    guidanceEN: "UNGUIDED",
    fuse: "Zapalnik uderzeniowy", 
    fuseEN: "IMPACT FUSE",
    warhead: "Burząca", 
    warheadEN: "HIGH-EXPLOSIVE",
    armingText: "Prosta balistyka", 
    context: "Ataki naziemne, ostrzał obszarowy", 
    name: "S-13 UNGUIDED ROCKET" 
  },
  "FAB100": { 
    speed: 0, 
    range: 5, 
    arming: 0, 
    guidance: "Brak naprowadzania", 
    guidanceEN: "UNGUIDED",
    fuse: "Zapalnik uderzeniowy", 
    fuseEN: "IMPACT FUSE",
    warhead: "Burząca", 
    warheadEN: "HIGH-EXPLOSIVE",
    armingText: "Swobodny spadek", 
    context: "Naloty bombowe na cele naziemne", 
    name: "FAB-100 BOMB" 
  },
  "FAB250": { 
    speed: 0, 
    range: 5, 
    arming: 0, 
    guidance: "Brak naprowadzania", 
    guidanceEN: "UNGUIDED",
    fuse: "Zapalnik uderzeniowy", 
    fuseEN: "IMPACT FUSE",
    warhead: "Burząca", 
    warheadEN: "HIGH-EXPLOSIVE",
    armingText: "Swobodny spadek", 
    context: "Naloty bombowe na cele naziemne", 
    name: "FAB-250 BOMB" 
  }
};

// ========== FUNKCJA SPRAWDZAJĄCA CZY RAKIETA DOGONI CEL ==========
function canIntercept(missile, Sx, Sy, Tx, Ty, vT, kursDeg) {
  if (vT === 0) {
    const distance = Math.hypot(Tx - Sx, Ty - Sy);
    return distance <= missile.range;
  }

  const kursRad = kursDeg * Math.PI / 180;
  const vx = vT * Math.sin(kursRad);
  const vy = -vT * Math.cos(kursRad);

  const rx = Tx - Sx;
  const ry = Ty - Sy;

  const a = vx * vx + vy * vy - missile.speed * missile.speed;
  const b = 2 * (rx * vx + ry * vy);
  const c = rx * rx + ry * ry;

  const d = b * b - 4 * a * c;
  if (d < 0) return false;

  const sqrtD = Math.sqrt(d);
  const t1 = (-b - sqrtD) / (2 * a);
  const t2 = (-b + sqrtD) / (2 * a);
  const ts = [t1, t2].filter(t => t >= 0);

  if (ts.length === 0) return false;

  const t = Math.min(...ts);
  const Px = Tx + vx * t;
  const Py = Ty + vy * t;

  const distToImpact = Math.hypot(Px - Sx, Py - Sy);
  return distToImpact <= missile.range;
}

// ========== COORDINATES MAP ==========
function drawMap() {
  const mapContainer = document.getElementById('mapContainer');
  const canvas = document.getElementById('coordMap');
  const ctx = canvas.getContext('2d');
  
  canvas.width = mapContainer.clientWidth;
  canvas.height = mapContainer.clientHeight;
  
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);
  
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 0.5;
  
  for (let x = 0; x <= 3000; x += 500) {
    const px = (x / 3000) * width;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, height);
    ctx.stroke();
  }
  
  for (let y = 0; y <= 2000; y += 500) {
    const py = (y / 2000) * height;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(width, py);
    ctx.stroke();
  }
  
  const sx = +document.getElementById("sx").value || 0;
  const sy = +document.getElementById("sy").value || 0;
  const tx = +document.getElementById("tx").value || 0;
  const ty = +document.getElementById("ty").value || 0;
  const markerText = document.getElementById("marker").textContent;
  
  function gameToPixel(x, y) {
    const px = (x / 3000) * width;
    const py = (y / 2000) * height;
    return { x: px, y: py };
  }
  
  if (sx > 0 || sy > 0) {
    const ourPos = gameToPixel(sx, sy);
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(ourPos.x, ourPos.y, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  
  if (tx > 0 || ty > 0) {
    const targetPos = gameToPixel(tx, ty);
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(targetPos.x, targetPos.y, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  
  let markerOutOfBounds = false;
  if (markerText !== "---, --- km") {
    const parts = markerText.split(",");
    if (parts.length === 2) {
      const markerX = parseInt(parts[0].trim());
      const markerY = parseInt(parts[1].replace(/[^0-9]/g, ''));
      
      if (!isNaN(markerX) && !isNaN(markerY)) {
        if (markerX < 0 || markerX > 3000 || markerY < 0 || markerY > 2000) {
          markerOutOfBounds = true;
        }
        
        const markerPos = gameToPixel(markerX, markerY);
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(markerPos.x, markerPos.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  const mainHeader = document.getElementById('mainHeader');
  const mapWarning = document.getElementById('mapWarning');
  
  if (markerOutOfBounds) {
    mapContainer.classList.add('warning');
    mainHeader.classList.add('warning');
    
    // Tłumaczenie tytułu dla ostrzeżenia
    const warningTitle = translations.app?.titleFull || "IMPACT OUT OF MAP";
    mainHeader.querySelector('h1').innerHTML = warningTitle.split(" ").join("<br>");
    mapWarning.classList.add('show');
  } else {
    mapContainer.classList.remove('warning');
    mainHeader.classList.remove('warning');
    
    // Normalny tytuł
    const normalTitle = translations.app?.title || "HF-INTERCEPT COMP";
    mainHeader.querySelector('h1').innerHTML = normalTitle;
    mapWarning.classList.remove('show');
  }
}

// ========== MAP MOUSE COORDINATES ==========
let mapMouseMoveTimer = null;
let lastMouseX = 0;
let lastMouseY = 0;

document.getElementById('coordMap').addEventListener('mousemove', function(event) {
  const rect = this.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  let gameX = Math.round((x / rect.width) * 3000);
  let gameY = Math.round((y / rect.height) * 2000);
  
  if (gameX < 0) gameX = 0;
  if (gameX > 3000) gameX = 3000;
  if (gameY < 0) gameY = 0;
  if (gameY > 2000) gameY = 2000;
  
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
  
  if (mapMouseMoveTimer) clearTimeout(mapMouseMoveTimer);
  
  mapMouseMoveTimer = setTimeout(() => {
    const coordsElement = document.getElementById('arrowCoords');
    const mouseX = event.clientX; // Pozycja w całym oknie
    const mouseY = event.clientY;
    
    // Pozycja myszki WZGLĘDEM MAPY
    const mouseInMapX = event.clientX - rect.left;
    const mouseInMapY = event.clientY - rect.top;
    const mapWidth = rect.width;
    const mapHeight = rect.height;
    
    // USTAWIENIE POZIOME - względem mapy
    let leftPosition;
    if (mouseInMapX > mapWidth - 61) {
      // Blisko prawej krawędzi MAPY - pokaż po LEWEJ stronie myszki
      leftPosition = (mouseX - 60) + 'px';
    } else {
      // Normalnie - pokaż po PRAWEJ stronie myszki
      leftPosition = (mouseX + 10) + 'px';
    }
    
    // USTAWIENIE PIONOWE
    let topPosition;
    if (mouseY + 68 > window.innerHeight) {
      // Blisko dolnej krawędzi OKNA - pokaż NAD myszką
      topPosition = (mouseY - 45) + 'px';
    } else {
      // Normalnie - pokaż POD myszką
      topPosition = (mouseY + 5) + 'px';
    }
    
    coordsElement.innerHTML = `
      <div class="coord-line">X: ${gameX}</div>
      <div class="coord-line">Y: ${gameY}</div>
    `;
    coordsElement.style.left = leftPosition;
    coordsElement.style.top = topPosition;
    coordsElement.style.display = 'block';
  }, 10);
});

document.getElementById('coordMap').addEventListener('mouseleave', function() {
  if (mapMouseMoveTimer) clearTimeout(mapMouseMoveTimer);
  document.getElementById('arrowCoords').style.display = 'none';
});

// ========== CUSTOM MISSILE MENU HANDLING ==========
function checkMissileCompatibilityOnHover(missileKey) {
  const Sx = +document.getElementById("sx").value || 0;
  const Sy = +document.getElementById("sy").value || 0;
  const Tx = +document.getElementById("tx").value || 0;
  const Ty = +document.getElementById("ty").value || 0;
  const vT = +document.getElementById("vt").value || 0;
  const kursDeg = +document.getElementById("kurs").value || 0;
  
  if (Sx === 0 && Sy === 0 && Tx === 0 && Ty === 0) return "neutral";
  
  const missile = missiles[missileKey];
  if (!missile) return "neutral";
  
  const distance = Math.hypot(Tx - Sx, Ty - Sy);
  
  if (distance > missile.range) return "incompatible";
  if (missile.arming > 0 && distance < missile.arming) return "incompatible";
  if (!canIntercept(missile, Sx, Sy, Tx, Ty, vT, kursDeg)) return "incompatible";
  
  return "compatible";
}

let missileTooltipTimer = null;

function selectMissile(key) {
  const missileItems = document.querySelectorAll(".missile-item");
  const rocketSelect = document.getElementById("rakieta");
  
  // Sprawdź czy ta sama rakieta jest już wybrana (toggle)
  if (selectedMissileKey === key) {
    // Odznacz - rezygnuj z wyboru
    const selectedItem = document.querySelector(`.missile-item[data-key="${key}"]`);
    if (selectedItem) selectedItem.classList.remove("active");
    
    rocketSelect.value = "";
    selectedMissileKey = null;
  } else {
    // Zaznacz nową rakietę
    missileItems.forEach(item => item.classList.remove("active"));
    
    const selectedItem = document.querySelector(`.missile-item[data-key="${key}"]`);
    if (selectedItem) selectedItem.classList.add("active");
    
    rocketSelect.value = key;
    selectedMissileKey = key;
  }
  
  // RESET po zmianie rakiety
  document.querySelector('.key-wide').classList.remove('confirmed'); // COMPUTE OFF
  updateStatus("status.enterData", "neutral"); // Biały napis
  
  checkMissileCompatibility();
  saveToLocalStorage();
}

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", function() {
  // USTAWIENIE STANU POCZĄTKOWEGO
  document.querySelector('.key-wide').classList.remove('confirmed'); // COMPUTE OFF
  updateStatus("status.enterData", "neutral");
  selectedMissileKey = null;
  showMissileHighlights = false;
  
  const missileItems = document.querySelectorAll(".missile-item");
  
  missileItems.forEach(item => {
    item.addEventListener("mouseover", function(event) {
      const missileKey = this.dataset.key;
      
      if (missileTooltipTimer) clearTimeout(missileTooltipTimer);
      
      missileTooltipTimer = setTimeout(() => {
        const missile = missiles[missileKey];
        if (missile) {
          document.getElementById("tooltipName").textContent = missile.name;
          document.getElementById("tooltipGuidance").textContent = missile.guidanceEN + " | " + missile.guidance;
          document.getElementById("tooltipFuse").textContent = missile.fuseEN + " | " + missile.fuse;
          document.getElementById("tooltipWarhead").textContent = missile.warheadEN + " | " + missile.warhead;
          document.getElementById("tooltipSpeed").textContent = missile.speed + " km/h";
          document.getElementById("tooltipArming").textContent = missile.armingText;
          document.getElementById("tooltipContext").textContent = missile.context;
          
          const tooltip = document.getElementById("missileTooltip");
          tooltip.style.left = (event.clientX + 10) + "px";
          tooltip.style.top = (event.clientY + 10) + "px";
          tooltip.classList.add("show");
        }
      }, 600);
    });
    
    item.addEventListener("mouseout", function() {
      if (missileTooltipTimer) {
        clearTimeout(missileTooltipTimer);
        missileTooltipTimer = null;
      }
      document.getElementById("missileTooltip").classList.remove("show");
    });
    
    item.addEventListener("click", function() {
      const missileKey = this.dataset.key;
      selectMissile(missileKey);
    });
  });
  
  // NIE wybieraj rakiety automatycznie na starcie
  // if (missileItems.length > 0) selectMissile(missileItems[0].dataset.key);
  
  loadFromLocalStorage();
  
  setTimeout(() => { drawMap(); }, 100);
  
  window.addEventListener('resize', function() { drawMap(); });
  
  // KÓŁKO MYSZY - dodanie event listenera przy inicjalizacji
  document.querySelectorAll(".input-field").forEach(field => {
    field.addEventListener("wheel", function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      const fieldId = this.id;
      const isArrowUp = event.deltaY < 0;
      const delta = isArrowUp ? 10 : -10;
      
      playSound('tick');
      adjustFieldOnce(fieldId, delta);
    });
  });
});

// ========== COORDINATES VALIDATION ==========
function validateCoordinates(input) {
  playSound('tick');
  
  // Zresetuj cały stan aplikacji
  resetAppState();
  
  input.value = input.value.replace(/\D/g, '');
  
  if (input.value.length > 4) input.value = input.value.slice(0, 4);
  
  let val = parseInt(input.value) || 0;
  
  if (input.id === "sx" || input.id === "tx") {
    if (val > 3000) input.value = "3000";
    if (val < 0) input.value = "0";
  }
  
  if (input.id === "sy" || input.id === "ty") {
    if (val > 2000) input.value = "2000";
    if (val < 0) input.value = "0";
  }
  
  checkMissileCompatibility();
  saveToLocalStorage();
  drawMap();
}

// ========== DIGIT LIMITATION ==========
function limitDigits(input, maxDigits) {
  playSound('tick');
  
  // Zresetuj cały stan aplikacji
  resetAppState();
  
  input.value = input.value.replace(/\D/g, '');
  
  if (input.value.length > maxDigits) input.value = input.value.slice(0, maxDigits);
  
  if (input.id === "kurs") {
    let val = parseInt(input.value) || 0;
    if (val > 360) input.value = "360";
    if (val < 0) input.value = "0";
  }
  
  checkMissileCompatibility();
  saveToLocalStorage();
}

// ========== INPUT FIELD KEY HANDLING ==========
function handleKeyInput(event, fieldId) {
  if (event.key === "+" || event.key === "=" || event.key === "-" || event.key === "_") {
    playSound('tick');
  }
  
  if (event.key === "Escape") {
    event.preventDefault();
    if (activeField) {
      activeField.value = "";
      activeField.classList.remove("active");
      activeField = null;
    }
    checkMissileCompatibility();
    saveToLocalStorage();
    drawMap();
    return;
  }
  
  if (event.key === "+" || (event.shiftKey && event.key === "=")) {
    event.preventDefault();
    adjustFieldOnce(fieldId, (fieldId === "vt") ? 10 : 1);
  }
  
  if (event.key === "-" || event.key === "_") {
    event.preventDefault();
    adjustFieldOnce(fieldId, (fieldId === "vt") ? -10 : -1);
  }
  
  if (event.key === "ArrowUp") {
    event.preventDefault();
    playSound('tick');
    adjustFieldOnce(fieldId, (fieldId === "vt") ? 10 : 1);
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    playSound('tick');
    adjustFieldOnce(fieldId, (fieldId === "vt") ? -10 : -1);
  }
  
  if (event.key === "Enter") {
    event.preventDefault();
    const fields = ["sx", "sy", "tx", "ty", "vt", "kurs"];
    const currentIndex = fields.indexOf(fieldId);
    if (currentIndex < fields.length - 1) {
      document.getElementById(fields[currentIndex + 1]).focus();
    }
  }
  
  const allowedKeys = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
    "Tab", "Enter", "+", "-", "=", "_", "Escape"
  ];
  
  if (!allowedKeys.includes(event.key) && 
      !(event.ctrlKey || event.metaKey) &&
      !(event.key === "a" && event.ctrlKey) &&
      !(event.key === "c" && event.ctrlKey) &&
      !(event.key === "v" && event.ctrlKey) &&
      !(event.key === "x" && event.ctrlKey)) {
    event.preventDefault();
  }
}

// ========== INPUT FIELD FOCUS MANAGEMENT ==========
let activeField = null;

document.querySelectorAll(".input-field").forEach(field => {
  field.addEventListener("focus", function() {
    if (activeField) activeField.classList.remove("active");
    activeField = this;
    this.classList.add("active");
    this.select();
  });
  
  field.addEventListener("input", function() {
    checkMissileCompatibility();
    saveToLocalStorage();
    if (this.id === "sx" || this.id === "sy" || this.id === "tx" || this.id === "ty") {
      drawMap();
    }
  });
});

// ========== RESULT TOOLTIPS ==========
const resultTooltipTimers = {};

function showResultTooltip(tooltipId, event) {
  if (resultTooltipTimers[tooltipId]) clearTimeout(resultTooltipTimers[tooltipId]);
  
  resultTooltipTimers[tooltipId] = setTimeout(() => {
    const tooltip = document.getElementById(tooltipId);
    tooltip.style.left = (event.clientX + 15) + "px";
    tooltip.style.top = (event.clientY + 15) + "px";
    tooltip.classList.add("show");
  }, 200);
}

function hideResultTooltip(tooltipId) {
  if (resultTooltipTimers[tooltipId]) {
    clearTimeout(resultTooltipTimers[tooltipId]);
    resultTooltipTimers[tooltipId] = null;
  }
  document.getElementById(tooltipId).classList.remove("show");
}

// ========== ARROW CONTROLS AUTO-SCROLL ==========
let arrowInterval = null;

function startArrow(fieldId, delta) {
  playSound('click');
  
  // Zresetuj cały stan aplikacji
  resetAppState();
  
  const field = document.getElementById(fieldId);
  updateArrowCoordinates(fieldId, parseInt(field.value) || 0);
  adjustFieldOnce(fieldId, delta);
  
  arrowInterval = setTimeout(() => {
    arrowInterval = setInterval(() => adjustFieldOnce(fieldId, delta), 50);
  }, 500);
}

function adjustFieldOnce(fieldId, delta) {
  playSound('tick');
  
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  let val = parseInt(field.value) || 0;
  val += delta;
  
  if ((fieldId === "sx" || fieldId === "tx")) {
    if (val < 0) val = 0;
    if (val > 3000) val = 3000;
  }
  
  if ((fieldId === "sy" || fieldId === "ty")) {
    if (val < 0) val = 0;
    if (val > 2000) val = 2000;
  }
  
  if (fieldId === "kurs") {
    if (val < 0) val = 360;
    if (val > 360) val = 0;
  }
  
  if (fieldId === "vt" && val < 0) val = 0;
  
  field.value = Math.round(val);
  updateArrowCoordinates(fieldId, val);
  
  if (activeField) activeField.classList.remove("active");
  activeField = field;
  field.classList.add("active");
  
  checkMissileCompatibility();
  saveToLocalStorage();
  if (fieldId === "sx" || fieldId === "sy" || fieldId === "tx" || fieldId === "ty") {
    drawMap();
  }
}

function stopArrow() {
  if (arrowInterval) {
    clearTimeout(arrowInterval);
    clearInterval(arrowInterval);
    arrowInterval = null;
  }
  hideArrowCoordinates();
}

// ========== NUMERIC KEYBOARD FUNCTIONS ==========
function press(val) {
  playSound('click');
  
  // Zresetuj cały stan aplikacji
  resetAppState();
  
  if (!activeField) return;
  activeField.value += val;
  
  if (activeField.id === "sx" || activeField.id === "sy" || 
      activeField.id === "tx" || activeField.id === "ty") {
    validateCoordinates(activeField);
  } else if (activeField.id === "kurs") {
    limitDigits(activeField, 3);
  } else if (activeField.id === "vt") {
    limitDigits(activeField, 4);
  }
  
  checkMissileCompatibility();
  saveToLocalStorage();
}

// ========== CLEAR FIELD ==========
function clearField() {
  // Jeśli nie ma aktywnego pola - błąd
  if (!activeField) {
    setTimeout(() => {
      playSound('error');
    }, 300);
    return;
  }
  
  // Odtwórz dźwięk clear po 0.3s
  setTimeout(() => {
    playSound('clear');
    activeField.value = "";
    
    // Zresetuj cały stan aplikacji
    resetAppState();
    
    checkMissileCompatibility();
    saveToLocalStorage();
    drawMap();
  }, 300);
}

// ========== CLEAR ALL FIELDS ==========
function clearAllFields() {
  // Odtwórz dźwięk clear po 0.3s
  setTimeout(() => {
    playSound('clear');
    
    const fields = ["sx", "sy", "tx", "ty", "vt", "kurs"];
    fields.forEach(id => {
      const field = document.getElementById(id);
      if (field) field.value = "";
    });
    
    if (activeField) {
      activeField.classList.remove("active");
      activeField = null;
    }
    
    // Zresetuj cały stan aplikacji
    resetAppState();
    
    document.getElementById("marker").textContent = "---, --- km";
    document.getElementById("distance").textContent = "--- km";
    document.getElementById("bearing").textContent = "---°";
    document.getElementById("timeToImpact").textContent = "00:00:00";
    
    saveToLocalStorage();
    drawMap();
  }, 300);
}

// ========== LOCALSTORAGE ==========
function saveToLocalStorage() {
  const data = {
    sx: document.getElementById("sx").value,
    sy: document.getElementById("sy").value,
    tx: document.getElementById("tx").value,
    ty: document.getElementById("ty").value,
    vt: document.getElementById("vt").value,
    kurs: document.getElementById("kurs").value,
    missile: document.getElementById("rakieta").value,
    timestamp: new Date().getTime()
  };
  
  try {
    localStorage.setItem("hf_intercept_data", JSON.stringify(data));
  } catch (e) {
    console.log("Błąd zapisu do localStorage:", e);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem("hf_intercept_data");
    if (!saved) return;
    
    const data = JSON.parse(saved);
    
    if (data.sx) document.getElementById("sx").value = data.sx;
    if (data.sy) document.getElementById("sy").value = data.sy;
    if (data.tx) document.getElementById("tx").value = data.tx;
    if (data.ty) document.getElementById("ty").value = data.ty;
    if (data.vt) document.getElementById("vt").value = data.vt;
    if (data.kurs) document.getElementById("kurs").value = data.kurs;
    
    if (data.missile && missiles[data.missile]) {
      selectMissile(data.missile);
    }
    
    setTimeout(() => {
      checkMissileCompatibility();
      drawMap();
    }, 100);
    
  } catch (e) {
    console.log("Błąd odczytu z localStorage:", e);
  }
}

// ========== MISSILE COMPATIBILITY CHECK ==========
function checkMissileCompatibility() {
  const Sx = +document.getElementById("sx").value || 0;
  const Sy = +document.getElementById("sy").value || 0;
  const Tx = +document.getElementById("tx").value || 0;
  const Ty = +document.getElementById("ty").value || 0;
  const vT = +document.getElementById("vt").value || 0;
  const kursDeg = +document.getElementById("kurs").value || 0;
  
  const missileKey = selectedMissileKey || document.getElementById("rakieta").value;
  
  // Sprawdź czy wszystkie 6 pól są wypełnione
  const allFilled = Sx !== 0 && Sy !== 0 && Tx !== 0 && Ty !== 0 && vT !== 0 && kursDeg !== 0;
  
  if (!allFilled) {
    // Jeśli nie wszystkie pola wypełnione - biały napis
    updateStatus("status.enterData", "neutral");
    return;
  }
  
  // Jeśli wszystkie pola wypełnione ale brak rakiety - biały napis
  if (!missileKey || !missiles[missileKey]) {
    updateStatus("status.enterData", "neutral");
    return;
  }
  
  // Tutaj tylko sprawdzamy ale NIE pokazujemy statusów kolorowych
  // Statusy kolorowe pokazują się tylko po kliknięciu COMPUTE z rakietą
  const missile = missiles[missileKey];
  const distance = Math.hypot(Tx - Sx, Ty - Sy);
  
  if (distance > missile.range) {
    return; // Nie pokazuj statusu - pokaże się po COMPUTE
  }
  
  if (missile.arming > 0 && distance < missile.arming) {
    return; // Nie pokazuj statusu - pokaże się po COMPUTE
  }
  
  if (!canIntercept(missile, Sx, Sy, Tx, Ty, vT, kursDeg)) {
    return; // Nie pokazuj statusu - pokaże się po COMPUTE
  }
  
  // Wszystko OK ale też nie pokazuj - pokaże się po COMPUTE
}

// ========== STATUS UPDATE ==========
function updateStatus(translationKey, type) {
  const statusText = document.getElementById("statusText");
  const statusIcon = document.getElementById("statusIcon");
  
  // Pobierz przetłumaczony tekst
  let message;
  if (translationKey.startsWith("status.")) {
    const keys = translationKey.split('.');
    let value = translations;
    for (const key of keys) {
      if (value && value[key]) {
        value = value[key];
      } else {
        value = null;
        break;
      }
    }
    message = value || translationKey;
  } else {
    message = translationKey;
  }
  
  // Dodaj nazwę rakiety dla statusu "APPROVED"
  if (translationKey === "status.approved" && selectedMissileKey) {
    const missile = missiles[selectedMissileKey];
    if (missile) {
      const missileShortName = missile.name.split(" ")[0];
      message = `${missileShortName} ${message}`;
    }
  }
  
  statusText.textContent = message;
  statusText.classList.remove("status-valid");
  
  switch(type) {
    case "success":
      statusIcon.textContent = "";
      statusText.classList.add("status-valid");
      statusText.style.color = statusIcon.style.color = "var(--success)";
      break;
    case "error":
      statusIcon.textContent = "";
      statusText.style.color = statusIcon.style.color = "#ff4444";
      break;
    case "warning":
      statusIcon.textContent = "";
      statusText.style.color = statusIcon.style.color = "var(--warning)";
      break;
    default:
      statusIcon.textContent = "";
      statusText.style.color = statusIcon.style.color = "var(--text-dim)";
  }
}

// ========== HIGHLIGHT COMPATIBLE MISSILES ==========
function highlightCompatibleMissiles() {
  const missileItems = document.querySelectorAll(".missile-item");
  const Sx = +document.getElementById("sx").value || 0;
  const Sy = +document.getElementById("sy").value || 0;
  const Tx = +document.getElementById("tx").value || 0;
  const Ty = +document.getElementById("ty").value || 0;
  const vT = +document.getElementById("vt").value || 0;
  const kursDeg = +document.getElementById("kurs").value || 0;
  
  if (Sx === 0 && Sy === 0 && Tx === 0 && Ty === 0) return;
  
  missileItems.forEach(item => {
    const missileKey = item.dataset.key;
    const missile = missiles[missileKey];
    if (!missile) return;
    
    const distance = Math.hypot(Tx - Sx, Ty - Sy);
    const isCompatible = distance <= missile.range && 
                        (missile.arming === 0 || distance >= missile.arming) &&
                        canIntercept(missile, Sx, Sy, Tx, Ty, vT, kursDeg);
    
    item.classList.remove("highlight-compatible");
    if (isCompatible && showMissileHighlights) {
      item.classList.add("highlight-compatible");
    }
  });
}

// ========== MAIN CALCULATIONS ==========
function calculateTarget() {
  playSound('click'); // Natychmiastowy dźwięk click
  
  const Sx = +document.getElementById("sx").value || 0;
  const Sy = +document.getElementById("sy").value || 0;
  const Tx = +document.getElementById("tx").value || 0;
  const Ty = +document.getElementById("ty").value || 0;
  const vT = +document.getElementById("vt").value || 0;
  const kursDeg = +document.getElementById("kurs").value || 0;

  // Sprawdź czy wszystkie 6 pól są wypełnione
  const allFilled = Sx !== 0 && Sy !== 0 && Tx !== 0 && Ty !== 0 && vT !== 0 && kursDeg !== 0;
  
  if (!allFilled) {
    // Jeśli nie wszystkie pola wypełnione - ERROR po 0.3s
    setTimeout(() => {
      playSound('error');
    }, 300);
    document.querySelector('.key-wide').classList.remove('confirmed'); // COMPUTE OFF
    return;
  }
  
  const missileKey = selectedMissileKey || document.getElementById("rakieta").value;
  
  // SCENARIUSZ 1: Wszystkie pola wypełnione, ale brak wybranej rakiety
  if (!missileKey || !missiles[missileKey]) {
    // Pokazuj zielone rakiety, COMPUTE miga i gaśnie
    showMissileHighlights = true;
    highlightCompatibleMissiles();
    
    // AKTYWUJ menu rakiet
    const missileMenu = document.getElementById('missileMenu');
    if (missileMenu) {
      missileMenu.classList.remove('disabled');
      missileMenu.classList.add('enabled');
    }
    
    // COMPUTE: ON → OFF (miga na chwilę)
    document.querySelector('.key-wide').classList.add('confirmed');
    setTimeout(() => {
      document.querySelector('.key-wide').classList.remove('confirmed');
    }, 300);
    
    // Napis pozostaje biały "ENTER TARGET DATA"
    updateStatus("status.enterData", "neutral");
    return;
  }
  
  // SCENARIUSZ 2: Wszystkie pola wypełnione + rakieta wybrana
  const missile = missiles[missileKey];
  
  // Obliczenia
  if (vT === 0) {
    const markerX = Tx;
    const markerY = Ty;
    const distToImpact = Math.hypot(Tx - Sx, Ty - Sy);
    const ux = markerX - Sx;
    const uy = Sy - markerY;
    let alpha = Math.atan2(uy, ux);
    let bearingDeg = (360 - (alpha * 180 / Math.PI) + 90) % 360;
    if (bearingDeg < 0) bearingDeg += 360;

    document.getElementById("marker").textContent = `${markerX.toFixed(0)}, ${markerY.toFixed(0)} km`;
    document.getElementById("distance").textContent = `${distToImpact.toFixed(0)} km`;
    document.getElementById("bearing").textContent = `${bearingDeg.toFixed(0)}°`;

    const timeSeconds = distToImpact / missile.speed * 3600;
    const hours = Math.floor(timeSeconds / 3600);
    const minutes = Math.floor((timeSeconds % 3600) / 60);
    const seconds = Math.floor(timeSeconds % 60);
    document.getElementById("timeToImpact").textContent = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Sprawdź czy rakieta pasuje
    const distance = Math.hypot(Tx - Sx, Ty - Sy);
    
    setTimeout(() => {
      if (distance > missile.range) {
        updateStatus("status.outOfRange", "error");
        playSound('error');
        document.querySelector('.key-wide').classList.remove('confirmed'); // COMPUTE OFF
      } else if (missile.arming > 0 && distance < missile.arming) {
        updateStatus("status.tooClose", "error");
        playSound('error');
        document.querySelector('.key-wide').classList.remove('confirmed'); // COMPUTE OFF
      } else {
        updateStatus("status.approved", "success");
        playSound('success');
        // COMPUTE pozostaje ON
        document.querySelector('.key-wide').classList.add('confirmed');
      }
    }, 300);
    
    saveToLocalStorage();
    drawMap();
    return;
  }

  // Obliczenia dla vT > 0
  const kursRad = kursDeg * Math.PI / 180;
  const vx = vT * Math.sin(kursRad);
  const vy = -vT * Math.cos(kursRad);

  const rx = Tx - Sx;
  const ry = Ty - Sy;

  const a = vx * vx + vy * vy - missile.speed * missile.speed;
  const b = 2 * (rx * vx + ry * vy);
  const c = rx * rx + ry * ry;

  const d = b * b - 4 * a * c;
  if (d < 0) {
    setTimeout(() => {
      updateStatus("status.kinematic", "error");
      playSound('error');
      document.querySelector('.key-wide').classList.remove('confirmed'); // COMPUTE OFF
    }, 300);
    document.getElementById("timeToImpact").textContent = "00:00:00";
    return;
  }

  const sqrtD = Math.sqrt(d);
  const t1 = (-b - sqrtD) / (2 * a);
  const t2 = (-b + sqrtD) / (2 * a);
  const ts = [t1, t2].filter(t => t >= 0);

  if (ts.length === 0) {
    setTimeout(() => {
      updateStatus("status.kinematic", "error");
      playSound('error');
      document.querySelector('.key-wide').classList.remove('confirmed'); // COMPUTE OFF
    }, 300);
    document.getElementById("timeToImpact").textContent = "00:00:00";
    return;
  }

  const t = Math.min(...ts);

  const Px = Tx + vx * t;
  const Py = Ty + vy * t;

  const distToImpact = Math.hypot(Px - Sx, Py - Sy);
  if (distToImpact > missile.range) {
    setTimeout(() => {
      updateStatus("status.outOfRange", "error");
      playSound('error');
      document.querySelector('.key-wide').classList.remove('confirmed'); // COMPUTE OFF
    }, 300);
    document.getElementById("timeToImpact").textContent = "00:00:00";
    return;
  }

  const markerX = Px;
  const markerY = Py;
  const markerDist = distToImpact;

  const ux = markerX - Sx;
  const uy = Sy - markerY;

  let alpha = Math.atan2(uy, ux);
  let bearingDeg = (360 - (alpha * 180 / Math.PI) + 90) % 360;
  if (bearingDeg < 0) bearingDeg += 360;

  document.getElementById("marker").textContent = `${markerX.toFixed(0)}, ${markerY.toFixed(0)} km`;
  document.getElementById("distance").textContent = `${markerDist.toFixed(0)} km`;
  document.getElementById("bearing").textContent = `${bearingDeg.toFixed(0)}°`;

  const timeSeconds = t * 3600;
  const hours = Math.floor(timeSeconds / 3600);
  const minutes = Math.floor((timeSeconds % 3600) / 60);
  const seconds = Math.floor(timeSeconds % 60);
  document.getElementById("timeToImpact").textContent = 
    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  setTimeout(() => {
    updateStatus("status.approved", "success");
    playSound('success');
    // COMPUTE pozostaje ON
    document.querySelector('.key-wide').classList.add('confirmed');
  }, 300);

  saveToLocalStorage();
  drawMap();
}

// Obsługa kółka myszy dla pól wprowadzania
document.querySelectorAll(".input-field").forEach(field => {
  field.addEventListener("wheel", function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const fieldId = this.id;
    const isArrowUp = event.deltaY < 0;
    const delta = isArrowUp ? 10 : -10;
    
    playSound('tick');
    adjustFieldOnce(fieldId, delta);
  });
});

// ========== ARROW COORDINATES UPDATE ==========
function updateArrowCoordinates(fieldId, currentValue) {
  const coordsElement = document.getElementById('arrowCoords');
  const xLine = coordsElement.querySelector('.coord-line:first-child');
  const yLine = coordsElement.querySelector('.coord-line:last-child');
  
  if (fieldId === 'sx' || fieldId === 'tx') {
    xLine.textContent = `X: ${currentValue}`;
  }
  
  if (fieldId === 'sy' || fieldId === 'ty') {
    yLine.textContent = `Y: ${currentValue}`;
  }
  
  coordsElement.style.display = 'block';
}

function hideArrowCoordinates() {
  document.getElementById('arrowCoords').style.display = 'none';
}

// ========== POMIAR WYMIARÓW ==========
function pokazWymiary() {
  const app = document.querySelector('.app-container');
  if (app) {
    document.getElementById('szerokosc').textContent = app.offsetWidth;
    document.getElementById('wysokosc').textContent = app.offsetHeight;
  }
}

window.addEventListener('load', pokazWymiary);
window.addEventListener('resize', pokazWymiary);
setTimeout(pokazWymiary, 1000);

// ========== ARROW BUTTON HOVER EFFECTS ==========
document.querySelectorAll('.arrow-btn').forEach(btn => {
  btn.addEventListener('mouseenter', function() {
    this.style.background = 'var(--accent)';
    this.style.color = '#000';
  });
  
  btn.addEventListener('mouseleave', function() {
    this.style.background = 'transparent';
    this.style.color = 'var(--arrow)';
  });
});