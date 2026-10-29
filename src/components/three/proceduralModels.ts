import * as THREE from 'three';
import { MaterialTheme } from '../../types/hotel';

// -------------------------------------------------------------
// Procedural Canvas Textures (Zero external 404 dependencies)
// -------------------------------------------------------------

export function createWoodPlankTexture(theme: MaterialTheme = 'santorini'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  let baseColor = '#E8E1D5';
  let grainColor = '#D4C9BA';
  let seamColor = '#BFB2A0';

  if (theme === 'kyoto') {
    baseColor = '#D2C0A5';
    grainColor = '#B8A385';
    seamColor = '#9A8366';
  } else if (theme === 'nordic') {
    baseColor = '#EFEBE4';
    grainColor = '#DFD9CE';
    seamColor = '#CAC2B4';
  }

  // Base wash
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Planks
  const plankHeight = 64;
  for (let y = 0; y < 512; y += plankHeight) {
    ctx.strokeStyle = seamColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    // Wood grain lines
    for (let i = 0; i < 14; i++) {
      const gy = y + 4 + Math.random() * (plankHeight - 8);
      ctx.strokeStyle = grainColor;
      ctx.lineWidth = 1 + Math.random();
      ctx.globalAlpha = 0.35 + Math.random() * 0.25;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.bezierCurveTo(150, gy + (Math.random() - 0.5) * 6, 350, gy + (Math.random() - 0.5) * 6, 512, gy);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createTravertineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F4EFE6';
  ctx.fillRect(0, 0, 512, 512);

  // Travertine pore bands & veining
  ctx.fillStyle = '#E5DDD0';
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 512;
    const h = 2 + Math.random() * 8;
    ctx.globalAlpha = 0.25 + Math.random() * 0.2;
    ctx.fillRect(0, y, 512, h);
  }

  ctx.strokeStyle = '#D9CFBF';
  for (let j = 0; j < 8; j++) {
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * 512);
    ctx.bezierCurveTo(
      150, Math.random() * 512,
      350, Math.random() * 512,
      512, Math.random() * 512
    );
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createFabricTexture(theme: MaterialTheme = 'santorini'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  let colorA = '#F8F6F0';
  let colorB = '#EFECE3';
  if (theme === 'kyoto') {
    colorA = '#EFE6D8';
    colorB = '#E5D8C4';
  } else if (theme === 'nordic') {
    colorA = '#F3F2EE';
    colorB = '#E6E4DD';
  }

  ctx.fillStyle = colorA;
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = colorB;
  ctx.globalAlpha = 0.4;
  for (let x = 0; x < 256; x += 4) {
    ctx.fillRect(x, 0, 2, 256);
  }
  for (let y = 0; y < 256; y += 4) {
    ctx.fillRect(0, y, 256, 2);
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWaterCausticTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, '#58B8CA');
  gradient.addColorStop(0.5, '#72CCD9');
  gradient.addColorStop(1, '#4BA3B8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  // Subtle pool grid lines
  ctx.strokeStyle = '#8DE1ED';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.45;
  for (let x = 0; x < 256; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y < 256; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// -------------------------------------------------------------
// Shared Material Palette (Refined Light Luxury Aesthetics)
// -------------------------------------------------------------

export function createRoomMaterials(theme: MaterialTheme = 'santorini') {
  const woodTexture = createWoodPlankTexture(theme);
  const travertineTexture = createTravertineTexture();
  const fabricTexture = createFabricTexture(theme);
  const waterTexture = createWaterCausticTexture();

  const floorWood = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.35,
    metalness: 0.05,
  });

  const wallStone = new THREE.MeshStandardMaterial({
    map: travertineTexture,
    color: 0xFAF7F2,
    roughness: 0.65,
    metalness: 0.02,
  });

  const wallPlaster = new THREE.MeshStandardMaterial({
    color: 0xFDFCF9,
    roughness: 0.8,
    metalness: 0.0,
  });

  const linenFabric = new THREE.MeshStandardMaterial({
    map: fabricTexture,
    color: 0xFFFFFF,
    roughness: 0.9,
    metalness: 0.0,
  });

  const warmAccentWood = new THREE.MeshStandardMaterial({
    color: theme === 'kyoto' ? 0x8C6842 : theme === 'nordic' ? 0xB5A48F : 0xA5815A,
    roughness: 0.4,
    metalness: 0.1,
  });

  const brushedBrass = new THREE.MeshStandardMaterial({
    color: 0xD8B880,
    roughness: 0.25,
    metalness: 0.85,
  });

  const clearGlass = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.85,
    ior: 1.5,
  });

  const waterMaterial = new THREE.MeshStandardMaterial({
    map: waterTexture,
    color: 0x47B2C6,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.82,
  });

  const plantLeaf = new THREE.MeshStandardMaterial({
    color: 0x4D6945,
    roughness: 0.5,
    metalness: 0.05,
  });

  const warmLampGlow = new THREE.MeshStandardMaterial({
    color: 0xFFE8BD,
    emissive: 0xF0C070,
    emissiveIntensity: 0.8,
    roughness: 0.9,
  });

  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.7,
  });

  return {
    floorWood,
    wallStone,
    wallPlaster,
    linenFabric,
    warmAccentWood,
    brushedBrass,
    clearGlass,
    waterMaterial,
    plantLeaf,
    warmLampGlow,
    darkMetal,
  };
}

// -------------------------------------------------------------
// Modular Furniture Subcomponents (Composite 3-12 parts)
// -------------------------------------------------------------

export function createKingBed(materials: ReturnType<typeof createRoomMaterials>): THREE.Group {
  const group = new THREE.Group();

  // 1. Bed Frame Base (Warm wood platform)
  const baseGeo = new THREE.BoxGeometry(2.4, 0.25, 2.3);
  const baseMesh = new THREE.Mesh(baseGeo, materials.warmAccentWood);
  baseMesh.position.y = 0.125;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // 2. High Architectural Headboard with vertical fluting
  const headboardGeo = new THREE.BoxGeometry(2.8, 1.4, 0.15);
  const headboardMesh = new THREE.Mesh(headboardGeo, materials.warmAccentWood);
  headboardMesh.position.set(0, 0.8, 1.15);
  headboardMesh.castShadow = true;
  group.add(headboardMesh);

  // Headboard cushioned insert
  const headCushionGeo = new THREE.BoxGeometry(2.5, 0.9, 0.08);
  const headCushionMesh = new THREE.Mesh(headCushionGeo, materials.linenFabric);
  headCushionMesh.position.set(0, 0.85, 1.08);
  group.add(headCushionMesh);

  // 3. Plush Mattress
  const mattressGeo = new THREE.BoxGeometry(2.1, 0.35, 2.0);
  const mattressMesh = new THREE.Mesh(mattressGeo, materials.linenFabric);
  mattressMesh.position.set(0, 0.42, 0.05);
  mattressMesh.castShadow = true;
  group.add(mattressMesh);

  // 4. Folded Duvet / Bed Runner
  const runnerGeo = new THREE.BoxGeometry(2.15, 0.1, 0.8);
  const runnerMat = new THREE.MeshStandardMaterial({
    color: 0x9D7D54,
    roughness: 0.85,
  });
  const runnerMesh = new THREE.Mesh(runnerGeo, runnerMat);
  runnerMesh.position.set(0, 0.62, -0.5);
  group.add(runnerMesh);

  // 5. Pillows (4 luxury pillows: 2 back props, 2 front accents)
  const pillowGeo = new THREE.BoxGeometry(0.7, 0.16, 0.45);
  const pillowMat = materials.linenFabric;

  const p1 = new THREE.Mesh(pillowGeo, pillowMat);
  p1.position.set(-0.6, 0.66, 0.7);
  p1.rotation.x = -0.2;
  const p2 = new THREE.Mesh(pillowGeo, pillowMat);
  p2.position.set(0.6, 0.66, 0.7);
  p2.rotation.x = -0.2;
  group.add(p1, p2);

  const accentPillowGeo = new THREE.BoxGeometry(0.5, 0.14, 0.35);
  const ap1 = new THREE.Mesh(accentPillowGeo, runnerMat);
  ap1.position.set(-0.6, 0.72, 0.45);
  ap1.rotation.x = -0.35;
  const ap2 = new THREE.Mesh(accentPillowGeo, runnerMat);
  ap2.position.set(0.6, 0.72, 0.45);
  ap2.rotation.x = -0.35;
  group.add(ap1, ap2);

  // 6. Bedside Nightstands (Floating cantilevered shelves with drawer)
  const standGeo = new THREE.BoxGeometry(0.6, 0.2, 0.5);
  const leftStand = new THREE.Mesh(standGeo, materials.warmAccentWood);
  leftStand.position.set(-1.6, 0.4, 0.95);
  leftStand.castShadow = true;
  const rightStand = new THREE.Mesh(standGeo, materials.warmAccentWood);
  rightStand.position.set(1.6, 0.4, 0.95);
  rightStand.castShadow = true;
  group.add(leftStand, rightStand);

  // 7. Designer Brass & Opal Bedside Lamps
  const createLamp = (x: number) => {
    const lamp = new THREE.Group();
    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 12);
    const stem = new THREE.Mesh(stemGeo, materials.brushedBrass);
    stem.position.y = 0.225;
    // Shade (Opal glass glow)
    const shadeGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.2, 16);
    const shade = new THREE.Mesh(shadeGeo, materials.warmLampGlow);
    shade.position.y = 0.36;
    lamp.add(stem, shade);
    lamp.position.set(x, 0.5, 0.95);
    return lamp;
  };
  group.add(createLamp(-1.6), createLamp(1.6));

  return group;
}

export function createModernLounge(materials: ReturnType<typeof createRoomMaterials>): THREE.Group {
  const group = new THREE.Group();

  // 1. Curved Linen Sofa
  const seatGeo = new THREE.BoxGeometry(2.2, 0.32, 0.9);
  const seat = new THREE.Mesh(seatGeo, materials.linenFabric);
  seat.position.y = 0.25;
  seat.castShadow = true;
  group.add(seat);

  // Sofa Backrest
  const backGeo = new THREE.BoxGeometry(2.2, 0.45, 0.25);
  const back = new THREE.Mesh(backGeo, materials.linenFabric);
  back.position.set(0, 0.55, 0.35);
  back.castShadow = true;
  group.add(back);

  // Sofa Armrests
  const armGeo = new THREE.BoxGeometry(0.25, 0.35, 0.9);
  const armL = new THREE.Mesh(armGeo, materials.linenFabric);
  armL.position.set(-1.0, 0.45, 0);
  const armR = new THREE.Mesh(armGeo, materials.linenFabric);
  armR.position.set(1.0, 0.45, 0);
  group.add(armL, armR);

  // Accent Cushions
  const cushionGeo = new THREE.BoxGeometry(0.4, 0.35, 0.15);
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0xBF9E73, roughness: 0.9 });
  const c1 = new THREE.Mesh(cushionGeo, cushionMat);
  c1.position.set(-0.65, 0.5, 0.18);
  c1.rotation.y = 0.15;
  const c2 = new THREE.Mesh(cushionGeo, cushionMat);
  c2.position.set(0.65, 0.5, 0.18);
  c2.rotation.y = -0.15;
  group.add(c1, c2);

  // 2. Travertine & Brass Coffee Table
  const tableTopGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32);
  const tableTop = new THREE.Mesh(tableTopGeo, materials.wallStone);
  tableTop.position.set(0, 0.32, -0.9);
  tableTop.castShadow = true;

  const tableLegGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.3, 24);
  const tableLeg = new THREE.Mesh(tableLegGeo, materials.brushedBrass);
  tableLeg.position.set(0, 0.15, -0.9);
  group.add(tableTop, tableLeg);

  // Coffee Table Book & Ceramic Vase
  const bookGeo = new THREE.BoxGeometry(0.25, 0.03, 0.35);
  const book = new THREE.Mesh(bookGeo, materials.linenFabric);
  book.position.set(-0.15, 0.36, -0.9);
  const vaseGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.16, 16);
  const vase = new THREE.Mesh(vaseGeo, materials.brushedBrass);
  vase.position.set(0.18, 0.42, -0.85);
  group.add(book, vase);

  // 3. Woven Wool Lounge Rug beneath
  const rugGeo = new THREE.BoxGeometry(2.8, 0.015, 2.4);
  const rugMat = new THREE.MeshStandardMaterial({
    color: 0xEDE9DF,
    roughness: 0.95,
  });
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.position.set(0, 0.01, -0.4);
  rug.receiveShadow = true;
  group.add(rug);

  return group;
}

export function createLuxuryBathtub(materials: ReturnType<typeof createRoomMaterials>): THREE.Group {
  const group = new THREE.Group();

  // Freestanding oval soaking tub
  const tubGeo = new THREE.CylinderGeometry(0.65, 0.55, 0.65, 32, 1, false);
  tubGeo.scale(1.4, 1.0, 0.9);
  const tubMat = new THREE.MeshStandardMaterial({
    color: 0xF7F4EE,
    roughness: 0.15,
    metalness: 0.05,
  });
  const tub = new THREE.Mesh(tubGeo, tubMat);
  tub.position.y = 0.35;
  tub.castShadow = true;
  group.add(tub);

  // Water inside tub
  const waterGeo = new THREE.CylinderGeometry(0.62, 0.52, 0.02, 32);
  waterGeo.scale(1.36, 1.0, 0.86);
  const tubWater = new THREE.Mesh(waterGeo, materials.waterMaterial);
  tubWater.position.y = 0.58;
  group.add(tubWater);

  // Standing Floor Faucet (Brushed Brass)
  const faucetGroup = new THREE.Group();
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.95, 16),
    materials.brushedBrass
  );
  stem.position.y = 0.475;
  const spout = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.04, 0.25),
    materials.brushedBrass
  );
  spout.position.set(0, 0.93, 0.12);
  faucetGroup.add(stem, spout);
  faucetGroup.position.set(0, 0, -0.75);
  group.add(faucetGroup);

  return group;
}

export function createPottedPlant(materials: ReturnType<typeof createRoomMaterials>): THREE.Group {
  const group = new THREE.Group();

  // Ceramic Planter
  const potGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.45, 20);
  const potMat = new THREE.MeshStandardMaterial({ color: 0xF0ECE3, roughness: 0.7 });
  const pot = new THREE.Mesh(potGeo, potMat);
  pot.position.y = 0.225;
  pot.castShadow = true;
  group.add(pot);

  // Plant Fronds / Tropical Leaves (Group of 6 varied leaves)
  const leafGeo = new THREE.CylinderGeometry(0.01, 0.14, 0.7, 5);
  leafGeo.scale(1.0, 1.0, 0.2);

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const leaf = new THREE.Mesh(leafGeo, materials.plantLeaf);
    leaf.position.set(Math.cos(angle) * 0.08, 0.55 + (i % 2) * 0.1, Math.sin(angle) * 0.08);
    leaf.rotation.x = 0.35 + (i % 3) * 0.1;
    leaf.rotation.y = angle;
    leaf.rotation.z = 0.15;
    leaf.castShadow = true;
    group.add(leaf);
  }

  return group;
}

export function createBalconyFurniture(materials: ReturnType<typeof createRoomMaterials>): THREE.Group {
  const group = new THREE.Group();

  // Sun Lounger 1
  const createLounger = (x: number) => {
    const lounger = new THREE.Group();
    // Teak frame
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.15, 1.8),
      materials.warmAccentWood
    );
    frame.position.y = 0.15;
    frame.castShadow = true;

    // Cushion
    const cushion = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 0.1, 1.76),
      materials.linenFabric
    );
    cushion.position.y = 0.26;
    cushion.castShadow = true;

    // Angled Backrest
    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 0.08, 0.6),
      materials.linenFabric
    );
    backrest.position.set(0, 0.45, 0.55);
    backrest.rotation.x = -0.55;

    lounger.add(frame, cushion, backrest);
    lounger.position.set(x, 0, 0);
    return lounger;
  };

  group.add(createLounger(-0.9));
  group.add(createLounger(0.9));

  // Small Teak Side Table
  const tableGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.35, 16);
  const sideTable = new THREE.Mesh(tableGeo, materials.warmAccentWood);
  sideTable.position.set(0, 0.175, 0.2);
  sideTable.castShadow = true;
  group.add(sideTable);

  return group;
}

// -------------------------------------------------------------
// 1. DELUXE OCEAN SUITE MODEL
// -------------------------------------------------------------

export function buildOceanSuiteModel(materials: ReturnType<typeof createRoomMaterials>): THREE.Group {
  const suite = new THREE.Group();

  // Main Room Travertine Floor (7m x 6m)
  const roomFloorGeo = new THREE.BoxGeometry(8.2, 0.3, 6.4);
  const roomFloor = new THREE.Mesh(roomFloorGeo, materials.floorWood);
  roomFloor.position.set(0, -0.15, 0.8);
  roomFloor.receiveShadow = true;
  suite.add(roomFloor);

  // Exterior Balcony Teak Deck
  const balconyDeckGeo = new THREE.BoxGeometry(8.2, 0.28, 3.2);
  const balconyDeck = new THREE.Mesh(balconyDeckGeo, materials.warmAccentWood);
  balconyDeck.position.set(0, -0.16, -3.8);
  balconyDeck.receiveShadow = true;
  suite.add(balconyDeck);

  // Rear Wall (White plaster with warm travertine accent)
  const backWallGeo = new THREE.BoxGeometry(8.2, 3.2, 0.25);
  const backWall = new THREE.Mesh(backWallGeo, materials.wallPlaster);
  backWall.position.set(0, 1.45, 3.9);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  suite.add(backWall);

  // Left Wall with Cutout/Window
  const leftWallGeo = new THREE.BoxGeometry(0.25, 3.2, 6.4);
  const leftWall = new THREE.Mesh(leftWallGeo, materials.wallPlaster);
  leftWall.position.set(-4.1, 1.45, 0.8);
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  suite.add(leftWall);

  // Right Wall (Bathroom divider with travertine panel)
  const rightWallGeo = new THREE.BoxGeometry(0.25, 3.2, 4.0);
  const rightWall = new THREE.Mesh(rightWallGeo, materials.wallStone);
  rightWall.position.set(4.1, 1.45, 2.0);
  rightWall.castShadow = true;
  suite.add(rightWall);

  // Glass Sliding Balcony Doors / Railing
  const glassGeo = new THREE.BoxGeometry(8.0, 1.1, 0.08);
  const glassRailing = new THREE.Mesh(glassGeo, materials.clearGlass);
  glassRailing.position.set(0, 0.55, -5.3);
  suite.add(glassRailing);

  // Top Railing Trim (Brushed Brass)
  const brassRailGeo = new THREE.BoxGeometry(8.1, 0.06, 0.09);
  const brassRail = new THREE.Mesh(brassRailGeo, materials.brushedBrass);
  brassRail.position.set(0, 1.12, -5.3);
  suite.add(brassRail);

  // Sliding Door Glass Panels (Dividing indoor & balcony)
  const sliderGeo = new THREE.BoxGeometry(3.8, 2.8, 0.06);
  const leftSlider = new THREE.Mesh(sliderGeo, materials.clearGlass);
  leftSlider.position.set(-2.0, 1.4, -2.35);
  const rightSlider = new THREE.Mesh(sliderGeo, materials.clearGlass);
  rightSlider.position.set(2.0, 1.4, -2.35);
  suite.add(leftSlider, rightSlider);

  // Add King Bed
  const bed = createKingBed(materials);
  bed.position.set(0, 0, 0.6);
  suite.add(bed);

  // Add Lounge Area on Left
  const lounge = createModernLounge(materials);
  lounge.position.set(-2.6, 0, -0.6);
  lounge.rotation.y = 0.45;
  suite.add(lounge);

  // Add Freestanding Bathtub on Right
  const tub = createLuxuryBathtub(materials);
  tub.position.set(3.1, 0, 1.0);
  tub.rotation.y = -Math.PI / 2;
  suite.add(tub);

  // Add Potted Plants
  const plant1 = createPottedPlant(materials);
  plant1.position.set(-3.6, 0, 3.2);
  const plant2 = createPottedPlant(materials);
  plant2.position.set(3.6, 0, -1.8);
  suite.add(plant1, plant2);

  // Add Balcony Furniture
  const balconyFurn = createBalconyFurniture(materials);
  balconyFurn.position.set(0, 0, -3.9);
  suite.add(balconyFurn);

  return suite;
}

// -------------------------------------------------------------
// 2. PRIVATE POOL SANCTUARY VILLA MODEL
// -------------------------------------------------------------

export function buildPoolVillaModel(materials: ReturnType<typeof createRoomMaterials>): THREE.Group {
  const villa = new THREE.Group();

  // Villa Indoor Hardwood Deck (7m x 5m)
  const villaFloor = new THREE.Mesh(
    new THREE.BoxGeometry(7.6, 0.3, 5.2),
    materials.floorWood
  );
  villaFloor.position.set(0, -0.15, 1.4);
  villaFloor.receiveShadow = true;
  villa.add(villaFloor);

  // Sunken Heated Plunge Pool
  const poolWidth = 5.2;
  const poolLength = 4.2;
  const poolRimGeo = new THREE.BoxGeometry(poolWidth + 1.2, 0.4, poolLength + 1.2);
  const poolRim = new THREE.Mesh(poolRimGeo, materials.wallStone);
  poolRim.position.set(-0.8, -0.2, -3.2);
  poolRim.receiveShadow = true;
  villa.add(poolRim);

  // Sparkling Pool Water Plane
  const waterGeo = new THREE.BoxGeometry(poolWidth, 0.1, poolLength);
  const poolWater = new THREE.Mesh(waterGeo, materials.waterMaterial);
  poolWater.position.set(-0.8, -0.06, -3.2);
  villa.add(poolWater);

  // Pool Wooden Sundeck Board
  const deckGeo = new THREE.BoxGeometry(3.0, 0.28, 4.4);
  const sunDeck = new THREE.Mesh(deckGeo, materials.warmAccentWood);
  sunDeck.position.set(3.2, -0.14, -3.2);
  sunDeck.receiveShadow = true;
  villa.add(sunDeck);

  // Rear Wall with Sloped Tropical Louvers
  const rearWall = new THREE.Mesh(
    new THREE.BoxGeometry(7.6, 3.2, 0.25),
    materials.wallPlaster
  );
  rearWall.position.set(0, 1.45, 3.9);
  rearWall.castShadow = true;
  villa.add(rearWall);

  // Side Natural Travertine Stone Walls
  const sideWallL = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 3.2, 5.2),
    materials.wallStone
  );
  sideWallL.position.set(-3.8, 1.45, 1.4);
  villa.add(sideWallL);

  // Tropical Canopy Bed Frame
  const canopyGroup = new THREE.Group();
  const bedCore = createKingBed(materials);
  canopyGroup.add(bedCore);

  // 4 Canopy Corner Posts
  const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.6, 12);
  const p1 = new THREE.Mesh(postGeo, materials.warmAccentWood);
  p1.position.set(-1.25, 1.3, -1.05);
  const p2 = new THREE.Mesh(postGeo, materials.warmAccentWood);
  p2.position.set(1.25, 1.3, -1.05);
  const p3 = new THREE.Mesh(postGeo, materials.warmAccentWood);
  p3.position.set(-1.25, 1.3, 1.25);
  const p4 = new THREE.Mesh(postGeo, materials.warmAccentWood);
  p4.position.set(1.25, 1.3, 1.25);

  // Top Canopy Rails
  const railMat = materials.warmAccentWood;
  const topRailX1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.05, 0.05), railMat);
  topRailX1.position.set(0, 2.6, -1.05);
  const topRailX2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.05, 0.05), railMat);
  topRailX2.position.set(0, 2.6, 1.25);
  const topRailZ1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 2.3), railMat);
  topRailZ1.position.set(-1.25, 2.6, 0.1);
  const topRailZ2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 2.3), railMat);
  topRailZ2.position.set(1.25, 2.6, 0.1);

  canopyGroup.add(p1, p2, p3, p4, topRailX1, topRailX2, topRailZ1, topRailZ2);
  canopyGroup.position.set(0, 0, 1.4);
  villa.add(canopyGroup);

  // Outdoor Rain Shower Garden on Right
  const showerTower = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 2.4, 0.3),
    materials.wallStone
  );
  showerTower.position.set(3.4, 1.2, 0.4);
  const showerHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16),
    materials.brushedBrass
  );
  showerHead.position.set(3.4, 2.3, 0.8);
  villa.add(showerTower, showerHead);

  // Potted Palms and Tropical Greenery
  const pPlant1 = createPottedPlant(materials);
  pPlant1.position.set(-3.2, 0, 3.2);
  const pPlant2 = createPottedPlant(materials);
  pPlant2.position.set(3.2, 0, 3.2);
  const pPlant3 = createPottedPlant(materials);
  pPlant3.position.set(-3.4, 0, -3.5);
  villa.add(pPlant1, pPlant2, pPlant3);

  // Sundeck Lounge
  const deckLounge = createBalconyFurniture(materials);
  deckLounge.position.set(3.0, 0, -3.2);
  deckLounge.rotation.y = Math.PI / 2;
  villa.add(deckLounge);

  return villa;
}

// -------------------------------------------------------------
// 3. SKYLINE CELESTIAL PENTHOUSE MODEL
// -------------------------------------------------------------

export function buildPenthouseModel(materials: ReturnType<typeof createRoomMaterials>): THREE.Group {
  const penthouse = new THREE.Group();

  // Grand Ground Level Marble Floor (9m x 7m)
  const grandFloor = new THREE.Mesh(
    new THREE.BoxGeometry(9.4, 0.3, 7.6),
    materials.wallStone
  );
  grandFloor.position.set(0, -0.15, 0.8);
  grandFloor.receiveShadow = true;
  penthouse.add(grandFloor);

  // Cantilevered Observation Terrace
  const terraceGeo = new THREE.BoxGeometry(9.4, 0.28, 3.4);
  const terrace = new THREE.Mesh(terraceGeo, materials.warmAccentWood);
  terrace.position.set(0, -0.14, -4.4);
  terrace.receiveShadow = true;
  penthouse.add(terrace);

  // Heated Circular Jacuzzi on Terrace
  const jacuzziRimGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.6, 32);
  const jacuzziRim = new THREE.Mesh(jacuzziRimGeo, materials.wallStone);
  jacuzziRim.position.set(-2.6, 0.3, -4.2);
  jacuzziRim.castShadow = true;

  const jacuzziWaterGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.04, 32);
  const jacuzziWater = new THREE.Mesh(jacuzziWaterGeo, materials.waterMaterial);
  jacuzziWater.position.set(-2.6, 0.55, -4.2);
  penthouse.add(jacuzziRim, jacuzziWater);

  // Panoramic Glass Railing with Brass Cap
  const glassRail = new THREE.Mesh(
    new THREE.BoxGeometry(9.2, 1.2, 0.08),
    materials.clearGlass
  );
  glassRail.position.set(0, 0.6, -6.0);
  const brassCap = new THREE.Mesh(
    new THREE.BoxGeometry(9.3, 0.06, 0.08),
    materials.brushedBrass
  );
  brassCap.position.set(0, 1.22, -6.0);
  penthouse.add(glassRail, brassCap);

  // Double-Height Rear Wall
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(9.4, 4.8, 0.25),
    materials.wallPlaster
  );
  backWall.position.set(0, 2.25, 4.4);
  backWall.castShadow = true;
  penthouse.add(backWall);

  // Upper Mezzanine Loft Platform (Floating Master Bedroom)
  const loftGeo = new THREE.BoxGeometry(4.8, 0.25, 3.6);
  const loftFloor = new THREE.Mesh(loftGeo, materials.floorWood);
  loftFloor.position.set(-2.2, 2.2, 2.4);
  loftFloor.castShadow = true;
  penthouse.add(loftFloor);

  // Loft Glass Balustrade
  const loftGlass = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 0.9, 0.06),
    materials.clearGlass
  );
  loftGlass.position.set(-2.2, 2.75, 0.6);
  penthouse.add(loftGlass);

  // Master Bed situated on Mezzanine Loft
  const loftBed = createKingBed(materials);
  loftBed.position.set(-2.2, 2.32, 2.2);
  penthouse.add(loftBed);

  // Floating Architectural Staircase
  for (let i = 0; i < 11; i++) {
    const stepGeo = new THREE.BoxGeometry(0.9, 0.08, 0.32);
    const step = new THREE.Mesh(stepGeo, materials.warmAccentWood);
    step.position.set(0.6, i * 0.2, 3.8 - i * 0.28);
    step.castShadow = true;
    penthouse.add(step);
  }

  // Designer Wet Bar Counter on Lower Level (Right side)
  const barGeo = new THREE.BoxGeometry(2.4, 1.0, 0.65);
  const barCounter = new THREE.Mesh(barGeo, materials.wallStone);
  barCounter.position.set(3.0, 0.5, -0.8);
  barCounter.castShadow = true;

  // 3 Bar Stools
  for (let s = 0; s < 3; s++) {
    const stoolLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.03, 0.65, 12),
      materials.darkMetal
    );
    stoolLeg.position.set(2.4 + (s - 1) * 0.7, 0.325, -1.4);
    const stoolSeat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16),
      materials.warmAccentWood
    );
    stoolSeat.position.set(2.4 + (s - 1) * 0.7, 0.68, -1.4);
    penthouse.add(stoolLeg, stoolSeat);
  }
  penthouse.add(barCounter);

  // Lower Level Lounge Seating
  const lounge = createModernLounge(materials);
  lounge.position.set(-1.8, 0, -1.2);
  penthouse.add(lounge);

  // Decorative Plants
  const pl1 = createPottedPlant(materials);
  pl1.position.set(4.0, 0, 3.8);
  const pl2 = createPottedPlant(materials);
  pl2.position.set(3.8, 0, -4.5);
  penthouse.add(pl1, pl2);

  return penthouse;
}

// -------------------------------------------------------------
// 4. RESORT OVERVIEW & ARCHITECTURAL COMPLEX
// -------------------------------------------------------------

export function buildResortOverviewModel(materials: ReturnType<typeof createRoomMaterials>): THREE.Group {
  const resort = new THREE.Group();

  // Coastal Base Platform (Landscape & Beach edge)
  const landGeo = new THREE.CylinderGeometry(14, 14.5, 0.5, 48);
  const landMat = new THREE.MeshStandardMaterial({
    color: 0xF3EFE6,
    roughness: 0.85,
  });
  const land = new THREE.Mesh(landGeo, landMat);
  land.position.y = -0.25;
  land.receiveShadow = true;
  resort.add(land);

  // Ocean Water Outer Ring
  const waterGeo = new THREE.CylinderGeometry(18, 18, 0.35, 48);
  const ocean = new THREE.Mesh(waterGeo, materials.waterMaterial);
  ocean.position.y = -0.4;
  resort.add(ocean);

  // Main Grand Atrium Pavilion (Multi-tiered modernist structure)
  const pavilionBase = new THREE.Mesh(
    new THREE.BoxGeometry(6.0, 1.8, 4.5),
    materials.wallPlaster
  );
  pavilionBase.position.set(0, 0.9, 1.5);
  pavilionBase.castShadow = true;
  pavilionBase.receiveShadow = true;

  // Cantilevered Shading Roof
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 0.2, 5.4),
    materials.warmAccentWood
  );
  roof.position.set(0, 1.85, 1.5);
  roof.castShadow = true;
  resort.add(pavilionBase, roof);

  // Terraced Ocean Suites Wing (Left)
  for (let floor = 0; floor < 3; floor++) {
    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(3.8 - floor * 0.3, 0.8, 3.2 - floor * 0.2),
      materials.wallStone
    );
    wing.position.set(-5.5 + floor * 0.2, 0.4 + floor * 0.8, 0.5 - floor * 0.3);
    wing.castShadow = true;
    resort.add(wing);
  }

  // Private Pool Villas (Right side freestanding pavilions)
  for (let v = 0; v < 3; v++) {
    const villaBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.7, 1.8),
      materials.wallPlaster
    );
    villaBase.position.set(4.8 + (v % 2) * 1.6, 0.35, -1.0 + v * 2.2);
    villaBase.castShadow = true;

    // Small Villa Private Pool
    const vPool = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.08, 1.0),
      materials.waterMaterial
    );
    vPool.position.set(4.8 + (v % 2) * 1.6 - 0.2, 0.1, -1.0 + v * 2.2 - 1.2);

    resort.add(villaBase, vPool);
  }

  // Central Resort Grand Infinity Lagoon
  const lagoonGeo = new THREE.BoxGeometry(5.2, 0.15, 3.0);
  const lagoon = new THREE.Mesh(lagoonGeo, materials.waterMaterial);
  lagoon.position.set(0, 0.08, -2.5);
  resort.add(lagoon);

  // Sun Loungers along Lagoon
  for (let l = 0; l < 4; l++) {
    const lounger = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.08, 0.9),
      materials.linenFabric
    );
    lounger.position.set(-1.8 + l * 1.2, 0.1, -4.2);
    lounger.castShadow = true;
    resort.add(lounger);
  }

  // Stylized Minimalist Palm Trees
  for (let p = 0; p < 8; p++) {
    const palm = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.06, 0.1, 1.8, 8);
    const trunk = new THREE.Mesh(trunkGeo, materials.warmAccentWood);
    trunk.position.y = 0.9;
    trunk.rotation.z = (Math.random() - 0.5) * 0.2;

    const crownGeo = new THREE.ConeGeometry(0.8, 0.9, 7);
    const crown = new THREE.Mesh(crownGeo, materials.plantLeaf);
    crown.position.y = 1.9;

    palm.add(trunk, crown);
    const angle = (p / 8) * Math.PI * 2;
    const rad = 7.5 + (p % 3) * 1.5;
    palm.position.set(Math.cos(angle) * rad, 0, Math.sin(angle) * rad);
    resort.add(palm);
  }

  return resort;
}
