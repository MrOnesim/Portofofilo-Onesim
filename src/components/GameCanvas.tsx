import React, { useEffect, useRef, useState } from "react";
import { 
  PROJECTS_DATA, 
  SOCIAL_LINKS, 
  Project 
} from "../data/portfolioData";
import { 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Sun, 
  Moon, 
  List, 
  Info, 
  Play, 
  Zap,
  CheckCircle,
  Compass
} from "lucide-react";
import sound from "../utils/SoundSystem";

interface GameCanvasProps {
  onSwitchToClassic: () => void;
  onOpenProject: (project: Project) => void;
}

// Car Skin Configuration
interface CarSkin {
  id: string;
  name: string;
  color: string;
  cabinColor: string;
  wheelColor: string;
  maxSpeed: number;
  acceleration: number;
  handling: number;
  driftiness: number;
  mass: number;
  length: number;
  width: number;
}

const CAR_SKINS: CarSkin[] = [
  {
    id: "red-toy",
    name: "Red Speedster",
    color: "#ff3e00",
    cabinColor: "#ffe5e0",
    wheelColor: "#1a1614",
    maxSpeed: 5.8,
    acceleration: 0.17,
    handling: 0.07,
    driftiness: 0.6,
    mass: 1.0,
    length: 46,
    width: 26
  },
  {
    id: "green-truck",
    name: "Monster Truck",
    color: "#16a34a",
    cabinColor: "#dcfce7",
    wheelColor: "#222222",
    maxSpeed: 4.5,
    acceleration: 0.14,
    handling: 0.05,
    driftiness: 0.35,
    mass: 2.2,
    length: 54,
    width: 38
  },
  {
    id: "cybertruck",
    name: "CyberTruck",
    color: "#9ca3af",
    cabinColor: "#374151",
    wheelColor: "#111111",
    maxSpeed: 6.5,
    acceleration: 0.19,
    handling: 0.055,
    driftiness: 0.85,
    mass: 1.5,
    length: 50,
    width: 28
  },
  {
    id: "f1-racer",
    name: "Formula F1",
    color: "#eab308",
    cabinColor: "#000000",
    wheelColor: "#2a2118",
    maxSpeed: 7.5,
    acceleration: 0.25,
    handling: 0.09,
    driftiness: 0.2,
    mass: 0.75,
    length: 48,
    width: 25
  }
];

// Physics Body definition
interface PhysicsBody {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number; // Collision radius
  angle: number;
  av: number; // Angular velocity
  mass: number;
  isStatic: boolean;
  type: "block" | "pin" | "billboard" | "social" | "text-block" | "pickup";
  width?: number;
  height?: number;
  label?: string;
  color?: string;
  textColor?: string;
  topColor?: string;
  sideColor?: string;
  isKnockedOver?: boolean;
  targetUrl?: string;
  projectRef?: Project;
}

interface Coin {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  respawnTimer: number;
  pulse: number;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface SkidMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
}

// Falling Ambient weather leaf/particle
interface WeatherParticle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  color: string;
  angle: number;
  spinSpeed: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ onSwitchToClassic, onOpenProject }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(sound.getMuteState());
  const [isNightMode, setIsNightMode] = useState(false);
  const [selectedSkin, setSelectedSkin] = useState<CarSkin>(CAR_SKINS[0]);
  const [activeBillboard, setActiveBillboard] = useState<PhysicsBody | null>(null);
  const activeBillboardRef = useRef<PhysicsBody | null>(null);
  
  // Custom paint color (interactive customizer)
  const [customColor, setCustomColor] = useState("#ff3e00");
  const [customUnderglow, setCustomUnderglow] = useState("#ff00c8");
  const [enableUnderglow, setEnableUnderglow] = useState(true);

  // Dynamic Minimap Scale
  const [showMinimap, setShowMinimap] = useState(true);

  // Game metrics
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [bowlingScore, setBowlingScore] = useState(0);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [showControlsHint, setShowControlsHint] = useState(true);

  // Real-time coordinates for live minimap reporting
  const [carCoords, setCarCoords] = useState({ x: 1250, y: 1400 });

  // Quest / Achievements System
  const [quests, setQuests] = useState({
    speedDemon: { name: "Vitesse Extreme (>100 km/h Turbo)", done: false, desc: "Utilise SHIFT pour le boost" },
    goldRush: { name: "Collectionneur (5 pieces)", done: false, desc: "Collecte les anneaux brillants" },
    jengaStrike: { name: "Demolition de competences", done: false, desc: "Percute la pile de briques tech" },
    strikePins: { name: "Champion de Quilles (5 tombees)", done: false, desc: "Heurte les quilles en bas a gauche" },
    skyHigh: { name: "Saut Propulse!", done: false, desc: "Saute depuis la rampe en bois" }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // References for active input keys
  const keysRef = useRef<{ [key: string]: boolean }>({});
  
  // Virtual controls for mobile
  const [isMobile, setIsMobile] = useState(false);
  const touchState = useRef({
    turnLeft: false,
    turnRight: false,
    forward: false,
    reverse: false,
    drift: false,
    turbo: false
  });

  // Check if touch device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleMute = () => {
    const state = sound.toggleMute();
    setIsMuted(state);
  };

  // Main Loop logic inside useEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = containerRef.current?.clientWidth || window.innerWidth;
      const height = containerRef.current?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial setup of physical items
    const MAP_WIDTH = 2500;
    const MAP_HEIGHT = 2500;

    // Car Initial State
    const car = {
      x: 1250,
      y: 1400,
      z: 0,
      vz: 0,
      angle: -Math.PI / 2, // facing north
      speed: 0,
      vx: 0,
      vy: 0,
      steering: 0,
      driftFactor: 0,
      isDrifting: false,
      skidTimer: 0,
      onRamp: false,
      lastLandTimer: 0,
      invulnerable: 0,
      isTurboActive: false
    };

    // Camera State
    const camera = {
      x: car.x,
      y: car.y,
      zoom: 1,
      targetZoom: 1
    };

    // Persistent arrays
    let bodies: PhysicsBody[] = [];
    let coins: Coin[] = [];
    let particles: Particle[] = [];
    let skidMarks: SkidMark[] = [];
    let weatherParticles: WeatherParticle[] = [];

    // Initialize falling wind leaf particles
    for (let w = 0; w < 40; w++) {
      weatherParticles.push({
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        speedX: -1 - Math.random() * 2,
        speedY: 0.5 + Math.random() * 1.5,
        size: 3 + Math.random() * 4,
        color: isNightMode ? "rgba(56, 189, 248, 0.4)" : "rgba(244, 114, 182, 0.45)", // pink cherry blossoms or cyan sparks
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.05
      });
    }

    // Helper to generate a unique ID
    const uid = () => Math.random().toString(36).substr(2, 9);

    // Initialise Map Bodies
    const setupMap = () => {
      bodies = [];
      coins = [];
      skidMarks = [];
      particles = [];

      // 1. Giant title letters: "BRUNO SIMON"
      const titleString = "ONESIM";
      const charSpacing = 85;
      const titleStartX = 1250 - (titleString.length * charSpacing) / 2;
      const titleY = 1050;

      for (let i = 0; i < titleString.length; i++) {
        const char = titleString[i];
        bodies.push({
          id: `title-${char}-${uid()}`,
          x: titleStartX + i * charSpacing,
          y: titleY,
          vx: 0,
          vy: 0,
          r: 28,
          angle: 0,
          av: 0,
          mass: 1.1,
          isStatic: false,
          type: "text-block",
          label: char,
          color: "#fffcf7",
          topColor: "#ec4899", // bright hot pink top
          sideColor: "#be185d" // darker pink sides
        });
      }

      // 2. SKILLS PILE (Tower Stack / Jenga Block)
      const skillsX = 1850;
      const skillsY = 1650;
      const techList = [
        { name: "React", color: "#61dafb", side: "#00b4d8" },
        { name: "TypeScript", color: "#3178c6", side: "#1d4ed8" },
        { name: "Three.js", color: "#ff4b4b", side: "#b91c1c" },
        { name: "WebGL", color: "#ef4444", side: "#991b1b" },
        { name: "Vite", color: "#646cff", side: "#4d3eff" },
        { name: "Tailwind", color: "#38bdf8", side: "#0284c7" },
        { name: "Node.js", color: "#339933", side: "#166534" },
        { name: "Blender", color: "#f97316", side: "#c2410c" },
        { name: "GLSL", color: "#a855f7", side: "#6b21a8" }
      ];

      // Lay them out in a triangular wall or stack
      let techIdx = 0;
      const rowSpacingX = 85;
      const rowSpacingY = 80;
      for (let row = 0; row < 3; row++) {
        const cols = 3 - row;
        const startX = skillsX - ((cols - 1) * rowSpacingX) / 2;
        const currentY = skillsY - row * rowSpacingY;

        for (let col = 0; col < cols; col++) {
          if (techIdx < techList.length) {
            const tech = techList[techIdx++];
            bodies.push({
              id: `skill-${tech.name}`,
              x: startX + col * rowSpacingX + (Math.random() - 0.5) * 5,
              y: currentY + (Math.random() - 0.5) * 5,
              vx: 0,
              vy: 0,
              r: 35,
              angle: (Math.random() - 0.5) * 0.1,
              av: 0,
              mass: 1.4,
              isStatic: false,
              type: "block",
              label: tech.name,
              color: "#fff",
              topColor: tech.color,
              sideColor: tech.side
            });
          }
        }
      }

      // 3. BOWLING PINS (Bottom-left area)
      const bowlX = 650;
      const bowlY = 1750;
      const pinRows = 4;
      const pinSpacingX = 40;
      const pinSpacingY = 45;
      let pinCount = 1;

      for (let r = 0; r < pinRows; r++) {
        const startPinX = bowlX - (r * pinSpacingX) / 2;
        const currentPinY = bowlY - r * pinSpacingY;

        for (let c = 0; c <= r; c++) {
          bodies.push({
            id: `pin-${pinCount++}`,
            x: startPinX + c * pinSpacingX,
            y: currentPinY,
            vx: 0,
            vy: 0,
            r: 14,
            angle: 0,
            av: 0,
            mass: 0.45,
            isStatic: false,
            type: "pin",
            color: "#ffffff",
            topColor: "#ef4444", // red stripe
            sideColor: "#d1d5db",
            isKnockedOver: false
          });
        }
      }

      // 4. PROJECTS BILLBOARD STANDS (Top-Right area)
      const projX = 1850;
      const projY = 700;
      const projPositions = [
        { x: projX - 180, y: projY - 140 },
        { x: projX + 180, y: projY - 140 },
        { x: projX - 180, y: projY + 140 },
        { x: projX + 180, y: projY + 140 },
        { x: projX - 340, y: projY },
        { x: projX + 340, y: projY }
      ];

      PROJECTS_DATA.forEach((proj, idx) => {
        const pos = projPositions[idx] || { x: projX, y: projY };
        bodies.push({
          id: `project-${proj.id}`,
          x: pos.x,
          y: pos.y,
          vx: 0,
          vy: 0,
          r: 50,
          angle: 0,
          av: 0,
          mass: Infinity, // unmoveable structure
          isStatic: true,
          type: "billboard",
          label: proj.title,
          color: proj.color,
          projectRef: proj
        });
      });

      // 5. PROJECT PICKUPS - Glowing cubes near billboards
      PROJECTS_DATA.forEach((proj, idx) => {
        const pos = projPositions[idx] || { x: projX, y: projY };
        const pickupAngle = (idx / PROJECTS_DATA.length) * Math.PI * 2;
        const orbitR = 90;
        bodies.push({
          id: `pickup-${proj.id}`,
          x: pos.x + Math.cos(pickupAngle) * orbitR,
          y: pos.y + Math.sin(pickupAngle) * orbitR,
          vx: 0,
          vy: 0,
          r: 20,
          angle: 0,
          av: 0.02,
          mass: 1.5,
          isStatic: false,
          type: "pickup",
          label: proj.title,
          color: proj.color,
          projectRef: proj,
        });
      });

      // 6. SOCIAL MEDIA BLOCKS (Top-Center area)
      const socY = 480;
      const socX = 1250;
      const socialConfigs = [
        { name: "GITHUB", url: SOCIAL_LINKS.github, color: "#1a1614", side: "#000", x: socX - 220 },
        { name: "LINKEDIN", url: SOCIAL_LINKS.linkedin, color: "#0077b5", side: "#004471", x: socX - 70 },
        { name: "TWITTER", url: SOCIAL_LINKS.twitter, color: "#191919", side: "#0d0d0d", x: socX + 80 },
        { name: "EMAIL ME", url: SOCIAL_LINKS.email, color: "#ff3e00", side: "#c02c00", x: socX + 230 }
      ];

      socialConfigs.forEach((sc) => {
        bodies.push({
          id: `social-${sc.name}`,
          x: sc.x,
          y: socY,
          vx: 0,
          vy: 0,
          r: 38,
          angle: 0,
          av: 0,
          mass: 1.8,
          isStatic: false,
          type: "social",
          label: sc.name,
          color: "#fff",
          topColor: sc.color,
          sideColor: sc.side,
          targetUrl: sc.url
        });
      });

      // 6. FLOATING COINS
      const coinLocations = [
        // start ring
        { x: 1250 - 150, y: 1400 },
        { x: 1250 + 150, y: 1400 },
        { x: 1250, y: 1400 + 150 },
        // near title
        { x: 1000, y: 1050 },
        { x: 1500, y: 1050 },
        // ramp approach and landing
        { x: 1250, y: 920 },
        { x: 1250, y: 720 },
        { x: 1250, y: 640 },
        // near projects
        { x: 1850, y: 700 },
        { x: 1670, y: 560 },
        { x: 2030, y: 840 },
        // near skills
        { x: 1850, y: 1450 },
        { x: 1850, y: 1850 },
        // near bowling lane
        { x: 650, y: 1500 },
        { x: 650, y: 1950 },
        // around about me desk
        { x: 500, y: 800 },
        { x: 380, y: 650 },
        { x: 620, y: 950 }
      ];

      coinLocations.forEach((loc, idx) => {
        coins.push({
          id: `coin-${idx}`,
          x: loc.x,
          y: loc.y,
          collected: false,
          respawnTimer: 0,
          pulse: Math.random() * Math.PI
        });
      });
    };

    setupMap();

    // RAMP bounding box definition (wood ramp to jump)
    const ramp = {
      x: 1250,
      y: 840,
      width: 80,
      height: 120,
      angle: 0 // straight up
    };

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[e.key] = true;
      keysRef.current[key] = true;

      // Reset
      if (key === "r") {
        sound.playClick();
        car.x = 1250;
        car.y = 1400;
        car.z = 0;
        car.vz = 0;
        car.angle = -Math.PI / 2;
        car.speed = 0;
        car.vx = 0;
        car.vy = 0;
        car.steering = 0;
        setupMap();
        setBowlingScore(0);
        setActiveBillboard(null);
        setQuests({
          speedDemon: { name: "Vitesse Extreme (>100 km/h Turbo)", done: false, desc: "Utilise SHIFT pour le boost" },
          goldRush: { name: "Collectionneur (5 pieces)", done: false, desc: "Collecte les anneaux brillants" },
          jengaStrike: { name: "Demolition de competences", done: false, desc: "Percute la pile de briques tech" },
          strikePins: { name: "Champion de Quilles (5 tombees)", done: false, desc: "Heurte les quilles en bas a gauche" },
          skyHigh: { name: "Saut Propulse!", done: false, desc: "Saute depuis la rampe en bois" }
        });
        setCoinsCollected(0);
        triggerToast("Scene, scores et quetes reinitialises avec succes!");
      }

      // Enter key to open highlighted project
      if (key === "enter" && activeBillboardRef.current?.projectRef) {
        sound.playClick();
        onOpenProject(activeBillboardRef.current.projectRef);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[e.key] = false;
      keysRef.current[key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Particle Emitter
    const spawnDust = (x: number, y: number, color: string = "#fffcf7") => {
      particles.push({
        x,
        y,
        z: 0,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        vz: Math.random() * 1.2,
        size: 3 + Math.random() * 5,
        color,
        alpha: 0.6,
        life: 0,
        maxLife: 20 + Math.random() * 20
      });
    };

    const spawnSparkles = (x: number, y: number, color: string = "#fbbf24") => {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const spd = 1.5 + Math.random() * 2.5;
        particles.push({
          x,
          y,
          z: 8,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          vz: 1 + Math.random() * 3,
          size: 2 + Math.random() * 3,
          color,
          alpha: 1,
          life: 0,
          maxLife: 25 + Math.random() * 15
        });
      }
    };

    const spawnTurboFlame = (x: number, y: number, angle: number) => {
      // emit neon fire trail
      const backwardX = -Math.cos(angle);
      const backwardY = -Math.sin(angle);
      const spread = 0.45;
      
      particles.push({
        x: x + backwardX * 18,
        y: y + backwardY * 18,
        z: 3,
        vx: backwardX * (3 + Math.random() * 3) + (Math.random() - 0.5) * spread,
        vy: backwardY * (3 + Math.random() * 3) + (Math.random() - 0.5) * spread,
        vz: 0.5 + Math.random() * 1.5,
        size: 4 + Math.random() * 6,
        color: Math.random() > 0.4 ? "#f43f5e" : "#a855f7", // hot pink & purple fire
        alpha: 1,
        life: 0,
        maxLife: 15 + Math.random() * 10
      });
    };

    // GAME LOOP
    let animationId: number;

    const tick = () => {
      // 1. Gather inputs
      const keys = keysRef.current;
      const isUp = keys["arrowup"] || keys["w"] || touchState.current.forward;
      const isDown = keys["arrowdown"] || keys["s"] || touchState.current.reverse;
      const isLeft = keys["arrowleft"] || keys["a"] || touchState.current.turnLeft;
      const isRight = keys["arrowright"] || keys["d"] || touchState.current.turnRight;
      const isSpace = keys[" "] || touchState.current.drift;
      const isShift = keys["shift"] || touchState.current.turbo;

      // 2. Resolve Car Stats based on skin selected
      const currentSkin = selectedSkin;

      // Turbo booster modification
      let finalMaxSpeed = currentSkin.maxSpeed;
      let finalAcceleration = currentSkin.acceleration;
      if (isShift && isUp && car.z === 0) {
        finalMaxSpeed *= 1.55; // huge speed surge
        finalAcceleration *= 1.8;
        car.isTurboActive = true;
        
        if (Math.random() < 0.6) {
          spawnTurboFlame(car.x, car.y, car.angle);
        }
        if (Math.random() < 0.1) {
          sound.playTurbo();
        }
      } else {
        car.isTurboActive = false;
      }

      // 3. Drive Model Physics (Acceleration, Steering, Drifting, Jumping)
      let targetSteering = 0;
      if (isLeft) targetSteering = -currentSkin.handling;
      if (isRight) targetSteering = currentSkin.handling;
      car.steering += (targetSteering - car.steering) * 0.18;

      // Acceleration / Brake
      if (car.z === 0) {
        if (isUp) {
          car.speed += finalAcceleration;
          if (car.speed > finalMaxSpeed) car.speed = finalMaxSpeed;
        } else if (isDown) {
          car.speed -= finalAcceleration * 0.75;
          if (car.speed < -finalMaxSpeed * 0.4) car.speed = -finalMaxSpeed * 0.4;
        } else {
          car.speed *= 0.95; // passive friction
        }
      }

      // Drift physics (friction reduction side-ways)
      const slipThreshold = 1.8;
      car.isDrifting = isSpace && Math.abs(car.speed) > slipThreshold && car.z === 0;

      // Apply steering to angle
      const speedFactor = Math.min(1, Math.abs(car.speed) / 1.5);
      car.angle += car.steering * car.speed * 0.15 * (car.isDrifting ? 1.6 : 1.0) * speedFactor;

      const forwardX = Math.cos(car.angle);
      const forwardY = Math.sin(car.angle);

      if (car.z === 0) {
        if (car.isDrifting) {
          const driftGrip = 1 - currentSkin.driftiness * 0.08;
          car.vx = car.vx * driftGrip + forwardX * car.speed * (1 - driftGrip);
          car.vy = car.vy * driftGrip + forwardY * car.speed * (1 - driftGrip);
          
          car.skidTimer++;
          if (car.skidTimer % 2 === 0) {
            const rearLeftX = car.x - Math.cos(car.angle) * 12 + Math.sin(car.angle) * 10;
            const rearLeftY = car.y - Math.sin(car.angle) * 12 - Math.cos(car.angle) * 10;
            const rearRightX = car.x - Math.cos(car.angle) * 12 - Math.sin(car.angle) * 10;
            const rearRightY = car.y - Math.sin(car.angle) * 12 + Math.cos(car.angle) * 10;

            skidMarks.push({ x1: rearLeftX, y1: rearLeftY, x2: rearLeftX + car.vx * 0.1, y2: rearLeftY + car.vy * 0.1, alpha: 0.45 });
            skidMarks.push({ x1: rearRightX, y1: rearRightY, x2: rearRightX + car.vx * 0.1, y2: rearRightY + car.vy * 0.1, alpha: 0.45 });

            spawnDust(car.x - forwardX * 18, car.y - forwardY * 18, isNightMode ? "#333" : "#d8c7ba");
          }
        } else {
          car.vx = forwardX * car.speed;
          car.vy = forwardY * car.speed;

          if (Math.abs(car.speed) > 0.5 && Math.random() < 0.25) {
            spawnDust(car.x - forwardX * 18, car.y - forwardY * 18, isNightMode ? "#222" : "#ebdccb");
          }
        }
      } else {
        // In-air flight physics
        car.x += car.vx;
        car.y += car.vy;

        car.vz -= 0.25;
        car.z += car.vz;

        if (car.z <= 0) {
          car.z = 0;
          car.vz = 0;
          sound.playCrash(0.85);
          car.lastLandTimer = 15;
          for (let s = 0; s < 10; s++) {
            spawnDust(car.x + (Math.random() - 0.5) * 20, car.y + (Math.random() - 0.5) * 20, isNightMode ? "#444" : "#d1c4b7");
          }

          // Trigger Air Jump quest
          setQuests((prev) => {
            if (!prev.skyHigh.done) {
              sound.playAchievement();
              triggerToast("🏆 SUCCES: Saut Propulse!");
              return { ...prev, skyHigh: { ...prev.skyHigh, done: true } };
            }
            return prev;
          });
        }
      }

      if (car.z === 0) {
        car.x += car.vx;
        car.y += car.vy;
      }

      // Update real-time state for minimap reporting
      setCarCoords({ x: Math.round(car.x), y: Math.round(car.y) });

      // Update audio
      sound.setEngineSpeed(Math.abs(car.speed) / finalMaxSpeed);
      sound.setDriftActive(car.isDrifting);

      // JUMP RAMP TRIGGER
      const halfWidth = ramp.width / 2;
      const halfHeight = ramp.height / 2;
      const inRampX = car.x >= ramp.x - halfWidth && car.x <= ramp.x + halfWidth;
      const inRampY = car.y >= ramp.y - halfHeight && car.y <= ramp.y + halfHeight;

      if (inRampX && inRampY && car.z === 0) {
        const progressFactor = (ramp.y + halfHeight - car.y) / ramp.height;
        if (progressFactor >= 0 && progressFactor <= 1) {
          car.z = progressFactor * 32;
          car.onRamp = true;
        }

        if (car.y <= ramp.y - halfHeight + 15 && car.vy < 0) {
          car.z = 32;
          car.vz = Math.abs(car.speed) * 0.95 + 2.8; // launch high!
          car.onRamp = false;
          sound.playJump();
          spawnSparkles(car.x, car.y, "#ec4899");
        }
      } else {
        if (car.onRamp && car.z > 0 && car.vz === 0) {
          car.vz = 0;
          car.onRamp = false;
        }
      }

      // BOUNDARY COLLISIONS
      const MARGIN = 80;
      if (car.x < MARGIN) { car.x = MARGIN; car.vx = -car.vx * 0.3; car.speed = -car.speed * 0.3; sound.playCrash(0.3); }
      if (car.x > MAP_WIDTH - MARGIN) { car.x = MAP_WIDTH - MARGIN; car.vx = -car.vx * 0.3; car.speed = -car.speed * 0.3; sound.playCrash(0.3); }
      if (car.y < MARGIN) { car.y = MARGIN; car.vy = -car.vy * 0.3; car.speed = -car.speed * 0.3; sound.playCrash(0.3); }
      if (car.y > MAP_HEIGHT - MARGIN) { car.y = MAP_HEIGHT - MARGIN; car.vy = -car.vy * 0.3; car.speed = -car.speed * 0.3; sound.playCrash(0.3); }

      // OBJECT-TO-OBJECT COLLISIONS & RIGID BODIES
      let currentActiveBillboard: PhysicsBody | null = null;
      let knockedOverPinCount = 0;

      // Update body physics
      bodies.forEach((b) => {
        if (b.isStatic) return;

        b.vx *= 0.94;
        b.vy *= 0.94;
        b.av *= 0.93;

        b.x += b.vx;
        b.y += b.vy;
        b.angle += b.av;

        if (b.x < MARGIN) { b.x = MARGIN; b.vx = -b.vx * 0.5; }
        if (b.x > MAP_WIDTH - MARGIN) { b.x = MAP_WIDTH - MARGIN; b.vx = -b.vx * 0.5; }
        if (b.y < MARGIN) { b.y = MARGIN; b.vy = -b.vy * 0.5; }
        if (b.y > MAP_HEIGHT - MARGIN) { b.y = MAP_HEIGHT - MARGIN; b.vy = -b.vy * 0.5; }

        if (b.type === "pin" && b.isKnockedOver) {
          knockedOverPinCount++;
        }
      });

      // CAR COLLISION with BODIES
      const carRadius = currentSkin.length / 2;

      for (const b of bodies) {
        const dx = b.x - car.x;
        const dy = b.y - car.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = carRadius + b.r;

        if (dist < minDist) {
          if (b.isStatic) {
            const overlap = minDist - dist;
            const pushX = (dx / dist) * overlap;
            const pushY = (dy / dist) * overlap;

            car.x -= pushX;
            car.y -= pushY;
            car.vx = -car.vx * 0.4;
            car.vy = -car.vy * 0.4;
            car.speed = -car.speed * 0.4;

            if (b.type === "billboard") {
              currentActiveBillboard = b;
            }

            if (Math.abs(car.speed) > 1.0) {
              sound.playCrash(Math.abs(car.speed) / finalMaxSpeed);
              for (let d = 0; d < 4; d++) spawnDust(b.x, b.y, b.color || "#ff3e00");
            }
          } else {
            const overlap = minDist - dist;
            const pushX = (dx / dist) * overlap;
            const pushY = (dy / dist) * overlap;

            if (car.z === 0) {
              b.x += pushX * 0.8;
              b.y += pushY * 0.8;
              car.x -= pushX * 0.2;
              car.y -= pushY * 0.2;

              const normalX = dx / dist;
              const normalY = dy / dist;

              const rvx = b.vx - car.vx;
              const rvy = b.vy - car.vy;

              const velAlongNormal = rvx * normalX + rvy * normalY;

              if (velAlongNormal < 0) {
                const restitution = 0.5;
                let impulseScalar = -(1 + restitution) * velAlongNormal;
                impulseScalar /= (1 / currentSkin.mass + 1 / b.mass);

                b.vx += (1 / b.mass) * impulseScalar * normalX;
                b.vy += (1 / b.mass) * impulseScalar * normalY;
                
                car.vx -= (1 / currentSkin.mass) * impulseScalar * normalX;
                car.vy -= (1 / currentSkin.mass) * impulseScalar * normalY;
                car.speed = Math.sqrt(car.vx * car.vx + car.vy * car.vy) * (car.speed < 0 ? -1 : 1);

                b.av = (Math.random() - 0.5) * 0.15 * Math.abs(car.speed);

                // Achievements Check: Scatter technology block pile
                if (b.id.startsWith("skill-")) {
                  setQuests((prev) => {
                    if (!prev.jengaStrike.done) {
                      sound.playAchievement();
                      triggerToast("🏆 SUCCES: Demolition de competences!");
                      return { ...prev, jengaStrike: { ...prev.jengaStrike, done: true } };
                    }
                    return prev;
                  });
                }

                if (b.type === "pin" && !b.isKnockedOver) {
                  b.isKnockedOver = true;
                  sound.playStrike();
                  b.topColor = "#ef4444";
                }

                if (b.type === "social" && Math.abs(car.speed) > 1.5) {
                  b.av = 0.4 * (Math.random() > 0.5 ? 1 : -1);
                  sound.playCoin();
                  
                  // Open social profile URL on solid hit
                  if (b.targetUrl) {
                    setTimeout(() => {
                      window.open(b.targetUrl, "_blank");
                    }, 400);
                  }
                }

                if (b.type === "pickup" && b.projectRef) {
                  if (!b.isKnockedOver) {
                    b.isKnockedOver = true;
                    sound.playPickup();
                    for (let d = 0; d < 12; d++) {
                      const a = (d / 12) * Math.PI * 2;
                      particles.push({
                        x: b.x, y: b.y, z: 0,
                        vx: Math.cos(a) * 3 + (Math.random() - 0.5) * 2,
                        vy: Math.sin(a) * 3 + (Math.random() - 0.5) * 2,
                        vz: Math.random() * 5,
                        size: 3 + Math.random() * 4,
                        color: b.color || "#3b82f6",
                        alpha: 1, life: 40, maxLife: 40,
                      });
                    }
                    setTimeout(() => {
                      if (b.projectRef) onOpenProject(b.projectRef);
                    }, 400);
                    setTimeout(() => {
                      b.isKnockedOver = false;
                    }, 5000);
                  }
                }

                sound.playCrash(Math.abs(car.speed) / finalMaxSpeed);
              }
            }
          }
        }
      }

      // BLOCK-TO-BLOCK COLLISION (Inter-body)
      for (let i = 0; i < bodies.length; i++) {
        const bi = bodies[i];
        if (bi.isStatic) continue;

        for (let j = i + 1; j < bodies.length; j++) {
          const bj = bodies[j];
          if (bj.isStatic) continue;

          const dx = bj.x - bi.x;
          const dy = bj.y - bi.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = bi.r + bj.r;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const pushX = (dx / dist) * overlap;
            const pushY = (dy / dist) * overlap;

            bi.x -= pushX * 0.5;
            bi.y -= pushY * 0.5;
            bj.x += pushX * 0.5;
            bj.y += pushY * 0.5;

            const tempVx = bi.vx;
            const tempVy = bi.vy;
            bi.vx = bi.vx * 0.5 + bj.vx * 0.5;
            bi.vy = bi.vy * 0.5 + bj.vy * 0.5;
            bj.vx = bj.vx * 0.5 + tempVx * 0.5;
            bj.vy = bj.vy * 0.5 + tempVy * 0.5;

            bi.av = (Math.random() - 0.5) * 0.15;
            bj.av = (Math.random() - 0.5) * 0.15;

            if (bi.type === "pin" && bj.type === "pin") {
              if ((bi.isKnockedOver || bj.isKnockedOver) && !(bi.isKnockedOver && bj.isKnockedOver)) {
                bi.isKnockedOver = true;
                bj.isKnockedOver = true;
                sound.playStrike();
              }
            }
          }
        }
      }

      // Update scoring
      if (knockedOverPinCount !== bowlingScore) {
        setBowlingScore(knockedOverPinCount);

        if (knockedOverPinCount >= 5) {
          setQuests((prev) => {
            if (!prev.strikePins.done) {
              sound.playAchievement();
              triggerToast("🏆 SUCCES: Champion de Quilles (5 tombees)!");
              return { ...prev, strikePins: { ...prev.strikePins, done: true } };
            }
            return prev;
          });
        }
      }

      // COIN COLLECTIONS
      coins.forEach((c) => {
        if (c.collected) {
          c.respawnTimer--;
          if (c.respawnTimer <= 0) {
            c.collected = false;
          }
          return;
        }

        const dx = c.x - car.x;
        const dy = c.y - car.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < carRadius + 14) {
          c.collected = true;
          c.respawnTimer = 600; // respawn in 10 seconds
          sound.playCoin();
          
          setCoinsCollected((prev) => {
            const next = prev + 1;
            if (next >= 5) {
              setQuests((q) => {
                if (!q.goldRush.done) {
                  sound.playAchievement();
                  triggerToast("🏆 SUCCES: Collectionneur (5 pieces)!");
                  return { ...q, goldRush: { ...q.goldRush, done: true } };
                }
                return q;
              });
            }
            return next;
          });

          spawnSparkles(c.x, c.y, "#ec4899");
        }
      });

      // UPDATE ACTIVE BILLBOARD STATE FOR REACT UI
      if (activeBillboardRef.current?.id !== currentActiveBillboard?.id) {
        activeBillboardRef.current = currentActiveBillboard;
        setActiveBillboard(currentActiveBillboard);
      }

      // Speed check for achievements
      const kmh = Math.round(Math.abs(car.speed) * 18);
      if (kmh >= 100) {
        setQuests((prev) => {
          if (!prev.speedDemon.done) {
            sound.playAchievement();
            triggerToast("🏆 SUCCES: Vitesse Extreme (>100 km/h Turbo)!");
            return { ...prev, speedDemon: { ...prev.speedDemon, done: true } };
          }
          return prev;
        });
      }

      // ANIMATE PARTICLES
      particles = particles.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (p.z > 0) {
          p.vz -= 0.15;
        } else {
          p.z = 0;
          p.vx *= 0.9;
          p.vy *= 0.9;
        }
        p.alpha = 1 - p.life / p.maxLife;
        return p.life < p.maxLife;
      });

      // Animate ambient weather particles
      weatherParticles.forEach((wp) => {
        wp.x += wp.speedX;
        wp.y += wp.speedY;
        wp.angle += wp.spinSpeed;

        if (wp.x < 0) wp.x = MAP_WIDTH;
        if (wp.y > MAP_HEIGHT) wp.y = 0;
      });

      // Decay skid marks
      if (skidMarks.length > 450) {
        skidMarks.shift();
      }
      skidMarks.forEach((sm) => {
        sm.alpha *= 0.998;
      });

      // SMOOTH CAMERA FOLLOWING
      const camLerp = 0.08;
      camera.x += (car.x - camera.x) * camLerp;
      camera.y += (car.y - camera.y) * camLerp;

      const targetZm = 1.05 - (Math.abs(car.speed) / finalMaxSpeed) * 0.15;
      camera.zoom += (targetZm - camera.zoom) * camLerp;

      // RENDER WORLD TO CANVAS
      ctx.clearRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);

      ctx.save();
      if (car.lastLandTimer > 0) {
        const shake = (car.lastLandTimer / 15) * 5;
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
        car.lastLandTimer--;
      }

      const halfW = canvas.width / (2 * (window.devicePixelRatio || 1));
      const halfH = canvas.height / (2 * (window.devicePixelRatio || 1));
      ctx.translate(halfW, halfH);
      ctx.scale(camera.zoom, camera.zoom);
      ctx.translate(-camera.x, -camera.y);

      // Draw Map Ground Clay (Dynamic Grid)
      const groundColor = isNightMode ? "#110e0c" : "#ebdccb";
      const clayColor = isNightMode ? "#1a1614" : "#fffcf7";
      const roadLineColor = isNightMode ? "#3f332a" : "#f0ebd6";

      ctx.fillStyle = groundColor;
      ctx.fillRect(-2000, -2000, MAP_WIDTH + 4000, MAP_HEIGHT + 4000);

      // Draw main field
      ctx.fillStyle = clayColor;
      ctx.fillRect(MARGIN, MARGIN, MAP_WIDTH - MARGIN * 2, MAP_HEIGHT - MARGIN * 2);

      // Draw subtle grid lines on clay for extreme depth perception
      ctx.strokeStyle = isNightMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)";
      ctx.lineWidth = 1;
      for (let gx = MARGIN; gx < MAP_WIDTH - MARGIN; gx += 100) {
        ctx.beginPath();
        ctx.moveTo(gx, MARGIN);
        ctx.lineTo(gx, MAP_HEIGHT - MARGIN);
        ctx.stroke();
      }
      for (let gy = MARGIN; gy < MAP_HEIGHT - MARGIN; gy += 100) {
        ctx.beginPath();
        ctx.moveTo(MARGIN, gy);
        ctx.lineTo(MAP_WIDTH - MARGIN, gy);
        ctx.stroke();
      }

      // Draw lanes
      ctx.strokeStyle = roadLineColor;
      ctx.lineWidth = 14;
      ctx.setLineDash([20, 20]);
      
      ctx.beginPath();
      ctx.arc(1250, 1400, 120, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = isNightMode ? "rgba(234, 179, 8, 0.35)" : "rgba(140, 116, 96, 0.45)";
      ctx.font = "bold 20px monospace";
      ctx.fillText("← QUILLE", 700, 1380);
      ctx.fillText("PROJETS →", 1700, 1050);
      ctx.fillText("COMPETENCES ↘", 1700, 1550);
      ctx.fillText("↑ RESEAUX", 1200, 780);
      ctx.fillText("A PROPOS ←", 500, 950);

      ctx.font = "bold 32px serif";
      ctx.fillText("RAMPE DE SAUT!", 1150, 980);

      // Draw skid marks
      ctx.lineWidth = 2.5;
      skidMarks.forEach((sm) => {
        ctx.strokeStyle = `rgba(0, 0, 0, ${sm.alpha * (isNightMode ? 0.35 : 0.15)})`;
        ctx.beginPath();
        ctx.moveTo(sm.x1, sm.y1);
        ctx.lineTo(sm.x2, sm.y2);
        ctx.stroke();
      });

      // Draw JUMP Ramp structure (a wooden wedge)
      ctx.save();
      ctx.fillStyle = isNightMode ? "#332" : "#a16207";
      ctx.fillRect(ramp.x - halfWidth, ramp.y - halfHeight, ramp.width, ramp.height);
      ctx.strokeStyle = isNightMode ? "#111" : "#78350f";
      ctx.lineWidth = 4;
      for (let ly = ramp.y - halfHeight + 10; ly < ramp.y + halfHeight; ly += 20) {
        ctx.beginPath();
        ctx.moveTo(ramp.x - halfWidth + 8, ly);
        ctx.lineTo(ramp.x + halfWidth - 8, ly);
        ctx.stroke();
      }
      ctx.restore();

      // Draw Coins
      coins.forEach((c) => {
        if (c.collected) return;
        c.pulse += 0.05;
        const coinYOffset = Math.sin(c.pulse) * 4 - 8;

        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.12)";
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.translate(c.x, c.y + coinYOffset);
        ctx.fillStyle = "#d97706";
        ctx.beginPath();
        ctx.arc(0, 2, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // 3D Block Drawing Helper
      const draw3DBlockObj = (
        x: number, 
        y: number, 
        r: number, 
        angle: number, 
        height3D: number, 
        color: string, 
        topColor: string, 
        sideColor: string, 
        label?: string,
        isPin: boolean = false,
        isKnocked: boolean = false
      ) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 10;

        const w = r * 1.5;
        const h = r * 1.5;

        if (isPin) {
          if (isKnocked) {
            ctx.shadowColor = "rgba(0,0,0,0.08)";
            ctx.shadowOffsetY = 2;
            ctx.fillStyle = "#e5e7eb";
            ctx.fillRect(-8, -25, 16, 30);
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(-8, -15, 16, 6);
          } else {
            const z = height3D;
            ctx.fillStyle = "rgba(0,0,0,0.18)";
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = sideColor;
            ctx.fillRect(-r, -z, r * 2, z);

            ctx.fillStyle = topColor;
            ctx.beginPath();
            ctx.arc(0, -z, r, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ef4444";
            ctx.fillRect(-r, -z * 0.6, r * 2, z * 0.15);
          }
        } else {
          const z = height3D;

          ctx.fillStyle = "rgba(0,0,0,0.12)";
          ctx.fillRect(-w/2, -h/2, w, h);

          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.fillStyle = sideColor;
          ctx.beginPath();
          ctx.moveTo(-w/2, h/2);
          ctx.lineTo(w/2, h/2);
          ctx.lineTo(w/2 - z * 0.2, h/2 - z);
          ctx.lineTo(-w/2 - z * 0.2, h/2 - z);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = sideColor;
          ctx.beginPath();
          ctx.moveTo(w/2, -h/2);
          ctx.lineTo(w/2, h/2);
          ctx.lineTo(w/2 - z * 0.2, h/2 - z);
          ctx.lineTo(w/2 - z * 0.2, -h/2 - z);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = topColor;
          ctx.fillRect(-w/2 - z * 0.2, -h/2 - z, w, h);

          if (label) {
            ctx.fillStyle = color;
            ctx.font = `bold ${r * 0.55}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, -z * 0.2, -z);
          }
        }
        ctx.restore();
      };

      // Draw all Physical Bodies
      for (const b of bodies) {
        if (b.type === "billboard") {
          ctx.save();
          ctx.fillStyle = "rgba(0,0,0,0.18)";
          ctx.fillRect(b.x - 30, b.y - 10, 8, 20);
          ctx.fillRect(b.x + 22, b.y - 10, 8, 20);

          ctx.fillStyle = "#78350f";
          ctx.fillRect(b.x - 30, b.y - 20, 8, 40);
          ctx.fillRect(b.x + 22, b.y - 20, 8, 40);

          const z = 24;
          ctx.shadowColor = "rgba(0,0,0,0.22)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 4;
          ctx.shadowOffsetY = 12;

          ctx.fillStyle = "#a16207";
          ctx.fillRect(b.x - 72, b.y - 42 - z, 144, 44);

          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.fillStyle = b.color || "#ff3e00";
          ctx.fillRect(b.x - 68, b.y - 38 - z, 136, 36);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 13px serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const labelText = b.label && b.label.length > 14 ? b.label.substring(0, 13) + "." : b.label;
          ctx.fillText(labelText || "", b.x, b.y - 20 - z);

          if (activeBillboardRef.current?.id === b.id) {
            ctx.strokeStyle = "#ff3e00";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r + Math.sin(Date.now() * 0.01) * 8, 0, Math.PI*2);
            ctx.stroke();
          }

          ctx.restore();
        } else if (b.type === "pin") {
          draw3DBlockObj(b.x, b.y, b.r, b.angle, 35, b.color || "", b.topColor || "", b.sideColor || "", "", true, b.isKnockedOver);
        } else if (b.type === "social") {
          draw3DBlockObj(b.x, b.y, b.r, b.angle, 32, "#ffffff", b.topColor || "", b.sideColor || "", b.label);
        } else if (b.type === "text-block") {
          draw3DBlockObj(b.x, b.y, b.r, b.angle, 28, "#fffcf7", b.topColor || "", b.sideColor || "", b.label);
        } else if (b.type === "pickup") {
          if (b.isKnockedOver) continue;
          const pulse = 1 + Math.sin(Date.now() * 0.005 + bodies.indexOf(b)) * 0.15;
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.shadowColor = b.color || "#3b82f6";
          ctx.shadowBlur = 25;
          ctx.beginPath();
          ctx.arc(0, 0, b.r * pulse + 8, 0, Math.PI * 2);
          ctx.fillStyle = (b.color || "#3b82f6") + "25";
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();
          draw3DBlockObj(b.x, b.y, b.r * pulse, b.angle, 28, b.color || "#3b82f6", (b.color || "#3b82f6") + "cc", "#1e1b4b", "?");
        } else {
          draw3DBlockObj(b.x, b.y, b.r, b.angle, 34, "#fff", b.topColor || "", b.sideColor || "", b.label);
        }
      }

      // Draw falling weather/wind leaf particles
      weatherParticles.forEach((wp) => {
        ctx.save();
        ctx.translate(wp.x, wp.y);
        ctx.rotate(wp.angle);
        ctx.fillStyle = wp.color;
        // draw a leaf-like shape
        ctx.beginPath();
        ctx.ellipse(0, 0, wp.size, wp.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw particles
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y - p.z, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw About Desk / Resume Paper on bottom-left / top-left area
      const deskX = 500;
      const deskY = 800;
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(deskX - 160, deskY - 100, 320, 200);

      ctx.fillStyle = isNightMode ? "#2a221a" : "#f5e8d3";
      ctx.fillRect(deskX - 150, deskY - 90, 300, 180);

      ctx.strokeStyle = isNightMode ? "#1a1310" : "#d2b48c";
      ctx.lineWidth = 8;
      ctx.strokeRect(deskX - 150, deskY - 90, 300, 180);

      ctx.fillStyle = isNightMode ? "#111" : "#fffcfa";
      ctx.fillRect(deskX - 130, deskY - 70, 260, 140);
      ctx.strokeStyle = isNightMode ? "#333" : "#ebdccb";
      ctx.lineWidth = 2;
      ctx.strokeRect(deskX - 130, deskY - 70, 260, 140);

      ctx.fillStyle = isNightMode ? "#fff" : "#1a1310";
      ctx.font = "bold 14px serif";
      ctx.fillText("ONESIM - FULL-STACK DEV", deskX - 110, deskY - 45);

      ctx.fillStyle = isNightMode ? "#9ca3af" : "#6b584a";
      ctx.font = "11px monospace";
      ctx.fillText("• Developpeur Full-Stack (2025 - Present)", deskX - 110, deskY - 20);
      ctx.fillText("• Forme a FuturCraft Institut", deskX - 110, deskY - 0);
      ctx.fillText("• Createur d'Employra RH (SaaS)", deskX - 110, deskY + 20);
      ctx.fillText("• Passionne par les technologies web", deskX - 110, deskY + 40);
      ctx.restore();

      // Draw Bowling lane boundary
      const bowlX = 650;
      const bowlY = 1750;
      ctx.save();
      ctx.strokeStyle = isNightMode ? "#332a25" : "#e4cbba";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(bowlX - 80, bowlY + 120);
      ctx.lineTo(bowlX - 80, bowlY - 140);
      ctx.moveTo(bowlX + 80, bowlY + 120);
      ctx.lineTo(bowlX + 80, bowlY - 140);
      ctx.stroke();

      ctx.fillStyle = "#020617";
      ctx.fillRect(bowlX - 100, bowlY - 190, 80, 40);
      ctx.strokeStyle = "#475569";
      ctx.strokeRect(bowlX - 100, bowlY - 190, 80, 40);

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 14px monospace";
      ctx.fillText("PINS", bowlX - 90, bowlY - 175);
      ctx.font = "bold 18px monospace";
      ctx.fillText(bowlingScore === 10 ? "STRIKE!" : `${bowlingScore} / 10`, bowlX - 90, bowlY - 158);
      ctx.restore();

      // DRAW THE TOY CAR (PROJECTED 3D STACKING)
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);

      // Shadow below car, scaling down based on jumping height Z
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      const shadowScale = Math.max(0.4, 1 - car.z / 100);
      ctx.beginPath();
      ctx.ellipse(4, 4, (currentSkin.length / 2) * shadowScale, (currentSkin.width / 2) * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Project car by -car.z (air elevation)
      ctx.translate(0, -car.z);

      // Active Neon Underglow (Interactive Customizer)
      if (enableUnderglow && car.z === 0) {
        ctx.save();
        ctx.shadowColor = customUnderglow;
        ctx.shadowBlur = 18;
        ctx.fillStyle = customUnderglow;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(0, 0, currentSkin.length * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw wheels
      ctx.fillStyle = currentSkin.wheelColor;
      const wheelW = 12;
      const wheelH = 6;
      const frontWheelOffset = currentSkin.length * 0.32;
      const rearWheelOffset = currentSkin.length * 0.32;
      const lateralWheelOffset = currentSkin.width * 0.46;

      ctx.fillRect(-rearWheelOffset - wheelW/2, -lateralWheelOffset - wheelH/2, wheelW, wheelH);
      ctx.fillRect(-rearWheelOffset - wheelW/2, lateralWheelOffset - wheelH/2, wheelW, wheelH);

      ctx.save();
      ctx.translate(frontWheelOffset, -lateralWheelOffset);
      ctx.rotate(car.steering * 1.5);
      ctx.fillRect(-wheelW/2, -wheelH/2, wheelW, wheelH);
      ctx.restore();

      ctx.save();
      ctx.translate(frontWheelOffset, lateralWheelOffset);
      ctx.rotate(car.steering * 1.5);
      ctx.fillRect(-wheelW/2, -wheelH/2, wheelW, wheelH);
      ctx.restore();

      // Draw 3D Extruded Car Chassis
      const extrusionLayers = 14;
      for (let l = 0; l < extrusionLayers; l++) {
        ctx.fillStyle = l < 4 ? "#111" : customColor;
        const cw = currentSkin.length - 2;
        const ch = currentSkin.width;
        ctx.fillRect(-cw/2, -ch/2 - l * 0.5, cw, ch);
      }

      // Draw Cabin Cabin Canopy
      const cabinLength = currentSkin.length * 0.52;
      const cabinWidth = currentSkin.width * 0.72;
      for (let c = 0; c < 10; c++) {
        ctx.fillStyle = currentSkin.cabinColor;
        ctx.fillRect(-cabinLength/2 - 4, -cabinWidth/2 - (c + 14) * 0.5, cabinLength, cabinWidth);
      }

      // Windshield glass detail
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(cabinLength/2 - 6, -cabinWidth/2 + 2 - 12, 4, cabinWidth - 4);

      if (currentSkin.id === "f1-racer") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(currentSkin.length / 2 - 4, -currentSkin.width * 0.8, 4, currentSkin.width * 1.6);
        ctx.fillRect(-currentSkin.length / 2 - 2, -currentSkin.width * 0.9 - 10, 6, currentSkin.width * 1.8);
      } else if (currentSkin.id === "green-truck") {
        ctx.fillStyle = "#eab308";
        ctx.fillRect(-2, -currentSkin.width/2, 4, 3);
        ctx.fillRect(-2, currentSkin.width/2 - 3, 4, 3);
      }

      ctx.restore();
      ctx.restore();

      // Speedo calculation
      const speedValue = Math.round(Math.abs(car.speed) * 18);
      setSpeedKmh(speedValue);

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedSkin, isNightMode, customColor, customUnderglow, enableUnderglow]);

  // Touch controls listeners
  const handleTouchStart = (control: keyof typeof touchState.current) => {
    touchState.current[control] = true;
  };

  const handleTouchEnd = (control: keyof typeof touchState.current) => {
    touchState.current[control] = false;
  };

  // Preset palette colors for paint selection
  const COLOR_PRESETS = ["#ff3e00", "#10b981", "#3b82f6", "#eab308", "#ec4899", "#8b5cf6", "#f97316"];
  const UNDERGLOW_PRESETS = ["#ff00c8", "#00f0ff", "#39ff14", "#ffff00", "#ff0000", "#7b00ff"];

  return (
    <div className="relative w-full h-screen bg-[#ebdccb] overflow-hidden select-none font-sans" ref={containerRef}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* SUCCESS TOAST FOR QUEST COMPLETIONS */}
      {toastMessage && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-emerald-500/30 text-white px-5 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-fadeIn backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold font-mono text-emerald-400">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER CONTROLS BAR */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-30">
        {/* Title branding */}
        <div className="bg-[#fffcf7]/90 backdrop-blur-md border border-[#ebdccb] px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-3 pointer-events-auto">
          <div>
            <h1 className="text-sm font-serif font-black tracking-tight text-[#231a14] leading-none mb-0.5">
              ONESIM
            </h1>
            <p className="text-[10px] text-[#8c7460] font-bold font-mono">
              FULL-STACK PLAYGROUND
            </p>
          </div>
          <button
            onClick={onSwitchToClassic}
            className="flex items-center gap-1 bg-[#ff3e00] hover:bg-[#e03600] active:scale-95 transition-all text-white text-[11px] font-black uppercase px-3 py-1.5 rounded-lg ml-2"
          >
            <List className="w-3.5 h-3.5" />
            Portfolio
          </button>
        </div>

        {/* Dashboard Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Day / Night Mode Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsNightMode(!isNightMode);
            }}
            title={isNightMode ? "Switch to Day Mode" : "Switch to Night Mode"}
            className="bg-[#fffcf7]/90 backdrop-blur-md border border-[#ebdccb] hover:bg-[#ebdccb]/30 p-2.5 rounded-xl shadow-sm transition-all text-[#2c2621] active:scale-95"
          >
            {isNightMode ? <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            className="bg-[#fffcf7]/90 backdrop-blur-md border border-[#ebdccb] hover:bg-[#ebdccb]/30 p-2.5 rounded-xl shadow-sm transition-all text-[#2c2621] active:scale-95"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#ff3e00]" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Guide Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setShowControlsHint(!showControlsHint);
            }}
            title="Toggle Controls Guide"
            className="bg-[#fffcf7]/90 backdrop-blur-md border border-[#ebdccb] hover:bg-[#ebdccb]/30 p-2.5 rounded-xl shadow-sm transition-all text-[#2c2621] active:scale-95"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MODERN GLASS RADAR MINIMAP (Top-Right Panel) */}
      {showMinimap && (
        <div className="absolute top-20 right-4 bg-slate-950/85 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl z-20 w-[180px] pointer-events-auto">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#ff3e00] animate-pulse" />
              Radar Map
            </span>
            <button 
              onClick={() => setShowMinimap(false)}
              className="text-[9px] text-gray-400 hover:text-white font-mono"
            >
              [Hide]
            </button>
          </div>

          {/* Canvas Minimap Display */}
          <div className="relative w-full h-[150px] bg-slate-900/60 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
            {/* Compass rings */}
            <div className="absolute w-[110px] h-[110px] rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute w-[60px] h-[60px] rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute w-px h-full bg-white/5 pointer-events-none" />
            <div className="absolute w-full h-px bg-white/5 pointer-events-none" />

            {/* Projected coordinates dot mapping */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Projects billboard dot */}
              <div 
                className="absolute w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse shadow-sm shadow-fuchsia-500"
                style={{ top: "35%", left: "75%" }}
                title="Projects zone"
              />
              {/* Project pickups dot */}
              <div 
                className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping shadow-sm shadow-blue-400"
                style={{ top: "32%", left: "72%" }}
                title="Project pickups"
              />
              {/* Bowling Pins dot */}
              <div 
                className="absolute w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500"
                style={{ top: "72%", left: "28%" }}
                title="Bowling Pin Zone"
              />
              {/* Skills pile dot */}
              <div 
                className="absolute w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500"
                style={{ top: "68%", left: "75%" }}
                title="Skills Brick Pile"
              />
              {/* Social media cluster */}
              <div 
                className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"
                style={{ top: "25%", left: "50%" }}
                title="Social links"
              />

              {/* Active Player Car indicator */}
              <div 
                className="absolute w-2.5 h-2.5 bg-[#ff3e00] rounded-sm flex items-center justify-center shadow-lg shadow-[#ff3e00]/40"
                style={{ 
                  left: `${((carCoords.x / 2500) * 100).toFixed(0)}%`, 
                  top: `${((carCoords.y / 2500) * 100).toFixed(0)}%` 
                }}
              >
                <div className="w-1 h-1 bg-white rounded-full animate-ping" />
              </div>
            </div>
          </div>

          <div className="mt-1.5 flex justify-between text-[9px] text-gray-400 font-mono">
            <span>X: {carCoords.x}</span>
            <span>Y: {carCoords.y}</span>
          </div>
        </div>
      )}

      {/* QUICK FLOATING TRIGGER FOR MINIMAP */}
      {!showMinimap && (
        <button
          onClick={() => { sound.playClick(); setShowMinimap(true); }}
          className="absolute top-20 right-4 bg-[#fffcf7]/90 border border-[#ebdccb] px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#2c2621] z-20 shadow-sm"
        >
          🗺️ Show Radar Map
        </button>
      )}

      {/* CONTROLS GUIDE PANEL OVERLAY */}
      {showControlsHint && (
        <div className="absolute top-20 left-4 right-4 sm:right-auto max-w-sm bg-[#fffcf7]/95 border-2 border-[#2c2621] p-5 rounded-3xl shadow-xl z-20">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8c7460] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#ff3e00] animate-pulse" />
              Comment jouer
            </h2>
            <button 
              onClick={() => {
                sound.playClick();
                setShowControlsHint(false);
              }}
              className="text-[11px] font-bold text-gray-400 hover:text-[#ff3e00]"
            >
              Hide
            </button>
          </div>
          
          <div className="space-y-3.5 text-xs text-[#5a4c41]">
            <div>
              <div className="flex items-center gap-2 mb-1.5 font-bold text-[#2c2621]">
                <span className="bg-white border border-[#ebdccb] px-1.5 py-0.5 rounded text-[10px] shadow-xs">W,A,S,D</span>
                <span>or</span>
                <span className="bg-white border border-[#ebdccb] px-1.5 py-0.5 rounded text-[10px] shadow-xs">Arrows</span>
              </div>
              <p>Accelere, recule et dirige la voiture a travers l'ecran.</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5 font-bold text-[#2c2621]">
                <span className="bg-white border border-[#ebdccb] px-2 py-0.5 rounded text-[10px] shadow-xs">SHIFT</span>
              </div>
              <p className="font-bold text-amber-600">Maintiens SHIFT pour un Turbo Nitro Extreme!</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5 font-bold text-[#2c2621]">
                <span className="bg-white border border-[#ebdccb] px-2.5 py-0.5 rounded text-[10px] shadow-xs">SPACEBAR</span>
              </div>
              <p>Maintiens pour deraper en **Drift**!</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5 font-bold text-[#2c2621]">
                <span className="bg-white border border-[#ebdccb] px-1.5 py-0.5 rounded text-[10px] shadow-xs">R</span>
              </div>
              <p>Reset de la voiture, quilles et quetes!</p>
            </div>

            <div className="pt-2.5 border-t border-[#ebdccb]/60 flex flex-col gap-1 text-[11px]">
              <p className="font-bold text-[#3b82f6]">🎯 Objectifs:</p>
              <p>• Detruis les lettres geantes roses!</p>
              <p>• Eboute la pile de competences!</p>
              <p>• Saute de la rampe a toute vitesse!</p>
              <p>• Fais tomber les 10 quilles!</p>
              <p>• Collectionne les pieces en or!</p>
              <p className="text-cyan-400">• Collecte les ★ cubes pour decouvrir mes projets!</p>
            </div>
          </div>
        </div>
      )}

      {/* REAL-TIME SANDBOX QUESTS TRACKER (Middle-Left Panel) */}
      <div className="absolute lg:top-[420px] top-72 left-4 right-4 lg:right-auto max-w-sm bg-slate-950/85 backdrop-blur-md border border-white/10 p-4 rounded-3xl shadow-xl z-20 pointer-events-auto text-white">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5 mb-3 border-b border-white/10 pb-1.5">
          <Zap className="w-4 h-4 text-[#ff3e00] animate-bounce" />
          Quest Tracker
        </h3>
        
        <div className="space-y-3">
          {Object.entries(quests).map(([key, q]) => (
            <div key={key} className="flex items-start gap-2.5 group">
              <div className={`mt-0.5 rounded-full transition-colors flex items-center justify-center ${
                q.done ? "text-emerald-400" : "text-gray-500"
              }`}>
                {q.done ? <CheckCircle className="w-4 h-4 fill-emerald-950" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-600" />}
              </div>
              <div>
                <span className={`text-xs font-bold block ${q.done ? "line-through text-gray-400 font-medium" : "text-white"}`}>
                  {q.name}
                </span>
                <span className="text-[10px] text-gray-400 leading-tight block">
                  {q.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HIGH-FIDELITY GARAGE & CUSTOM CAR COLORIZER (Bottom-Left Panel) */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-20 max-w-sm hidden sm:block">
        <div className="bg-[#fffcf7]/95 border-2 border-[#2c2621] p-4 rounded-3xl shadow-lg pointer-events-auto">
          
          {/* VEHICLE MODEL PRESENTS */}
          <span className="text-[10px] text-[#8c7460] font-black block uppercase tracking-wider mb-2 font-mono">
            1. Select vehicle chassis
          </span>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {CAR_SKINS.map((skin) => (
              <button
                key={skin.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedSkin(skin);
                  setCustomColor(skin.color);
                }}
                className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${
                  selectedSkin.id === skin.id
                    ? "bg-[#ff3e00] text-white border-transparent"
                    : "bg-[#ebdccb]/10 text-[#2c2621] border-[#ebdccb] hover:bg-[#ebdccb]/30"
                }`}
              >
                <div>
                  <span className="text-xs font-black block leading-tight">{skin.name}</span>
                  <span className="text-[9px] opacity-80 block font-mono">
                    Top Spd: {skin.maxSpeed.toFixed(0)}
                  </span>
                </div>
                <div 
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: skin.color }}
                />
              </button>
            ))}
          </div>

          {/* INTERACTIVE PAINT COLORPICKER WHEEL */}
          <span className="text-[10px] text-[#8c7460] font-black block uppercase tracking-wider mb-1.5 font-mono">
            2. Customize chassis paint
          </span>
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="color" 
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 focus:outline-none"
              title="Paint color wheel picker"
            />
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PRESETS.map((col) => (
                <button
                  key={col}
                  onClick={() => { sound.playClick(); setCustomColor(col); }}
                  className="w-5 h-5 rounded-full border border-black/10 hover:scale-110 active:scale-95 transition-transform"
                  style={{ backgroundColor: col }}
                  title={col}
                />
              ))}
            </div>
          </div>

          {/* DYNAMIC UNDERGLOW PANEL */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-[#8c7460] font-black block uppercase tracking-wider font-mono">
              3. Interactive neon underglow
            </span>
            <input 
              type="checkbox" 
              checked={enableUnderglow}
              onChange={(e) => setEnableUnderglow(e.target.checked)}
              className="w-4 h-4 text-[#ff3e00] focus:ring-[#ff3e00] border-gray-300 rounded"
            />
          </div>
          {enableUnderglow && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <input 
                type="color" 
                value={customUnderglow}
                onChange={(e) => setCustomUnderglow(e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                title="Neon underglow wheel picker"
              />
              <div className="flex flex-wrap gap-1">
                {UNDERGLOW_PRESETS.map((u) => (
                  <button
                    key={u}
                    onClick={() => { sound.playClick(); setCustomUnderglow(u); }}
                    className="w-4 h-4 rounded-full border border-black/5 hover:scale-115 active:scale-90 transition-transform"
                    style={{ backgroundColor: u }}
                    title={u}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SPEEDOMETER & HUD STATUS OVERLAYS (Bottom-Right/Center) */}
      <div className="absolute bottom-4 right-4 left-4 sm:left-auto pointer-events-none z-20 flex items-end gap-3">
        {/* Speedometer Gauges */}
        <div className="bg-[#fffcf7]/95 border-2 border-[#2c2621] px-5 py-4 rounded-3xl shadow-lg pointer-events-auto text-right font-mono min-w-[170px] relative overflow-hidden">
          
          {/* Turbo charge line */}
          {touchState.current.turbo && (
            <div className="absolute top-0 inset-x-0 h-1 bg-rose-500 animate-pulse" />
          )}

          <div className="flex justify-between items-center gap-4 border-b border-[#ebdccb]/60 pb-1.5 mb-1.5">
            <span className="text-[10px] text-[#8c7460] font-bold uppercase font-sans">Speed</span>
            <span className="text-xl font-black text-[#2c2621]">
              {speedKmh} <span className="text-[11px] font-normal font-sans">km/h</span>
            </span>
          </div>

          <div className="flex justify-between items-center gap-4 border-b border-[#ebdccb]/60 pb-1.5 mb-1.5">
            <span className="text-[10px] text-[#8c7460] font-bold uppercase font-sans">Coins</span>
            <span className="text-sm font-black text-amber-600">
              {coinsCollected} Collected
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-[10px] text-[#8c7460] font-bold uppercase font-sans">Pins Down</span>
            <span className="text-sm font-black text-emerald-600">
              {bowlingScore === 10 ? "🎳 STRIKE!" : `${bowlingScore} / 10`}
            </span>
          </div>
        </div>

        {/* Reset / Stuck Button */}
        <button
          onClick={() => {
            const rEvent = new KeyboardEvent("keydown", { key: "r" });
            window.dispatchEvent(rEvent);
          }}
          title="Reset Car Position & Quests (R)"
          className="bg-[#ff3e00] hover:bg-[#e03600] active:scale-95 transition-all text-white p-4 rounded-2xl shadow-lg shadow-[#ff3e00]/15 pointer-events-auto flex items-center justify-center"
        >
          <RefreshCw className="w-5 h-5 animate-spin-slow" />
        </button>
      </div>

      {/* PICKUP HINT — floating tag */}
      <div className="absolute bottom-20 sm:bottom-24 left-4 pointer-events-none z-20 opacity-70 hover:opacity-100 transition-opacity">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 text-white/80 text-[10px] font-mono font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg animate-pulse">
          <span className="w-2 h-2 rounded-sm bg-cyan-400 animate-spin" />
          Collecte les cubes lumineux ★
        </div>
      </div>

      {/* CONTEXTUAL DIALOGUE BANNER (Discovered bills) */}
      {activeBillboard && activeBillboard.projectRef && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-[#2c2621] border border-white/10 text-white px-6 py-4 rounded-3xl shadow-2xl z-20 flex flex-col sm:flex-row items-center gap-4 max-w-lg w-11/12 animate-slideUp">
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeBillboard.color }} />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Projet Decouvert</span>
            </div>
            <h3 className="text-base font-serif font-black">{activeBillboard.label}</h3>
            <p className="text-xs text-gray-300 line-clamp-1">{activeBillboard.projectRef.description}</p>
          </div>

          <button
            onClick={() => {
              if (activeBillboard.projectRef) {
                onOpenProject(activeBillboard.projectRef);
              }
            }}
            className="bg-[#ff3e00] hover:bg-[#e03600] active:scale-95 transition-all text-white text-xs font-black uppercase px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            VOIR LE PROJET
          </button>
        </div>
      )}

      {/* MOBILE HUD OVERLAY (Virtual Controls) */}
      {isMobile && (
        <div className="absolute inset-x-0 bottom-6 pointer-events-none z-10 flex justify-between px-6">
          {/* Steering left pad */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onTouchStart={() => handleTouchStart("turnLeft")}
              onTouchEnd={() => handleTouchEnd("turnLeft")}
              className="w-16 h-16 bg-[#fffcf7]/95 border border-[#ebdccb] active:bg-[#ff3e00]/15 select-none rounded-2xl shadow-md flex items-center justify-center text-[#2c2621] font-black text-2xl"
            >
              ◀
            </button>
            <button
              onTouchStart={() => handleTouchStart("turnRight")}
              onTouchEnd={() => handleTouchEnd("turnRight")}
              className="w-16 h-16 bg-[#fffcf7]/95 border border-[#ebdccb] active:bg-[#ff3e00]/15 select-none rounded-2xl shadow-md flex items-center justify-center text-[#2c2621] font-black text-2xl"
            >
              ▶
            </button>
          </div>

          {/* Drift & Turbo controls */}
          <div className="flex items-center gap-2 pointer-events-auto self-end">
            <button
              onTouchStart={() => handleTouchStart("drift")}
              onTouchEnd={() => handleTouchEnd("drift")}
              className="w-14 h-14 bg-amber-600/90 border border-amber-700 select-none text-white font-bold text-xs rounded-full shadow-md flex items-center justify-center active:scale-90"
            >
              DRIFT
            </button>
            <button
              onTouchStart={() => handleTouchStart("turbo")}
              onTouchEnd={() => handleTouchEnd("turbo")}
              className="w-14 h-14 bg-rose-600/95 border border-rose-700 select-none text-white font-bold text-xs rounded-full shadow-md flex flex-col items-center justify-center active:scale-90"
            >
              <span>TURBO</span>
              <span className="text-[8px]">NITRO</span>
            </button>
          </div>

          {/* Pedals */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onTouchStart={() => handleTouchStart("reverse")}
              onTouchEnd={() => handleTouchEnd("reverse")}
              className="w-16 h-20 bg-gray-700/90 border border-gray-800 select-none text-white font-bold text-xs rounded-xl shadow-md flex flex-col items-center justify-center"
            >
              <span>BRAKE</span>
              <span className="text-[10px] opacity-75">REV</span>
            </button>
            <button
              onTouchStart={() => handleTouchStart("forward")}
              onTouchEnd={() => handleTouchEnd("forward")}
              className="w-18 h-24 bg-[#ff3e00]/95 border border-[#e03600] select-none text-white font-bold text-sm rounded-xl shadow-md flex flex-col items-center justify-center"
            >
              <span>GO</span>
              <span className="text-xs opacity-75">▲</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
