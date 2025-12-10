console.log("Script loaded - version 1.0");

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

// ========== COORDINATES MAP ==========
function drawMap() {
  const mapContainer = document.getElementById('mapContainer');
  const canvas = document.getElementById('coordMap');
  const ctx = canvas.getContext('2d');
  
  canvas.width = mapContainer.clientWidth;
  canvas.height = mapContainer.clientHeight;
  
  const width = canvas.width;
  const height = canvas.height;
  
  // Czyszczenie i tło mapy
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);
  
  // Linie siatki co 500 jednostek
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
  
  // Pobranie współrzędnych z pól
  const sx = +document.getElementById("sx").value || 0;
  const sy = +document.getElementById("sy").value || 0;
  const tx = +document.getElementById("tx").value || 0;
  const ty = +document.getElementById("ty").value || 0;
  const markerText = document.getElementById("marker").textContent;
  
  // Konwersja współrzędnych gry na piksele
  function gameToPixel(x, y) {
    const px = (x / 3000) * width;
    const py = (y / 2000) * height;
    return { x: px, y: py };
  }
  
  // Rysowanie pozycji własnej
  if (sx > 0 || sy > 0) {
    const ourPos = gameToPixel(sx, sy);
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(ourPos.x, ourPos.y, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('US', ourPos.x + 6, ourPos.y - 6);
  }
  
  // Rysowanie celu
  if (tx > 0 || ty > 0) {
    const targetPos = gameToPixel(tx, ty);
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(targetPos.x, targetPos.y, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('TGT', targetPos.x + 6, targetPos.y - 6);
  }
  
  // Rysowanie markera (punkt przewidywanego trafienia)
  let markerOutOfBounds = false;
  if (markerText !== "---, --- km") {
    const parts = markerText.split(",");
    if (parts.length === 2) {
      const markerX = parseInt(parts[0].trim());
      const markerY = parseInt(parts[1].replace("km", "").trim());
      
      if (!isNaN(markerX) && !isNaN(markerY)) {
        if (markerX < 0 || markerX > 3000 || markerY < 0 || markerY > 2000) {
          markerOutOfBounds = true;
        }
        
        const markerPos = gameToPixel(markerX, markerY);
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(markerPos.x, markerPos.y, 3.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('MARK', markerPos.x + 6, markerPos.y - 6);
      }
    }
  }
  
  // Ostrzeżenie jeśli marker poza mapą
  const mainHeader = document.getElementById('mainHeader');
  const mapWarning = document.getElementById('mapWarning');
  
  if (markerOutOfBounds) {
    mapContainer.classList.add('warning');
    mainHeader.classList.add('warning');
    mainHeader.querySelector('h1').innerHTML = 'IMPACT OUT<br>OF MAP';
    mapWarning.classList.add('show');
  } else {
    mapContainer.classList.remove('warning');
    mainHeader.classList.remove('warning');
    mainHeader.querySelector('h1').innerHTML = 'HF-INTERCEPT<br>COMPUTER';
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

// Ogranicz do zakresu mapy
if (gameX < 0) gameX = 0;
if (gameX > 3000) gameX = 3000;
if (gameY < 0) gameY = 0;
if (gameY > 2000) gameY = 2000;
  
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
  
  if (mapMouseMoveTimer) clearTimeout(mapMouseMoveTimer);
  
  mapMouseMoveTimer = setTimeout(() => {
    const coordsElement = document.getElementById('arrowCoords');
    coordsElement.innerHTML = `
      <div class="coord-line">X: ${gameX}</div>
      <div class="coord-line">Y: ${gameY}</div>
    `;
    coordsElement.style.left = (event.clientX + 10) + 'px';
    coordsElement.style.top = (event.clientY + 10) + 'px';
    coordsElement.style.display = 'block';
  }, 15); // małe opóźnienie żeby nie migało
});

document.getElementById('coordMap').addEventListener('mouseleave', function() {
  if (mapMouseMoveTimer) clearTimeout(mapMouseMoveTimer);
  document.getElementById('arrowCoords').style.display = 'none';
});

// ========== CUSTOM MISSILE MENU HANDLING ==========
// ========== MISSILE HOVER COMPATIBILITY CHECK ==========
function checkMissileCompatibilityOnHover(missileKey) {
  const Sx = +document.getElementById("sx").value || 0;
  const Sy = +document.getElementById("sy").value || 0;
  const Tx = +document.getElementById("tx").value || 0;
  const Ty = +document.getElementById("ty").value || 0;
  
  if (Sx === 0 && Sy === 0 && Tx === 0 && Ty === 0) {
    return "neutral";
  }
  
  const missile = missiles[missileKey];
  if (!missile) return "neutral";
  
  const distance = Math.hypot(Tx - Sx, Ty - Sy);
  
  if (distance > missile.range) {
    return "incompatible";
  }
  
  if (missile.arming > 0 && distance < missile.arming) {
    return "incompatible";
  }
  
  return "compatible";
}

let missileTooltipTimer = null;
let selectedMissileKey = null;

function selectMissile(key) {
  const missileItems = document.querySelectorAll(".missile-item");
  const rocketSelect = document.getElementById("rakieta");
  
  missileItems.forEach(item => {
    item.classList.remove("active");
  });
  
  const selectedItem = document.querySelector(`.missile-item[data-key="${key}"]`);
  if (selectedItem) {
    selectedItem.classList.add("active");
  }
  
  rocketSelect.value = key;
  selectedMissileKey = key;
  checkMissileCompatibility();
  saveToLocalStorage();
}

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", function() {
  const missileItems = document.querySelectorAll(".missile-item");
  
  missileItems.forEach(item => {
    item.addEventListener("mouseenter", function() {
      const missileKey = this.dataset.key;
      const compatibility = checkMissileCompatibilityOnHover(missileKey);
      
      this.classList.remove("compatible-border", "incompatible-border");
      
      if (compatibility === "compatible") {
        this.classList.add("compatible-border");
      } else if (compatibility === "incompatible") {
        this.classList.add("incompatible-border");
      }
    });
    
    item.addEventListener("mouseleave", function() {
      this.classList.remove("compatible-border", "incompatible-border");
    });
    
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
      }, 3000); // 3 sekundy opóźnienia
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
  
  if (missileItems.length > 0) {
    selectMissile(missileItems[0].dataset.key);
  }
  
  loadFromLocalStorage();
  
  setTimeout(() => {
    drawMap();
  }, 100);
  
  window.addEventListener('resize', function() {
    drawMap();
  });
});

// ========== COORDINATES VALIDATION (0-3000 X, 0-2000 Y) ==========
function validateCoordinates(input) {
  input.value = input.value.replace(/\D/g, '');
  
  if (input.value.length > 4) {
    input.value = input.value.slice(0, 4);
  }
  
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

// ========== DIGIT LIMITATION (for vt and kurs) ==========
function limitDigits(input, maxDigits) {
  input.value = input.value.replace(/\D/g, '');
  
  if (input.value.length > maxDigits) {
    input.value = input.value.slice(0, maxDigits);
  }
  
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
    adjustFieldOnce(fieldId, (fieldId === "vt") ? 10 : 1);
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
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
  if (resultTooltipTimers[tooltipId]) {
    clearTimeout(resultTooltipTimers[tooltipId]);
  }
  
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
  const field = document.getElementById(fieldId);
  updateArrowCoordinates(fieldId, parseInt(field.value) || 0);
  adjustFieldOnce(fieldId, delta);
  
  arrowInterval = setTimeout(() => {
    arrowInterval = setInterval(() => adjustFieldOnce(fieldId, delta), 50);
  }, 500);
}

function adjustFieldOnce(fieldId, delta) {
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

// ========== CLEAR FIELD (clears only active field) ==========
function clearField() {
  if (!activeField) return;
  activeField.value = "";
  checkMissileCompatibility();
  saveToLocalStorage();
  drawMap();
}

// ========== CLEAR ALL FIELDS (clears all fields) ==========
function clearAllFields() {
  const fields = ["sx", "sy", "tx", "ty", "vt", "kurs"];
  fields.forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.value = "";
    }
  });
  
  if (activeField) {
    activeField.classList.remove("active");
    activeField = null;
  }
  
  document.getElementById("marker").textContent = "---, --- km";
  document.getElementById("distance").textContent = "--- km";
  document.getElementById("bearing").textContent = "---°";
  document.getElementById("optimal").textContent = "--- km";
  
  updateStatus("WPISZ DANE CELU", "neutral");
  saveToLocalStorage();
  drawMap();
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
  
  const missileKey = document.getElementById("rakieta").value;
  if (!missiles[missileKey]) {
    updateStatus("⚠️ WYBIERZ RAKIETĘ", "warning");
    return;
  }
  
  const missile = missiles[missileKey];
  
  const allFilled = Sx !== 0 || Sy !== 0 || Tx !== 0 || Ty !== 0 || vT !== 0;
  if (!allFilled) {
    updateStatus("WPISZ DANE CELU", "neutral");
    return;
  }
  
  const distance = Math.hypot(Tx - Sx, Ty - Sy);
  
  if (distance > missile.range) {
    updateStatus(`❌ POZA ZASIĘGIEM (${distance.toFixed(0)} > ${missile.range}km)`, "error");
    return;
  }
  
  if (missile.arming > 0 && distance < missile.arming) {
    updateStatus(`❌ ZA BLISKO (min ${missile.arming}km)`, "error");
    return;
  }
  
  updateStatus(`✓ ${missile.name.split(" ")[0]} GOTOWA`, "success");
}

// ========== STATUS UPDATE ==========
function updateStatus(message, type) {
  const statusText = document.getElementById("statusText");
  const statusIcon = document.getElementById("statusIcon");
  
  statusText.textContent = message;
  statusText.classList.remove("status-valid");
  
  switch(type) {
    case "success":
      statusIcon.textContent = "✓";
      statusText.classList.add("status-valid");
      statusText.style.color = statusIcon.style.color = "var(--success)";
      break;
    case "error":
      statusIcon.textContent = "❌";
      statusText.style.color = statusIcon.style.color = "#ff4444";
      break;
    case "warning":
      statusIcon.textContent = "⚠️";
      statusText.style.color = statusIcon.style.color = "var(--warning)";
      break;
    default:
      statusIcon.textContent = "ⓘ";
      statusText.style.color = statusIcon.style.color = "var(--text-dim)";
  }
}

// ========== MAIN CALCULATIONS ==========
function calculateTarget() {
  const Sx = +document.getElementById("sx").value || 0;
  const Sy = +document.getElementById("sy").value || 0;
  const Tx = +document.getElementById("tx").value || 0;
  const Ty = +document.getElementById("ty").value || 0;
  const vT = +document.getElementById("vt").value || 0;
  const kursDeg = +document.getElementById("kurs").value || 0;

  const missileKey = document.getElementById("rakieta").value;
  if (!missiles[missileKey]) {
    updateStatus("❌ WYBIERZ RAKIETĘ", "error");
    return;
  }

  const missile = missiles[missileKey];

  // Jeśli prędkość celu = 0, punkt trafienia = pozycja celu
  if (vT === 0) {
    const markerX = Tx;
    const markerY = Ty;
    const distToImpact = Math.hypot(Tx - Sx, Ty - Sy);
    const ux = markerX - Sx;
    const uy = Sy - markerY;
    let alpha = Math.atan2(uy, ux);
    let bearingDeg = (360 - (alpha * 180 / Math.PI) + 90) % 360;
    if (bearingDeg < 0) bearingDeg += 360;
    const optimalRange = missile.arming + 50;

    document.getElementById("marker").textContent = `${markerX.toFixed(0)}, ${markerY.toFixed(0)} km`;
    document.getElementById("distance").textContent = `${distToImpact.toFixed(0)} km`;
    document.getElementById("bearing").textContent = `${bearingDeg.toFixed(0)}°`;
    document.getElementById("optimal").textContent = `${optimalRange.toFixed(0)} km`;

    updateStatus(`✓ ${missile.name.split(" ")[0]} CEL STACJONARNY`, "success");
    saveToLocalStorage();
    drawMap();
    return;
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
  if (d < 0) {
    updateStatus("❌ BRAK ROZWIĄZANIA", "error");
    return;
  }

  const sqrtD = Math.sqrt(d);
  const t1 = (-b - sqrtD) / (2 * a);
  const t2 = (-b + sqrtD) / (2 * a);
  const ts = [t1, t2].filter(t => t >= 0);

  if (ts.length === 0) {
    updateStatus("❌ BRAK CZASU SPOTKANIA", "error");
    return;
  }

  const t = Math.min(...ts);

  const Px = Tx + vx * t;
  const Py = Ty + vy * t;

  const distToImpact = Math.hypot(Px - Sx, Py - Sy);
  if (distToImpact > missile.range) {
    updateStatus(`❌ POZA ZASIĘGIEM (${distToImpact.toFixed(0)} > ${missile.range})`, "error");
    return;
  }

  const markerX = Px;
  const markerY = Py;
  const markerDist = distToImpact;

  if (missile.arming > 0) {
    const distToArming = Math.max(0, markerDist - missile.arming);
    if (distToArming < 50) {
      updateStatus(`⚠️ MAŁY ZAPAS UZBROJENIA`, "warning");
    }
  }

  const ux = markerX - Sx;
  const uy = Sy - markerY;

  let alpha = Math.atan2(uy, ux);
  let bearingDeg = (360 - (alpha * 180 / Math.PI) + 90) % 360;
  if (bearingDeg < 0) bearingDeg += 360;

  const optimalRange = missile.arming + 50;

  document.getElementById("marker").textContent = `${markerX.toFixed(0)}, ${markerY.toFixed(0)} km`;
  document.getElementById("distance").textContent = `${markerDist.toFixed(0)} km`;
  document.getElementById("bearing").textContent = `${bearingDeg.toFixed(0)}°`;
  document.getElementById("optimal").textContent = `${optimalRange.toFixed(0)} km`;

  updateStatus(`✓ ${missile.name.split(" ")[0]} Parametry wybrane`, "success");
  saveToLocalStorage();
  drawMap();
}

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
  
  // pokaż box obok strzałki
  coordsElement.style.display = 'block';
}

function hideArrowCoordinates() {
  document.getElementById('arrowCoords').style.display = 'none';
}

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