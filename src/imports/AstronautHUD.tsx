import { useEffect, useRef, useState } from "react";
import type { PlanetProximity } from "./SpaceScene";

type CameraMode = "orbit" | "cinematic" | "guided";

interface AstronautHUDProps {
  mode: CameraMode;
  onModeChange: (mode: CameraMode) => void;
  onReset?: () => void;
  nearbyPlanet?: PlanetProximity | null;
  onEnterPlanet?: (planetName: string) => void;
}

function RadarScanner() {
  const radarRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const blipsRef = useRef<{ angle: number; dist: number; life: number; color: string }[]>([
    { angle: 0.8,  dist: 0.55, life: 1, color: "#cc3322" },
    { angle: 2.1,  dist: 0.72, life: 1, color: "#226688" },
    { angle: 3.6,  dist: 0.48, life: 1, color: "#aa7722" },
    { angle: 5.0,  dist: 0.65, life: 1, color: "#338833" },
    { angle: 0.0,  dist: 0.08, life: 1, color: "#2255ff" },
  ]);

  useEffect(() => {
    const canvas = radarRef.current;
    if (!canvas) return;
    let animId: number;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const R = W / 2 - 4;

      ctx.clearRect(0, 0, W, H);

      // background
      ctx.fillStyle = "rgba(0,4,20,0.85)";
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // concentric rings
      [0.33, 0.66, 1].forEach(f => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(74,138,255,0.18)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // cross hairs
      ctx.strokeStyle = "rgba(74,138,255,0.15)";
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

      // sweep trail
      const sweepAngle = angleRef.current;
      const trailLen = Math.PI * 0.55;
      const grad = ctx.createConicalGradient
        ? null // not standard — use manual approach
        : null;
      for (let i = 0; i < 48; i++) {
        const a = sweepAngle - (trailLen / 48) * i;
        const alpha = (1 - i / 48) * 0.22;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, a - trailLen / 48, a);
        ctx.closePath();
        ctx.fillStyle = `rgba(74,255,138,${alpha})`;
        ctx.fill();
      }

      // sweep line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * R, cy + Math.sin(sweepAngle) * R);
      ctx.strokeStyle = "rgba(74,255,138,0.9)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // blips — light up as sweep passes
      blipsRef.current.forEach(b => {
        const diff = ((sweepAngle - b.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.15) b.life = 1.0;
        b.life *= 0.985;
        if (b.life < 0.04) return;
        const bx = cx + Math.cos(b.angle) * R * b.dist;
        const by = cy + Math.sin(b.angle) * R * b.dist;
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.life;
        ctx.fill();
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // border
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(74,138,255,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      angleRef.current = (sweepAngle + 0.018) % (Math.PI * 2);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{
      background: "rgba(0,4,20,0.55)",
      border: "1px solid rgba(74,138,255,0.2)",
      padding: "12px 16px",
      backdropFilter: "blur(8px)",
      borderRadius: "2px",
    }}>
      <div style={{ color: "#4a8aff", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.2em", opacity: 0.5, marginBottom: "8px", borderBottom: "1px solid rgba(74,138,255,0.15)", paddingBottom: "4px" }}>
        SECTOR SCAN
      </div>
      <canvas
        ref={radarRef}
        width={130}
        height={130}
        style={{ display: "block" }}
      />
    </div>
  );
}

function SpaceCompass({ heading }: { heading: number }) {
  const compassRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = compassRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = W / 2 - 6;

    ctx.clearRect(0, 0, W, H);

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(74,138,255,0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.85, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(74,138,255,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Cardinal direction markers (N, E, S, W)
    const directions = [
      { label: "N", angle: -Math.PI / 2, color: "#cc3322" },
      { label: "E", angle: 0, color: "#226688" },
      { label: "S", angle: Math.PI / 2, color: "#aa7722" },
      { label: "W", angle: Math.PI, color: "#338833" },
    ];

    directions.forEach(({ label, angle, color }) => {
      // Tick mark
      const tickStart = R * 0.75;
      const tickEnd = R * 0.90;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * tickStart, cy + Math.sin(angle) * tickStart);
      ctx.lineTo(cx + Math.cos(angle) * tickEnd, cy + Math.sin(angle) * tickEnd);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Direction label
      ctx.save();
      ctx.translate(cx + Math.cos(angle) * (R + 12), cy + Math.sin(angle) * (R + 12));
      ctx.fillStyle = color;
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });

    // Heading indicator (needle)
    const headingRad = ((heading - 90) * Math.PI) / 180;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(headingRad);

    // Needle
    ctx.beginPath();
    ctx.moveTo(0, -R * 0.6);
    ctx.lineTo(-4, 0);
    ctx.lineTo(0, R * 0.15);
    ctx.lineTo(4, 0);
    ctx.closePath();
    ctx.fillStyle = "#4aff8a";
    ctx.fill();
    ctx.strokeStyle = "#2ad65f";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#4a8aff";
    ctx.fill();

    ctx.restore();

    // Degree markers
    for (let i = 0; i < 12; i++) {
      if (i % 3 === 0) continue; // Skip cardinal directions
      const a = (i * Math.PI) / 6 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82);
      ctx.lineTo(cx + Math.cos(a) * R * 0.90, cy + Math.sin(a) * R * 0.90);
      ctx.strokeStyle = "rgba(74,138,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [heading]);

  return (
    <div style={{
      background: "rgba(0,4,20,0.55)",
      border: "1px solid rgba(74,138,255,0.2)",
      padding: "12px 16px",
      backdropFilter: "blur(8px)",
      borderRadius: "2px",
    }}>
      <div style={{ color: "#4a8aff", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.2em", opacity: 0.5, marginBottom: "8px", borderBottom: "1px solid rgba(74,138,255,0.15)", paddingBottom: "4px" }}>
        NAVIGATION
      </div>
      <canvas
        ref={compassRef}
        width={140}
        height={140}
        style={{ display: "block" }}
      />
      <div style={{
        textAlign: "center",
        color: "#4aff8a",
        fontFamily: "monospace",
        fontSize: "11px",
        letterSpacing: "0.1em",
        marginTop: "8px"
      }}>
        {String(heading).padStart(3, "0")}°
      </div>
    </div>
  );
}

function TelemetryLine({ label, value, unit = "" }: { label: string; value: string | number; unit?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
      <span style={{ color: "#4a8aff", fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.12em", opacity: 0.7 }}>
        {label}
      </span>
      <span style={{ color: "#aaccff", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.08em" }}>
        {value}
        {unit && <span style={{ opacity: 0.5, fontSize: "9px" }}> {unit}</span>}
      </span>
    </div>
  );
}

export function AstronautHUD({ mode, onModeChange, onReset, nearbyPlanet, onEnterPlanet }: AstronautHUDProps) {
  const [time, setTime] = useState(new Date());
  const [altitude, setAltitude] = useState(408.2);
  const [velocity, setVelocity] = useState(7.66);
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [heading, setHeading] = useState(127);
  const [oxygen, setOxygen] = useState(98.7);
  const [signal, setSignal] = useState(94);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle Enter key press when near a planet
  useEffect(() => {
    if (!nearbyPlanet || !onEnterPlanet) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && nearbyPlanet) {
        onEnterPlanet(nearbyPlanet.name);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nearbyPlanet, onEnterPlanet]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setAltitude(v => parseFloat((v + (Math.random() - 0.5) * 0.3).toFixed(1)));
      setVelocity(v => parseFloat((v + (Math.random() - 0.5) * 0.02).toFixed(2)));
      setPitch(v => parseFloat((v + (Math.random() - 0.5) * 0.4).toFixed(1)));
      setRoll(v => parseFloat((v + (Math.random() - 0.5) * 0.3).toFixed(1)));
      setHeading(v => Math.round((v + (Math.random() - 0.5) * 0.5 + 360) % 360));
      setOxygen(v => Math.min(100, Math.max(85, parseFloat((v + (Math.random() - 0.5) * 0.05).toFixed(1)))));
      setSignal(v => Math.min(100, Math.max(80, Math.round(v + (Math.random() - 0.5) * 0.8))));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Draw visor lens overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const cw = canvas.width;
    const ch = canvas.height;
    const cx = cw / 2;
    const cy = ch / 2;

    // Create oval/rounded vignette (wider horizontally to simulate visor)
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, cw, ch);

    // Outer dark border (rounded viewport frame) - expanded to occupy more space
    const vignetteOval = ctx.createRadialGradient(cx, cy, Math.min(cw, ch) * 0.5, cx, cy, Math.min(cw, ch) * 0.72);
    vignetteOval.addColorStop(0, "rgba(0,0,0,0)");
    vignetteOval.addColorStop(0.75, "rgba(0,2,8,0.2)");
    vignetteOval.addColorStop(1, "rgba(0,2,8,0.7)");
    ctx.fillStyle = vignetteOval;
    ctx.fillRect(0, 0, cw, ch);

    // Subtle blue tint reflection (top arc)
    const reflection = ctx.createLinearGradient(0, 0, cw, ch * 0.35);
    reflection.addColorStop(0, "rgba(80,150,255,0.04)");
    reflection.addColorStop(0.5, "rgba(80,150,255,0.08)");
    reflection.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = reflection;
    ctx.fillRect(0, 0, cw, ch * 0.45);

    // Subtle scratches/imperfections
    ctx.strokeStyle = "rgba(200,220,255,0.03)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * cw;
      const y = Math.random() * ch;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 25);
      ctx.stroke();
    }

    // Draw rounded viewport frame border (simulating helmet visor edge) - larger oval
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1.5, 1.05); // Wider and taller ellipse for max visibility
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(cw, ch) * 0.62, 0, Math.PI * 2);
    ctx.restore();
    ctx.strokeStyle = "rgba(40,80,120,0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner subtle glow
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1.5, 1.05);
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(cw, ch) * 0.61, 0, Math.PI * 2);
    ctx.restore();
    ctx.strokeStyle = "rgba(74,138,255,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, []);

  const formatTime = (d: Date) =>
    `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}:${String(d.getUTCSeconds()).padStart(2, "0")} UTC`;

  const modeColors: Record<CameraMode, string> = {
    orbit: "#4a8aff",
    cinematic: "#ff4a8a",
    guided: "#4affa0",
  };

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", userSelect: "none", zIndex: 10 }}>
      {/* Canvas lens overlay */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />

      {/* Top telemetry bar - streamlined */}
      <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "40px", background: "rgba(0,4,20,0.6)", border: "1px solid rgba(74,138,255,0.25)", padding: "10px 32px", borderRadius: "2px", backdropFilter: "blur(12px)" }}>
        {/* Mode indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: modeColors[mode], boxShadow: `0 0 8px ${modeColors[mode]}` }} />
          <span style={{ color: modeColors[mode], fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em" }}>
            {mode.toUpperCase()}
          </span>
        </div>

        <div style={{ width: "1px", height: "20px", background: "rgba(74,138,255,0.2)" }} />

        {/* Altitude */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ color: "#4a8aff", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.15em", opacity: 0.6 }}>ALT</span>
          <span style={{ color: "#aaccff", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.05em" }}>{altitude}</span>
        </div>

        {/* Velocity */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ color: "#4a8aff", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.15em", opacity: 0.6 }}>VEL</span>
          <span style={{ color: "#aaccff", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.05em" }}>{velocity}</span>
        </div>

        <div style={{ width: "1px", height: "20px", background: "rgba(74,138,255,0.2)" }} />

        {/* Heading - centered emphasis */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ color: "#4a8aff", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.15em", opacity: 0.6 }}>HDG</span>
          <span style={{ color: "#4aff8a", fontFamily: "monospace", fontSize: "14px", letterSpacing: "0.1em", fontWeight: 500 }}>
            {String(heading).padStart(3, "0")}°
          </span>
        </div>

        <div style={{ width: "1px", height: "20px", background: "rgba(74,138,255,0.2)" }} />

        {/* O2 */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ color: "#4a8aff", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.15em", opacity: 0.6 }}>O2</span>
          <span style={{ color: "#aaccff", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.05em" }}>{oxygen}%</span>
        </div>

        {/* Signal */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#4a8aff", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.15em", opacity: 0.6 }}>SIG</span>
          <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{
                width: "2px",
                height: `${5 + i * 2}px`,
                background: i < Math.round(signal / 20) ? "#4aff8a" : "rgba(74,255,138,0.2)",
                borderRadius: "1px",
              }} />
            ))}
          </div>
        </div>

        <div style={{ width: "1px", height: "20px", background: "rgba(74,138,255,0.2)" }} />

        {/* Time */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ color: "#4a8aff", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.15em", opacity: 0.6 }}>UTC</span>
          <span style={{ color: "#aaccff", fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.05em" }}>{formatTime(time)}</span>
        </div>
      </div>

      {/* Left side: compass + telemetry + EZ Cosmos panels */}
      <div style={{ position: "absolute", left: "24px", top: "50%", transform: "translateY(-62%)", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Compass panel */}
        <SpaceCompass heading={heading} />

        {/* Telemetry panel */}
        <div style={{
          background: "rgba(0,4,20,0.55)",
          border: "1px solid rgba(74,138,255,0.2)",
          padding: "12px 16px",
          backdropFilter: "blur(8px)",
          borderRadius: "2px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}>
          <div style={{ color: "#4a8aff", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.2em", opacity: 0.5, marginBottom: "4px", borderBottom: "1px solid rgba(74,138,255,0.15)", paddingBottom: "4px" }}>
            TELEMETRY
          </div>
          <TelemetryLine label="ALT" value={altitude} unit="km" />
          <TelemetryLine label="VEL" value={velocity} unit="km/s" />
          <TelemetryLine label="O2" value={oxygen} unit="%" />
          <TelemetryLine label="TEMP" value="-270.4" unit="C" />
          <TelemetryLine label="GRAV" value="0.000" unit="g" />
          <TelemetryLine label="DIST" value="384,400" unit="km" />
        </div>

        {/* EZ Cosmos / Telmeret panel */}
        <div style={{
          background: "rgba(0,4,20,0.55)",
          border: "1px solid rgba(74,138,255,0.2)",
          padding: "12px 16px",
          backdropFilter: "blur(8px)",
          borderRadius: "2px",
          display: "flex",
          flexDirection: "column",
          gap: "7px",
        }}>
          <div style={{ color: "#4a8aff", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.2em", opacity: 0.5, marginBottom: "4px", borderBottom: "1px solid rgba(74,138,255,0.15)", paddingBottom: "4px" }}>
            EZ COSMOS
          </div>
          {[
            { name: "EZ Command Center", color: "#2255ff" },
            { name: "EZ-PM",             color: "#cc3322" },
            { name: "EZ-TicketConsole",  color: "#226688" },
            { name: "EZ-Orchestrator",   color: "#aa7722" },
            { name: "EZ-Custom",         color: "#338833" },
          ].map(({ name, color }) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: color,
                boxShadow: `0 0 6px ${color}`,
                flexShrink: 0,
              }} />
              <span style={{ color: "#aaccff", fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.08em" }}>
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Radar scanner */}
        <RadarScanner />
      </div>

      {/* Right side status list */}
      <div style={{ position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "14px", alignItems: "flex-end" }}>
        {["ORBIT STABLE", "HULL INTEGRITY 100%", "LIFE SUPPORT OK", "NAV LOCK ENGAGED"].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#aaccff", fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.1em", opacity: 0.6 }}>
              {item}
            </span>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4aff8a", boxShadow: "0 0 6px #4aff8a" }} />
          </div>
        ))}
      </div>

      {/* Center targeting reticle */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ overflow: "visible" }}>
          {/* Crosshairs extending beyond reticle */}
          <line x1="0" y1="100" x2="60" y2="100" stroke="rgba(74,138,255,0.3)" strokeWidth="1" />
          <line x1="140" y1="100" x2="200" y2="100" stroke="rgba(74,138,255,0.3)" strokeWidth="1" />
          <line x1="100" y1="0" x2="100" y2="60" stroke="rgba(74,138,255,0.3)" strokeWidth="1" />
          <line x1="100" y1="140" x2="100" y2="200" stroke="rgba(74,138,255,0.3)" strokeWidth="1" />

          {/* Outer ring */}
          <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(74,138,255,0.35)" strokeWidth="1.5" />

          {/* Mid ring */}
          <circle cx="100" cy="100" r="35" fill="none" stroke="rgba(74,138,255,0.4)" strokeWidth="1.2" />

          {/* Inner ring */}
          <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(74,138,255,0.5)" strokeWidth="1" />

          {/* Center dot */}
          <circle cx="100" cy="100" r="3" fill="rgba(74,255,138,0.8)" />
          <circle cx="100" cy="100" r="5" fill="none" stroke="rgba(74,255,138,0.4)" strokeWidth="1" />

          {/* Tick marks on outer ring (12 positions like a clock) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
            const r1 = 50;
            const r2 = i % 3 === 0 ? 42 : 46; // Longer ticks at cardinal positions
            const x1 = 100 + Math.cos(angle) * r1;
            const y1 = 100 + Math.sin(angle) * r1;
            const x2 = 100 + Math.cos(angle) * r2;
            const y2 = 100 + Math.sin(angle) * r2;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i % 3 === 0 ? "rgba(74,138,255,0.6)" : "rgba(74,138,255,0.35)"}
                strokeWidth={i % 3 === 0 ? "2" : "1"}
              />
            );
          })}

          {/* Small corner brackets at cardinal directions */}
          {[0, 90, 180, 270].map((deg) => {
            const angle = (deg * Math.PI) / 180 - Math.PI / 2;
            const r = 58;
            const cx = 100 + Math.cos(angle) * r;
            const cy = 100 + Math.sin(angle) * r;
            return (
              <g key={deg}>
                <line
                  x1={cx - 4}
                  y1={cy - 4}
                  x2={cx - 4}
                  y2={cy + 4}
                  stroke="rgba(74,138,255,0.5)"
                  strokeWidth="1"
                />
                <line
                  x1={cx - 4}
                  y1={cy - 4}
                  x2={cx + 4}
                  y2={cy - 4}
                  stroke="rgba(74,138,255,0.5)"
                  strokeWidth="1"
                />
              </g>
            );
          })}

        </svg>
      </div>

      {/* Landing Prompt - appears when near a planet */}
      {nearbyPlanet && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -180px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          pointerEvents: "auto",
          animation: "pulseIn 0.4s ease-out",
        }}>
          {/* Distance indicator */}
          <div style={{
            background: "rgba(0,4,20,0.85)",
            border: `1px solid ${nearbyPlanet.color}44`,
            padding: "6px 14px",
            borderRadius: "2px",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{
              color: nearbyPlanet.color,
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              opacity: 0.7,
            }}>
              DISTANCE: {nearbyPlanet.distance.toFixed(1)} km
            </div>
          </div>

          {/* Main landing prompt */}
          <button
            onClick={() => onEnterPlanet?.(nearbyPlanet.name)}
            style={{
              background: `linear-gradient(135deg, rgba(0,4,20,0.9), rgba(0,8,30,0.95))`,
              border: `2px solid ${nearbyPlanet.color}`,
              padding: "16px 32px",
              borderRadius: "4px",
              backdropFilter: "blur(12px)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: `0 0 20px ${nearbyPlanet.color}44, inset 0 0 20px ${nearbyPlanet.color}11`,
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = `0 0 30px ${nearbyPlanet.color}88, inset 0 0 30px ${nearbyPlanet.color}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = `0 0 20px ${nearbyPlanet.color}44, inset 0 0 20px ${nearbyPlanet.color}11`;
            }}
          >
            {/* Animated border shimmer */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, transparent, ${nearbyPlanet.color}33, transparent)`,
              animation: "shimmer 2s infinite",
            }} />

            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{
                color: nearbyPlanet.color,
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "0.3em",
                opacity: 0.8,
              }}>
                PRESS ENTER TO ACCESS
              </div>
              <div style={{
                color: "#ffffff",
                fontFamily: "monospace",
                fontSize: "20px",
                letterSpacing: "0.15em",
                fontWeight: 700,
                textShadow: `0 0 10px ${nearbyPlanet.color}`,
              }}>
                {nearbyPlanet.name}
              </div>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: nearbyPlanet.color,
                boxShadow: `0 0 12px ${nearbyPlanet.color}`,
                marginTop: "4px",
              }} />
            </div>
          </button>

          {/* Approach indicator chevrons */}
          <div style={{ display: "flex", gap: "6px", opacity: 0.5 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "12px",
                  height: "12px",
                  border: `2px solid ${nearbyPlanet.color}`,
                  borderTop: "none",
                  borderLeft: "none",
                  transform: "rotate(45deg)",
                  animation: `bounce 1.2s infinite ease-in-out ${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseIn {
          from {
            opacity: 0;
            transform: translate(-50%, -200px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -180px) scale(1);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bounce {
          0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.3; }
          50% { transform: rotate(45deg) translateY(-4px); opacity: 1; }
        }
      `}</style>

      {/* Bottom mode switcher + reset — pointer-events ON */}
      <div style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", pointerEvents: "auto", alignItems: "center" }}>
        {(["orbit", "cinematic", "guided"] as CameraMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            style={{
              background: mode === m ? `${modeColors[m]}22` : "rgba(0,4,20,0.6)",
              border: `1px solid ${mode === m ? modeColors[m] : "rgba(74,138,255,0.2)"}`,
              color: mode === m ? modeColors[m] : "rgba(170,204,255,0.5)",
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
              padding: "6px 16px",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
              borderRadius: "2px",
            }}
          >
            {m.toUpperCase()}
          </button>
        ))}

        {/* Reset button */}
        {onReset && (
          <button
            onClick={onReset}
            style={{
              background: "rgba(0,4,20,0.6)",
              border: "1px solid rgba(74,255,138,0.3)",
              color: "#4aff8a",
              fontFamily: "monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
              padding: "6px 16px",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(74,255,138,0.15)";
              e.currentTarget.style.borderColor = "#4aff8a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,4,20,0.6)";
              e.currentTarget.style.borderColor = "rgba(74,255,138,0.3)";
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            RESET
          </button>
        )}
      </div>

      {/* Corner bracket decorations */}
      <div style={{ position: "absolute", width: "20px", height: "20px", top: "16px", left: "16px", borderTop: "1px solid rgba(74,138,255,0.4)", borderLeft: "1px solid rgba(74,138,255,0.4)" }} />
      <div style={{ position: "absolute", width: "20px", height: "20px", top: "16px", right: "16px", borderTop: "1px solid rgba(74,138,255,0.4)", borderRight: "1px solid rgba(74,138,255,0.4)" }} />
      <div style={{ position: "absolute", width: "20px", height: "20px", bottom: "16px", left: "16px", borderBottom: "1px solid rgba(74,138,255,0.4)", borderLeft: "1px solid rgba(74,138,255,0.4)" }} />
      <div style={{ position: "absolute", width: "20px", height: "20px", bottom: "16px", right: "16px", borderBottom: "1px solid rgba(74,138,255,0.4)", borderRight: "1px solid rgba(74,138,255,0.4)" }} />
    </div>
  );
}
