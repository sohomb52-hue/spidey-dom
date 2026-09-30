/**
 * Authentic Comic Artwork for Spider-Verse Canon Archive Events
 * High-definition vector comic illustrations matching the exact narrative lore of each event.
 */

const svgUri = (svg: string): string => {
  const clean = svg.replace(/\n\s*/g, ' ').trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(clean)}`;
};

/** 01: THE SPIDER BITE */
export const ART_CANON_01 = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <radialGradient id="nukeGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#a3e635"/>
      <stop offset="70%" stop-color="#15803d"/>
      <stop offset="100%" stop-color="#052e16"/>
    </radialGradient>
  </defs>
  <rect width="600" height="380" fill="url(#nukeGlow)"/>
  <!-- Science Exhibition Radiation Rays -->
  <g stroke="#facc15" stroke-width="4" stroke-dasharray="8,6" opacity="0.8">
    <line x1="300" y1="0" x2="300" y2="380"/>
    <line x1="0" y1="190" x2="600" y2="190"/>
    <line x1="60" y1="40" x2="540" y2="340"/>
    <line x1="540" y1="40" x2="60" y2="340"/>
  </g>
  <!-- Radioactive Spider Glowing in Particle Beam -->
  <g transform="translate(300, 160)">
    <circle cx="0" cy="0" r="55" fill="#facc15" fill-opacity="0.3" stroke="#facc15" stroke-width="3"/>
    <!-- Spider Body -->
    <ellipse cx="0" cy="15" rx="22" ry="30" fill="#dc2626" stroke="#1b1b20" stroke-width="4"/>
    <circle cx="0" cy="-12" r="16" fill="#1b1b20" stroke="#facc15" stroke-width="2"/>
    <circle cx="-5" cy="-14" r="3" fill="#facc15"/>
    <circle cx="5" cy="-14" r="3" fill="#facc15"/>
    <!-- 8 Jointed Legs -->
    <path d="M-15 -5 Q-50 -30 -65 -10 M-18 5 Q-65 0 -80 25 M-18 15 Q-65 25 -75 55 M-15 25 Q-55 55 -55 85" stroke="#1b1b20" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M15 -5 Q50 -30 65 -10 M18 5 Q65 0 80 25 M18 15 Q65 25 75 55 M15 25 Q55 55 55 85" stroke="#1b1b20" stroke-width="5" stroke-linecap="round" fill="none"/>
  </g>
  <!-- Teenage Peter Parker Hand Receiving Bite -->
  <g transform="translate(260, 240)">
    <path d="M-30 80 L20 20 L60 25 L80 80 Z" fill="#fed7aa" stroke="#1b1b20" stroke-width="5"/>
    <!-- Electrical ZAP at bite point -->
    <polygon points="40,20 30,0 45,5 50,-15 55,5 70,0 60,20" fill="#fde047" stroke="#1b1b20" stroke-width="2"/>
  </g>
  <rect x="25" y="25" width="180" height="34" fill="#1b1b20" stroke="#facc15" stroke-width="2"/>
  <text x="115" y="48" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#facc15" letter-spacing="1">RADIOACTIVE BITE</text>
  <g transform="translate(450, 60) rotate(10)">
    <polygon points="0,0 120,-10 110,40 10,35" fill="#ef4444" stroke="#1b1b20" stroke-width="3"/>
    <text x="60" y="24" text-anchor="middle" font-family="'Impact', sans-serif" font-size="22" fill="#fff">ZZZAP!</text>
  </g>
</svg>
`);

/** 02: WITH GREAT POWER COMES GREAT RESPONSIBILITY */
export const ART_CANON_02 = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="tvStudio" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="50%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="380" fill="url(#tvStudio)"/>
  <!-- TV Studio Corridor & Open Elevator Door -->
  <rect x="360" y="40" width="180" height="280" fill="#0f172a" stroke="#94a3b8" stroke-width="6"/>
  <rect x="380" y="60" width="140" height="260" fill="#facc15" opacity="0.25"/>
  <!-- Fleeing Burglar with Loot Sack -->
  <g transform="translate(420, 160)">
    <circle cx="0" cy="0" r="18" fill="#fed7aa" stroke="#1b1b20" stroke-width="3"/>
    <rect x="-8" y="-12" width="16" height="8" fill="#1b1b20"/>
    <path d="M-15 18 L15 18 L20 80 L-20 80 Z" fill="#334155" stroke="#1b1b20" stroke-width="4"/>
    <!-- Loot Bag -->
    <ellipse cx="25" cy="45" rx="20" ry="25" fill="#fef08a" stroke="#1b1b20" stroke-width="3"/>
    <text x="25" y="52" text-anchor="middle" font-family="'Impact', sans-serif" font-size="14" fill="#1b1b20">$</text>
  </g>
  <!-- Arrogant Spider-Man in Foreground Folding Arms -->
  <g transform="translate(160, 150)">
    <ellipse cx="0" cy="0" rx="45" ry="60" fill="#dc2626" stroke="#1b1b20" stroke-width="5"/>
    <path d="M-35 -10 Q-10 -30 0 -10 Q-5 15 -30 10 Z" fill="#fff" stroke="#1b1b20" stroke-width="4"/>
    <path d="M35 -10 Q10 -30 0 -10 Q5 15 30 10 Z" fill="#fff" stroke="#1b1b20" stroke-width="4"/>
    <path d="M-60 60 L60 60 L50 180 L-50 180 Z" fill="#dc2626" stroke="#1b1b20" stroke-width="5"/>
    <!-- Crossed Arms -->
    <rect x="-45" y="90" width="90" height="30" rx="10" fill="#1d4ed8" stroke="#1b1b20" stroke-width="4"/>
  </g>
  <!-- Stan Lee Closing Narrative Box -->
  <g transform="translate(50, 270)">
    <rect width="500" height="80" fill="#fef08a" stroke="#1b1b20" stroke-width="4"/>
    <text x="20" y="32" font-family="'Impact', sans-serif" font-size="16" fill="#1b1b20">STAN LEE'S TIMELESS LESSON:</text>
    <text x="20" y="58" font-family="'Impact', sans-serif" font-style="italic" font-size="22" fill="#dc2626">“WITH GREAT POWER THERE MUST ALSO COME — GREAT RESPONSIBILITY!”</text>
  </g>
</svg>
`);

/** 03: THE DEATH OF UNCLE BEN */
export const ART_CANON_03 = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <radialGradient id="warehouseMoon" cx="70%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#93c5fd"/>
      <stop offset="40%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="600" height="380" fill="url(#warehouseMoon)"/>
  <!-- Full Moon through broken warehouse window -->
  <circle cx="440" cy="100" r="70" fill="#f8fafc" stroke="#94a3b8" stroke-width="4"/>
  <path d="M400 30 L480 170 M370 100 L510 100" stroke="#0f172a" stroke-width="4"/>
  <!-- Vengeful Spider-Man Hoisting Burglar by Shirt Collar -->
  <g transform="translate(240, 180)">
    <!-- Spider-Man Darkened Silhouette with Glowing White Eyes -->
    <path d="M-100 160 C-90 60 -40 20 0 20 C40 20 90 60 100 160 Z" fill="#dc2626" stroke="#1b1b20" stroke-width="6"/>
    <ellipse cx="0" cy="-30" rx="45" ry="58" fill="#dc2626" stroke="#1b1b20" stroke-width="5"/>
    <path d="M-35 -40 Q-10 -60 0 -40 Q-5 -15 -30 -20 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="4"/>
    <path d="M35 -40 Q10 -60 0 -40 Q5 -15 30 -20 Z" fill="#ffffff" stroke="#1b1b20" stroke-width="4"/>
    <!-- Burglar Terrorized Face in Moonlight Beam -->
    <g transform="translate(130, -10)">
      <circle cx="0" cy="0" r="32" fill="#fed7aa" stroke="#1b1b20" stroke-width="4"/>
      <circle cx="-10" cy="-6" r="4" fill="#1b1b20"/>
      <circle cx="10" cy="-6" r="4" fill="#1b1b20"/>
      <ellipse cx="0" cy="12" rx="10" ry="12" fill="#450a0a"/>
      <!-- Flash of Recognition -->
      <polygon points="0,-45 8,-25 22,-20 8,-12 0,0 -8,-12 -22,-20 -8,-25" fill="#facc15"/>
    </g>
  </g>
  <!-- Police Sirens / Broken Heart Stamp -->
  <rect x="25" y="25" width="220" height="34" fill="#dc2626" stroke="#fff" stroke-width="2"/>
  <text x="135" y="48" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#fff">THE ACME WAREHOUSE</text>
  <g transform="translate(420, 270) rotate(-6)">
    <polygon points="0,0 150,-10 140,45 10,40" fill="#facc15" stroke="#1b1b20" stroke-width="3"/>
    <text x="75" y="28" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#1b1b20">IT'S HIM!</text>
  </g>
</svg>
`);

/** 04: SPIDER-MAN ENTERS THE DAILY BUGLE */
export const ART_CANON_04 = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="bugleDesk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="380" fill="url(#bugleDesk)"/>
  <!-- Giant Daily Bugle Front Page Newspaper -->
  <rect x="40" y="30" width="520" height="280" fill="#ffffff" stroke="#1b1b20" stroke-width="5"/>
  <text x="300" y="80" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" fill="#1b1b20" letter-spacing="2">THE DAILY BUGLE</text>
  <line x1="60" y1="95" x2="540" y2="95" stroke="#1b1b20" stroke-width="3"/>
  <text x="300" y="135" text-anchor="middle" font-family="'Impact', sans-serif" font-size="34" fill="#dc2626">SPIDER-MAN: MENACE OR HERO?!</text>
  <!-- Newspaper Photo Box of Spidey Swinging with Peter's Camera -->
  <rect x="70" y="150" width="220" height="140" fill="#dc2626" stroke="#1b1b20" stroke-width="4"/>
  <g transform="translate(180, 220)">
    <circle cx="0" cy="0" r="30" fill="#ffffff" stroke="#1b1b20" stroke-width="3"/>
    <path d="M-18 -8 Q0 -20 18 -8 Q0 15 -18 -8 Z" fill="#1b1b20"/>
    <text x="0" y="50" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="11" fill="#fff">EXCLUSIVE BY PETER PARKER</text>
  </g>
  <!-- J. Jonah Jameson Slamming Ten Dollar Bills on Desk -->
  <g transform="translate(390, 160)">
    <circle cx="50" cy="40" r="35" fill="#fed7aa" stroke="#1b1b20" stroke-width="4"/>
    <path d="M15 25 L85 25 L75 -15 L25 -15 Z" fill="#18181b"/>
    <rect x="40" y="50" width="20" height="8" fill="#1b1b20"/>
    <rect x="58" y="55" width="28" height="8" fill="#78350f" transform="rotate(-15, 58, 55)"/>
    <circle cx="88" cy="48" r="3" fill="#ea580c"/>
    <!-- $10 Bills -->
    <rect x="0" y="100" width="70" height="35" rx="3" fill="#86efac" stroke="#15803d" stroke-width="2"/>
    <text x="35" y="124" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#166534">$10</text>
  </g>
</svg>
`);

/** 05: THE GREEN GOBLIN REVEALED */
export const ART_CANON_05 = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <radialGradient id="goblinLab" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a855f7"/>
      <stop offset="50%" stop-color="#15803d"/>
      <stop offset="100%" stop-color="#022c22"/>
    </radialGradient>
  </defs>
  <rect width="600" height="380" fill="url(#goblinLab)"/>
  <!-- Chemical Vats and Oscorp Gas Clouds -->
  <circle cx="100" cy="120" r="70" fill="#22c55e" opacity="0.25"/>
  <circle cx="500" cy="100" r="90" fill="#a855f7" opacity="0.3"/>
  <!-- Norman Osborn Unmasked Face with Goblin Shadow Looming Behind -->
  <g transform="translate(300, 180)">
    <!-- Unmasked Norman Osborn Head with Waves of Ridged Reddish Hair -->
    <ellipse cx="0" cy="0" rx="75" ry="95" fill="#fcd34d" stroke="#1b1b20" stroke-width="6"/>
    <!-- Characteristic Cornrows / Waved Hair -->
    <path d="M-75 -20 C-60 -95 60 -95 75 -20 C40 -60 -40 -60 -75 -20 Z" fill="#991b1b" stroke="#1b1b20" stroke-width="4"/>
    <path d="M-50 -35 Q0 -70 50 -35 M-40 -15 Q0 -50 40 -15" stroke="#7f1d1d" stroke-width="4" fill="none"/>
    <!-- Intense Maniacal Eyes -->
    <ellipse cx="-28" cy="-5" rx="16" ry="12" fill="#facc15" stroke="#1b1b20" stroke-width="3"/>
    <circle cx="-28" cy="-5" r="5" fill="#1b1b20"/>
    <ellipse cx="28" cy="-5" rx="16" ry="12" fill="#facc15" stroke="#1b1b20" stroke-width="3"/>
    <circle cx="28" cy="-5" r="5" fill="#1b1b20"/>
    <!-- Smirk -->
    <path d="M-30 40 Q0 70 30 40" stroke="#1b1b20" stroke-width="5" fill="none"/>
    <!-- Tied-up Spider-Man in Steel Wire Net at Left -->
    <g transform="translate(-190, 40)">
      <ellipse cx="0" cy="0" rx="35" ry="48" fill="#dc2626" stroke="#1b1b20" stroke-width="4"/>
      <!-- Steel Net Lines -->
      <line x1="-35" y1="-30" x2="35" y2="30" stroke="#e2e8f0" stroke-width="4"/>
      <line x1="-35" y1="30" x2="35" y2="-30" stroke="#e2e8f0" stroke-width="4"/>
      <line x1="-30" y1="0" x2="30" y2="0" stroke="#e2e8f0" stroke-width="4"/>
    </g>
  </g>
  <rect x="25" y="25" width="260" height="34" fill="#15803d" stroke="#facc15" stroke-width="2"/>
  <text x="155" y="48" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#fff">OSCORP IDENTITY DISCOVERY</text>
</svg>
`);

/** 06: THE NIGHT GWEN STACY DIED */
export const ART_CANON_06 = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="bridgeNight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="380" fill="url(#bridgeNight)"/>
  <!-- Brooklyn / GW Bridge Steel Towers Silhouette -->
  <path d="M120 380 L140 40 L180 40 L200 380 Z" fill="#334155" stroke="#1b1b20" stroke-width="4"/>
  <path d="M420 380 L440 40 L480 40 L500 380 Z" fill="#334155" stroke="#1b1b20" stroke-width="4"/>
  <!-- Bridge Suspension Cables -->
  <path d="M0 60 Q300 240 600 60" stroke="#64748b" stroke-width="5" fill="none"/>
  <!-- Falling Figure of Gwen Stacy (Green Trench Coat & Blonde Hair) -->
  <g transform="translate(300, 220)">
    <circle cx="0" cy="-25" r="16" fill="#fde047" stroke="#1b1b20" stroke-width="3"/>
    <path d="M-15 -10 L15 -10 L25 50 L-25 50 Z" fill="#15803d" stroke="#1b1b20" stroke-width="4"/>
    <!-- Purple Skirt & Black Boots -->
    <rect x="-18" y="45" width="36" height="20" fill="#7e22ce"/>
  </g>
  <!-- Desperate Tensile Web Line Snapping at her Ankle -->
  <path d="M160 50 Q240 140 295 285" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
  <!-- Fatal Sound Effect "SNAP!" Stamp -->
  <g transform="translate(330, 270) rotate(12)">
    <polygon points="0,0 120,-10 110,40 10,35" fill="#facc15" stroke="#dc2626" stroke-width="4"/>
    <text x="60" y="26" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="28" fill="#dc2626">SNAP!</text>
  </g>
  <!-- Spider-Man on Bridge Tower Reaching Out in Horror -->
  <g transform="translate(160, 45)">
    <circle cx="0" cy="0" r="22" fill="#dc2626" stroke="#1b1b20" stroke-width="3"/>
    <path d="M-12 -6 Q0 -14 12 -6 Q0 8 -12 -6 Z" fill="#fff"/>
  </g>
</svg>
`);

/** 07: THE SYMBIOTE ARRIVES */
export const ART_CANON_07 = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <radialGradient id="battleworld" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#09090b"/>
    </radialGradient>
  </defs>
  <rect width="600" height="380" fill="url(#battleworld)"/>
  <!-- Alien Spherical Containment Module on Battleworld -->
  <circle cx="300" cy="190" r="140" fill="none" stroke="#60a5fa" stroke-width="4" stroke-dasharray="8,6"/>
  <!-- Liquid Living Black Symbiote Flowing onto Peter's Red Glove -->
  <g transform="translate(300, 190)">
    <!-- Red Hand Below -->
    <path d="M-60 140 L-20 40 L20 40 L60 140 Z" fill="#dc2626" stroke="#1b1b20" stroke-width="4"/>
    <!-- Liquid Symbiote Ooze Coating Hand into Black Suit -->
    <path d="M-80 80 Q-40 -20 0 10 Q40 -20 80 80 C90 140 -90 140 -80 80 Z" fill="#09090b" stroke="#38bdf8" stroke-width="4"/>
    <!-- First Glimpse of the Giant White Spider Chest Emblem -->
    <polygon points="0,50 -25,20 -15,70 0,90 15,70 25,20" fill="#ffffff"/>
  </g>
  <rect x="25" y="25" width="220" height="34" fill="#09090b" stroke="#38bdf8" stroke-width="2"/>
  <text x="135" y="48" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#38bdf8">SECRET WARS #8 • 1984</text>
  <g transform="translate(420, 270) rotate(-6)">
    <polygon points="0,0 150,-10 140,40 10,35" fill="#38bdf8" stroke="#09090b" stroke-width="3"/>
    <text x="75" y="26" text-anchor="middle" font-family="'Impact', sans-serif" font-size="18" fill="#09090b">BLACK SUIT BORN</text>
  </g>
</svg>
`);

/** 08: VENOM IS BORN */
export const ART_CANON_08 = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <radialGradient id="belfryGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="600" height="380" fill="url(#belfryGrad)"/>
  <!-- Church Belfry Massive Brass Bell with Sonic Shockwaves -->
  <g transform="translate(300, 110)">
    <path d="M-80 60 C-60 -40 60 -40 80 60 L100 80 L-100 80 Z" fill="#d97706" stroke="#1b1b20" stroke-width="6"/>
    <ellipse cx="0" cy="80" rx="100" ry="25" fill="#f59e0b" stroke="#1b1b20" stroke-width="4"/>
    <circle cx="0" cy="80" r="16" fill="#78350f"/>
    <!-- Sonic Shockwaves DONG! -->
    <circle cx="0" cy="80" r="130" fill="none" stroke="#fde047" stroke-width="4" stroke-dasharray="10,8" opacity="0.7"/>
    <circle cx="0" cy="80" r="170" fill="none" stroke="#fde047" stroke-width="3" stroke-dasharray="12,10" opacity="0.4"/>
  </g>
  <!-- Eddie Brock at Bottom Merging into Hulking Venom with Fangs & Long Tongue -->
  <g transform="translate(300, 270)">
    <path d="M-140 110 C-110 -20 110 -20 140 110 Z" fill="#09090b" stroke="#1b1b20" stroke-width="6"/>
    <!-- White Jagged Eyes -->
    <path d="M-60 10 Q-20 -20 -10 15 Q-30 35 -60 10 Z" fill="#fff"/>
    <path d="M60 10 Q20 -20 10 15 Q30 35 60 10 Z" fill="#fff"/>
    <!-- Razor Needle Teeth & Acid Tongue -->
    <path d="M-45 45 Q0 90 45 45 Z" fill="#450a0a"/>
    <path d="M0 55 Q30 90 -10 110" stroke="#ec4899" stroke-width="10" fill="none" stroke-linecap="round"/>
  </g>
  <g transform="translate(80, 260) rotate(-10)">
    <polygon points="0,0 130,-10 120,40 10,35" fill="#facc15" stroke="#1b1b20" stroke-width="3"/>
    <text x="65" y="26" text-anchor="middle" font-family="'Impact', sans-serif" font-size="22" fill="#1b1b20">CLANGGGG!</text>
  </g>
</svg>
`);

/** 09: KRAVEN'S LAST HUNT */
export const ART_CANON_09 = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="rainGraveyard" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="60%" stop-color="#27272a"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="380" fill="url(#rainGraveyard)"/>
  <!-- Torrential Heavy Rain Lines -->
  <g stroke="#94a3b8" stroke-width="1.5" opacity="0.3">
    <line x1="50" y1="0" x2="20" y2="200"/><line x1="150" y1="0" x2="120" y2="200"/>
    <line x1="250" y1="0" x2="220" y2="200"/><line x1="350" y1="0" x2="320" y2="200"/>
    <line x1="450" y1="0" x2="420" y2="200"/><line x1="550" y1="0" x2="520" y2="200"/>
  </g>
  <!-- Cemetery Tombstone "HERE LIES SPIDER-MAN" -->
  <g transform="translate(180, 140)">
    <path d="M-70 180 L-70 0 C-70 -50 70 -50 70 0 L70 180 Z" fill="#52525b" stroke="#1b1b20" stroke-width="5"/>
    <text x="0" y="30" text-anchor="middle" font-family="'Impact', sans-serif" font-size="18" fill="#f43f5e">R. I. P.</text>
    <text x="0" y="65" text-anchor="middle" font-family="'Impact', sans-serif" font-size="14" fill="#ffffff">SPIDER-MAN</text>
  </g>
  <!-- Mud Mound with Spider-Man Black-Suited Hand Clawing Out of the Earth -->
  <g transform="translate(380, 260)">
    <ellipse cx="0" cy="50" rx="140" ry="45" fill="#451a03" stroke="#1b1b20" stroke-width="5"/>
    <!-- Black Glove Clawing Skyward with Rain Splashes -->
    <path d="M-15 50 L-10 -40 L5 -60 L15 -40 L25 -10 L15 50 Z" fill="#09090b" stroke="#e2e8f0" stroke-width="4"/>
    <polygon points="5,-60 10,-80 18,-65" fill="#09090b" stroke="#e2e8f0" stroke-width="3"/>
  </g>
  <rect x="25" y="25" width="220" height="34" fill="#1b1b20" stroke="#f43f5e" stroke-width="2"/>
  <text x="135" y="48" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#f43f5e">FEARFUL SYMMETRY • 1987</text>
</svg>
`);

/** 10: THE CLONE SAGA */
export const ART_CANON_10 = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <radialGradient id="cloneLab" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
  </defs>
  <rect width="600" height="380" fill="url(#cloneLab)"/>
  <!-- Two Identical Spider-Heroes (Classic 616 vs Scarlet Spider Ben Reilly) -->
  <!-- Left: Peter Parker 616 Classic -->
  <g transform="translate(180, 180)">
    <ellipse cx="0" cy="0" rx="60" ry="75" fill="#dc2626" stroke="#1b1b20" stroke-width="5"/>
    <path d="M-45 -10 Q-15 -30 0 -10 Q-5 20 -40 15 Z" fill="#fff" stroke="#1b1b20" stroke-width="4"/>
    <path d="M45 -10 Q15 -30 0 -10 Q5 20 40 15 Z" fill="#fff" stroke="#1b1b20" stroke-width="4"/>
    <rect x="-40" y="85" width="80" height="24" fill="#dc2626" stroke="#fff" stroke-width="2"/>
    <text x="0" y="102" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#fff">ORIGINAL?</text>
  </g>
  <!-- Right: Ben Reilly (Scarlet Spider in Blue Sleeveless Hoodie) -->
  <g transform="translate(420, 180)">
    <ellipse cx="0" cy="0" rx="60" ry="75" fill="#dc2626" stroke="#1b1b20" stroke-width="5"/>
    <path d="M-45 -10 Q-15 -30 0 -10 Q-5 20 -40 15 Z" fill="#fff" stroke="#1b1b20" stroke-width="4"/>
    <path d="M45 -10 Q15 -30 0 -10 Q5 20 40 15 Z" fill="#fff" stroke="#1b1b20" stroke-width="4"/>
    <!-- Blue Sleeveless Hoodie Collar -->
    <path d="M-70 70 L70 70 L60 140 L-60 140 Z" fill="#0284c7" stroke="#1b1b20" stroke-width="4"/>
    <!-- Giant Slanted Black Spider Logo on Hoodie -->
    <path d="M0 85 L-20 120 M0 85 L20 120" stroke="#1b1b20" stroke-width="6"/>
    <rect x="-40" y="85" width="80" height="24" fill="#0284c7" stroke="#fff" stroke-width="2"/>
    <text x="0" y="102" text-anchor="middle" font-family="'Impact', sans-serif" font-size="12" fill="#fff">CLONE?</text>
  </g>
  <!-- Giant Question Mark Mirror Split -->
  <line x1="300" y1="40" x2="300" y2="340" stroke="#facc15" stroke-width="6" stroke-dasharray="10,6"/>
  <rect x="220" y="25" width="160" height="34" fill="#1b1b20" stroke="#facc15" stroke-width="2"/>
  <text x="300" y="48" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#facc15">BEN REILLY SAGA</text>
</svg>
`);

/** 11: THE SPIDER-ISLAND EVENT */
export const ART_CANON_11 = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <radialGradient id="spiderIsland" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="50%" stop-color="#991b1b"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </radialGradient>
  </defs>
  <rect width="600" height="380" fill="url(#spiderIsland)"/>
  <!-- Manhattan Skyline Enmeshed in Thousands of Giant Web Strands -->
  <g stroke="#ffffff" stroke-width="2" opacity="0.6" fill="none">
    <path d="M0 100 Q300 280 600 80"/>
    <path d="M0 200 Q300 340 600 180"/>
    <path d="M100 0 Q300 200 500 380"/>
    <path d="M500 0 Q300 200 100 380"/>
  </g>
  <!-- Multiple Web-Slingers Flying over Times Square -->
  <g transform="translate(180, 140)">
    <circle cx="0" cy="0" r="16" fill="#dc2626" stroke="#1b1b20" stroke-width="3"/>
    <line x1="0" y1="0" x2="-80" y2="-80" stroke="#fff" stroke-width="3"/>
  </g>
  <g transform="translate(420, 120)">
    <circle cx="0" cy="0" r="16" fill="#facc15" stroke="#1b1b20" stroke-width="3"/>
    <line x1="0" y1="0" x2="80" y2="-80" stroke="#fff" stroke-width="3"/>
  </g>
  <g transform="translate(300, 220)">
    <!-- Peter Parker Leading the City Defenses -->
    <ellipse cx="0" cy="0" rx="35" ry="45" fill="#dc2626" stroke="#1b1b20" stroke-width="5"/>
    <path d="M-25 -6 Q0 -18 25 -6 Q0 12 -25 -6 Z" fill="#fff"/>
  </g>
  <rect x="25" y="25" width="250" height="34" fill="#1b1b20" stroke="#fff" stroke-width="2"/>
  <text x="150" y="48" text-anchor="middle" font-family="'Impact', sans-serif" font-size="16" fill="#fff">MANHATTAN INFESTATION</text>
  <g transform="translate(360, 270) rotate(-4)">
    <polygon points="0,0 200,-10 190,45 10,40" fill="#facc15" stroke="#1b1b20" stroke-width="3"/>
    <text x="100" y="28" text-anchor="middle" font-family="'Impact', sans-serif" font-size="20" fill="#1b1b20">EVERYONE HAS POWERS!</text>
  </g>
</svg>
`);
