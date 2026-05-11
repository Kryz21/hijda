"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

/* ────────────────────────────────────────────────────────────
   IMPORTANT: Replace YOUR_FORMSPREE_ID below.
   1. Go to https://formspree.io → New Form → copy the form ID
   2. Paste it where it says YOUR_FORMSPREE_ID
   e.g. "https://formspree.io/f/xpzgdkqr"
──────────────────────────────────────────────────────────── */
const FORMSPREE_URL = "https://formspree.io/f/YOUR_FORMSPREE_ID";

/* ── Canvas robot (pink/dark theme) ── */
function RobotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const botRef = useRef({ eyeX: 0, eyeY: 0, floatT: 0, floatY: 0, blink: 1, blinkT: 0, nextBlink: 3, antennaAngle: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const cy = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      mouseRef.current = {
        x: (cx - rect.left - rect.width / 2) / (rect.width / 2),
        y: (cy - rect.top - rect.height / 2) / (rect.height / 2),
      };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function draw(ts: number) {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      const b = botRef.current, m = mouseRef.current;
      ctx.clearRect(0, 0, W, H);

      b.floatT += 0.018;
      b.floatY = Math.sin(b.floatT) * 7;
      b.antennaAngle = Math.sin(b.floatT * 1.4) * 0.1;
      b.eyeX = lerp(b.eyeX, m.x * 5, 0.07);
      b.eyeY = lerp(b.eyeY, m.y * 3.5, 0.07);

      b.blinkT += 0.016;
      if (b.blinkT > b.nextBlink) {
        b.blink = Math.max(0, b.blink - 0.18);
        if (b.blink === 0) { b.blink = 1; b.blinkT = 0; b.nextBlink = 2 + Math.random() * 4; }
      }

      const cx = W / 2, cy = H / 2 + b.floatY;

      // Glow halo
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
      halo.addColorStop(0, "rgba(255,79,135,0.07)");
      halo.addColorStop(1, "transparent");
      ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);

      // Shadow
      const shadowG = ctx.createRadialGradient(cx, cy + 140, 0, cx, cy + 140, 80);
      shadowG.addColorStop(0, "rgba(255,79,135,0.2)"); shadowG.addColorStop(1, "transparent");
      ctx.fillStyle = shadowG; ctx.fillRect(0, 0, W, H);

      ctx.save(); ctx.translate(cx, cy);

      // Neck
      ctx.fillStyle = "#1c1c1c"; ctx.strokeStyle = "rgba(255,79,135,0.2)"; ctx.lineWidth = 1;
      rr(ctx, -7, 58, 14, 20, 3); ctx.fill(); ctx.stroke();

      // Body
      const bG = ctx.createLinearGradient(-50, 75, 50, 158);
      bG.addColorStop(0, "#1e1e1e"); bG.addColorStop(1, "#111");
      ctx.fillStyle = bG; ctx.strokeStyle = "rgba(255,79,135,0.3)"; ctx.lineWidth = 1.5;
      rr(ctx, -50, 75, 100, 78, 17); ctx.fill(); ctx.stroke();

      // Chest orb
      const orbG = ctx.createRadialGradient(-3, 107, 1, 0, 110, 13);
      orbG.addColorStop(0, "#ff85ad"); orbG.addColorStop(0.5, "#ff4f87"); orbG.addColorStop(1, "#7a0f32");
      ctx.fillStyle = orbG; ctx.beginPath(); ctx.arc(0, 110, 13, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,133,173,0.4)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.beginPath(); ctx.ellipse(-4, 105, 4, 2.5, -0.4, 0, Math.PI * 2); ctx.fill();

      // Arms
      for (const s of [-1, 1]) {
        ctx.save(); ctx.translate(s * 50, 98);
        ctx.rotate(s * (0.15 + Math.sin(b.floatT + (s === 1 ? 0.5 : 0)) * 0.05));
        const aG = ctx.createLinearGradient(0, 0, s * 18, 36);
        aG.addColorStop(0, "#222"); aG.addColorStop(1, "#181818");
        ctx.fillStyle = aG; ctx.strokeStyle = "rgba(255,79,135,0.2)"; ctx.lineWidth = 1;
        rr(ctx, s * 2, 0, s * 17, 36, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#242424"; ctx.strokeStyle = "rgba(255,79,135,0.25)";
        ctx.beginPath(); ctx.arc(s * 10, 40, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      }

      // Head
      ctx.save(); ctx.translate(0, -10);
      const hG = ctx.createLinearGradient(-48, -56, 48, 28);
      hG.addColorStop(0, "#242424"); hG.addColorStop(1, "#141414");
      ctx.fillStyle = hG; ctx.strokeStyle = "rgba(255,79,135,0.45)"; ctx.lineWidth = 1.5;
      rr(ctx, -46, -56, 92, 86, 22); ctx.fill(); ctx.stroke();

      // Ear nodes
      for (const s of [-1, 1]) {
        ctx.fillStyle = "#1c1c1c"; ctx.strokeStyle = "rgba(255,79,135,0.4)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(s * 48, -16, 7.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "rgba(255,79,135,0.65)";
        ctx.beginPath(); ctx.arc(s * 48, -16, 3, 0, Math.PI * 2); ctx.fill();
      }

      // Eyes
      for (const s of [-1, 1]) {
        const ex = s * 16, ey = -18, eR = 13;
        const eG = ctx.createRadialGradient(ex, ey, 0, ex, ey, eR);
        eG.addColorStop(0, "#0a0a0a"); eG.addColorStop(1, "#050505");
        ctx.fillStyle = eG; ctx.strokeStyle = "rgba(255,79,135,0.5)"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(ex, ey, eR, eR * b.blink, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        if (b.blink > 0.1) {
          const ix = ex + b.eyeX * 0.4, iy = ey + b.eyeY * 0.3;
          const iG = ctx.createRadialGradient(ix - 2, iy - 2, 0, ix, iy, 7);
          iG.addColorStop(0, "#ff85ad"); iG.addColorStop(0.5, "#ff4f87"); iG.addColorStop(1, "#5e0f28");
          ctx.fillStyle = iG; ctx.beginPath(); ctx.arc(ix, iy, 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(ix + b.eyeX * 0.1, iy + b.eyeY * 0.1, 3.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.arc(ix - 2.5, iy - 2.5, 2, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Mouth
      const smile = 0.3 + Math.sin(b.floatT * 0.5) * 0.1;
      ctx.strokeStyle = "rgba(255,79,135,0.7)"; ctx.lineWidth = 1.8; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-16, 14); ctx.quadraticCurveTo(0, 14 + smile * 16, 16, 14); ctx.stroke();

      ctx.restore(); // head

      // Antenna
      ctx.save(); ctx.translate(0, -66); ctx.rotate(b.antennaAngle);
      ctx.strokeStyle = "rgba(255,79,135,0.45)"; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -26); ctx.stroke();
      const aG2 = ctx.createRadialGradient(-2, -30, 0, 0, -30, 6);
      aG2.addColorStop(0, "#ff85ad"); aG2.addColorStop(0.6, "#ff4f87"); aG2.addColorStop(1, "transparent");
      ctx.fillStyle = aG2; ctx.beginPath(); ctx.arc(0, -30, 6, 0, Math.PI * 2); ctx.fill();
      const pulse = 0.5 + 0.5 * Math.sin(ts * 0.0035);
      ctx.strokeStyle = `rgba(255,79,135,${0.5 * pulse})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, -30, 6 + pulse * 5, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      ctx.restore(); // main

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <canvas ref={canvasRef} style={{ width: "100%", maxWidth: 340, height: 420, display: "block" }} />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(255,79,135,0.5)", letterSpacing: "3px", textTransform: "uppercase" }}>
        ◈ AMAANAT-BOT · ONLINE
      </p>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --pink: #ff4f87;
          --pink-dim: rgba(255,79,135,0.12);
          --pink-glow: rgba(255,79,135,0.35);
          --black: #05050d;
          --surface: rgba(255,255,255,0.03);
          --border: rgba(255,79,135,0.15);
        }

        .c-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--black);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 90px 6% 60px;
          gap: 60px;
          position: relative;
          overflow: hidden;
        }

        .c-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 55% at 15% 55%, rgba(255,79,135,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 40% 50% at 85% 25%, rgba(139,15,58,0.07) 0%, transparent 60%);
          pointer-events: none;
        }

        /* ── BOT side ── */
        .c-bot { flex: 1; min-width: 0; display: flex; justify-content: center; align-items: center; position: relative; z-index: 1; }

        /* ── FORM side ── */
        .c-form-side {
          flex: 1;
          max-width: 500px;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.7s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: none; }
        }

        .c-eyebrow {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--pink);
          margin-bottom: 12px;
        }

        .c-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5vw, 3.4rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 14px;
        }

        .c-title span { font-style: italic; color: var(--pink); }

        .c-subtitle {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.42);
          line-height: 1.75;
          margin-bottom: 36px;
        }

        .c-subtitle a {
          color: var(--pink);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,79,135,0.3);
          transition: border-color 0.2s;
        }
        .c-subtitle a:hover { border-color: var(--pink); }

        /* Fields */
        .c-fields { display: flex; flex-direction: column; gap: 16px; margin-bottom: 22px; }
        .c-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .c-field { display: flex; flex-direction: column; gap: 7px; }

        .c-field label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          transition: color 0.2s;
        }

        .c-field.focused label { color: var(--pink); }

        .c-field input,
        .c-field textarea {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 13px 15px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          color: #fff;
          outline: none;
          resize: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          box-sizing: border-box;
        }

        .c-field input::placeholder,
        .c-field textarea::placeholder { color: rgba(255,255,255,0.18); }

        .c-field input:hover,
        .c-field textarea:hover {
          border-color: rgba(255,79,135,0.25);
          background: rgba(255,255,255,0.04);
        }

        .c-field input:focus,
        .c-field textarea:focus {
          border-color: rgba(255,79,135,0.6);
          background: rgba(255,79,135,0.04);
          box-shadow: 0 0 0 3px rgba(255,79,135,0.08), 0 0 20px rgba(255,79,135,0.06);
        }

        /* Button */
        .c-btn {
          width: 100%;
          padding: 15px 24px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #8b0f3a 0%, #c2185b 50%, #ff4f87 100%);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
          box-shadow: 0 4px 20px rgba(139,15,58,0.3);
          position: relative;
          overflow: hidden;
        }

        .c-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .c-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 12px 40px rgba(194,24,91,0.45), 0 0 60px rgba(194,24,91,0.15);
        }

        .c-btn:hover::after { opacity: 1; }
        .c-btn:active:not(:disabled) { transform: scale(0.98); }
        .c-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .c-arrow { display: inline-flex; align-items: center; transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .c-btn:hover .c-arrow { transform: translateX(5px); }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Success */
        .c-success {
          text-align: center;
          padding: 28px 0;
          animation: fadeUp 0.5s ease;
        }

        .c-success-icon {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: var(--pink-dim);
          border: 1px solid rgba(255,79,135,0.3);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          color: var(--pink);
        }

        .c-success h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .c-success p { font-size: 0.85rem; color: rgba(255,255,255,0.4); }

        /* Error */
        .c-error {
          background: rgba(255,79,79,0.08);
          border: 1px solid rgba(255,79,79,0.25);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 0.85rem;
          color: #ff7979;
          margin-bottom: 14px;
          text-align: center;
        }

        /* Social row */
        .c-social {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 22px;
          padding-top: 22px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-wrap: wrap;
        }

        .c-social span {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
          flex-shrink: 0;
        }

        .c-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          text-decoration: none;
          color: rgba(255,255,255,0.5);
          font-size: 0.78rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .c-pill:hover {
          border-color: rgba(255,79,135,0.4);
          color: var(--pink);
          background: var(--pink-dim);
        }

        /* Responsive */
        @media (max-width: 860px) {
          .c-root { flex-direction: column; padding: 100px 6% 60px; gap: 24px; }
          .c-bot canvas { height: 300px !important; max-width: 280px !important; }
          .c-row { grid-template-columns: 1fr; }
          .c-form-side { max-width: 100%; width: 100%; }
        }
      `}</style>

      <Navbar />

      <main className="c-root">
        {/* Robot */}
        <div className="c-bot">
          <RobotCanvas />
        </div>

        {/* Form */}
        <div className="c-form-side">
          <p className="c-eyebrow">◈ Get in touch</p>
          <h1 className="c-title">Let&apos;s <span>connect.</span></h1>
          <p className="c-subtitle">
            Have a question, want to volunteer, or just say hello? Drop us a message
            or find us on{" "}
            <a href="https://www.instagram.com/project.amaanat/" target="_blank" rel="noopener noreferrer">
              @project.amaanat
            </a>.
          </p>

          {status === "sent" ? (
            <div className="c-success">
              <div className="c-success-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3>Message received!</h3>
              <p>We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              {status === "error" && (
                <div className="c-error">
                  Something went wrong. Please try again or email us directly.
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="c-fields">
                  <div className="c-row">
                    <div className={`c-field${focused === "name" ? " focused" : ""}`}>
                      <label htmlFor="name">Your name</label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Annanya"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div className={`c-field${focused === "email" ? " focused" : ""}`}>
                      <label htmlFor="email">Email address</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className={`c-field${focused === "message" ? " focused" : ""}`}>
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us how you'd like to get involved, ask a question, or just say hi..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="c-btn" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <><div className="spinner" /> Sending...</>
                  ) : (
                    <>
                      Send message
                      <span className="c-arrow">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="c-social">
            <span>or reach us on</span>
            <a href="https://www.instagram.com/project.amaanat/" target="_blank" rel="noopener noreferrer" className="c-pill">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
              @project.amaanat
            </a>
            <a href="mailto:projectamaanat@gmail.com" className="c-pill">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Gmail
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
