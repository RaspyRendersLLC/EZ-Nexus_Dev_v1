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

function ModeSwitcher({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
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
          onClick={() => setMode("dash")}
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

function TopHUD({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
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
          <ModeSwitcher mode={mode} setMode={setMode} />
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
    sections: [
      { title: "The Problem", body: "The traditional barrier to enterprise software is years of learned experience — institutional knowledge that locks teams out of their own tools. New hires spend months getting up to speed rather than doing the work they were hired for." },
      { title: "The EZ Solution", body: "EZ Nexus serves as the central hub for all EZ products, creating one cohesive environment where every tool reinforces the next. Every interaction teaches. Every workflow builds fluency naturally. Your team accumulates real, transferable experience from day one — not after a two-year onboarding arc." },
      { title: "The Central Hub", body: "As the connective tissue of the EZ ecosystem, EZ Nexus provides a unified entry point, shared context, and consistent patterns across every product. What you learn in one EZ app instantly applies everywhere else." },
    ],
    points: ["Zero onboarding curve", "Cross-product knowledge transfer", "Skills built through use, not study", "Central hub architecture"],
  },
  {
    num: "02", label: "EASELIZABETH", color: "#b06aff",
    headline: "Your AI That Empowers",
    tagline: "The AI guide built to empower every person in your organisation",
    sections: [
      { title: "Who She Is", body: "EaseLizabeth is not a chatbot or a search bar with a personality. She is a contextually aware AI guide, deeply integrated across every EZ product and trained to understand your specific business environment and the workflows that matter most to your team." },
      { title: "How She Works", body: "EaseLizabeth surfaces the right information at the right moment — before you ask. She anticipates your next move, handles the cognitive load of navigation and discovery, and communicates exclusively in plain, everyday language. No jargon. No complexity theatre." },
      { title: "What She Can Do", body: "From answering product questions to initiating cross-app workflows, creating requests, summarising data, onboarding new users, and flagging issues before they escalate — EaseLizabeth is your always-available intelligent assistant." },
    ],
    points: ["Context-aware across all EZ products", "Plain-language interaction always", "Proactive — surfaces insights before you ask", "Capable of initiating cross-app actions"],
  },
  {
    num: "03", label: "SIMPLICITY", color: "#ff79c6",
    headline: "Down to Earth, By Design",
    tagline: "Every interface is presented in a down-to-earth, everyday manner",
    sections: [
      { title: "The Principle", body: "Every interface in EZ Cosmos is built on one non-negotiable rule: if it needs explaining, it needs redesigning. We don't hide complexity behind jargon — we eliminate it entirely so none of us ever need to study an app to know how to use it." },
      { title: "How It Shows Up", body: "Button labels say what they do. Navigation goes where you expect. Errors explain themselves. Settings are visible, not buried. Every EZ interface is peer-reviewed against one standard: can someone who has never seen this product navigate it confidently on day one?" },
      { title: "The Promise", body: "We all know what any given app can do. Now we all know how to make it do that. Simplicity is not a feature we add — it is the foundation every EZ product is built on, before a single line of code is written." },
    ],
    points: ["No jargon — ever", "Intuitive navigation by default", "Self-explanatory interfaces", "Zero manual required"],
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
          Three principles. One ecosystem. Every EZ product built upon them.
        </div>
      </div>

      <div style={{ width: "60%", height: 1, background: "linear-gradient(to right, transparent, rgba(123,47,255,0.5), transparent)" }} />

      <div style={{ display: "flex", gap: 14, width: "100%", flex: 1 }}>
        {PILLARS_DATA.map(p => (
          <div key={p.num} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 16px", background: `${p.color}07`, border: `1px solid ${p.color}22`, borderTop: `3px solid ${p.color}`, borderRadius: 12 }}>
            <div style={{ ...orb(36, 900), color: `${p.color}18`, lineHeight: 1, marginBottom: 6 }}>{p.num}</div>
            <div style={{ ...orb(11, 900), color: p.color, letterSpacing: "0.12em", marginBottom: 4 }}>{p.label}</div>
            <div style={{ ...orb(13, 800), color: PALETTE.text, marginBottom: 10 }}>{p.headline}</div>
            <div style={{ height: 1, width: "60%", background: `linear-gradient(to right, transparent, ${p.color}44, transparent)`, marginBottom: 10 }} />
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 12, color: PALETTE.muted, lineHeight: 1.6, flex: 1 }}>{p.tagline}</div>
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
    { label: "Company",          content: <PamphletPage0 /> },
    { label: "The 3 Pillars",    content: <PamphletPage1 /> },
    { label: "Pillar: Experience",   content: <PamphletPillarPage pillar={PILLARS_DATA[0]} /> },
    { label: "Pillar: EaseLizabeth", content: <PamphletPillarPage pillar={PILLARS_DATA[1]} /> },
    { label: "Pillar: Simplicity",   content: <PamphletPillarPage pillar={PILLARS_DATA[2]} /> },
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

function LoginScreen({ onLogin }: { onLogin: (isNew: boolean) => void }) {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [loadingSSO, setLoadingSSO] = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [ssoOpened, setSsoOpened]   = useState(false); // true once the auth tab was opened

  // Poll localStorage every 600ms as backup for the storage event
  useEffect(() => {
    if (!ssoOpened) return;
    const id = setInterval(() => {
      if (localStorage.getItem("ez_auth_complete") === "1") {
        localStorage.removeItem("ez_auth_complete");
        clearInterval(id);
        onLogin(true);
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

  const handleCredentialLogin = () => {
    if (!email.trim()) { setError("EMAIL ADDRESS REQUIRED"); return; }
    if (!password)     { setError("PASSWORD REQUIRED"); return; }
    setError(""); setLoading(true);
    openMicrosoftLogin(email.trim());
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
        onLogin(true);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [onLogin]);

  const fieldStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", background: "rgba(6,3,20,0.7)",
    border: "1px solid rgba(123,47,255,0.35)", borderRadius: 8,
    color: PALETTE.text, fontFamily: "Rajdhani, sans-serif", fontSize: 13,
    outline: "none", boxSizing: "border-box", letterSpacing: "0.02em",
    transition: "border-color 0.2s",
  };

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
              disabled={loadingSSO || loading}
              style={{ width: "100%", padding: "12px 0", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: loading ? "rgba(0,210,255,0.04)" : "linear-gradient(135deg, rgba(0,210,255,0.22), rgba(123,47,255,0.22))", border: "1px solid rgba(0,210,255,0.5)", borderRadius: 10, cursor: loadingSSO ? "default" : "pointer", boxShadow: loadingSSO ? "none" : "0 0 24px rgba(0,210,255,0.15)", transition: "all 0.2s" }}
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
                      onClick={() => onLogin(true)}
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

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, marginTop: ssoOpened ? 14 : 0 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(123,47,255,0.2)" }} />
              <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: 9, color: "rgba(160,185,255,0.3)", letterSpacing: "0.12em" }}>OR SIGN IN MANUALLY</span>
              <div style={{ flex: 1, height: 1, background: "rgba(123,47,255,0.2)" }} />
            </div>


            {/* Footer note */}
            <div style={{ textAlign: "center", marginTop: 18, fontFamily: "Rajdhani, sans-serif", fontSize: 9.5, color: "rgba(160,185,255,0.28)", lineHeight: 1.6 }}>
              Protected by EZ Nexus Authentication · Azure AD<br />
              New users will complete profile setup after login
            </div>
          </div>
        </div>
      </motion.div>
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

  const advance = () => {
    setError("");
    if (step === 0 && !role)    { setError("Please select a role to continue"); return; }
    if (step === 1 && !dept)    { setError("Please select your department"); return; }
    if (step === 2 && !subDept) { setError("Please select your sub-department"); return; }
    if (step < 2) { setStep(s => s + 1); } else { onComplete(); }
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
              <button onClick={onComplete} style={{ width: "100%", marginTop: 10, padding: "8px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "Rajdhani, sans-serif", fontSize: 10, color: "rgba(160,185,255,0.3)", letterSpacing: "0.08em" }}>
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

  const switchGalaxy = (g: Galaxy) => { setGalaxy(g); setCarouselPage(0); };
  const currentGalaxy = GALAXIES.find(g => g.id === galaxy)!;

  useEffect(() => {
    const hash = window.location.hash;

    // Azure redirected back with #id_token= in the URL — log in directly
    if (hash.includes("id_token=") || hash.includes("access_token=")) {
      window.history.replaceState({}, "", window.location.pathname);
      setIsLoggedIn(true);
      setShowOnboarding(true);
      try { localStorage.setItem("ez_auth_complete", "1"); } catch {}
      return;
    }

    // Fallback: storage event if another tab caught the token first
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ez_auth_complete" && e.newValue === "1") {
        localStorage.removeItem("ez_auth_complete");
        setIsLoggedIn(true);
        setShowOnboarding(true);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={(isNew) => { setIsLoggedIn(true); if (isNew) setShowOnboarding(true); }} />;
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

      {/* ── UI Layer ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <TopHUD mode={mode} setMode={setMode} />

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
