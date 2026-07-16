import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, Globe, ShoppingBag, Users, BookOpen, User, Settings,
  Search, Bell, Play, Pause, SkipForward, SkipBack, Volume2,
  Activity, Calendar, Shield, Map, BarChart3, Package,
  Clock, Gauge, Radio, Layers, MessageSquare, Monitor, Star,
  Cpu, Navigation, Satellite, Wind, Compass, ChevronRight, ChevronLeft,
  Brain, Headphones, FileText, CheckSquare, PlusCircle,
  Terminal, LogIn, AlertCircle,
} from "lucide-react";

import bgImg          from "@/imports/ChatGPT_Image_Jul_11__2026__10_04_54_AM.png";
import avatarBg       from "@/imports/ChatGPT_Image_Jul_11__2026__10_04_54_AM.png";
import img5           from "@/imports/image-5.png";
import bEZ3D          from "@/imports/b_EZ3D-1.png";
import bEZPM          from "@/imports/b_EZPM.png";
import bEZTicket      from "@/imports/b_EZTicketConsole.png";
import bEZCustom      from "@/imports/b_AI_Platform.png";
import bOneStop       from "@/imports/b_OneStop.png";
import bSupportStaff  from "@/imports/image-8.png";
import nexusLogo      from "@/imports/NexusFooter.png";
import rrLogoImg      from "@/imports/image-10.png";
import ezNexusLogo    from "@/imports/image-11.png";
import panoramaUrl    from "@/imports/EZ_Cosmos_Panorama_v3.png";
import ezPillar1Url       from "@/imports/EZPillar1.png";
import ezPillar2Url       from "@/imports/EZPillar2.png";
import elPillar1Url       from "@/imports/PillarEaseLizabeth1.png";
import elPillar2Url       from "@/imports/PillarEaseLizabeth2.png";
import elPillar3Url       from "@/imports/PillarEaseLizabeth3.png";
import easierPillarUrl from "@/imports/image-15.png";
import keyFeaturesUrl  from "@/imports/image-18.png";
import pmTextureUrl      from "@/imports/image-14.png";
import tdTextureUrl      from "@/imports/image-16.png";
import itsmTextureUrl    from "@/imports/image-17.png";
import cosmosTextureUrl  from "@/imports/image-19.png";
import orgTextureUrl     from "@/imports/image-20.png";

type Mode   = "nexus" | "dash";
type Galaxy = "cosmos" | "audio" | "gamer" | "ezway";

const GALAXIES: { id: Galaxy; name: string; sub: string; color: string; accent: string; live: boolean }[] = [
  { id: "cosmos", name: "EZ COSMOS", sub: "IT & Enterprise Suite",      color: "#00d2ff", accent: "#b06aff", live: true  },
  { id: "audio",  name: "EZ AUDIO",  sub: "Audio Production Suite",     color: "#ff6b9d", accent: "#ff4499", live: false },
  { id: "gamer",  name: "EZ GAMER",  sub: "Gaming & Esports Suite",     color: "#00ff88", accent: "#22d3ee", live: false },
  { id: "ezway",  name: "EZ WAY",    sub: "Philosophy & Company Story", color: "#b06aff", accent: "#00d2ff", live: true  },
];
// Navigation-only galaxies — ezway is only reachable via the in-product link, not the nav arrows
const NAV_GALAXIES = GALAXIES.filter(g => g.id !== "ezway");

// ─── Design Tokens ────────────────────────────────────────────────────────────
// From image-1.png design system

const PALETTE = {
  voidBg:   "#0a0b12",
  spaceDark:"#1b1d2a",
  deepPurp: "#2a0f57",
  elecPurp: "#4e1ad5",
  starBlue: "#0d4d91",
  cyan:     "#00d2ff",
  purple:   "#7b2fff",
  text:     "#e8eeff",
  muted:    "rgba(160,185,255,0.5)",
  border:   "rgba(255,255,255,0.08)",
};

// Glass card — panel with purple glow border
const GC: React.CSSProperties = {
  background: "rgba(13,9,45,0.36)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(123,47,255,0.38)",
  borderRadius: 12,
  boxShadow: "0 0 22px rgba(78,26,213,0.20), 0 0 1px rgba(160,100,255,0.45), inset 0 1px 0 rgba(255,255,255,0.07)",
};

// Gradient text helper — logo-style theme gradient
const gradText = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: "linear-gradient(135deg, #00d2ff 0%, #b06aff 60%, #ff79c6 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  ...extra,
});

// Orbitron helper
const orb = (size: number, weight = 700): React.CSSProperties => ({
  fontFamily: "Orbitron, monospace",
  fontSize: size,
  fontWeight: weight,
  letterSpacing: "0.06em",
});

// Section header label — gradient text for panel headers
function SHead({ children, mb = 8 }: { children: string; mb?: number }) {
  return (
    <div style={{ ...orb(8, 800), letterSpacing: "0.1em", marginBottom: mb, textTransform: "uppercase", ...gradText() }}>
      {children}
    </div>
  );
}

// Mini progress bar
function MBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ ...orb(8, 400), color: PALETTE.muted }}>{label}</span>
        <span style={{ ...orb(8, 700), color }}>{value}%</span>
      </div>
      <div style={{ height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 1 }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 1, boxShadow: `0 0 5px ${color}88` }} />
      </div>
    </div>
  );
}

// RR Logo — actual image asset
function RRLogo({ size = 32 }: { size?: number }) {
  return (
    <img
      src={ezNexusLogo}
      alt="EZ Nexus"
      style={{ width: size, height: size, objectFit: "contain", borderRadius: "50%", flexShrink: 0, display: "block", mixBlendMode: "screen" }}
    />
  );
}

// ─── Shared Cards ─────────────────────────────────────────────────────────────

const SYS_STATUS_ITEMS = [
  { label: "Systems",  value: 88,  color: "#00ff88", status: "Healthy"     },
  { label: "Network",  value: 92,  color: PALETTE.cyan,   status: "Optimal"    },
  { label: "Security", value: 78,  color: "#fbbf24", status: "Monitoring"  },
  { label: "Sync",     value: 100, color: PALETTE.purple,  status: "Synced"     },
];

function SystemStatusCard() {
  return (
    <div style={{ ...GC, padding: "14px 14px" }}>
      <div style={{ ...orb(9, 800), letterSpacing: "0.06em", marginBottom: 10, ...gradText() }}>SYSTEM STATUS</div>
      {SYS_STATUS_ITEMS.map((s) => (
        <button key={s.label} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "7px 10px", marginBottom: 5, background: "rgba(255,255,255,0.03)", border: `1px solid ${PALETTE.border}`, borderLeft: `2px solid ${s.color}55`, borderRadius: 8, cursor: "default", textAlign: "left" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, boxShadow: `0 0 6px ${s.color}`, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: PALETTE.text, fontFamily: "Rajdhani, sans-serif", flex: 1 }}>{s.label}</span>
          <span style={{ ...orb(8, 700), color: s.color }}>{s.value}%</span>
          <span style={{ fontSize: 8, color: PALETTE.muted, fontFamily: "Rajdhani, sans-serif", marginLeft: 2 }}>{s.status}</span>
        </button>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 6px #00ff88" }} />
        <span style={{ ...orb(7, 400), color: "rgba(150,175,255,0.4)" }}>All Systems Operational</span>
      </div>
    </div>
  );
}

function CosmicRadioCard() {
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{ ...GC, padding: "14px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
        <Radio size={9} color={PALETTE.purple} />
        <span style={{ ...orb(8, 700), ...gradText() }}>Cosmic Radio</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: PALETTE.text, marginBottom: 1, fontFamily: "Rajdhani, sans-serif" }}>EZ Cosmos</div>
      <div style={{ fontSize: 9, color: PALETTE.muted, marginBottom: 7, fontFamily: "Rajdhani, sans-serif" }}>RR Spacer</div>
      <div style={{ height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 1, marginBottom: 9, overflow: "hidden" }}>
        <div style={{ height: "100%", width: "38%", background: `linear-gradient(to right,${PALETTE.purple},${PALETTE.cyan})`, borderRadius: 1 }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <SkipBack size={12} color={PALETTE.muted} style={{ cursor: "pointer" }} />
        <button
          onClick={() => setPlaying(!playing)}
          style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${PALETTE.purple},${PALETTE.cyan})`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {playing ? <Pause size={10} color="#fff" /> : <Play size={10} color="#fff" />}
        </button>
        <SkipForward size={12} color={PALETTE.muted} style={{ cursor: "pointer" }} />
        <Volume2 size={12} color="rgba(150,175,255,0.3)" />
      </div>
    </div>
  );
}

// ─── Mode Switcher ────────────────────────────────────────────────────────────
// Persistent 2-button indicator in the TopHUD center. Double-tap Tab also switches.

function ModeSwitcher({ mode, setMode, onOrbitRequest }: { mode: Mode; setMode: (m: Mode) => void; onOrbitRequest: () => void }) {
  const isDash  = mode === "nexus";
  const isOrbit = mode === "dash";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>

      {/* Mode button pair — large, themed */}
      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "stretch",
        background: "rgba(4,2,18,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(123,47,255,0.42)",
        borderRadius: 12,
        padding: 4,
        gap: 3,
        boxShadow: "0 0 30px rgba(78,26,213,0.25), 0 0 1px rgba(160,100,255,0.5)",
      }}>
        {/* Corner brackets */}
        {([["top","left","0,210,255"],["top","right","123,47,255"],["bottom","left","0,210,255"],["bottom","right","123,47,255"]] as const).map(([v,h,rgb]) => (
          <div key={`${v}${h}`} style={{
            position: "absolute", [v]: -1, [h]: -1, width: 12, height: 12,
            borderTop:    v === "top"    ? `2px solid rgba(${rgb},0.7)` : "none",
            borderBottom: v === "bottom" ? `2px solid rgba(${rgb},0.7)` : "none",
            borderLeft:   h === "left"   ? `2px solid rgba(${rgb},0.7)` : "none",
            borderRight:  h === "right"  ? `2px solid rgba(${rgb},0.7)` : "none",
            borderRadius: h === "left" && v === "top" ? "2px 0 0 0" : h === "right" && v === "top" ? "0 2px 0 0" : h === "left" ? "0 0 0 2px" : "0 0 2px 0",
          }} />
        ))}

        {/* DASH MODE */}
        <button
          onClick={() => setMode("nexus")}
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "9px 26px",
            background: isDash ? `linear-gradient(135deg, rgba(0,210,255,0.18), rgba(0,210,255,0.06))` : "transparent",
            border: `1px solid ${isDash ? `${PALETTE.cyan}66` : "transparent"}`,
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.22s ease",
            boxShadow: isDash ? `0 0 20px ${PALETTE.cyan}30, inset 0 0 12px ${PALETTE.cyan}0c` : "none",
          }}
        >
          {isDash && <div style={{ width: 6, height: 6, borderRadius: "50%", background: PALETTE.cyan, boxShadow: `0 0 10px ${PALETTE.cyan}, 0 0 20px ${PALETTE.cyan}66` }} />}
          <Monitor size={14} color={isDash ? PALETTE.cyan : "rgba(160,185,255,0.35)"} />
          <span style={{ ...orb(11, isDash ? 800 : 500), color: isDash ? PALETTE.cyan : "rgba(160,185,255,0.35)", letterSpacing: "0.1em" }}>DASH MODE</span>
        </button>

        {/* Divider */}
        <div style={{ width: 1, alignSelf: "stretch", margin: "6px 1px", background: "rgba(123,47,255,0.3)" }} />

        {/* ORBIT MODE */}
        <button
          onClick={onOrbitRequest}
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "9px 26px",
            background: isOrbit ? `linear-gradient(135deg, rgba(123,47,255,0.18), rgba(123,47,255,0.06))` : "transparent",
            border: `1px solid ${isOrbit ? `${PALETTE.purple}66` : "transparent"}`,
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.22s ease",
            boxShadow: isOrbit ? `0 0 20px ${PALETTE.purple}30, inset 0 0 12px ${PALETTE.purple}0c` : "none",
          }}
        >
          <Globe size={14} color={isOrbit ? PALETTE.purple : "rgba(160,185,255,0.35)"} />
          <span style={{ ...orb(11, isOrbit ? 800 : 500), color: isOrbit ? PALETTE.purple : "rgba(160,185,255,0.35)", letterSpacing: "0.1em" }}>ORBIT MODE</span>
          {isOrbit && <div style={{ width: 6, height: 6, borderRadius: "50%", background: PALETTE.purple, boxShadow: `0 0 10px ${PALETTE.purple}, 0 0 20px ${PALETTE.purple}66` }} />}
        </button>
      </div>

      {/* Keyboard hint */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 8, color: "rgba(130,155,220,0.28)", fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.07em" }}>
        Double tap
        <span style={{ padding: "1px 5px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3, fontSize: 7.5, color: "rgba(130,155,220,0.4)", fontFamily: "Orbitron, monospace" }}>Tab</span>
        to switch
      </div>
    </div>
  );
}

// ─── Top HUD ─────────────────────────────────────────────────────────────────
// ~72px height, 24px margins | Logo left · Compass center · Utilities right

function TopHUD({ mode, setMode, onOrbitRequest }: { mode: Mode; setMode: (m: Mode) => void; onOrbitRequest: () => void }) {
  return (
    <>
      {/* ── Thin file-system-level bar ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 38, zIndex: 100,
        background: "rgba(8,5,22,0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(123,47,255,0.28)",
        boxShadow: "0 1px 0 rgba(160,100,255,0.12)",
        display: "flex", alignItems: "center",
        padding: "0 16px", gap: 10,
      }}>
        {/* Branding */}
        <div style={{ display: "flex", alignItems: "center", minWidth: 180, overflow: "hidden", flexShrink: 0 }}>
          <img src={nexusLogo} alt="EZ NEXUS" style={{ height: 34, width: "auto", maxWidth: 180, objectFit: "contain", mixBlendMode: "screen", display: "block" }} />
        </div>
        <div style={{ flex: 1 }} />
        {/* Right utilities */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <Search size={14} color="rgba(160,185,255,0.4)" style={{ cursor: "pointer" }} />
          <Bell   size={14} color="rgba(160,185,255,0.4)" style={{ cursor: "pointer" }} />
          <RRLogo size={26} />
        </div>
      </div>

      {/* ── Mode switcher — floats above the bar, centered ── */}
      <div style={{
        position: "absolute", top: 4, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        zIndex: 110,
        pointerEvents: "none",
      }}>
        <div style={{ pointerEvents: "auto" }}>
          <ModeSwitcher mode={mode} setMode={setMode} onOrbitRequest={onOrbitRequest} />
        </div>
      </div>
    </>
  );
}

// ─── Bottom HUD ───────────────────────────────────────────────────────────────
// ~74px height | Segmented modules · Center emblem · Status widgets

function BottomHUD({ mode }: { mode: Mode }) {
  const now = new Date();
  const orbitStats = [
    { label: "LOCATION",       value: "EZ COSMOS DASH",  Icon: Navigation },
    { label: "VELOCITY",       value: "0.0 m/s",         Icon: Gauge      },
    { label: "ALTITUDE",       value: "12.45 AU",         Icon: Navigation },
    { label: "HELMET HUD",     value: "Active",           Icon: Monitor    },
    { label: "SUIT INTEGRITY", value: "100%",             Icon: Shield     },
    { label: "OXYGEN",         value: "100%",             Icon: Wind       },
    { label: "TIME",           value: now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}), Icon: Clock },
    { label: "DATE",           value: now.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}), Icon: Calendar },
  ];
  const nexusStats = [
    { label: "ACTIVE PROJECTS",  value: "24",   Icon: Package },
    { label: "TASKS COMPLETED",  value: "156",  Icon: Activity },
    { label: "TICKETS RESOLVED", value: "89",   Icon: MessageSquare },
    { label: "SYSTEM HEALTH",    value: "98%",  Icon: Shield },
    { label: "AI INTERACTIONS",  value: "1.2K", Icon: Cpu },
    { label: "TIME",             value: now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}), Icon: Clock },
    { label: "DATE",             value: now.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}), Icon: Calendar },
  ];
  const stats = mode === "dash" ? orbitStats : nexusStats;

  const half = Math.ceil(stats.length / 2);
  const leftStats  = stats.slice(0, half);
  const rightStats = stats.slice(half);

  const statCell = (s: typeof stats[0], i: number) => (
    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <s.Icon size={10} color={PALETTE.cyan} />
      <div>
        <div style={{ ...orb(7, 700), color: "rgba(140,170,255,0.4)" }}>{s.label}</div>
        <div style={{ ...orb(9, 700), color: PALETTE.text }}>{s.value}</div>
      </div>
    </div>
  );

  return (
    <div style={{
      ...GC, position: "absolute", bottom: 0, left: 0, right: 0,
      height: 56, borderRadius: 0,
      borderBottom: "none", borderLeft: "none", borderRight: "none",
      borderTop: "1px solid rgba(123,47,255,0.28)",
      display: "flex", alignItems: "center", padding: "0 16px", zIndex: 100,
    }}>
      {/* Left stats */}
      <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 16 }}>
        {leftStats.map((s, i) => (
          <React.Fragment key={i}>
            {statCell(s, i)}
            {i < leftStats.length - 1 && <div style={{ width: 1, height: 26, background: "rgba(0,210,255,0.1)", flexShrink: 0 }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Center: EZ Nexus action button — aligned with mode button divider */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <button style={{
          width: 60, height: 60,
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, rgba(123,47,255,0.35), rgba(0,210,255,0.15))",
          border: "1.5px solid rgba(123,47,255,0.6)",
          boxShadow: "0 0 24px rgba(123,47,255,0.5), 0 0 8px rgba(0,210,255,0.3), inset 0 0 16px rgba(123,47,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", padding: 0, flexShrink: 0,
        }}>
          <img src={ezNexusLogo} alt="EZ Nexus" style={{ width: 52, height: 52, objectFit: "contain", borderRadius: "50%", mixBlendMode: "screen" }} />
        </button>
      </div>

      {/* Right stats */}
      <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 16, justifyContent: "flex-end" }}>
        {rightStats.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 1, height: 26, background: "rgba(0,210,255,0.1)", flexShrink: 0 }} />}
            {statCell(s, i)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── LEFT MODULES — Floating independent cards ────────────────────────────────
// image.png: "Independent widgets", 16px radius, 20px padding, 16px gaps

const KEYBINDS: [string, string][] = [
  ["W","Look Up"],    ["A","Look Left"],
  ["SPACE","Teleport"],["S","Look Down"],
  ["D","Look Right"], ["E","Rotate"],
  ["L SHIFT","Boost"],["Q","Roll"],
  ["SCROLL","Zoom"],  ["R","Search"],
];

const NAV_ITEMS = [
  { Icon: Home,        label: "Overview",      sub: "Nexus Home",         active: true  },
  { Icon: Globe,       label: "My Worlds",     sub: "Your Products",      active: false },
  { Icon: Monitor,     label: "OneStop",       sub: "Control Center",     active: false },
  { Icon: Star,        label: "EaseLizabeth", sub: "Your AI Guide",      active: false },
  { Icon: ShoppingBag, label: "Marketplace",   sub: "Assets & Tools",     active: false },
  { Icon: Users,       label: "Community",     sub: "Connect & Share",    active: false },
  { Icon: BookOpen,    label: "Learn",          sub: "Guides & Tutorials", active: false },
  { Icon: User,        label: "Profile",        sub: "Personal Hub",       active: false },
];

const ORG_NAV_ITEMS = [
  { Icon: Users,       label: "Team Overview",    sub: "All Staff & Roles",      active: true  },
  { Icon: BarChart3,   label: "Departments",      sub: "Structure & Hierarchy",  active: false },
  { Icon: User,        label: "Staff Directory",  sub: "People & Contacts",      active: false },
  { Icon: Calendar,    label: "Schedules",        sub: "Shifts & Availability",  active: false },
  { Icon: Star,        label: "Onboarding",       sub: "New Hire Flows",         active: false },
  { Icon: BookOpen,    label: "HR Policies",      sub: "Guidelines & Docs",      active: false },
  { Icon: Shield,      label: "Compliance",       sub: "Audit & Governance",     active: false },
  { Icon: Settings,    label: "Org Settings",     sub: "Configuration & Perms",  active: false },
];

const CMD_ITEMS = [
  { label: "EZRequest",    Icon: FileText,    color: PALETTE.cyan   },
  { label: "EZApproval",   Icon: CheckSquare, color: "#00ff88"      },
  { label: "EZCreate",     Icon: PlusCircle,  color: PALETTE.purple },
  { label: "EZMembership", Icon: Users,       color: "#fbbf24"      },
];

function CommandCenterCard() {
  return (
    <div style={{ ...GC, padding: "14px 14px" }}>
      <div style={{ ...orb(9, 800), letterSpacing: "0.06em", marginBottom: 10, ...gradText() }}>
        EZNEXUS COMMANDCENTER
      </div>
      {CMD_ITEMS.map((c) => (
        <button key={c.label} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 10px", marginBottom: 6, background: "rgba(255,255,255,0.04)", border: `1px solid ${PALETTE.border}`, borderLeft: `2px solid ${c.color}55`, borderRadius: 8, cursor: "pointer", textAlign: "left" }}>
          <c.Icon size={12} color={c.color} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: PALETTE.text, fontFamily: "Rajdhani, sans-serif" }}>{c.label}</span>
          <ChevronRight size={10} color={PALETTE.muted} style={{ marginLeft: "auto", flexShrink: 0 }} />
        </button>
      ))}
      <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", padding: "8px 10px", marginTop: 2, background: "rgba(167,139,250,0.12)", border: `1px solid rgba(167,139,250,0.45)`, borderRadius: 8, cursor: "pointer" }}>
        <MessageSquare size={11} color="#a78bfa" />
        <span style={{ ...orb(9, 700), color: "#a78bfa", letterSpacing: "0.04em" }}>Submit EZTicket</span>
      </button>
    </div>
  );
}

function OrgNavCard() {
  return (
    <div style={{ ...GC, padding: "14px 14px" }}>
      <div style={{ ...orb(9, 800), letterSpacing: "0.06em", marginBottom: 10, ...gradText() }}>
        ORG NAVIGATION
      </div>
      {ORG_NAV_ITEMS.map((item, i) => (
        <button key={i} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 10px", marginBottom: 5, background: item.active ? "rgba(0,210,255,0.07)" : "rgba(255,255,255,0.035)", border: `1px solid ${item.active ? "rgba(0,210,255,0.28)" : PALETTE.border}`, borderLeft: `2px solid ${item.active ? PALETTE.cyan : "rgba(255,255,255,0.1)"}`, borderRadius: 8, cursor: "pointer", textAlign: "left" }}>
          <item.Icon size={12} color={item.active ? PALETTE.cyan : PALETTE.muted} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: item.active ? PALETTE.cyan : PALETTE.text, fontFamily: "Rajdhani, sans-serif", flex: 1 }}>{item.label}</span>
          <ChevronRight size={10} color={item.active ? `${PALETTE.cyan}88` : `${PALETTE.muted}66`} style={{ flexShrink: 0 }} />
        </button>
      ))}
    </div>
  );
}

function LeftModules({ mode }: { mode: Mode }) {
  return (
    <div style={{ position: "absolute", top: 80, left: 12, width: 204, display: "flex", flexDirection: "column", gap: 14, zIndex: 50, maxHeight: "calc(100vh - 80px - 68px)", overflowY: "auto", paddingBottom: 6 }}>

      {mode === "dash" ? (
        <>
          {/* ORBIT MODE header card */}
          <div style={{ ...GC, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <Compass size={11} color={PALETTE.cyan} />
              <span style={{ ...orb(10, 800), color: "#fff" }}>ORBIT MODE</span>
            </div>
            <div style={{ fontSize: 9, color: PALETTE.muted, fontFamily: "Rajdhani, sans-serif" }}>Explore, Discover, Connect</div>
          </div>

          {/* Navigation Guide */}
          <div style={{ ...GC, padding: "12px 14px" }}>
            <SHead>Navigation Guide</SHead>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 6px" }}>
              {KEYBINDS.map(([key, action]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ padding: "2px 5px", ...orb(7, 700), background: "rgba(0,210,255,0.1)", border: "1px solid rgba(0,210,255,0.25)", borderRadius: 4, color: PALETTE.cyan, whiteSpace: "nowrap", flexShrink: 0 }}>{key}</div>
                  <span style={{ fontSize: 8, color: PALETTE.muted, fontFamily: "Rajdhani, sans-serif", whiteSpace: "nowrap" }}>{action}</span>
                </div>
              ))}
            </div>
          </div>

          <SystemStatusCard />
          <CosmicRadioCard />

          {/* Location */}
          <div style={{ ...GC, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
              <Navigation size={9} color={PALETTE.cyan} />
              <span style={{ ...orb(8, 700), color: PALETTE.muted }}>Location</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: PALETTE.text, fontFamily: "Rajdhani, sans-serif" }}>EZ Cosmos Orbit</div>
            <div style={{ fontSize: 9, color: PALETTE.muted, fontFamily: "Rajdhani, sans-serif" }}>Sector 7 · Deep Space</div>
          </div>
        </>
      ) : (
        <>
          {/* NEXUS Navigation — CommandCenter style */}
          <div style={{ ...GC, padding: "14px 14px" }}>
            <div style={{ ...orb(9, 800), letterSpacing: "0.06em", marginBottom: 10, ...gradText() }}>NEXUS NAVIGATION</div>
            {NAV_ITEMS.map((item, i) => (
              <button key={i} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 10px", marginBottom: 5, background: item.active ? "rgba(0,210,255,0.07)" : "rgba(255,255,255,0.035)", border: `1px solid ${item.active ? "rgba(0,210,255,0.28)" : PALETTE.border}`, borderLeft: `2px solid ${item.active ? PALETTE.cyan : "rgba(255,255,255,0.1)"}`, borderRadius: 8, cursor: "pointer", textAlign: "left" }}>
                <item.Icon size={12} color={item.active ? PALETTE.cyan : PALETTE.muted} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: item.active ? PALETTE.cyan : PALETTE.text, fontFamily: "Rajdhani, sans-serif", flex: 1 }}>{item.label}</span>
                <ChevronRight size={10} color={item.active ? `${PALETTE.cyan}88` : `${PALETTE.muted}66`} style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>

          {/* CommandCenter — below navigation */}
          <CommandCenterCard />

          {/* Nexus Intelligence — below command center */}
          <NexusIntelligenceCard />
        </>
      )}
    </div>
  );
}

// ─── RIGHT MODULES — Floating independent cards ───────────────────────────────

const ACTIVITY = [
  { label: "EZ 3D Studio",  detail: "Project updated", time: "2m ago",  color: "#fb923c" },
  { label: "EZ PM",         detail: "Task assigned",   time: "15m ago", color: "#f472b6" },
  { label: "Ticket #087",   detail: "Resolved",        time: "1h ago",  color: "#a78bfa" },
  { label: "EZCustom",      detail: "Model sync done", time: "2h ago",  color: "#c084fc" },
];

const EVENTS = [
  { title: "EZ Universe Update",          date: "May 28, 2025 – 10:00 AM", color: PALETTE.purple },
  { title: "Community Showcase",          date: "May 28, 2025 – 2:00 PM",  color: PALETTE.cyan   },
  { title: "Live Q&A with EaseLizabeth", date: "May 30, 2025",            color: "#f472b6"      },
];

// Shared EaseLizabeth card — avatarHeight controls how much of the character is shown
function EaseLizabethCard({ mode, avatarHeight = 155 }: { mode: Mode; avatarHeight?: number }) {
  return (
    <div style={{ ...GC, padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px 8px", borderBottom: `1px solid ${PALETTE.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ ...orb(10, 800), ...gradText() }}>EASELIZABETH</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 6px #00ff88" }} />
          <span style={{ ...orb(8, 700), color: "#00ff88" }}>ON LINE</span>
        </div>
      </div>

      {/* Avatar — cropped from background asset */}
      <div style={{ height: avatarHeight, position: "relative", overflow: "hidden", backgroundImage: `url(${avatarBg})`, backgroundSize: "260%", backgroundPosition: "88% 5%" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,9,45,0.95) 0%, rgba(13,9,45,0.2) 55%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 30px rgba(0,210,255,0.08)` }} />
        <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center", padding: "0 12px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", textShadow: `0 0 14px ${PALETTE.cyan}`, fontFamily: "Rajdhani, sans-serif" }}>Hello, Ray.</div>
          <div style={{ fontSize: 10, color: "rgba(190,215,255,0.85)", lineHeight: 1.5, fontFamily: "Rajdhani, sans-serif" }}>
            {mode === "nexus"
              ? <>How can I guide you<br />in the Nexus today?</>
              : <>How can I assist you<br />on your Dash today?</>}
          </div>
        </div>
      </div>

      {/* Waveform + chat button */}
      <div style={{ padding: "8px 14px 10px", borderTop: `1px solid ${PALETTE.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 8 }}>
          {[3,5,9,13,7,11,4,8,12,5,9,3,7,4,10,6,8,4,11,7].map((h, i) => (
            <div key={i} style={{ width: 2, height: h, background: PALETTE.cyan, borderRadius: 1, opacity: 0.45 }} />
          ))}
        </div>
        <button style={{ width: "100%", padding: "6px", ...orb(9, 700), color: PALETTE.cyan, background: "rgba(0,210,255,0.1)", border: `1px solid rgba(0,210,255,0.3)`, borderRadius: 7, cursor: "pointer", boxShadow: "0 0 10px rgba(0,210,255,0.1)" }}>
          Chat with Me →
        </button>
      </div>
    </div>
  );
}

function RightModules({ mode }: { mode: Mode }) {
  return (
    <div style={{ position: "absolute", top: 80, right: 12, width: 266, display: "flex", flexDirection: "column", gap: 14, zIndex: 50, maxHeight: "calc(100vh - 80px - 68px)", overflowY: "auto", paddingBottom: 6 }}>

      {/* Mode-specific cards */}
      {mode === "nexus" ? (
        <>
          {/* Org Navigation — mirrors Nexus Nav on the left */}
          <OrgNavCard />

          {/* EaseLizabeth — expanded, fills space freed by removing radio */}
          <EaseLizabethCard mode={mode} avatarHeight={340} />
        </>
      ) : (
        <>
          {/* Active Mission */}
          <div style={{ ...GC, padding: "14px 14px" }}>
            <SHead mb={10}>Active Mission</SHead>
            <div style={{ padding: "10px 10px", background: "rgba(255,255,255,0.04)", border: `1px solid ${PALETTE.border}`, borderRadius: 8, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Compass size={13} color="#fbbf24" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "Rajdhani, sans-serif" }}>Explore & Discover</span>
              </div>
              <div style={{ fontSize: 10, color: PALETTE.muted, marginBottom: 8, lineHeight: 1.5, fontFamily: "Rajdhani, sans-serif" }}>Visit new worlds and unlock their potential</div>
              <div style={{ fontSize: 9, color: PALETTE.muted, marginBottom: 5, fontFamily: "Rajdhani, sans-serif" }}>Progress: 3 / 7 Worlds</div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "43%", background: `linear-gradient(to right,${PALETTE.purple},${PALETTE.cyan})`, borderRadius: 2 }} />
              </div>
            </div>
            <button style={{ width: "100%", padding: "6px", ...orb(9, 600), color: PALETTE.muted, background: "rgba(255,255,255,0.03)", border: `1px solid ${PALETTE.border}`, borderRadius: 6, cursor: "pointer" }}>
              View Mission Log
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{ ...GC, padding: "14px 14px" }}>
            <SHead mb={10}>Quick Actions</SHead>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[{Icon:Map,l:"Map"},{Icon:Satellite,l:"Scan"},{Icon:Star,l:"Favor."},{Icon:Navigation,l:"Navigate"},{Icon:Package,l:"Inventory"},{Icon:MessageSquare,l:"Comms"}].map(({Icon,l}) => (
                <button key={l} style={{ padding: "9px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, ...orb(8, 600), color: PALETTE.muted, background: "rgba(255,255,255,0.04)", border: `1px solid ${PALETTE.border}`, borderRadius: 8, cursor: "pointer" }}>
                  <Icon size={14} color={PALETTE.muted} />{l}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* EaseLizabeth for dash mode */}
      {mode === "dash" && <EaseLizabethCard mode={mode} />}
    </div>
  );
}

// ─── CENTER VIEWPORT elements ─────────────────────────────────────────────────

// Orbital node data — matches reference layout
const ORB_NODES = [
  { id: "ezpm",        label: "EZ PM",           sub: "Project Guide",        color: "#f472b6", angle: 315, r: 130 },
  { id: "ai",          label: "EZCustom",        sub: "Custom Solutions Hub", color: "#c084fc", angle: 25,  r: 130 },
  { id: "ez3d",        label: "EZ3D Studio",     sub: "Create Without Limits",color: "#fb923c", angle: 210, r: 130 },
  { id: "ticket",      label: "EZ ITSM",         sub: "IT Service Management",color: "#4ade80", angle: 145, r: 130 },
  { id: "elizabeth",   label: "EaseLizabeth",   sub: "AI That Empowers",     color: "#c084fc", angle: 200, r: 205 },
  { id: "marketplace", label: "Marketplace",     sub: "Assets & Tools",       color: "#fbbf24", angle: 238, r: 205 },
  { id: "community",   label: "Community",       sub: "Connect & Share",      color: "#34d399", angle: 276, r: 205 },
  { id: "onestop",     label: "OneStop",         sub: "Command Everything",   color: "#22d3ee", angle: 312, r: 205 },
];

function toRad(deg: number) { return (deg * Math.PI) / 180; }

function OrbitalHub() {
  const W = 520, H = 480, cx = 255, cy = 245;

  const nodes = ORB_NODES.map((n) => ({
    ...n,
    x: cx + n.r * Math.cos(toRad(n.angle)),
    y: cy + n.r * Math.sin(toRad(n.angle)),
  }));

  return (
    <div style={{ position: "absolute", left: "34%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 20, pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="hub-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#7b2fff" stopOpacity="0.5" />
            <stop offset="50%"  stopColor="#0d4d91" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ambient hub glow */}
        <ellipse cx={cx} cy={cy} rx={105} ry={88} fill="url(#hub-bg)" />

        {/* Orbital rings — dashed */}
        <ellipse cx={cx} cy={cy} rx={130} ry={110} fill="none" stroke="rgba(0,210,255,0.18)" strokeWidth="1" strokeDasharray="5 10" />
        <ellipse cx={cx} cy={cy} rx={205} ry={175} fill="none" stroke="rgba(123,47,255,0.13)" strokeWidth="1" strokeDasharray="4 12" />

        {/* Connector lines from hub to nodes */}
        {nodes.map((n) => (
          <line key={n.id} x1={cx} y1={cy} x2={n.x} y2={n.y}
            stroke={n.color} strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 8" />
        ))}

        {/* Central hub — ringed planet style */}
        {/* Outer ring */}
        <ellipse cx={cx} cy={cy} rx={68} ry={22} fill="none" stroke="rgba(0,210,255,0.35)" strokeWidth="2.5"
          transform={`rotate(-20, ${cx}, ${cy})`} />
        {/* Hub sphere */}
        <circle cx={cx} cy={cy} r={48}
          fill="radial-gradient(circle, #2a0f57, #0a0b12)"
          style={{ filter: "url(#node-glow)" }}
        />
        <circle cx={cx} cy={cy} r={48} fill="#0d0820" stroke="rgba(0,210,255,0.45)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={42} fill="rgba(78,26,213,0.25)" />
        {/* Inner glow */}
        <circle cx={cx} cy={cy} r={32} fill="rgba(123,47,255,0.2)" />
        {/* Hub text */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="url(#rr-grad)" fontSize="13" fontWeight="900" fontFamily="Orbitron,monospace">RR</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={PALETTE.cyan} fontSize="6.5" fontWeight="700" fontFamily="Orbitron,monospace" letterSpacing="0.08em">EZ COSMOS</text>

        {/* Orbital nodes */}
        {nodes.map((n) => (
          <g key={n.id} filter="url(#node-glow)">
            {/* Node glow halo */}
            <circle cx={n.x} cy={n.y} r={26} fill={n.color} fillOpacity="0.07" />
            {/* Node ring */}
            <circle cx={n.x} cy={n.y} r={20} fill="#0a0b12" fillOpacity="0.75" stroke={n.color} strokeWidth="1.5" strokeOpacity="0.65" />
            {/* Node core dot */}
            <circle cx={n.x} cy={n.y} r={7} fill={n.color} fillOpacity="0.9" />
            {/* Label */}
            <text x={n.x} y={n.y + 34} textAnchor="middle" fill={n.color} fontSize="8" fontWeight="700" fontFamily="Orbitron,monospace"
              style={{ textShadow: `0 0 8px ${n.color}` }}>{n.label}</text>
            <text x={n.x} y={n.y + 44} textAnchor="middle" fill="rgba(190,210,255,0.55)" fontSize="7" fontFamily="Rajdhani,sans-serif">{n.sub}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// EZ COSMOS — Row 1: split 50/50 with Upcoming Events
function CosmosRow() {
  return (
    <div style={{ height: "100%", display: "flex", gap: 7 }}>

      {/* Left half — EZ Cosmos identity */}
      <div style={{ ...GC, flex: 1, padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 36px rgba(0,210,255,0.10), 0 0 22px rgba(78,26,213,0.22), 0 0 1px rgba(160,100,255,0.45), inset 0 1px 0 rgba(255,255,255,0.07)" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(0,210,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,210,255,0.08)", boxShadow: "0 0 18px rgba(0,210,255,0.3)", flexShrink: 0 }}>
          <Globe size={20} color={PALETTE.cyan} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ ...orb(17, 900), letterSpacing: "0.05em", ...gradText() }}>EZ COSMOS</span>
            <div style={{ padding: "2px 6px", background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.4)", borderRadius: 4, ...orb(6, 700), color: "#00ff88" }}>LIVE</div>
          </div>
          <div style={{ fontSize: 10, color: PALETTE.muted, fontFamily: "Rajdhani, sans-serif", marginBottom: 6 }}>IT & Enterprise Suite · 6 Products Active</div>
          <button style={{ padding: "6px 16px", ...orb(9, 700), color: "#fff", background: "linear-gradient(135deg, rgba(123,47,255,0.6), rgba(13,77,145,0.6))", border: "1px solid rgba(0,210,255,0.45)", borderRadius: 7, cursor: "pointer", boxShadow: "0 0 16px rgba(0,210,255,0.2)", letterSpacing: "0.05em", whiteSpace: "nowrap" as const }}>
            Enter Cosmos →
          </button>
        </div>
      </div>

      {/* Right half — Upcoming Events */}
      <div style={{ ...GC, flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column" }}>
        <div style={{ ...orb(9, 800), letterSpacing: "0.1em", marginBottom: 8, ...gradText() }}>UPCOMING EVENTS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
          {EVENTS.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "rgba(255,255,255,0.03)", border: `1px solid ${PALETTE.border}`, borderLeft: `2px solid ${e.color}`, borderRadius: 8 }}>
              <Calendar size={10} color={e.color} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: PALETTE.text, fontFamily: "Rajdhani, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{e.title}</div>
                <div style={{ fontSize: 8, color: PALETTE.muted, fontFamily: "Rajdhani, sans-serif" }}>{e.date}</div>
              </div>
              <ChevronRight size={10} color={PALETTE.muted} style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Galaxy Nav Row — Row 2 of center layout, horizontal arrows cycling all 3 galaxies
function GalaxyNavRow({ galaxy, setGalaxy }: { galaxy: Galaxy; setGalaxy: (g: Galaxy) => void }) {
  const navIdx = NAV_GALAXIES.findIndex(g => g.id === galaxy);
  const baseIdx = navIdx >= 0 ? navIdx : 0;
  const prevG = NAV_GALAXIES[(baseIdx - 1 + NAV_GALAXIES.length) % NAV_GALAXIES.length];
  const nextG = NAV_GALAXIES[(baseIdx + 1) % NAV_GALAXIES.length];

  const navBtn = (dir: "left" | "right", target: typeof prevG) => {
    const isLeft = dir === "left";
    return (
      <button
        onClick={() => setGalaxy(target.id)}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 12,
          justifyContent: isLeft ? "flex-start" : "flex-end",
          padding: "8px 16px",
          background: isLeft
            ? `linear-gradient(to right, rgba(10,6,28,0.9) 0%, rgba(10,6,28,0.5) 100%)`
            : `linear-gradient(to left, rgba(10,6,28,0.9) 0%, rgba(10,6,28,0.5) 100%)`,
          border: `1px solid ${target.color}44`,
          [isLeft ? "borderLeft" : "borderRight"]: `2px solid ${target.color}`,
          borderRadius: 10,
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: `0 0 18px ${target.color}2a, inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        {isLeft && (
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${target.color}18`, border: `1.5px solid ${target.color}88`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 12px ${target.color}44` }}>
            <ChevronLeft size={17} color={target.color} />
          </div>
        )}
        <div style={{ textAlign: isLeft ? "left" : "right" }}>
          <div style={{ fontFamily: "Orbitron, monospace", fontSize: 9.5, fontWeight: 900, color: target.color, letterSpacing: "0.14em", textShadow: `0 0 10px ${target.color}`, whiteSpace: "nowrap" as const }}>
            {target.name}
          </div>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 8, color: `${target.color}88`, whiteSpace: "nowrap" as const, letterSpacing: "0.04em" }}>
            {target.sub}
          </div>
        </div>
        {!target.live && (
          <div style={{ padding: "2px 6px", background: `${target.color}18`, border: `1px solid ${target.color}44`, borderRadius: 4, fontFamily: "Orbitron, monospace", fontSize: 6.5, fontWeight: 700, color: target.color, letterSpacing: "0.1em", flexShrink: 0 }}>
            SOON
          </div>
        )}
        {!isLeft && (
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${target.color}18`, border: `1.5px solid ${target.color}88`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 12px ${target.color}44` }}>
            <ChevronRight size={17} color={target.color} />
          </div>
        )}
      </button>
    );
  };

  return (
    <div style={{ display: "flex", gap: 8, height: "100%", alignItems: "stretch" }}>
      {navBtn("left",  prevG)}
      {navBtn("right", nextG)}
    </div>
  );
}

// Product cards — each has a dedicated background image + colour-matched accent
// bgPos: backgroundPosition for the banner crop (center the hero subject)
const PRODUCTS = [
  { name: "EZ 3D Studio", sub: "3D Creative Suite",    color: "#b06aff", Icon: Layers,        img: bEZ3D,         bgPos: "center 30%" },
  { name: "EZ PM",        sub: "Project Management",   color: "#60a5fa", Icon: BarChart3,     img: bEZPM,         bgPos: "center 40%" },
  { name: "EZCustom",     sub: "Custom Solutions Hub", color: "#c084fc", Icon: Brain,         img: bEZCustom,     bgPos: "center 20%" },
  { name: "OneStop",      sub: "Experience Engine",    color: "#fbbf24", Icon: Monitor,       img: bOneStop,      bgPos: "center 28%" },
  { name: "EZ Org",       sub: "Staff Management",     color: "#38bdf8", Icon: Headphones,    img: bSupportStaff, bgPos: "center 35%" },
  { name: "EZ ITSM",      sub: "IT Service Management",color: "#4ade80", Icon: MessageSquare, img: bEZTicket,     bgPos: "center 35%" },
];

const PRODUCT_GROUPS = [
  { category: "CREATIVE SUITE",    accent: "#b06aff", productNames: ["EZ 3D Studio", "EZ PM"] },
  { category: "INTELLIGENCE HUB",  accent: "#c084fc", productNames: ["EZCustom",     "OneStop"] },
  { category: "BUSINESS OPS",      accent: "#38bdf8", productNames: ["EZ Org",       "EZ ITSM"] },
];

// Nexus Intelligence stats (sparkline points as SVG polyline)
const NEXUS_STATS = [
  { label: "Active Projects",  value: "24",   delta: "+15% this week",  spark: "0,10 4,7 8,9 12,4 16,7 20,3 24,6 28,2", sc: "#b06aff" },
  { label: "Tasks Completed",  value: "156",  delta: "+14% this week",  spark: "0,9 4,11 8,5 12,8 16,3 20,9 24,4 28,2", sc: "#60a5fa" },
  { label: "Tickets Resolved", value: "89",   delta: "+5 this week",    spark: "0,8 4,5 8,10 12,3 16,8 20,4 24,7 28,3", sc: "#4ade80" },
  { label: "System Health",    value: "98%",  delta: "Excellent",       spark: "0,4 4,3 8,5 12,2 16,4 20,2 24,3 28,1", sc: "#00ff88" },
  { label: "AI Interactions",  value: "1.2K", delta: "+8 interactions", spark: "0,11 4,7 8,9 12,5 16,8 20,3 24,7 28,2", sc: "#c084fc" },
];

function NexusIntelligenceCard() {
  return (
    <div style={{ ...GC, padding: "14px 14px" }}>
      <div style={{ ...orb(9, 800), letterSpacing: "0.1em", marginBottom: 10, ...gradText() }}>NEXUS INTELLIGENCE</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {NEXUS_STATS.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "rgba(255,255,255,0.03)", border: `1px solid ${PALETTE.border}`, borderLeft: `2px solid ${s.sc}55`, borderRadius: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 1 }}>
                <span style={{ ...orb(14, 900), color: "#fff", lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontSize: 7, color: s.sc, fontFamily: "Rajdhani, sans-serif", fontWeight: 600 }}>{s.delta}</span>
              </div>
              <div style={{ fontSize: 8, color: PALETTE.muted, fontFamily: "Rajdhani, sans-serif" }}>{s.label}</div>
            </div>
            <svg width="40" height="14" viewBox="0 0 28 12" preserveAspectRatio="none" style={{ flexShrink: 0 }}>
              <polyline points={s.spark} fill="none" stroke={s.sc} strokeWidth="1.8" strokeLinejoin="round" opacity="0.65" />
            </svg>
            <ChevronRight size={10} color={PALETTE.muted} style={{ flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WorldsSection({ carouselPage, setCarouselPage, onEzWayClick, galaxy, setGalaxy }: {
  carouselPage: number;
  setCarouselPage: (n: number) => void;
  onEzWayClick: () => void;
  galaxy: Galaxy;
  setGalaxy: (g: Galaxy) => void;
}) {
  const group = PRODUCT_GROUPS[carouselPage];
  const groupProducts = group.productNames.map(n => PRODUCTS.find(p => p.name === n)!);
  const canPrev = carouselPage > 0;
  const canNext = carouselPage < PRODUCT_GROUPS.length - 1;

  // Galaxy nav arrows — using NAV_GALAXIES cycling
  const navIdx = NAV_GALAXIES.findIndex(g => g.id === galaxy);
  const baseIdx = navIdx >= 0 ? navIdx : 0;
  const prevG = NAV_GALAXIES[(baseIdx - 1 + NAV_GALAXIES.length) % NAV_GALAXIES.length];
  const nextG = NAV_GALAXIES[(baseIdx + 1) % NAV_GALAXIES.length];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ ...GC, padding: "10px 14px 8px", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ ...orb(10, 800), letterSpacing: "0.08em", ...gradText() }}>MY WORLDS & PRODUCTS</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: group.accent, boxShadow: `0 0 6px ${group.accent}` }} />
              <span style={{ ...orb(8, 700), color: group.accent, letterSpacing: "0.1em" }}>{group.category}</span>
            </div>
          </div>
          {/* Page dots */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {PRODUCT_GROUPS.map((g, i) => (
              <button key={i} onClick={() => setCarouselPage(i)} style={{ width: carouselPage === i ? 18 : 6, height: 6, borderRadius: 3, background: carouselPage === i ? group.accent : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.25s ease", boxShadow: carouselPage === i ? `0 0 8px ${group.accent}88` : "none" }} />
            ))}
          </div>
        </div>

        {/* ── PRODUCT CARDS — 70% of panel space ── */}
        <div style={{ flex: "7 1 0", minHeight: 0, position: "relative", marginBottom: 4 }}>
          {/* Left carousel arrow */}
          {canPrev && (
            <button onClick={() => setCarouselPage(carouselPage - 1)} style={{ position: "absolute", left: -18, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(13,9,45,0.85)", border: `1px solid ${group.accent}44`, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 0 14px ${group.accent}22` }}>
              <ChevronLeft size={15} color={group.accent} />
            </button>
          )}
          {/* Right carousel arrow */}
          {canNext && (
            <button onClick={() => setCarouselPage(carouselPage + 1)} style={{ position: "absolute", right: -18, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(13,9,45,0.85)", border: `1px solid ${group.accent}44`, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 0 14px ${group.accent}22` }}>
              <ChevronRight size={15} color={group.accent} />
            </button>
          )}
          <div style={{ display: "flex", gap: 12, height: "100%" }}>
            {groupProducts.map((p) => (
              <div key={p.name} style={{ flex: 1, borderRadius: 10, overflow: "hidden", background: "rgba(8,5,28,0.82)", border: `1px solid ${PALETTE.border}`, cursor: "pointer", display: "flex", flexDirection: "column" }}>
                {/* Artwork banner */}
                <div style={{ flex: 1, position: "relative", overflow: "hidden", backgroundImage: `url(${p.img})`, backgroundSize: "cover", backgroundPosition: p.bgPos }}>
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(8,5,28,0.05) 0%, rgba(8,5,28,0) 30%, rgba(8,5,28,0.92) 100%)` }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, rgba(8,5,28,0.45) 0%, transparent 18%, transparent 82%, rgba(8,5,28,0.45) 100%)` }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${p.color}cc, ${p.color}00)` }} />
                  <div style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 7, background: `rgba(8,5,28,0.7)`, border: `1px solid ${p.color}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p.Icon size={14} color={p.color} />
                  </div>
                  <div style={{ position: "absolute", top: 10, left: 10, padding: "2px 8px", background: `${p.color}18`, border: `1px solid ${p.color}40`, borderRadius: 4 }}>
                    <span style={{ ...orb(7, 700), color: p.color }}>{group.category}</span>
                  </div>
                </div>
                {/* Content */}
                <div style={{ padding: "10px 12px 12px", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ ...orb(16, 900), lineHeight: 1.15, marginBottom: 4, ...gradText() }}>{p.name}</div>
                  <div style={{ fontSize: 10, fontFamily: "Rajdhani, sans-serif", marginBottom: 10, color: p.color, opacity: 0.82, letterSpacing: "0.04em" }}>{p.sub}</div>
                  <button style={{ padding: "6px 0", ...orb(9, 700), color: p.color, background: `${p.color}14`, border: `1px solid ${p.color}44`, borderRadius: 6, cursor: "pointer", width: "100%", textAlign: "center", letterSpacing: "0.06em", boxShadow: `0 0 8px ${p.color}18` }}>
                    Launch →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE EZ WAY — 20% of panel space ── */}
        <div style={{ flex: "2 1 0", minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={onEzWayClick} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "center", padding: "4px 0" }}>
            <div style={{ ...orb(22, 900), ...gradText(), lineHeight: 1.1 }}>The EZ WAY</div>
            <div style={{ fontSize: 11, color: "rgba(160,185,255,0.55)", fontFamily: "Rajdhani, sans-serif", marginTop: 3, letterSpacing: "0.06em" }}>
              Why is this an EZ choice? →
            </div>
          </button>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(123,47,255,0.35), transparent)", flexShrink: 0, marginBottom: 7 }} />

        {/* ── GALAXY NAV ARROWS — duplicated from audio/gamer style ── */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {/* Prev galaxy */}
          <button
            onClick={() => setGalaxy(prevG.id)}
            style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: `${prevG.color}10`, border: `1px solid ${prevG.color}38`, borderLeft: `2px solid ${prevG.color}`, borderRadius: 10, cursor: "pointer", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: `0 0 14px ${prevG.color}18` }}
          >
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${prevG.color}18`, border: `1px solid ${prevG.color}88`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ChevronLeft size={13} color={prevG.color} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Orbitron, monospace", fontSize: 8, fontWeight: 900, color: prevG.color, letterSpacing: "0.12em", textShadow: `0 0 8px ${prevG.color}88` }}>{prevG.name}</div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 7.5, color: `${prevG.color}88` }}>{prevG.sub}</div>
            </div>
            {!prevG.live && (
              <div style={{ marginLeft: "auto", padding: "1px 5px", background: `${prevG.color}14`, border: `1px solid ${prevG.color}38`, borderRadius: 4, fontFamily: "Orbitron, monospace", fontSize: 6, fontWeight: 700, color: prevG.color }}>SOON</div>
            )}
          </button>

          {/* Next galaxy */}
          <button
            onClick={() => setGalaxy(nextG.id)}
            style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: `${nextG.color}10`, border: `1px solid ${nextG.color}38`, borderRight: `2px solid ${nextG.color}`, borderRadius: 10, cursor: "pointer", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: `0 0 14px ${nextG.color}18`, justifyContent: "flex-end" }}
          >
            {!nextG.live && (
              <div style={{ marginRight: "auto", padding: "1px 5px", background: `${nextG.color}14`, border: `1px solid ${nextG.color}38`, borderRadius: 4, fontFamily: "Orbitron, monospace", fontSize: 6, fontWeight: 700, color: nextG.color }}>SOON</div>
            )}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Orbitron, monospace", fontSize: 8, fontWeight: 900, color: nextG.color, letterSpacing: "0.12em", textShadow: `0 0 8px ${nextG.color}88` }}>{nextG.name}</div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 7.5, color: `${nextG.color}88` }}>{nextG.sub}</div>
            </div>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${nextG.color}18`, border: `1px solid ${nextG.color}88`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ChevronRight size={13} color={nextG.color} />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}

// RAAR BREATH — orbit mode, floating bottom center
function RaarBreath() {
  return (
    <div style={{ position: "absolute", bottom: 74, left: "50%", transform: "translateX(-50%)", zIndex: 30, pointerEvents: "none" }}>
      <div style={{ ...GC, width: 295, padding: "12px 16px", boxShadow: `0 0 24px rgba(0,210,255,0.1)`, border: `1px solid rgba(0,210,255,0.22)` }}>
        <div style={{ ...orb(8, 700), color: PALETTE.cyan, letterSpacing: "0.12em", marginBottom: 6 }}>RAAR BREATH</div>
        <div style={{ fontSize: 12, color: PALETTE.text, lineHeight: 1.65, fontStyle: "italic", fontFamily: "Rajdhani, sans-serif" }}>
          You are in Orbit Mode.<br />
          Fly freely, discover new worlds,<br />
          and choose where to go next.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 8 }}>
          {[3,6,10,14,8,12,5,9,13,6,10,4,8,5,11,7,4,9,6,12].map((h, i) => (
            <div key={i} style={{ width: 2, height: h, background: PALETTE.cyan, borderRadius: 1, opacity: 0.48 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Galaxy dots indicator (bottom center) — only cosmos/audio/gamer ─────────
function GalaxyEdgeNav({ galaxy }: { galaxy: Galaxy; setGalaxy: (g: Galaxy) => void }) {
  const current = NAV_GALAXIES.find(g => g.id === galaxy) ?? NAV_GALAXIES[0];
  if (!NAV_GALAXIES.find(g => g.id === galaxy)) return null; // hide dots in ezway
  return (
    <div style={{
      position: "fixed", bottom: 14, left: "50%", transform: "translateX(-50%)",
      zIndex: 45, display: "flex", alignItems: "center", gap: 7, pointerEvents: "none",
    }}>
      {NAV_GALAXIES.map((g) => (
        <div key={g.id} style={{
          width: galaxy === g.id ? 24 : 6, height: 6, borderRadius: 3,
          background: galaxy === g.id ? current.color : "rgba(255,255,255,0.12)",
          boxShadow: galaxy === g.id ? `0 0 10px ${current.color}aa` : "none",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

// ─── Galaxy Placeholder (non-live galaxies) ───────────────────────────────────
function GalaxyComingSoon({ galaxy, setGalaxy }: { galaxy: Galaxy; setGalaxy: (g: Galaxy) => void }) {
  const g = GALAXIES.find(x => x.id === galaxy)!;
  const idx   = NAV_GALAXIES.findIndex(x => x.id === galaxy);
  const prevG = NAV_GALAXIES[(idx - 1 + NAV_GALAXIES.length) % NAV_GALAXIES.length];
  const nextG = NAV_GALAXIES[(idx + 1) % NAV_GALAXIES.length];

  return (
    <div style={{ position: "absolute", top: 38, left: 0, right: 0, bottom: 56, zIndex: 30, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, textAlign: "center" }}>
      {/* Glowing ring */}
      <div style={{ width: 130, height: 130, borderRadius: "50%", border: `2px solid ${g.color}66`, boxShadow: `0 0 50px ${g.color}33, inset 0 0 40px ${g.color}11`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", border: `1px solid ${g.color}44`, boxShadow: `0 0 24px ${g.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 36 }}>{g.id === "audio" ? "🎵" : "🎮"}</div>
        </div>
      </div>
      <div style={{ fontFamily: "Orbitron, monospace", fontSize: 32, fontWeight: 900, color: g.color, letterSpacing: "0.06em", textShadow: `0 0 30px ${g.color}88` }}>{g.name}</div>
      <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 15, color: `${g.color}88`, letterSpacing: "0.1em" }}>{g.sub}</div>
      <div style={{ padding: "9px 22px", background: `${g.color}12`, border: `1px solid ${g.color}44`, borderRadius: 8, fontFamily: "Orbitron, monospace", fontSize: 10, fontWeight: 700, color: g.color, letterSpacing: "0.12em" }}>
        LAUNCHING SOON — AUTHENTICATED VIA NEXUS
      </div>

      {/* Inline galaxy navigation */}
      <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
        <button
          onClick={() => setGalaxy(prevG.id)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", background: `${prevG.color}14`, border: `1px solid ${prevG.color}44`, borderLeft: `2px solid ${prevG.color}`, borderRadius: 10, cursor: "pointer", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: `0 0 16px ${prevG.color}22` }}
        >
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${prevG.color}18`, border: `1px solid ${prevG.color}88`, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={14} color={prevG.color} /></div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: 8.5, fontWeight: 900, color: prevG.color, letterSpacing: "0.12em" }}>{prevG.name}</div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 7.5, color: `${prevG.color}88` }}>{prevG.sub}</div>
          </div>
        </button>
        <button
          onClick={() => setGalaxy(nextG.id)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", background: `${nextG.color}14`, border: `1px solid ${nextG.color}44`, borderRight: `2px solid ${nextG.color}`, borderRadius: 10, cursor: "pointer", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: `0 0 16px ${nextG.color}22` }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: 8.5, fontWeight: 900, color: nextG.color, letterSpacing: "0.12em" }}>{nextG.name}</div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 7.5, color: `${nextG.color}88` }}>{nextG.sub}</div>
          </div>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${nextG.color}18`, border: `1px solid ${nextG.color}88`, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={14} color={nextG.color} /></div>
        </button>
      </div>
    </div>
  );
}

// ─── EZ WAY Pamphlet ─────────────────────────────────────────────────────────

// Centered slide helper — wraps a column with center alignment for PowerPoint-style pages
const slide: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center",
  textAlign: "center", height: "100%", gap: 0,
};

const PILLARS_DATA = [
  {
    num: "01", label: "EXPERIENCE", color: "#00d2ff",
    headline: "Real XP, Not Required XP",
    tagline: "We replace years of experience with a REAL experience via EZ Nexus",
    overview: [
      { mode: "ORBIT MODE", icon: "◎", desc: "Your command center. The full universe at a glance — live metrics, Nexus Intelligence, galaxy navigation, and team pulse. Think of it as the bridge of your ship." },
      { mode: "DASH MODE", icon: "⬡", desc: "Focused execution space. Deep dive into any EZ product or workflow. No noise, no context-switching — just you and the task that matters right now." },
    ],
    sections: [
      { title: "Two Modes. One Flow.", body: "EZ Nexus operates in two complementary states. Orbit Mode gives you command-centre visibility across your entire organisation — metrics, navigation, intelligence all in one view. Dash Mode collapses that context down to a single product or workflow, eliminating distraction. A double-tap of Tab switches between them instantly." },
      { title: "The EZ Solution", body: "EZ Nexus serves as the central hub for all EZ products, creating one cohesive environment where every tool reinforces the next. Every interaction teaches. Every workflow builds fluency naturally. Your team accumulates real, transferable experience from day one — not after a two-year onboarding arc." },
      { title: "The Central Hub", body: "As the connective tissue of the EZ ecosystem, EZ Nexus provides a unified entry point, shared context, and consistent patterns across every product. What you learn in one EZ app instantly applies everywhere else." },
    ],
    points: ["Orbit Mode: full universe view", "Dash Mode: focused execution", "Double-tap Tab to switch", "Zero onboarding curve", "Central hub architecture"],
  },
  {
    num: "02", label: "EASELIZABETH", color: "#b06aff",
    headline: "Operational Intelligence, Built In",
    tagline: "OI — not artificial intelligence, but Operational Intelligence born inside EZ",
    overview: [
      { mode: "WHAT IS OI?", icon: "◈", desc: "Operational Intelligence is knowledge embedded directly into the workflow — not a chatbot bolted on, but a living layer that understands your organisation's operations and surfaces what you need before you ask." },
      { mode: "EASELIZABETH", icon: "✦", desc: "She is the EZ-native expression of OI. Present across every product. Contextually aware. Speaking plain language. Your organisation's experience, made actionable." },
    ],
    sections: [
      { title: "OI, Not AI", body: "EaseLizabeth is not an AI assistant imported from elsewhere. She is an EZ-founded concept: Operational Intelligence. OI means intelligence that lives inside the operation — aware of your workflows, your roles, your history, your team. She doesn't just answer questions; she understands your business." },
      { title: "How She Works", body: "EaseLizabeth surfaces the right information at the right moment — before you ask. She anticipates your next move, handles the cognitive load of navigation and discovery, and communicates exclusively in plain, everyday language. No jargon. No complexity theatre. No prompt engineering required." },
      { title: "What She Can Do", body: "From answering product questions to initiating cross-app workflows, creating requests, summarising data, onboarding new users, and flagging issues before they escalate — EaseLizabeth is OI made tangible: your organisation's intelligence, always available." },
    ],
    points: ["OI — Operational Intelligence", "EZ-native concept, not external AI", "Context-aware across all products", "Plain-language interaction always", "Proactive — surfaces insights before you ask"],
  },
  {
    num: "03", label: "EASIER", color: "#ff79c6",
    headline: "One App. Every Tool. Zero Friction.",
    tagline: "Sync to scene — all your tools, in one place, working the way you already work",
    overview: [
      { mode: "STREAMLINED", icon: "⟶", desc: "Company-approved workflows baked directly into the interface. No workarounds. No shadow processes. Just the right way to do it, made the easiest way to do it." },
      { mode: "ONE APP FOR ALL", icon: "⬡", desc: "Sync to scene: every EZ product, every team tool, every data source — unified. Stop switching contexts. Start commanding your full operation from a single place." },
    ],
    sections: [
      { title: "Streamlined by Design", body: "Every workflow in EZ Cosmos follows company-approved processes — built in, not bolted on. Compliance and efficiency aren't competing forces here. When the right way to do something is also the easiest, people stop working around the system and start working with it." },
      { title: "Seamlessly Optimised", body: "EZ products are engineered so efficiency and compliance reinforce each other. Audit trails generate themselves. Approvals route automatically. Reports surface without being requested. Your team does the work — the system handles the process." },
      { title: "Sync to Scene", body: "All your tools. In one place. One app for all. EZ Nexus doesn't ask you to change how your organisation works — it syncs to the scene you're already in, unifying every EZ product into a single coherent experience. No tabs. No context collapse. No missed signals." },
    ],
    points: ["Streamline company-approved workflows", "Seamlessly optimised efficiency & compliance", "Sync to scene: all tools in one place", "One app for all"],
  },
];

const EZ_PRODUCTS_DETAIL = [
  {
    name: "EZ 3D Studio", color: "#b06aff", img: bEZ3D, category: "Creative Suite",
    tagline: "Create Without Limits",
    description: "EZ 3D Studio puts professional-grade 3D creation in everyone's hands. Whether designing architectural visualisations, character models, or product renders — our intuitive workspace removes the learning curve and keeps creative flow at the centre.",
    features: ["Real-time rendering engine", "Collaborative multi-user workspaces", "Asset library: 10,000+ models", "One-click export to all major formats", "AI-assisted modelling & texturing"],
  },
  {
    name: "EZ PM", color: "#60a5fa", img: bEZPM, category: "Project Management",
    tagline: "Projects That Run Themselves",
    description: "EZ PM is the project management suite that thinks like a team leader. From sprint boards to resource allocation, every workflow is designed to surface the information you need before you know you need it.",
    features: ["Adaptive sprint boards", "AI task prioritisation", "Resource & capacity planning", "Integrated time tracking", "One-click stakeholder reports"],
  },
  {
    name: "EZCustom", color: "#c084fc", img: bEZCustom, category: "Custom Solutions",
    tagline: "Your Platform, Your Rules",
    description: "EZCustom is the engine behind bespoke solutions. When off-the-shelf tools fall short, EZCustom bridges the gap — giving your team a modular, API-first environment to build exactly what the business requires.",
    features: ["Drag-and-drop workflow builder", "Full REST & GraphQL API access", "White-label branding controls", "Custom role & permission engine", "Webhook & integration marketplace"],
  },
  {
    name: "OneStop", color: "#fbbf24", img: bOneStop, category: "Experience Engine",
    tagline: "Command Everything From One Place",
    description: "OneStop is the control centre of EZ Cosmos — a unified dashboard that aggregates every product, every metric, and every action into a single, beautifully organised view. Stop switching tabs. Start commanding.",
    features: ["Unified cross-product dashboard", "Real-time KPI feeds", "Global search across all EZ apps", "Customisable widget canvas", "Role-based view templates"],
  },
  {
    name: "EZ Org", color: "#38bdf8", img: bSupportStaff, category: "Business Ops",
    tagline: "People Operations, Simplified",
    description: "EZ Org transforms staff management from a spreadsheet nightmare into a seamless, data-driven experience. Onboard, schedule, develop, and retain your team — all from one place that respects everyone's time.",
    features: ["Digital onboarding flows", "Shift & availability management", "Performance review templates", "Competency & skill tracking", "Direct integration with EZ ITSM"],
  },
  {
    name: "EZ ITSM", color: "#4ade80", img: bEZTicket, category: "Business Ops",
    tagline: "IT Service, On Your Terms",
    description: "EZ ITSM brings enterprise IT service management down to earth. From incident logging to change management, every ticket, every process, and every SLA lives in one transparent, auditable system your whole organisation can trust.",
    features: ["Smart ticket triage & routing", "SLA monitoring with alerts", "Change & problem management", "CMDB asset register", "Self-service knowledge base portal"],
  },
];

// ── Pamphlet slide components ─────────────────────────────────────────────────

function PamphletPage0() {
  return (
    <div style={{ ...slide, justifyContent: "center", gap: 20 }}>
      {/* Logo */}
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, rgba(0,210,255,0.25), rgba(123,47,255,0.15))", border: "2px solid rgba(0,210,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 36px rgba(0,210,255,0.3), inset 0 0 20px rgba(123,47,255,0.15)" }}>
        <img src={ezNexusLogo} alt="RR" style={{ width: 64, height: 64, objectFit: "contain", mixBlendMode: "screen" }} />
      </div>
      <div>
        <div style={{ ...orb(9, 700), color: PALETTE.muted, letterSpacing: "0.18em", marginBottom: 6 }}>RR TECHNOLOGIES</div>
        <div style={{ ...orb(32, 900), lineHeight: 1.1, ...gradText() }}>BUILT FOR PEOPLE.</div>
        <div style={{ ...orb(32, 900), lineHeight: 1.1, ...gradText() }}>DRIVEN BY PURPOSE.</div>
      </div>

      <div style={{ width: "60%", height: 1, background: "linear-gradient(to right, transparent, rgba(0,210,255,0.5), transparent)" }} />

      <div style={{ maxWidth: 640 }}>
        <div style={{ ...orb(8, 800), color: PALETTE.muted, letterSpacing: "0.14em", marginBottom: 10 }}>OUR PHILOSOPHY</div>
        <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 14.5, color: PALETTE.text, lineHeight: 1.8, margin: 0 }}>
          We believe technology should feel like a conversation, not a command. RR was founded on the principle that{" "}
          <span style={{ color: PALETTE.cyan, fontWeight: 700 }}>complexity is never a feature — clarity is.</span>{" "}
          Every decision we make is filtered through one simple question: does this make life easier?
        </p>
      </div>

      <div style={{ maxWidth: 580, padding: "16px 24px", background: "rgba(0,210,255,0.06)", border: "1px solid rgba(0,210,255,0.22)", borderTop: "2px solid rgba(0,210,255,0.6)", borderRadius: 10 }}>
        <div style={{ ...orb(8, 800), ...gradText(), letterSpacing: "0.12em", marginBottom: 8 }}>MISSION STATEMENT</div>
        <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 13, color: "rgba(232,238,255,0.8)", lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
          "To democratise enterprise-grade software by wrapping it in interfaces so intuitive, your team never needs a manual. We build EZ products because complex problems deserve simple solutions — and because your time is better spent doing great work, not figuring out the tools that support it."
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {[{ label: "People First", icon: "👥", sub: "Every feature starts with a human being" }, { label: "Radical Simplicity", icon: "✦", sub: "If it needs explaining, it needs redesigning" }, { label: "Real Experience", icon: "⚡", sub: "Knowledge earned just by using the product" }].map(v => (
          <div key={v.label} style={{ padding: "12px 18px", background: "rgba(123,47,255,0.08)", border: "1px solid rgba(123,47,255,0.2)", borderRadius: 10, minWidth: 150 }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{v.icon}</div>
            <div style={{ ...orb(9, 800), ...gradText(), marginBottom: 4 }}>{v.label}</div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 10.5, color: PALETTE.muted, lineHeight: 1.5 }}>{v.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PamphletPage1() {
  return (
    <div style={{ ...slide, justifyContent: "center", gap: 22 }}>
      <div>
        <div style={{ ...orb(9, 700), color: PALETTE.muted, letterSpacing: "0.16em", marginBottom: 8 }}>WHAT WE'RE BUILT ON</div>
        <div style={{ ...orb(28, 900), ...gradText() }}>THE THREE PILLARS OF EZ</div>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 13, color: PALETTE.muted, marginTop: 6 }}>
          Experience · Operational Intelligence · Easier — one ecosystem, every product.
        </div>
      </div>

      <div style={{ width: "60%", height: 1, background: "linear-gradient(to right, transparent, rgba(123,47,255,0.5), transparent)" }} />

      <div style={{ display: "flex", gap: 14, width: "100%", flex: 1 }}>
        {PILLARS_DATA.map(p => (
          <div key={p.num} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "18px 16px 16px", background: `${p.color}07`, border: `1px solid ${p.color}22`, borderTop: `3px solid ${p.color}`, borderRadius: 12 }}>
            {/* Number + label */}
            <div style={{ ...orb(32, 900), color: `${p.color}16`, lineHeight: 1, marginBottom: 4 }}>{p.num}</div>
            <div style={{ ...orb(10, 900), color: p.color, letterSpacing: "0.14em", marginBottom: 3 }}>{p.label}</div>
            <div style={{ ...orb(11, 800), color: PALETTE.text, marginBottom: 8, lineHeight: 1.3 }}>{p.headline}</div>
            <div style={{ height: 1, width: "70%", background: `linear-gradient(to right, transparent, ${p.color}44, transparent)`, marginBottom: 10 }} />
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, color: `${p.color}99`, lineHeight: 1.5, marginBottom: 12, fontStyle: "italic" }}>{p.tagline}</div>

            {/* Overview mode cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, width: "100%", flex: 1 }}>
              {p.overview.map((o, oi) => (
                <div key={oi} style={{ padding: "9px 11px", background: `${p.color}09`, border: `1px solid ${p.color}20`, borderLeft: `2px solid ${p.color}66`, borderRadius: 7, textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: p.color }}>{o.icon}</span>
                    <span style={{ ...orb(8, 800), color: p.color, letterSpacing: "0.1em" }}>{o.mode}</span>
                  </div>
                  <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 10.5, color: "rgba(232,238,255,0.65)", lineHeight: 1.55 }}>{o.desc}</div>
                </div>
              ))}
            </div>

            {/* Key points */}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4, width: "100%", alignItems: "flex-start" }}>
              {p.points.slice(0, 3).map((pt, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: p.color, boxShadow: `0 0 5px ${p.color}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 10, color: `${p.color}cc`, fontWeight: 600 }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PamphletPillarPage({ pillar }: { pillar: typeof PILLARS_DATA[0] }) {
  return (
    <div style={{ ...slide, justifyContent: "flex-start", gap: 0 }}>
      {/* Header */}
      <div style={{ width: "100%", textAlign: "center", marginBottom: 20 }}>
        <div style={{ ...orb(8, 700), color: `${pillar.color}88`, letterSpacing: "0.18em", marginBottom: 6 }}>PILLAR {pillar.num}</div>
        <div style={{ ...orb(26, 900), color: pillar.color, textShadow: `0 0 30px ${pillar.color}66` }}>{pillar.label}</div>
        <div style={{ ...orb(13, 600), color: PALETTE.text, marginTop: 6, marginBottom: 10 }}>{pillar.headline}</div>
        <div style={{ width: "50%", height: 1, background: `linear-gradient(to right, transparent, ${pillar.color}55, transparent)`, margin: "0 auto" }} />
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 13, color: `${pillar.color}99`, marginTop: 8, fontStyle: "italic" }}>{pillar.tagline}</div>
      </div>

      {/* Three sections */}
      <div style={{ display: "flex", gap: 12, width: "100%", flex: 1 }}>
        {pillar.sections.map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "16px 16px", background: `${pillar.color}06`, border: `1px solid ${pillar.color}18`, borderRadius: 10, display: "flex", flexDirection: "column", textAlign: "center" }}>
            <div style={{ ...orb(8, 800), color: pillar.color, letterSpacing: "0.1em", marginBottom: 8 }}>{s.title.toUpperCase()}</div>
            <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${pillar.color}33, transparent)`, marginBottom: 10 }} />
            <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 12.5, color: "rgba(232,238,255,0.75)", lineHeight: 1.75, margin: 0, flex: 1 }}>{s.body}</p>
          </div>
        ))}
      </div>

      {/* Key points */}
      <div style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" as const }}>
        {pillar.points.map((pt, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: `${pillar.color}10`, border: `1px solid ${pillar.color}30`, borderRadius: 20 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: pillar.color, boxShadow: `0 0 6px ${pillar.color}`, flexShrink: 0 }} />
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, color: pillar.color, fontWeight: 600 }}>{pt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Experience 01: From Tribal Knowledge → To Institutional Intelligence ──────
function PamphletExperience1() {
  const C = "#00d2ff";
  return (
    <div style={{ ...slide, justifyContent: "flex-start", gap: 0, padding: "12px 18px" }}>
      {/* Label + headline */}
      <div style={{ width: "100%", textAlign: "center", marginBottom: 10, flexShrink: 0 }}>
        <div style={{ ...orb(7, 700), color: `${C}77`, letterSpacing: "0.2em", marginBottom: 5 }}>EXPERIENCE 01 — FIELD EXPERTISE</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" as const }}>
          <span style={{ ...orb(15, 900), color: "rgba(232,238,255,0.45)" }}>FROM TRIBAL KNOWLEDGE</span>
          <span style={{ ...orb(18, 900), color: C, textShadow: `0 0 18px ${C}88` }}>→</span>
          <span style={{ ...orb(15, 900), color: C, textShadow: `0 0 14px ${C}55` }}>TO INSTITUTIONAL INTELLIGENCE</span>
        </div>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11.5, color: "rgba(160,185,255,0.5)", marginTop: 4, fontStyle: "italic" }}>
          Knowledge lives in people. When they're unavailable, progress stops. &nbsp;·&nbsp; EaseLizabeth captures, connects, and delivers expertise—instantly.
        </div>
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${C}44, transparent)`, marginTop: 8 }} />
      </div>

      {/* Full-width image */}
      <div style={{ flex: 1, minHeight: 0, width: "100%", borderRadius: 10, overflow: "hidden", border: `1px solid ${C}22`, position: "relative" as const }}>
        <img
          src={ezPillar1Url}
          alt="Experience 01 – From Tribal Knowledge to Institutional Intelligence"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
        />
        {/* Subtle Nexus-tinted vignette to blend into the dark panel */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,4,20,0.18) 0%, transparent 20%, transparent 75%, rgba(6,4,20,0.55) 100%)", pointerEvents: "none" }} />
      </div>

      {/* Key takeaway strip */}
      <div style={{ flexShrink: 0, marginTop: 10, display: "flex", gap: 8, width: "100%", justifyContent: "center", flexWrap: "wrap" as const }}>
        {[
          { col: "#ff6666", label: "Hard to find · Time consuming · Risk when unavailable" },
          { col: C,         label: "Always accessible · Instant answers · Knowledge that grows" },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: `${row.col}0d`, border: `1px solid ${row.col}28`, borderRadius: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: row.col, boxShadow: `0 0 7px ${row.col}`, flexShrink: 0 }} />
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, color: row.col, fontWeight: 600 }}>{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Experience 02: From Accessing Software → To Entering the Experience ────────
function PamphletExperience2() {
  const C = "#00d2ff"; const CA = "#7b2fff";
  return (
    <div style={{ ...slide, justifyContent: "flex-start", gap: 0, padding: "12px 18px" }}>
      {/* Label + headline */}
      <div style={{ width: "100%", textAlign: "center", marginBottom: 10, flexShrink: 0 }}>
        <div style={{ ...orb(7, 700), color: `${CA}88`, letterSpacing: "0.2em", marginBottom: 5 }}>EXPERIENCE 02 — ENGAGEMENT</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" as const }}>
          <span style={{ ...orb(15, 900), color: "rgba(232,238,255,0.45)" }}>FROM ACCESSING SOFTWARE</span>
          <span style={{ ...orb(18, 900), color: CA, textShadow: `0 0 18px ${CA}88` }}>→</span>
          <span style={{ ...orb(15, 900), color: C, textShadow: `0 0 14px ${C}55` }}>TO ENTERING THE EXPERIENCE</span>
        </div>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11.5, color: "rgba(160,185,255,0.5)", marginTop: 4, fontStyle: "italic" }}>
          Disconnected tools. Endless clicking. Work feels like a chore. &nbsp;·&nbsp; One universe. Every tool. Work feels immersive, intuitive, and empowering.
        </div>
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${CA}44, transparent)`, marginTop: 8 }} />
      </div>

      {/* Full-width image */}
      <div style={{ flex: 1, minHeight: 0, width: "100%", borderRadius: 10, overflow: "hidden", border: `1px solid ${CA}22`, position: "relative" as const }}>
        <img
          src={ezPillar2Url}
          alt="Experience 02 – From Accessing Software to Entering the Experience"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,4,20,0.18) 0%, transparent 20%, transparent 75%, rgba(6,4,20,0.55) 100%)", pointerEvents: "none" }} />
      </div>

      {/* Key takeaway strip */}
      <div style={{ flexShrink: 0, marginTop: 10, display: "flex", gap: 8, width: "100%", justifyContent: "center", flexWrap: "wrap" as const }}>
        {[
          { col: "#ff6666", label: "Multiple apps · Context switching · Disconnected · Low impact" },
          { col: C,         label: "One universe · Big picture · Intuitive · More impact, less effort" },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", background: `${row.col}0d`, border: `1px solid ${row.col}28`, borderRadius: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: row.col, boxShadow: `0 0 7px ${row.col}`, flexShrink: 0 }} />
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, color: row.col, fontWeight: 600 }}>{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Easier Pillar — 2 pages (top / bottom halves of image-15.png) ─────────────
function PamphletEasierPage({ half, num, headline, sub }: {
  half: "top" | "bottom"; num: number; headline: string; sub: string;
}) {
  const C = "#00d2ff"; const CA = "#7b2fff"; const CG = "#00ff88";
  return (
    <div style={{ ...slide, justifyContent: "flex-start", gap: 0, padding: "12px 18px" }}>
      <div style={{ width: "100%", flexShrink: 0, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ ...orb(7, 700), color: `${CG}66`, letterSpacing: "0.18em" }}>PILLAR 03 · EASIER</div>
          <div style={{ ...orb(7, 700), color: `${C}55`, letterSpacing: "0.15em" }}>PAGE {num} / 2</div>
        </div>
        <div style={{ ...orb(14, 900), color: CG, textShadow: `0 0 18px ${CG}55`, marginBottom: 3 }}>{headline}</div>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11.5, color: "rgba(160,185,255,0.5)", fontStyle: "italic" }}>{sub}</div>
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${CG}44, ${C}44, transparent)`, marginTop: 8 }} />
      </div>
      <div style={{ flex: 1, minHeight: 0, width: "100%", borderRadius: 10, overflow: "hidden", border: `1px solid ${CG}20`, position: "relative" as const }}>
        <img
          src={easierPillarUrl}
          alt={`Easier Pillar Page ${num}`}
          style={{ width: "100%", height: "200%", objectFit: "cover", objectPosition: half === "top" ? "top" : "bottom", display: "block",
            marginTop: half === "bottom" ? "-100%" : 0 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,4,20,0.12) 0%, transparent 15%, transparent 80%, rgba(6,4,20,0.5) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 12, right: 14, ...orb(8, 800), color: CG, background: "rgba(6,4,20,0.72)", border: `1px solid ${CG}33`, borderRadius: 6, padding: "3px 10px", letterSpacing: "0.12em" }}>
          PAGE {num}
        </div>
      </div>
    </div>
  );
}

// ── Key Features & Real World — 2 pages (left / right halves of image-18.png) ──
function PamphletHalfPage({ half, num, total, headline, sub, accentCol }: {
  half: "left" | "right"; num: number; total: number; headline: string; sub: string; accentCol: string;
}) {
  const C = "#00d2ff";
  return (
    <div style={{ ...slide, justifyContent: "flex-start", gap: 0, padding: "12px 18px" }}>
      <div style={{ width: "100%", flexShrink: 0, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ ...orb(7, 700), color: `${accentCol}77`, letterSpacing: "0.18em" }}>EZ NEXUS · OVERVIEW</div>
          <div style={{ ...orb(7, 700), color: `${C}55`, letterSpacing: "0.15em" }}>PAGE {num} / {total}</div>
        </div>
        <div style={{ ...orb(14, 900), color: accentCol, textShadow: `0 0 18px ${accentCol}55`, marginBottom: 3 }}>{headline}</div>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11.5, color: "rgba(160,185,255,0.5)", fontStyle: "italic" }}>{sub}</div>
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${accentCol}44, ${C}44, transparent)`, marginTop: 8 }} />
      </div>
      <div style={{ flex: 1, minHeight: 0, width: "100%", borderRadius: 10, overflow: "hidden", border: `1px solid ${accentCol}22`, position: "relative" as const }}>
        <img
          src={keyFeaturesUrl}
          alt={headline}
          style={{ width: "200%", height: "100%", objectFit: "cover", display: "block",
            marginLeft: half === "right" ? "-100%" : 0 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,4,20,0.12) 0%, transparent 15%, transparent 80%, rgba(6,4,20,0.5) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 12, right: 14, ...orb(8, 800), color: accentCol, background: "rgba(6,4,20,0.72)", border: `1px solid ${accentCol}33`, borderRadius: 6, padding: "3px 10px", letterSpacing: "0.12em" }}>
          PAGE {num}
        </div>
      </div>
    </div>
  );
}

// ── EaseLizabeth Pillar — 3 image pages ────────────────────────────────────────
function PamphletEaseLizabeth({ num, imgUrl, pageLabel, headline, sub }: {
  num: number; imgUrl: string; pageLabel: string; headline: string; sub: string;
}) {
  const C = "#00d2ff"; const CA = "#7b2fff";
  return (
    <div style={{ ...slide, justifyContent: "flex-start", gap: 0, padding: "12px 18px" }}>
      {/* Header */}
      <div style={{ width: "100%", textAlign: "center", marginBottom: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ ...orb(7, 700), color: `${CA}77`, letterSpacing: "0.18em" }}>PILLAR 02 · EASELIZABETH</div>
          <div style={{ ...orb(7, 700), color: `${C}55`, letterSpacing: "0.15em" }}>PAGE {num} / 3</div>
        </div>
        <div style={{ ...orb(14, 900), ...gradText(), marginBottom: 3 }}>{headline}</div>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11.5, color: "rgba(160,185,255,0.5)", fontStyle: "italic" }}>{sub}</div>
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${CA}44, ${C}44, transparent)`, marginTop: 8 }} />
      </div>

      {/* Full-width image */}
      <div style={{ flex: 1, minHeight: 0, width: "100%", borderRadius: 10, overflow: "hidden", border: `1px solid ${CA}25`, position: "relative" as const }}>
        <img
          src={imgUrl}
          alt={pageLabel}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,4,20,0.12) 0%, transparent 15%, transparent 80%, rgba(6,4,20,0.5) 100%)", pointerEvents: "none" }} />
        {/* Page badge */}
        <div style={{ position: "absolute", bottom: 12, right: 14, ...orb(8, 800), color: C, background: "rgba(6,4,20,0.72)", border: `1px solid ${C}33`, borderRadius: 6, padding: "3px 10px", letterSpacing: "0.12em" }}>
          PAGE {num}
        </div>
      </div>
    </div>
  );
}

function PamphletProductPage({ product }: { product: typeof EZ_PRODUCTS_DETAIL[0] }) {
  return (
    <div style={{ ...slide, justifyContent: "flex-start", gap: 0 }}>
      {/* Hero banner */}
      <div style={{ width: "100%", height: 180, borderRadius: 14, overflow: "hidden", position: "relative", backgroundImage: `url(${product.img})`, backgroundSize: "cover", backgroundPosition: "center 25%", flexShrink: 0, marginBottom: 18 }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(8,5,28,0.1) 0%, rgba(8,5,28,0) 30%, rgba(8,5,28,0.95) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${product.color}18 100%)` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${product.color}, transparent)` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 20px", textAlign: "center" }}>
          <div style={{ padding: "2px 10px", display: "inline-block", background: `${product.color}22`, border: `1px solid ${product.color}55`, borderRadius: 5, ...orb(7, 700), color: product.color, marginBottom: 5 }}>{product.category}</div>
          <div style={{ ...orb(24, 900), color: "#fff", lineHeight: 1.1, textShadow: `0 0 24px ${product.color}88` }}>{product.name}</div>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 12, color: `${product.color}cc`, marginTop: 3, fontStyle: "italic" }}>{product.tagline}</div>
        </div>
      </div>

      {/* Description */}
      <div style={{ maxWidth: 680, textAlign: "center", marginBottom: 18 }}>
        <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 13.5, color: PALETTE.text, lineHeight: 1.8, margin: 0 }}>{product.description}</p>
      </div>

      <div style={{ width: "60%", height: 1, background: `linear-gradient(to right, transparent, ${product.color}55, transparent)`, marginBottom: 16 }} />

      {/* Features grid */}
      <div style={{ ...orb(8, 800), color: `${product.color}88`, letterSpacing: "0.14em", marginBottom: 12 }}>KEY CAPABILITIES</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, justifyContent: "center", width: "100%" }}>
        {product.features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: `${product.color}08`, border: `1px solid ${product.color}22`, borderRadius: 8, minWidth: 180 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: product.color, boxShadow: `0 0 8px ${product.color}`, flexShrink: 0 }} />
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 12.5, color: PALETTE.text, fontWeight: 600 }}>{f}</span>
          </div>
        ))}
      </div>

      <button style={{ marginTop: 18, padding: "10px 28px", ...orb(10, 700), color: "#fff", background: `linear-gradient(135deg, ${product.color}44, ${product.color}22)`, border: `1px solid ${product.color}66`, borderRadius: 8, cursor: "pointer", boxShadow: `0 0 22px ${product.color}22`, letterSpacing: "0.05em" }}>
        Launch in EZ Cosmos →
      </button>
    </div>
  );
}

function EzWayPamphlet({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState(0);

  const pages = [
    { label: "Company",               content: <PamphletPage0 /> },
    { label: "The 3 Pillars",         content: <PamphletPage1 /> },
    { label: "Experience 01",         content: <PamphletExperience1 /> },
    { label: "Experience 02",         content: <PamphletExperience2 /> },
    { label: "EaseLizabeth · Meet Her",    content: <PamphletEaseLizabeth num={1} imgUrl={elPillar1Url} pageLabel="Meet EaseLizabeth" headline="MEET EASELIZABETH" sub="AI Guide · Innovator · Partner — The intelligence layer of EZ Nexus" /> },
    { label: "EaseLizabeth · In Action 1", content: <PamphletEaseLizabeth num={2} imgUrl={elPillar2Url} pageLabel="EaseLizabeth In Action – Page 2" headline="IN ACTION: REAL IMPACT. EVERY DAY." sub="From manual, repetitive work to intelligent, proactive execution." /> },
    { label: "EaseLizabeth · In Action 2", content: <PamphletEaseLizabeth num={3} imgUrl={elPillar3Url} pageLabel="EaseLizabeth In Action – Page 3" headline="IN ACTION: REAL IMPACT. EVERY DAY." sub="Meeting follow-up, accountability, onboarding — nothing slips." /> },
    { label: "Easier · Simple by Design",   content: <PamphletEasierPage half="top"    num={1} headline="EASIER: SIMPLE BY DESIGN." sub="The EZ Nexus Way: Simple. Intuitive. Effortless." /> },
    { label: "Easier · Compliant by Design", content: <PamphletEasierPage half="bottom" num={2} headline="COMPLIANT BY DESIGN." sub="EaseLizabeth ensures compliant output. Globally." /> },
    { label: "Key Features",                 content: <PamphletHalfPage half="left"  num={1} total={2} headline="KEY FEATURES" sub="Built for how work gets done. Designed for how it should." accentCol="#00d2ff" /> },
    { label: "Real World Situations",        content: <PamphletHalfPage half="right" num={2} total={2} headline="REAL WORLD SITUATIONS. REAL RESULTS." sub="Everyday challenges. Simplified by EZ Nexus. Powered by EaseLizabeth." accentCol="#7b2fff" /> },
    ...EZ_PRODUCTS_DETAIL.map(p => ({ label: p.name, content: <PamphletProductPage product={p} /> })),
  ];
  const total = pages.length;

  return (
    <div style={{ position: "absolute", top: 38, left: 0, right: 0, bottom: 56, zIndex: 60, background: "rgba(6,4,20,0.80)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 44px" }}>
      <div style={{ width: "100%", maxWidth: 1060, height: "100%", ...GC, background: "rgba(10,7,28,0.94)", border: "1px solid rgba(123,47,255,0.35)", boxShadow: "0 0 60px rgba(78,26,213,0.22), 0 0 1px rgba(160,100,255,0.5), inset 0 1px 0 rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "10px 20px", borderBottom: "1px solid rgba(123,47,255,0.18)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(123,47,255,0.14)", border: "1px solid rgba(123,47,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Orbitron", fontSize: 11, fontWeight: 900, ...gradText() }}>EZ</span>
            </div>
            <span style={{ ...orb(10, 900), ...gradText() }}>THE EZ WAY</span>
            <div style={{ width: 1, height: 12, background: "rgba(123,47,255,0.3)", margin: "0 4px" }} />
            <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, color: PALETTE.muted }}>{pages[page].label}</span>
          </div>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 10, color: "rgba(160,185,255,0.35)", letterSpacing: "0.08em", marginRight: 12 }}>
            {String(page + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button onClick={onClose} style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(123,47,255,0.1)", border: "1px solid rgba(123,47,255,0.3)", color: PALETTE.muted, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>×</button>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: "22px 28px", overflow: "auto", minHeight: 0 }}>
          {pages[page].content}
        </div>

        {/* Footer navigation */}
        <div style={{ display: "flex", alignItems: "center", padding: "9px 20px", borderTop: "1px solid rgba(123,47,255,0.15)", flexShrink: 0, gap: 10 }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 14px", background: page === 0 ? "transparent" : "rgba(123,47,255,0.1)", border: `1px solid ${page === 0 ? "transparent" : "rgba(123,47,255,0.35)"}`, borderRadius: 7, cursor: page === 0 ? "default" : "pointer", ...orb(8, 700), color: page === 0 ? "rgba(160,185,255,0.2)" : PALETTE.muted, letterSpacing: "0.06em" }}>
            <ChevronLeft size={12} color={page === 0 ? "rgba(160,185,255,0.2)" : PALETTE.muted} /> PREV
          </button>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 5 }}>
            {pages.map((_, i) => (
              <button key={i} onClick={() => setPage(i)} style={{ width: page === i ? 18 : 5, height: 5, borderRadius: 3, background: page === i ? PALETTE.cyan : "rgba(123,47,255,0.25)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.25s ease", boxShadow: page === i ? `0 0 8px ${PALETTE.cyan}88` : "none" }} />
            ))}
          </div>
          <button onClick={() => setPage(p => Math.min(total - 1, p + 1))} disabled={page === total - 1} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 14px", background: page === total - 1 ? "transparent" : "rgba(123,47,255,0.1)", border: `1px solid ${page === total - 1 ? "transparent" : "rgba(123,47,255,0.35)"}`, borderRadius: 7, cursor: page === total - 1 ? "default" : "pointer", ...orb(8, 700), color: page === total - 1 ? "rgba(160,185,255,0.2)" : PALETTE.muted, letterSpacing: "0.06em" }}>
            NEXT <ChevronRight size={12} color={page === total - 1 ? "rgba(160,185,255,0.2)" : PALETTE.muted} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN DATA ───────────────────────────────────────────────────────────────

const LOGIN_USERS = ["ray", "admin", "ops.user", "dev.team", "itsm.lead"];
const LOGIN_ROLES = ["Administrator", "Manager", "Staff", "Developer", "Analyst", "IT Lead", "Org Lead"];
const LOGIN_DEPTS: { name: string; subs: string[] }[] = [
  { name: "IT & Infrastructure",  subs: ["Help Desk", "Network Ops", "Security", "DevOps"] },
  { name: "Human Resources",      subs: ["Talent Acquisition", "People Ops", "L&D", "Compliance"] },
  { name: "Finance",              subs: ["Accounts", "Payroll", "Budgeting", "Audit"] },
  { name: "Operations",           subs: ["Logistics", "Facilities", "Supply Chain", "Project Ops"] },
  { name: "Product & Technology", subs: ["Engineering", "Design", "QA", "Architecture"] },
  { name: "Marketing",            subs: ["Brand", "Digital", "Growth", "Content"] },
];

// ─── EZ NEXUS LOGIN SCREEN ────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [error, setError]           = useState("");
  const [loadingSSO, setLoadingSSO] = useState(false);
  const [ssoOpened, setSsoOpened]   = useState(false);

  // Poll localStorage every 600ms as backup for the storage event
  useEffect(() => {
    if (!ssoOpened) return;
    const id = setInterval(() => {
      if (localStorage.getItem("ez_auth_complete") === "1") {
        localStorage.removeItem("ez_auth_complete");
        clearInterval(id);
        onLogin();
      }
    }, 600);
    return () => clearInterval(id);
  }, [ssoOpened, onLogin]);

  const particles = useRef(
    [...Array(28)].map((_, i) => ({
      left:  `${(i * 43 + 11) % 100}%`,
      top:   `${(i * 37 + 17) % 100}%`,
      size:  i % 3 === 0 ? 4 : 2,
      color: i % 2 === 0 ? PALETTE.cyan : PALETTE.purple,
      dur:   2.2 + (i % 4) * 0.4,
      delay: i * 0.14,
    }))
  ).current;

  // Orbital ring animation values — static so no jitter
  const rings = useRef([
    { r: 120, dash: "6 18",  dur: 40,  dir: 1  },
    { r: 155, dash: "3 24",  dur: 28,  dir: -1 },
    { r: 188, dash: "2 32",  dur: 55,  dir: 1  },
  ]).current;

  // Open Microsoft login in a NEW TAB — the only approach that works inside an iframe.
  // After the user authenticates, MSAL writes the account to sessionStorage in that tab.
  // We store a shared key in localStorage so this tab can detect completion.
  const openMicrosoftLogin = async (hint?: string) => {
    // Build the Azure AD authorize URL directly — no MSAL redirect inside the iframe
    const tenantId  = "617d6eb0-2279-4de1-93d8-b67d077491ba";
    const clientId  = "79c97a47-0330-4e67-8e4a-bec36555cab7";
    const redirectUri = encodeURIComponent(window.location.origin);
    const scope     = encodeURIComponent("openid profile email User.Read");
    const nonce     = Math.random().toString(36).slice(2);
    const state     = Math.random().toString(36).slice(2);
    localStorage.setItem("ez_auth_state", state);

    let url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`
      + `?client_id=${clientId}`
      + `&response_type=id_token`
      + `&redirect_uri=${redirectUri}`
      + `&scope=${scope}`
      + `&response_mode=fragment`
      + `&nonce=${nonce}`
      + `&state=${state}`;
    if (hint) url += `&login_hint=${encodeURIComponent(hint)}`;

    window.open(url, "_blank");
    setSsoOpened(true);
  };

  const handleSSOLogin = () => {
    setError(""); setLoadingSSO(true);
    openMicrosoftLogin();
  };

  // storage event — fires if cross-tab signalling works
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ez_auth_complete" && e.newValue === "1") {
        localStorage.removeItem("ez_auth_complete");
        onLogin();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [onLogin]);


  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", background: PALETTE.voidBg, display: "flex", alignItems: "center", justifyContent: "center" }}>

      {/* ── Background ── */}
      <img src={bgImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", zIndex: 0, opacity: 0.35 }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, rgba(78,26,213,0.18) 0%, rgba(3,1,14,0.82) 70%)", zIndex: 1 }} />

      {/* Scanlines */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", backgroundImage: "linear-gradient(transparent 50%, rgba(0,210,255,0.018) 50%)", backgroundSize: "100% 3px" }} />

      {/* Edge accent lines */}
      <div style={{ position: "absolute", top: 0,    left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(0,210,255,0.55), transparent)", zIndex: 4 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(123,47,255,0.55), transparent)", zIndex: 4 }} />

      {/* Particles */}
      {particles.map((p, i) => (
        <motion.div key={i}
          style={{ position: "absolute", width: p.size, height: p.size, borderRadius: "50%", background: p.color, left: p.left, top: p.top, zIndex: 2 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0, 1, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }}
        />
      ))}

      {/* ── Orbital hub illustration — centered behind panel ── */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 2, pointerEvents: "none" }}>
        <svg width={420} height={420} style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="lg-hub" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#7b2fff" stopOpacity="0.35" />
              <stop offset="70%"  stopColor="#0d4d91" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <ellipse cx={210} cy={210} rx={90} ry={75} fill="url(#lg-hub)" />
          {rings.map((ring, ri) => (
            <motion.ellipse key={ri}
              cx={210} cy={210} rx={ring.r} ry={ring.r * 0.82}
              fill="none"
              stroke={ri % 2 === 0 ? `rgba(0,210,255,0.12)` : `rgba(123,47,255,0.1)`}
              strokeWidth="1"
              strokeDasharray={ring.dash}
              animate={{ rotate: [0, ring.dir * 360] }}
              transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "210px 210px" }}
            />
          ))}
        </svg>
      </div>

      {/* ── Login panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 400, margin: "0 16px" }}
      >
        {/* Corner brackets */}
        {([["top","left","0,210,255"],["top","right","123,47,255"],["bottom","left","123,47,255"],["bottom","right","0,210,255"]] as const).map(([v,h,rgb]) => (
          <div key={`${v}${h}`} style={{
            position: "absolute", [v]: -8, [h]: -8, width: 18, height: 18,
            borderTop:    v === "top"    ? `2px solid rgba(${rgb},0.75)` : "none",
            borderBottom: v === "bottom" ? `2px solid rgba(${rgb},0.75)` : "none",
            borderLeft:   h === "left"   ? `2px solid rgba(${rgb},0.75)` : "none",
            borderRight:  h === "right"  ? `2px solid rgba(${rgb},0.75)` : "none",
          }} />
        ))}

        {/* Glass card */}
        <div style={{ background: "rgba(8,4,24,0.90)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", border: "1px solid rgba(123,47,255,0.38)", borderRadius: 16, boxShadow: "0 0 80px rgba(78,26,213,0.28), 0 0 1px rgba(160,100,255,0.5), inset 0 1px 0 rgba(255,255,255,0.06)", overflow: "hidden" }}>

          {/* ── Header ── */}
          <div style={{ padding: "28px 28px 22px", textAlign: "center", borderBottom: "1px solid rgba(123,47,255,0.15)", position: "relative" }}>
            {/* Top bar micro-detail */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right, transparent, rgba(0,210,255,0.5), rgba(123,47,255,0.5), transparent)" }} />

            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: "1.5px solid rgba(0,210,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 40% 35%, rgba(0,210,255,0.18), rgba(123,47,255,0.12))", boxShadow: "0 0 28px rgba(0,210,255,0.28), inset 0 0 18px rgba(123,47,255,0.12)" }}>
                <img src={ezNexusLogo} alt="EZ Nexus" style={{ width: 52, height: 52, objectFit: "contain", mixBlendMode: "screen" }} />
              </div>
            </div>

            <div style={{ ...orb(22, 900), ...gradText(), lineHeight: 1.05, marginBottom: 4 }}>EZ NEXUS</div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, color: PALETTE.muted, letterSpacing: "0.14em" }}>AUTHENTICATE TO ACCESS YOUR COSMOS</div>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "24px 28px 28px" }}>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, marginBottom: 16, overflow: "hidden" }}
                >
                  <AlertCircle size={12} color="#f87171" style={{ flexShrink: 0 }} />
                  <span style={{ ...orb(8, 700), color: "#f87171", letterSpacing: "0.08em" }}>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Microsoft SSO — primary CTA ── */}
            <button
              onClick={handleSSOLogin}
              disabled={loadingSSO}
              style={{ width: "100%", padding: "12px 0", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "linear-gradient(135deg, rgba(0,210,255,0.22), rgba(123,47,255,0.22))", border: "1px solid rgba(0,210,255,0.5)", borderRadius: 10, cursor: loadingSSO ? "default" : "pointer", boxShadow: loadingSSO ? "none" : "0 0 24px rgba(0,210,255,0.15)", transition: "all 0.2s" }}
            >
              {loadingSSO ? (
                <>
                  <motion.div style={{ width: 14, height: 14, border: "2px solid rgba(0,210,255,0.25)", borderTop: "2px solid #00d2ff", borderRadius: "50%" }}
                    animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                  <span style={{ ...orb(10, 700), color: PALETTE.cyan, letterSpacing: "0.1em" }}>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  {/* Microsoft logo mark */}
                  <svg width="16" height="16" viewBox="0 0 21 21">
                    <rect x="1"  y="1"  width="9" height="9" fill="#f25022" />
                    <rect x="11" y="1"  width="9" height="9" fill="#7fba00" />
                    <rect x="1"  y="11" width="9" height="9" fill="#00a4ef" />
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                  </svg>
                  <span style={{ ...orb(10, 700), color: "#fff", letterSpacing: "0.08em" }}>SIGN IN WITH MICROSOFT</span>
                </>
              )}
            </button>

            {/* Waiting state — replaces the SSO button after the tab opens */}
            <AnimatePresence>
              {ssoOpened && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden", marginTop: 10 }}
                >
                  <div style={{ padding: "16px 16px 14px", background: "rgba(0,210,255,0.05)", border: "1px solid rgba(0,210,255,0.22)", borderRadius: 12, textAlign: "center" }}>
                    {/* Pulsing indicator */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
                      <motion.div style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE.cyan, boxShadow: `0 0 10px ${PALETTE.cyan}` }}
                        animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                      />
                      <span style={{ ...orb(8, 700), color: PALETTE.cyan, letterSpacing: "0.1em" }}>MICROSOFT TAB OPEN</span>
                    </div>
                    <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, color: PALETTE.muted, marginBottom: 14, lineHeight: 1.6 }}>
                      Sign in to your Microsoft account in the other tab.<br />
                      When done, return here and click below.
                    </div>
                    <button
                      onClick={() => onLogin()}
                      style={{ width: "100%", padding: "11px 0", background: "linear-gradient(135deg, rgba(0,255,136,0.28), rgba(0,210,255,0.18))", border: "1px solid rgba(0,255,136,0.55)", borderRadius: 9, cursor: "pointer", ...orb(10, 700), color: "#fff", letterSpacing: "0.08em", boxShadow: "0 0 22px rgba(0,255,136,0.18)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    >
                      <LogIn size={14} color="#00ff88" />
                      I&apos;VE SIGNED IN — ENTER NEXUS
                    </button>
                    <button
                      onClick={() => { setSsoOpened(false); setLoadingSSO(false); setLoading(false); }}
                      style={{ marginTop: 10, background: "none", border: "none", cursor: "pointer", fontFamily: "Rajdhani, sans-serif", fontSize: 9, color: "rgba(160,185,255,0.25)", letterSpacing: "0.06em" }}
                    >
                      ← Cancel and try again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer note */}
            <div style={{ textAlign: "center", marginTop: 16, fontFamily: "Rajdhani, sans-serif", fontSize: 9.5, color: "rgba(160,185,255,0.28)", lineHeight: 1.6 }}>
              Protected by EZ Nexus Authentication · Azure AD<br />
              New users will complete profile setup after sign-in
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── ORBIT MODE HUD ───────────────────────────────────────────────────────────

const HC = "#00d2ff";   // hud cyan
const HG = "#00ff88";   // hud green
const HP = "#7b2fff";   // hud purple
const HB = "rgba(13,9,45,0.80)";
const HBD = "rgba(0,210,255,0.22)";
const HTX = "rgba(232,238,255,0.82)";

function HUDPanel({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: HB, border: `1px solid ${HBD}`, padding: "12px 14px", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 8, ...style }}>
      <div style={{ fontFamily: "Orbitron, monospace", fontSize: 7, letterSpacing: "0.22em", color: HC, opacity: 0.55, marginBottom: 8, borderBottom: `1px solid rgba(0,210,255,0.12)`, paddingBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

function HUDRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef  = useRef(0);
  const blipsRef  = useRef([
    { angle: 0.8,  dist: 0.55, life: 1, color: HP },
    { angle: 2.1,  dist: 0.72, life: 1, color: HC },
    { angle: 3.6,  dist: 0.48, life: 1, color: "#ff79c6" },
    { angle: 5.0,  dist: 0.65, life: 1, color: HG },
    { angle: 0.0,  dist: 0.08, life: 1, color: "#fbbf24" },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let animId: number;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2, R = W / 2 - 4;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(8,4,24,0.88)";
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      [0.33, 0.66, 1].forEach(f => {
        ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,210,255,0.15)`; ctx.lineWidth = 0.8; ctx.stroke();
      });
      ctx.strokeStyle = "rgba(0,210,255,0.12)"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      const sweepAngle = angleRef.current;
      const trailLen = Math.PI * 0.55;
      for (let i = 0; i < 48; i++) {
        const a = sweepAngle - (trailLen / 48) * i;
        const alpha = (1 - i / 48) * 0.18;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, a - trailLen / 48, a); ctx.closePath();
        ctx.fillStyle = `rgba(0,210,255,${alpha})`; ctx.fill();
      }
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * R, cy + Math.sin(sweepAngle) * R);
      ctx.strokeStyle = `rgba(0,210,255,0.85)`; ctx.lineWidth = 1.2; ctx.stroke();
      blipsRef.current.forEach(b => {
        const diff = ((sweepAngle - b.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.15) b.life = 1.0;
        b.life *= 0.985;
        if (b.life < 0.04) return;
        const bx = cx + Math.cos(b.angle) * R * b.dist;
        const by = cy + Math.sin(b.angle) * R * b.dist;
        ctx.beginPath(); ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = b.color; ctx.globalAlpha = b.life; ctx.fill();
        ctx.shadowColor = b.color; ctx.shadowBlur = 8; ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      });
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,210,255,0.3)`; ctx.lineWidth = 1; ctx.stroke();
      angleRef.current = (sweepAngle + 0.018) % (Math.PI * 2);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <HUDPanel label="NEXUS SCAN">
      <canvas ref={canvasRef} width={126} height={126} style={{ display: "block" }} />
    </HUDPanel>
  );
}

function HUDCompass({ heading }: { heading: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2, R = W / 2 - 8;
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0,210,255,0.4)`; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.85, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(123,47,255,0.25)`; ctx.lineWidth = 1; ctx.stroke();
    const dirs = [
      { label: "N", angle: -Math.PI / 2, color: HC },
      { label: "E", angle: 0,            color: HP },
      { label: "S", angle: Math.PI / 2,  color: "#ff79c6" },
      { label: "W", angle: Math.PI,      color: HG },
    ];
    dirs.forEach(({ label, angle, color }) => {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * R * 0.75, cy + Math.sin(angle) * R * 0.75);
      ctx.lineTo(cx + Math.cos(angle) * R * 0.90, cy + Math.sin(angle) * R * 0.90);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      ctx.save(); ctx.translate(cx + Math.cos(angle) * (R + 12), cy + Math.sin(angle) * (R + 12));
      ctx.fillStyle = color; ctx.font = "bold 10px Orbitron, monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, 0, 0); ctx.restore();
    });
    const headRad = ((heading - 90) * Math.PI) / 180;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(headRad);
    ctx.beginPath(); ctx.moveTo(0, -R * 0.6); ctx.lineTo(-4, 0); ctx.lineTo(0, R * 0.15); ctx.lineTo(4, 0); ctx.closePath();
    ctx.fillStyle = HG; ctx.fill(); ctx.strokeStyle = "#00cc66"; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fillStyle = HC; ctx.fill();
    ctx.restore();
    for (let i = 0; i < 12; i++) {
      if (i % 3 === 0) continue;
      const a = (i * Math.PI) / 6 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82);
      ctx.lineTo(cx + Math.cos(a) * R * 0.90, cy + Math.sin(a) * R * 0.90);
      ctx.strokeStyle = `rgba(0,210,255,0.28)`; ctx.lineWidth = 1; ctx.stroke();
    }
  }, [heading]);

  return (
    <HUDPanel label="NAVIGATION">
      <canvas ref={ref} width={136} height={136} style={{ display: "block" }} />
      <div style={{ textAlign: "center", color: HG, fontFamily: "Orbitron, monospace", fontSize: 11, letterSpacing: "0.1em", marginTop: 8 }}>
        {String(heading).padStart(3, "0")}°
      </div>
    </HUDPanel>
  );
}

function HUDTel({ label, value, unit = "" }: { label: string; value: string | number; unit?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ color: HC, fontFamily: "Orbitron, monospace", fontSize: 7.5, letterSpacing: "0.14em", opacity: 0.65, minWidth: 36 }}>{label}</span>
      <span style={{ color: HTX, fontFamily: "Rajdhani, sans-serif", fontSize: 12, letterSpacing: "0.06em", fontWeight: 600 }}>
        {value}{unit && <span style={{ opacity: 0.45, fontSize: 9 }}> {unit}</span>}
      </span>
    </div>
  );
}

// ─── 3D SPACE SCENE ───────────────────────────────────────────────────────────

// Color helpers for sphere rendering
const hexRgb = (h: string): [number,number,number] =>
  [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
const ca = (hex: string, a: number) => { const [r,g,b]=hexRgb(hex); return `rgba(${r},${g},${b},${a})`; };
const lc = (hex: string, f: number) => { const [r,g,b]=hexRgb(hex); return `rgb(${Math.min(255,r+f*255|0)},${Math.min(255,g+f*255|0)},${Math.min(255,b+f*255|0)})`; };
const dc = (hex: string, f: number) => { const [r,g,b]=hexRgb(hex); return `rgb(${Math.max(0,r-f*255|0)},${Math.max(0,g-f*255|0)},${Math.max(0,b-f*255|0)})`; };

// 3D vector math
type V3 = [number,number,number];
const v3norm = (v: V3): V3 => { const m=Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])||1; return [v[0]/m,v[1]/m,v[2]/m]; };
const v3cross = (a: V3, b: V3): V3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const v3dot = (a: V3, b: V3) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];

interface ScenePlanet {
  id: string; label: string; sub: string;
  color: string; accent: string; radius: number;
  pos?: V3;
  orbit?: { a: number; b: number; incl: number; speed: number; offset: number };
}

const SCENE_PLANETS: ScenePlanet[] = [
  { id:"cosmos",  label:"EZ COMMAND CENTER", sub:"The Central Hub", color:"#7b2fff", accent:"#00d2ff", radius:58, pos:[0,0,0] },
  { id:"rr",      label:"RR",         sub:"Technologies",     color:"#00d2ff", accent:"#7b2fff", radius:32, orbit:{ a:130, b:100, incl:0.70, speed:0.0005,  offset:1.6 } },
  { id:"pm",      label:"EZ PM",      sub:"Project Mgmt",     color:"#60a5fa", accent:"#3b82f6", radius:24, orbit:{ a:215, b:158, incl:0.25, speed:0.00025, offset:0.0 } },
  { id:"itsm",    label:"EZ ITSM",    sub:"IT Service",       color:"#4ade80", accent:"#22c55e", radius:20, orbit:{ a:205, b:168, incl:-0.30,speed:0.00030, offset:2.1 } },
  { id:"org",     label:"EZ Org",     sub:"People Ops",       color:"#38bdf8", accent:"#0ea5e9", radius:22, orbit:{ a:315, b:238, incl:0.55, speed:0.00020, offset:1.0 } },
  { id:"onestop", label:"OneStop",    sub:"Command Center",   color:"#fbbf24", accent:"#f59e0b", radius:28, orbit:{ a:325, b:252, incl:-0.40,speed:0.00015, offset:3.5 } },
  { id:"custom",  label:"EZCustom",   sub:"Custom Solutions", color:"#c084fc", accent:"#a855f7", radius:19, orbit:{ a:435, b:328, incl:0.60, speed:0.00010, offset:0.8 } },
  { id:"3d",      label:"EZ 3D",      sub:"Creative Suite",   color:"#b06aff", accent:"#9333ea", radius:22, orbit:{ a:448, b:342, incl:-0.55,speed:0.00012, offset:4.2 } },
];

// ── Viewport control guide (top-left HUD panel) ──
function ViewportGuide() {
  const rows = [
    { key: "LEFT DRAG",   act: "Orbit Camera",   icon: "◎" },
    { key: "SCROLL",      act: "Zoom In / Out",  icon: "⊕" },
    { key: "RIGHT DRAG",  act: "Pan View",       icon: "✛" },
    { key: "[R]",         act: "Reset Camera",   icon: "↺" },
    { key: "[F]",         act: "Focus Planet",   icon: "◉" },
    { key: "[ESC]",       act: "Exit Orbit",     icon: "✕" },
  ];
  return (
    <div style={{ position: "absolute", top: 74, left: 20, pointerEvents: "none", zIndex: 2 }}>
      <HUDPanel label="VIEWPORT OVERVIEW" style={{ minWidth: 196 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {rows.map(r => (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 9, color: HC, opacity: 0.7, minWidth: 14 }}>{r.icon}</span>
              <span style={{ fontFamily: "Orbitron, monospace", fontSize: 7, color: HC, opacity: 0.75, minWidth: 68, letterSpacing: "0.07em" }}>{r.key}</span>
              <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, color: "rgba(232,238,255,0.5)" }}>{r.act}</span>
            </div>
          ))}
        </div>
        {/* Planet legend */}
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid rgba(0,210,255,0.1)` }}>
          <div style={{ ...orb(6, 700), color: HC, opacity: 0.45, letterSpacing: "0.14em", marginBottom: 6 }}>ACTIVE SYSTEMS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px" }}>
            {SCENE_PLANETS.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: p.color, boxShadow: `0 0 4px ${p.color}` }} />
                <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 9, color: ca(p.color, 0.8) }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </HUDPanel>
    </div>
  );
}

// ── 3D Space canvas ──
function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cam    = useRef({ theta:0.42, phi:1.12, radius:530, tTheta:0.42, tPhi:1.12, tRadius:530 });
  const drag   = useRef({ active:false, btn:0, sx:0, sy:0, st:0, sp:0 });
  const frameT = useRef(0);
  const animId = useRef(0);

  // Panorama image for skysphere background
  const panoRef    = useRef<HTMLImageElement | null>(null);
  const pmTexRef   = useRef<HTMLImageElement | null>(null);
  const tdTexRef   = useRef<HTMLImageElement | null>(null);
  const itsmTexRef = useRef<HTMLImageElement | null>(null);
  const cosmosTexRef = useRef<HTMLImageElement | null>(null);
  const orgTexRef    = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const load = (src: string, ref: React.MutableRefObject<HTMLImageElement | null>) => {
      const img = new Image(); img.src = src; img.onload = () => { ref.current = img; };
    };
    load(panoramaUrl,     panoRef);
    load(pmTextureUrl,    pmTexRef);
    load(tdTextureUrl,    tdTexRef);
    load(itsmTextureUrl,  itsmTexRef);
    load(cosmosTextureUrl, cosmosTexRef);
    load(orgTextureUrl,    orgTexRef);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Camera & projection ──
    const getCamPos = () => {
      const { theta, phi, radius } = cam.current;
      return [radius*Math.sin(phi)*Math.cos(theta), radius*Math.cos(phi), radius*Math.sin(phi)*Math.sin(theta)] as V3;
    };
    const buildBasis = (cp: V3) => {
      const fwd   = v3norm([-cp[0],-cp[1],-cp[2]]);
      const right = v3norm(v3cross(fwd, [0,1,0]));
      const up    = v3cross(right, fwd);
      return { fwd, right, up };
    };
    const project = (wx:number, wy:number, wz:number, cp:V3, basis:{right:V3;up:V3;fwd:V3}, W:number, H:number) => {
      const t: V3 = [wx-cp[0], wy-cp[1], wz-cp[2]];
      const sx  = v3dot(t, basis.right);
      const sy  = v3dot(t, basis.up);
      const sz  = v3dot(t, basis.fwd);
      if (sz <= 8) return null;
      const f = 780 / sz;
      return { x: W/2 + sx*f, y: H/2 - sy*f, depth: sz, scale: f };
    };

    // ── Sphere renderer ──
    const drawSphere = (ctx: CanvasRenderingContext2D, sx:number, sy:number, sr:number, color:string) => {
      // Atmosphere
      const atm = ctx.createRadialGradient(sx,sy,sr*0.6, sx,sy,sr*1.9);
      atm.addColorStop(0, ca(color, 0.22)); atm.addColorStop(1, ca(color, 0));
      ctx.beginPath(); ctx.arc(sx,sy,sr*1.9,0,Math.PI*2); ctx.fillStyle=atm; ctx.fill();
      // Body
      const hx=sx-sr*0.3, hy=sy-sr*0.38;
      const body = ctx.createRadialGradient(hx,hy,sr*0.04, sx,sy,sr);
      body.addColorStop(0,   lc(color, 0.7));
      body.addColorStop(0.28,lc(color, 0.18));
      body.addColorStop(0.65,color);
      body.addColorStop(1,   dc(color, 0.62));
      ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2); ctx.fillStyle=body; ctx.fill();
      // Specular
      const spec = ctx.createRadialGradient(hx,hy,0, hx,hy,sr*0.5);
      spec.addColorStop(0, "rgba(255,255,255,0.52)");
      spec.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2); ctx.fillStyle=spec; ctx.fill();
    };

    // ── Orbit ring renderer ──
    const drawRing = (ctx: CanvasRenderingContext2D,
                      orb: NonNullable<ScenePlanet["orbit"]>,
                      cp: V3, basis: {right:V3;up:V3;fwd:V3}, W:number, H:number, color:string) => {
      const steps = 96; let first = true;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const ang = (i/steps)*Math.PI*2;
        const ox = orb.a*Math.cos(ang), oz = orb.b*Math.sin(ang);
        const wy=-oz*Math.sin(orb.incl), wz=oz*Math.cos(orb.incl);
        const p = project(ox, wy, wz, cp, basis, W, H);
        if (!p) { first=true; continue; }
        if (first) { ctx.moveTo(p.x,p.y); first=false; } else ctx.lineTo(p.x,p.y);
      }
      ctx.strokeStyle = ca(color, 0.16); ctx.lineWidth = 0.7; ctx.stroke();
    };

    // ── Equirectangular sky draw ──
    // Maps camera theta (0..2π) → U and phi (0..π) → V with seamless horizontal wrap
    const drawSky = (ctx: CanvasRenderingContext2D, W: number, H: number, theta: number, phi: number) => {
      const pano = panoRef.current;
      if (!pano || !pano.naturalWidth) {
        // Fallback while image loads
        ctx.fillStyle = "#04020e"; ctx.fillRect(0,0,W,H); return;
      }
      const PW = pano.naturalWidth, PH = pano.naturalHeight;
      // Compute source window from fixed FOV (focal length 780px)
      const fovH = 2 * Math.atan(W / (2 * 780));
      const fovV = 2 * Math.atan(H / (2 * 780));
      const srcW = PW * fovH / (Math.PI * 2);
      const srcH = PH * fovV / Math.PI;
      // Camera angle → panorama UV
      const uNorm  = (((theta / (Math.PI * 2)) % 1) + 1) % 1; // normalise to [0,1)
      const uCenter = uNorm * PW;
      const vCenter = (phi / Math.PI) * PH;
      const srcX = uCenter - srcW / 2;
      const srcY = Math.max(0, Math.min(PH - srcH, vCenter - srcH / 2));
      // Draw with horizontal seam wrap
      if (srcX < 0) {
        const leftW = -srcX;
        ctx.drawImage(pano, PW - leftW, srcY, leftW, srcH, 0, 0, W * leftW / srcW, H);
        ctx.drawImage(pano, 0, srcY, srcW - leftW, srcH, W * leftW / srcW, 0, W * (srcW - leftW) / srcW, H);
      } else if (srcX + srcW > PW) {
        const leftW = PW - srcX;
        ctx.drawImage(pano, srcX, srcY, leftW, srcH, 0, 0, W * leftW / srcW, H);
        ctx.drawImage(pano, 0, srcY, srcW - leftW, srcH, W * leftW / srcW, 0, W * (srcW - leftW) / srcW, H);
      } else {
        ctx.drawImage(pano, srcX, srcY, srcW, srcH, 0, 0, W, H);
      }
      // Subtle dark vignette around edges to help planets read
      const vig = ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.3, W/2,H/2,Math.min(W,H)*0.85);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = vig; ctx.fillRect(0,0,W,H);
    };

    // ── Main loop ──
    const loop = () => {
      animId.current = requestAnimationFrame(loop);
      frameT.current++;
      const ft = frameT.current;
      const W = canvas.width, H = canvas.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Smooth camera lerp
      const c = cam.current;
      c.theta  += (c.tTheta  - c.theta)  * 0.09;
      c.phi    += (c.tPhi    - c.phi)    * 0.09;
      c.radius += (c.tRadius - c.radius) * 0.09;
      // Clamp phi away from poles
      c.phi = Math.max(0.08, Math.min(Math.PI-0.08, c.phi));

      // ── Sky (equirectangular panorama, moves with camera) ──
      drawSky(ctx, W, H, c.theta, c.phi);

      const cp    = getCamPos();
      const basis = buildBasis(cp);

      // Compute planet world positions
      type PlanetEntry = { pl: ScenePlanet; wx:number; wy:number; wz:number; proj:{x:number;y:number;depth:number;scale:number} };
      const list: PlanetEntry[] = [];
      SCENE_PLANETS.forEach(pl => {
        let wx=0,wy=0,wz=0;
        if (pl.pos) { [wx,wy,wz]=pl.pos; }
        else if (pl.orbit) {
          const ang = ft*pl.orbit.speed + pl.orbit.offset;
          const ox=pl.orbit.a*Math.cos(ang), oz=pl.orbit.b*Math.sin(ang);
          wy=-oz*Math.sin(pl.orbit.incl); wz=oz*Math.cos(pl.orbit.incl); wx=ox;
        }
        const p=project(wx,wy,wz, cp, basis, W, H);
        if (p) list.push({ pl, wx, wy, wz, proj:p });
      });

      // Sort far-first
      list.sort((a,b)=>b.proj.depth-a.proj.depth);

      // Orbit rings
      SCENE_PLANETS.forEach(pl => {
        if (!pl.orbit) return;
        drawRing(ctx, pl.orbit, cp, basis, W, H, pl.color);
      });

      // Planets + labels
      list.forEach(({ pl, proj }) => {
        const sr = pl.radius * proj.scale * 0.88;
        if (sr < 1.5) return;
        const texMap: Record<string, HTMLImageElement | null> = {
          cosmos: cosmosTexRef.current,
          pm:     pmTexRef.current,
          "3d":   tdTexRef.current,
          itsm:   itsmTexRef.current,
          org:    orgTexRef.current,
        };
        const tex = texMap[pl.id];
        if (tex) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, sr, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(tex, proj.x - sr, proj.y - sr, sr * 2, sr * 2);
          const glow = ctx.createRadialGradient(proj.x, proj.y, sr * 0.6, proj.x, proj.y, sr);
          glow.addColorStop(0, "rgba(0,0,0,0)");
          glow.addColorStop(1, ca(pl.accent, 0.4));
          ctx.fillStyle = glow;
          ctx.fillRect(proj.x - sr, proj.y - sr, sr * 2, sr * 2);
          ctx.restore();
        } else {
          drawSphere(ctx, proj.x, proj.y, sr, pl.color);
        }
        // Label
        if (sr > 10) {
          const fs = Math.max(7, Math.min(12, sr * 0.33));
          ctx.textAlign="center";
          ctx.font = `700 ${fs}px Orbitron, monospace`;
          ctx.fillStyle = "rgba(232,238,255,0.9)";
          ctx.shadowColor = pl.color; ctx.shadowBlur = 6;
          ctx.fillText(pl.label, proj.x, proj.y+sr+14);
          ctx.shadowBlur = 0;
          if (sr > 18) {
            ctx.font = `${Math.max(7,fs*0.8)}px Rajdhani, sans-serif`;
            ctx.fillStyle = ca(pl.color, 0.65);
            ctx.fillText(pl.sub, proj.x, proj.y+sr+24);
          }
        }
      });
    };
    loop();

    // ── Mouse events ──
    const onDown = (e: MouseEvent) => {
      drag.current = { active:true, btn:e.button, sx:e.clientX, sy:e.clientY, st:cam.current.tTheta, sp:cam.current.tPhi };
      e.preventDefault();
    };
    const onMove = (e: MouseEvent) => {
      if (!drag.current.active) return;
      const dx=e.clientX-drag.current.sx, dy=e.clientY-drag.current.sy;
      if (drag.current.btn===0) {
        cam.current.tTheta = drag.current.st - dx*0.005;
        cam.current.tPhi   = Math.max(0.08, Math.min(Math.PI-0.08, drag.current.sp + dy*0.005));
      }
    };
    const onUp   = () => { drag.current.active=false; };
    const onWheel = (e: WheelEvent) => {
      cam.current.tRadius = Math.max(120, Math.min(1500, cam.current.tRadius + e.deltaY*0.55));
      e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key==="r"||e.key==="R") {
        cam.current.tTheta=0.42; cam.current.tPhi=1.12; cam.current.tRadius=530;
      }
      if (e.key==="f"||e.key==="F") {
        // Focus: reset to a close orbit of the central planet
        cam.current.tTheta=cam.current.tTheta; cam.current.tPhi=1.3; cam.current.tRadius=220;
      }
    };

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    canvas.addEventListener("wheel",     onWheel, { passive:false });
    window.addEventListener("keydown",   onKey);
    // Right-click menu suppress
    canvas.addEventListener("contextmenu", e => e.preventDefault());

    return () => {
      cancelAnimationFrame(animId.current);
      window.removeEventListener("resize",    resize);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      canvas.removeEventListener("wheel",     onWheel);
      window.removeEventListener("keydown",   onKey);
      canvas.removeEventListener("contextmenu", e => e.preventDefault());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"auto", cursor:"crosshair" }}
    />
  );
}

function OrbitConfirmOverlay({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(3,1,14,0.82)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", width: "100%", maxWidth: 440, margin: "0 16px" }}
      >
        {/* Corner brackets */}
        {([["top","left","0,210,255"],["top","right","123,47,255"],["bottom","left","123,47,255"],["bottom","right","0,210,255"]] as const).map(([v,h,rgb]) => (
          <div key={`${v}${h}`} style={{ position: "absolute", [v]: -10, [h]: -10, width: 20, height: 20,
            borderTop: v === "top" ? `2px solid rgba(${rgb},0.75)` : "none",
            borderBottom: v === "bottom" ? `2px solid rgba(${rgb},0.75)` : "none",
            borderLeft: h === "left" ? `2px solid rgba(${rgb},0.75)` : "none",
            borderRight: h === "right" ? `2px solid rgba(${rgb},0.75)` : "none",
          }} />
        ))}

        <div style={{ background: "rgba(8,4,24,0.96)", border: "1px solid rgba(0,210,255,0.32)", borderRadius: 16, overflow: "hidden", boxShadow: "0 0 80px rgba(0,210,255,0.12), 0 0 1px rgba(160,100,255,0.5)" }}>
          {/* Top accent */}
          <div style={{ height: 2, background: "linear-gradient(to right, transparent, rgba(0,210,255,0.6), rgba(123,47,255,0.6), transparent)" }} />

          <div style={{ padding: "32px 32px 28px", textAlign: "center" }}>
            {/* Pulsing orbit icon */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{ position: "relative", width: 64, height: 64 }}>
                <motion.div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(0,210,255,0.3)" }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }} />
                <motion.div style={{ position: "absolute", inset: 6, borderRadius: "50%", border: "1px solid rgba(0,210,255,0.5)" }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Globe size={28} color={HC} style={{ filter: `drop-shadow(0 0 12px ${HC})` }} />
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "3px 14px", background: "rgba(0,210,255,0.08)", border: "1px solid rgba(0,210,255,0.3)", borderRadius: 20, marginBottom: 16 }}>
              <motion.div style={{ width: 5, height: 5, borderRadius: "50%", background: HC, boxShadow: `0 0 8px ${HC}` }}
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <span style={{ ...orb(7, 700), color: HC, letterSpacing: "0.14em" }}>REQUEST RECEIVED</span>
            </div>

            <div style={{ ...orb(22, 900), ...gradText(), lineHeight: 1.1, marginBottom: 6 }}>ORBIT MODE</div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 13, color: PALETTE.muted, lineHeight: 1.7, marginBottom: 28 }}>
              All panels will be hidden.<br />
              The Nexus HUD will take full command.
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={onConfirm}
                style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, rgba(0,210,255,0.28), rgba(123,47,255,0.22))", border: "1px solid rgba(0,210,255,0.55)", borderRadius: 10, cursor: "pointer", ...orb(11, 700), color: "#fff", letterSpacing: "0.1em", boxShadow: "0 0 28px rgba(0,210,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
              >
                <Globe size={15} color={HC} />
                ENTER ORBIT MODE
              </button>
              <button
                onClick={onCancel}
                style={{ width: "100%", padding: "10px 0", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, cursor: "pointer", fontFamily: "Rajdhani, sans-serif", fontSize: 12, color: PALETTE.muted, letterSpacing: "0.1em" }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const EZ_HUD_PRODUCTS = [
  { name: "EZ 3D Studio",    color: "#b06aff" },
  { name: "EZ PM",           color: "#60a5fa" },
  { name: "EZ ITSM",         color: "#4ade80" },
  { name: "EZ Org",          color: "#38bdf8" },
  { name: "OneStop",         color: "#fbbf24" },
];

const HUD_STATUS = [
  { label: "NEXUS SYSTEMS",   value: "NOMINAL",      ok: true },
  { label: "OI LAYER",        value: "ACTIVE",       ok: true },
  { label: "EZ COSMOS",       value: "SYNCHRONIZED", ok: true },
  { label: "ORBIT LOCK",      value: "ENGAGED",      ok: true },
  { label: "INTELLIGENCE",    value: "ONLINE",       ok: true },
];

function NexusOrbitHUD({ onExit }: { onExit: () => void }) {
  const [time,     setTime]     = useState(new Date());
  const [altitude, setAltitude] = useState(408.2);
  const [velocity, setVelocity] = useState(7.66);
  const [pitch,    setPitch]    = useState(0);
  const [roll,     setRoll]     = useState(0);
  const [heading,  setHeading]  = useState(127);
  const [oxygen,   setOxygen]   = useState(98.7);
  const [signal,   setSignal]   = useState(94);
  const visorRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
      setAltitude(v => parseFloat((v + (Math.random() - 0.5) * 0.3).toFixed(1)));
      setVelocity(v => parseFloat((v + (Math.random() - 0.5) * 0.02).toFixed(2)));
      setPitch(v => parseFloat((v + (Math.random() - 0.5) * 0.4).toFixed(1)));
      setRoll(v => parseFloat((v + (Math.random() - 0.5) * 0.3).toFixed(1)));
      setHeading(v => Math.round((v + (Math.random() - 0.5) * 0.5 + 360) % 360));
      setOxygen(v => Math.min(100, Math.max(85, parseFloat((v + (Math.random() - 0.5) * 0.05).toFixed(1)))));
      setSignal(v => Math.min(100, Math.max(78, Math.round(v + (Math.random() - 0.5) * 0.8))));
    }, 800);
    return () => clearInterval(id);
  }, []);

  // Visor lens overlay canvas
  useEffect(() => {
    const canvas = visorRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cw = canvas.width, ch = canvas.height;
    const cx = cw / 2, cy = ch / 2;
    const vignette = ctx.createRadialGradient(cx, cy, Math.min(cw, ch) * 0.5, cx, cy, Math.min(cw, ch) * 0.72);
    vignette.addColorStop(0,    "rgba(0,0,0,0)");
    vignette.addColorStop(0.72, "rgba(0,2,12,0.18)");
    vignette.addColorStop(1,    "rgba(0,2,12,0.62)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, cw, ch);
    const tint = ctx.createLinearGradient(0, 0, cw, ch * 0.35);
    tint.addColorStop(0,   "rgba(0,210,255,0.035)");
    tint.addColorStop(0.5, "rgba(123,47,255,0.05)");
    tint.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, cw, ch * 0.45);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1.5, 1.05);
    ctx.beginPath(); ctx.arc(0, 0, Math.min(cw, ch) * 0.62, 0, Math.PI * 2);
    ctx.restore();
    ctx.strokeStyle = "rgba(0,210,255,0.12)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1.5, 1.05);
    ctx.beginPath(); ctx.arc(0, 0, Math.min(cw, ch) * 0.61, 0, Math.PI * 2);
    ctx.restore();
    ctx.strokeStyle = `rgba(0,210,255,0.08)`; ctx.lineWidth = 1; ctx.stroke();
  }, []);

  const fmt = (d: Date) =>
    `${String(d.getUTCHours()).padStart(2,"0")}:${String(d.getUTCMinutes()).padStart(2,"0")}:${String(d.getUTCSeconds()).padStart(2,"0")} UTC`;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none", userSelect: "none" }}>
      {/* ── 3D Space scene — first child = behind everything, receives mouse events ── */}
      <SpaceCanvas />

      {/* Visor overlay — subtle vignette on top of scene */}
      <canvas ref={visorRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.55 }} />

      {/* ── Viewport controls guide (top-left) ── */}
      <ViewportGuide />

      {/* Scanlines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(transparent 50%, rgba(0,210,255,0.012) 50%)", backgroundSize: "100% 3px", pointerEvents: "none" }} />

      {/* ── Top telemetry bar ── */}
      <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 28, background: HB, border: `1px solid ${HBD}`, padding: "10px 28px", borderRadius: 8, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", boxShadow: `0 0 30px rgba(0,210,255,0.08)` }}>
        {/* Mode badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.div style={{ width: 7, height: 7, borderRadius: "50%", background: HC, boxShadow: `0 0 10px ${HC}` }}
            animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <span style={{ ...orb(9, 800), color: HC, letterSpacing: "0.16em" }}>ORBIT MODE</span>
        </div>

        {[
          { lbl: "ALT", val: altitude },
          { lbl: "VEL", val: velocity },
        ].map(({ lbl, val }) => (
          <React.Fragment key={lbl}>
            <div style={{ width: 1, height: 20, background: `rgba(0,210,255,0.18)` }} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ ...orb(7, 600), color: HC, opacity: 0.6 }}>{lbl}</span>
              <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 13, fontWeight: 700, color: HTX }}>{val}</span>
            </div>
          </React.Fragment>
        ))}

        <div style={{ width: 1, height: 20, background: `rgba(0,210,255,0.18)` }} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ ...orb(7, 600), color: HC, opacity: 0.6 }}>HDG</span>
          <span style={{ ...orb(13, 700), color: HG }}>{String(heading).padStart(3,"0")}°</span>
        </div>

        <div style={{ width: 1, height: 20, background: `rgba(0,210,255,0.18)` }} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ ...orb(7, 600), color: HC, opacity: 0.6 }}>O2</span>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 13, fontWeight: 700, color: HTX }}>{oxygen}%</span>
        </div>

        {/* Signal bars */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ ...orb(7, 600), color: HC, opacity: 0.6 }}>SIG</span>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ width: 3, height: 5 + i * 2, background: i < Math.round(signal / 20) ? HG : "rgba(0,255,136,0.18)", borderRadius: 1 }} />
            ))}
          </div>
        </div>

        <div style={{ width: 1, height: 20, background: `rgba(0,210,255,0.18)` }} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ ...orb(7, 600), color: HC, opacity: 0.6 }}>UTC</span>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 12, fontWeight: 600, color: HTX, letterSpacing: "0.04em" }}>{fmt(time)}</span>
        </div>
      </div>

      {/* ── Left column — sits below viewport guide ── */}
      <div style={{ position: "absolute", left: 20, bottom: 80, display: "flex", flexDirection: "column", gap: 8 }}>
        <HUDCompass heading={heading} />

        <HUDPanel label="TELEMETRY">
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <HUDTel label="ALT"  value={altitude} unit="km" />
            <HUDTel label="VEL"  value={velocity} unit="km/s" />
            <HUDTel label="O2"   value={oxygen}   unit="%" />
            <HUDTel label="PCH"  value={pitch}    unit="°" />
            <HUDTel label="ROLL" value={roll}     unit="°" />
            <HUDTel label="GRAV" value="0.000"    unit="g" />
          </div>
        </HUDPanel>

        <HUDPanel label="EZ COSMOS">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {EZ_HUD_PRODUCTS.map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, boxShadow: `0 0 6px ${p.color}`, flexShrink: 0 }} />
                <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, color: HTX, letterSpacing: "0.04em" }}>{p.name}</span>
              </div>
            ))}
          </div>
        </HUDPanel>

        <HUDRadar />
      </div>

      {/* ── Right column status ── */}
      <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
        {HUD_STATUS.map((s, si) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...orb(6, 600), color: HC, opacity: 0.5, letterSpacing: "0.14em" }}>{s.label}</div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, fontWeight: 700, color: HTX, letterSpacing: "0.06em" }}>{s.value}</div>
            </div>
            <motion.div style={{ width: 7, height: 7, borderRadius: "50%", background: HG, boxShadow: `0 0 8px ${HG}` }}
              animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2 + si * 0.3, repeat: Infinity }} />
          </div>
        ))}
      </div>

      {/* ── Center reticle ── */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={200} height={200} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
          <line x1="0"   y1="100" x2="60"  y2="100" stroke={`rgba(0,210,255,0.28)`} strokeWidth="1" />
          <line x1="140" y1="100" x2="200" y2="100" stroke={`rgba(0,210,255,0.28)`} strokeWidth="1" />
          <line x1="100" y1="0"   x2="100" y2="60"  stroke={`rgba(0,210,255,0.28)`} strokeWidth="1" />
          <line x1="100" y1="140" x2="100" y2="200" stroke={`rgba(0,210,255,0.28)`} strokeWidth="1" />
          <circle cx="100" cy="100" r="50" fill="none" stroke={`rgba(0,210,255,0.3)`}  strokeWidth="1.5" />
          <circle cx="100" cy="100" r="35" fill="none" stroke={`rgba(123,47,255,0.35)`} strokeWidth="1.2" />
          <circle cx="100" cy="100" r="20" fill="none" stroke={`rgba(0,210,255,0.45)`} strokeWidth="1" />
          <circle cx="100" cy="100" r="3"  fill={`rgba(0,255,136,0.85)`} />
          <circle cx="100" cy="100" r="5"  fill="none" stroke={`rgba(0,255,136,0.4)`} strokeWidth="1" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
            const r1 = 50, r2 = i % 3 === 0 ? 42 : 46;
            return <line key={i}
              x1={100 + Math.cos(angle) * r1} y1={100 + Math.sin(angle) * r1}
              x2={100 + Math.cos(angle) * r2} y2={100 + Math.sin(angle) * r2}
              stroke={i % 3 === 0 ? `rgba(0,210,255,0.55)` : `rgba(0,210,255,0.3)`}
              strokeWidth={i % 3 === 0 ? "2" : "1"}
            />;
          })}
        </svg>
      </div>

      {/* ── Bottom exit bar — pointer events ON ── */}
      <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12, alignItems: "center", pointerEvents: "auto" }}>
        <button
          onClick={onExit}
          style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 28px", background: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.08))", border: "1px solid rgba(239,68,68,0.45)", borderRadius: 8, cursor: "pointer", ...orb(10, 700), color: "#f87171", letterSpacing: "0.1em", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 0 20px rgba(239,68,68,0.1)" }}
        >
          <Monitor size={14} color="#f87171" />
          EXIT ORBIT MODE
        </button>
        <div style={{ padding: "5px 14px", background: HB, border: `1px solid rgba(0,255,136,0.25)`, borderRadius: 6, backdropFilter: "blur(10px)" }}>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 10, color: `rgba(0,255,136,0.55)`, letterSpacing: "0.08em" }}>NEXUS ORBIT · STABLE</span>
        </div>
      </div>

      {/* ── Corner brackets ── */}
      {([["top","left","0,210,255"],["top","right","123,47,255"],["bottom","left","123,47,255"],["bottom","right","0,210,255"]] as const).map(([v,h,rgb]) => (
        <div key={`${v}${h}`} style={{ position: "absolute", [v]: 14, [h]: 14, width: 22, height: 22,
          borderTop:    v === "top"    ? `1.5px solid rgba(${rgb},0.5)` : "none",
          borderBottom: v === "bottom" ? `1.5px solid rgba(${rgb},0.5)` : "none",
          borderLeft:   h === "left"   ? `1.5px solid rgba(${rgb},0.5)` : "none",
          borderRight:  h === "right"  ? `1.5px solid rgba(${rgb},0.5)` : "none",
        }} />
      ))}
    </div>
  );
}

// ─── POST-LOGIN ONBOARDING OVERLAY ────────────────────────────────────────────
// Shown to new / first-time users immediately after authentication

function OnboardingOverlay({ onComplete }: { onComplete: () => void }) {
  const [step, setStep]       = useState(0);
  const [role, setRole]       = useState("");
  const [dept, setDept]       = useState("");
  const [subDept, setSubDept] = useState("");
  const [error, setError]     = useState("");

  const selectedDept = LOGIN_DEPTS.find(d => d.name === dept);
  const steps = [
    { key: "role",    label: "YOUR ROLE",           hint: "How will you primarily use EZ Nexus?" },
    { key: "dept",    label: "DEPARTMENT",          hint: "Which department are you part of?" },
    { key: "subDept", label: "SUB-DEPARTMENT",      hint: "Select your team within that department." },
  ];

  const saveAndComplete = (r = role, d = dept, sd = subDept) => {
    try {
      localStorage.setItem("ez_nexus_user_profile", JSON.stringify({ role: r, dept: d, subDept: sd, ts: Date.now() }));
    } catch {}
    onComplete();
  };

  const advance = () => {
    setError("");
    if (step === 0 && !role)    { setError("Please select a role to continue"); return; }
    if (step === 1 && !dept)    { setError("Please select your department"); return; }
    if (step === 2 && !subDept) { setError("Please select your sub-department"); return; }
    if (step < 2) { setStep(s => s + 1); } else { saveAndComplete(); }
  };

  const selectStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: "rgba(6,3,20,0.7)", color: PALETTE.text,
    border: "1px solid rgba(123,47,255,0.35)", borderRadius: 8,
    fontFamily: "Rajdhani, sans-serif", fontSize: 13,
    outline: "none", boxSizing: "border-box", cursor: "pointer",
    appearance: "none" as const, WebkitAppearance: "none" as const,
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(3,1,12,0.88)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
        style={{ width: "100%", maxWidth: 420, margin: "0 16px" }}
      >
        <div style={{ ...GC, background: "rgba(8,4,24,0.96)", borderRadius: 16, overflow: "hidden" }}>

          {/* Header */}
          <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid rgba(123,47,255,0.15)", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 12px", background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 20, marginBottom: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 6px #00ff88" }} />
              <span style={{ ...orb(7, 700), color: "#00ff88", letterSpacing: "0.1em" }}>AUTHENTICATED</span>
            </div>
            <div style={{ ...orb(18, 900), ...gradText(), marginBottom: 4 }}>WELCOME TO EZ NEXUS</div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, color: PALETTE.muted }}>
              Complete your profile to personalise your Nexus experience
            </div>
          </div>

          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "14px 0 0" }}>
            {steps.map((_, i) => (
              <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i <= step ? PALETTE.cyan : "rgba(255,255,255,0.1)", transition: "all 0.25s ease", boxShadow: i === step ? `0 0 8px ${PALETTE.cyan}88` : "none" }} />
            ))}
          </div>

          {/* Step body */}
          <div style={{ padding: "18px 24px 24px" }}>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                <div style={{ ...orb(8, 800), ...gradText(), letterSpacing: "0.12em", marginBottom: 4 }}>{steps[step].label}</div>
                <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 11, color: PALETTE.muted, marginBottom: 12 }}>{steps[step].hint}</div>

                {error && (
                  <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 10, color: "#f87171", marginBottom: 10 }}>{error}</div>
                )}

                {step === 0 && (
                  <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
                    <option value="" disabled>Select your role...</option>
                    {LOGIN_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                )}
                {step === 1 && (
                  <select value={dept} onChange={e => { setDept(e.target.value); setSubDept(""); }} style={selectStyle}>
                    <option value="" disabled>Select department...</option>
                    {LOGIN_DEPTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                )}
                {step === 2 && (
                  <select value={subDept} onChange={e => setSubDept(e.target.value)} style={selectStyle}>
                    <option value="" disabled>Select sub-department...</option>
                    {(selectedDept?.subs ?? []).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </motion.div>
            </AnimatePresence>

            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {step > 0 && (
                <button onClick={() => { setError(""); setStep(s => s - 1); }} style={{ flex: 1, padding: "10px 0", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, cursor: "pointer", ...orb(9, 600), color: PALETTE.muted, letterSpacing: "0.06em" }}>
                  ← BACK
                </button>
              )}
              <button onClick={advance} style={{ flex: 2, padding: "10px 0", background: "linear-gradient(135deg, rgba(0,210,255,0.28), rgba(123,47,255,0.28))", border: "1px solid rgba(0,210,255,0.45)", borderRadius: 8, cursor: "pointer", ...orb(9, 700), color: "#fff", letterSpacing: "0.08em", boxShadow: "0 0 18px rgba(0,210,255,0.12)" }}>
                {step < 2 ? "CONTINUE →" : "ENTER NEXUS →"}
              </button>
            </div>

            {step === 0 && (
              <button onClick={() => saveAndComplete("", "", "")} style={{ width: "100%", marginTop: 10, padding: "8px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "Rajdhani, sans-serif", fontSize: 10, color: "rgba(160,185,255,0.3)", letterSpacing: "0.08em" }}>
                Skip for now — I'll set this up later
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
export default function App() {
  const [isLoggedIn, setIsLoggedIn]         = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mode, setMode]                     = useState<Mode>("nexus");
  const [galaxy, setGalaxy]                 = useState<Galaxy>("cosmos");
  const [carouselPage, setCarouselPage]     = useState(0);
  const [orbitPending, setOrbitPending]     = useState(false);
  const [orbitActive, setOrbitActive]       = useState(false);

  const switchGalaxy = (g: Galaxy) => { setGalaxy(g); setCarouselPage(0); };
  const currentGalaxy = GALAXIES.find(g => g.id === galaxy)!;

  // Double-tap Tab → toggle Dash / Nexus mode (not available in orbit)
  const lastTabRef = useRef(0);
  useEffect(() => {
    if (!isLoggedIn || orbitActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const now = Date.now();
      if (now - lastTabRef.current < 400) {
        e.preventDefault();
        setMode(m => m === "nexus" ? "dash" : "nexus");
        lastTabRef.current = 0;
      } else {
        lastTabRef.current = now;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isLoggedIn, orbitActive]);

  const isReturningUser = () => {
    try { return !!localStorage.getItem("ez_nexus_user_profile"); } catch { return false; }
  };

  const loginUser = () => {
    setIsLoggedIn(true);
    if (!isReturningUser()) setShowOnboarding(true);
  };

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("id_token=") || hash.includes("access_token=")) {
      window.history.replaceState({}, "", window.location.pathname);
      loginUser();
      try { localStorage.setItem("ez_auth_complete", "1"); } catch {}
      return;
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "ez_auth_complete" && e.newValue === "1") {
        localStorage.removeItem("ez_auth_complete");
        loginUser();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => loginUser()} />;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", background: PALETTE.voidBg, fontFamily: "Rajdhani, sans-serif" }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-8px)} }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        ::-webkit-scrollbar-thumb { background: rgba(0,210,255,0.25); border-radius: 2px; }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        button:hover .galaxy-edge-glow { opacity: 1 !important; }
      `}</style>

      {/* ── First-time onboarding overlay ── */}
      {showOnboarding && <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />}

      {/* ── Background ── */}
      <img
        src={bgImg}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", zIndex: 0, display: "block" }}
      />
      {/* Galaxy tint overlay — shifts hue when in non-cosmos galaxy */}
      <div style={{
        position: "absolute", inset: 0,
        background: galaxy === "cosmos"
          ? "rgba(5,3,16,0.28)"
          : galaxy === "audio"
            ? "rgba(16,3,10,0.55)"
            : "rgba(3,14,8,0.55)",
        zIndex: 1,
        transition: "background 0.6s ease",
      }} />

      {/* ── Galaxy dots indicator (always on top) ── */}
      <GalaxyEdgeNav galaxy={galaxy} setGalaxy={switchGalaxy} />

      {/* ── Orbit confirm overlay ── */}
      {orbitPending && (
        <OrbitConfirmOverlay
          onConfirm={() => { setOrbitPending(false); setOrbitActive(true); }}
          onCancel={() => setOrbitPending(false)}
        />
      )}

      {/* ── Orbit HUD — covers everything when active ── */}
      {orbitActive && <NexusOrbitHUD onExit={() => setOrbitActive(false)} />}

      {/* ── UI Layer — hidden in orbit mode ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: orbitActive ? "none" : "block" }}>
        <TopHUD mode={mode} setMode={setMode} onOrbitRequest={() => setOrbitPending(true)} />

        {/* Galaxy-specific content */}
        {currentGalaxy.live ? (
          <>
            {/* EZ WAY — full-viewport pamphlet */}
            {galaxy === "ezway" && <EzWayPamphlet onClose={() => switchGalaxy("cosmos")} />}

            {galaxy !== "ezway" && <LeftModules mode={mode} />}
            {galaxy !== "ezway" && <RightModules mode={mode} />}

            {/* ── 2-row center layout ── */}
            {mode === "nexus" && galaxy !== "ezway" && (
              <div style={{
                position: "absolute",
                top: 90,
                left: 228,
                right: 290,
                bottom: 62,
                display: "flex",
                flexDirection: "column",
                gap: 7,
                zIndex: 30,
              }}>
                {/* Row 1 — EZ Cosmos split with Upcoming Events */}
                <div style={{ flex: "1 1 0", minHeight: 0 }}>
                  <CosmosRow />
                </div>
                {/* Row 2 — Products panel (largest, contains EZ WAY + nav) */}
                <div style={{ flex: "3.5 1 0", minHeight: 0 }}>
                  <WorldsSection carouselPage={carouselPage} setCarouselPage={setCarouselPage} onEzWayClick={() => switchGalaxy("ezway")} galaxy={galaxy} setGalaxy={switchGalaxy} />
                </div>
              </div>
            )}
            {mode === "dash" && galaxy !== "ezway" && <RaarBreath />}
          </>
        ) : (
          <GalaxyComingSoon galaxy={galaxy} setGalaxy={switchGalaxy} />
        )}

        <BottomHUD mode={mode} />
      </div>
    </div>
  );
}
