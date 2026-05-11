"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

export default function Contact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const botRef = useRef({
    eyeX: 0, eyeY: 0,
    bodyRotY: 0, bodyRotX: 0,
    floatY: 0, floatT: 0,
    antennaAngle: 0,
    blinkT: 0, blink: 1,
    nextBlink: 3,
    pupilScale: 1,
  });
  const animRef = useRef<number>(0);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
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

    function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const b = botRef.current;
      const m = mouseRef.current;

      ctx.clearRect(0, 0, W, H);

      // Float animation
      b.floatT += 0.02;
      b.floatY = Math.sin(b.floatT) * 8;
      b.antennaAngle = Math.sin(b.floatT * 1.3) * 0.12;

      // Smooth eye tracking
      b.eyeX = lerp(b.eyeX, m.x * 6, 0.08);
      b.eyeY = lerp(b.eyeY, m.y * 4, 0.08);
      b.bodyRotY = lerp(b.bodyRotY, m.x * 10, 0.05);
      b.bodyRotX = lerp(b.bodyRotX, m.y * 6, 0.05);

      // Blink
      b.blinkT += 0.016;
      if (b.blinkT > b.nextBlink) {
        b.blink = Math.max(0, b.blink - 0.15);
        if (b.blink === 0) { b.blink = 1; b.blinkT = 0; b.nextBlink = 2 + Math.random() * 4; }
      }

      const cx = W / 2;
      const cy = H / 2 + b.floatY;
      const skewX = b.bodyRotY * 0.3;
      const skewY = b.bodyRotX * 0.15;

      // Spotlight
      const spotGrad = ctx.createRadialGradient(cx + m.x * 40, cy - 80 + m.y * 20, 0, cx + m.x * 40, cy - 80 + m.y * 20, 260);
      spotGrad.addColorStop(0, "rgba(255,79,135,0.13)");
      spotGrad.addColorStop(0.5, "rgba(255,79,135,0.05)");
      spotGrad.addColorStop(1, "transparent");
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, W, H);

      // Shadow
      const shadowGrad = ctx.createRadialGradient(cx + skewX, cy + 130, 0, cx + skewX, cy + 130, 80);
      shadowGrad.addColorStop(0, "rgba(255,79,135,0.18)");
      shadowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(cx + skewX, cy + skewY);

      // ── NECK ──
      ctx.fillStyle = "#1a1a1a";
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      drawRoundRect(ctx, -8, 60, 16, 22, 4);
      ctx.fill(); ctx.stroke();

      // ── BODY ──
      const bodyGrad = ctx.createLinearGradient(-52, 70, 52, 150);
      bodyGrad.addColorStop(0, "#222");
      bodyGrad.addColorStop(1, "#111");
      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = "rgba(255,79,135,0.35)";
      ctx.lineWidth = 1.5;
      drawRoundRect(ctx, -52, 78, 104, 80, 18);
      ctx.fill(); ctx.stroke();

      // Body chest light
      const chestGrad = ctx.createRadialGradient(0, 112, 0, 0, 112, 30);
      chestGrad.addColorStop(0, "rgba(255,79,135,0.22)");
      chestGrad.addColorStop(1, "transparent");
      ctx.fillStyle = chestGrad;
      ctx.beginPath(); ctx.arc(0, 112, 30, 0, Math.PI * 2); ctx.fill();

      // Body panel lines
      ctx.strokeStyle = "rgba(255,79,135,0.15)";
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-38 + i * 26, 90); ctx.lineTo(-38 + i * 26, 148);
        ctx.stroke();
      }

      // Chest orb
      const orbGrad = ctx.createRadialGradient(-4, 108, 1, 0, 112, 14);
      orbGrad.addColorStop(0, "#ff85ad");
      orbGrad.addColorStop(0.5, "#ff4f87");
      orbGrad.addColorStop(1, "#8b0f3a");
      ctx.fillStyle = orbGrad;
      ctx.beginPath(); ctx.arc(0, 112, 13, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,133,173,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Orb shine
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath(); ctx.ellipse(-4, 107, 4, 2.5, -0.4, 0, Math.PI * 2); ctx.fill();

      // ── ARMS ──
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(side * 52, 100);
        ctx.rotate(side * (0.15 + Math.sin(b.floatT + (side === 1 ? 0.5 : 0)) * 0.06));

        // Upper arm
        const armGrad = ctx.createLinearGradient(0, 0, side * 20, 40);
        armGrad.addColorStop(0, "#222");
        armGrad.addColorStop(1, "#181818");
        ctx.fillStyle = armGrad;
        ctx.strokeStyle = "rgba(255,79,135,0.25)";
        ctx.lineWidth = 1;
        drawRoundRect(ctx, side * 2, 0, side * 18, 38, 8);
        ctx.fill(); ctx.stroke();

        // Hand
        const handGrad = ctx.createRadialGradient(side * 11, 42, 0, side * 11, 42, 12);
        handGrad.addColorStop(0, "#2a2a2a");
        handGrad.addColorStop(1, "#141414");
        ctx.fillStyle = handGrad;
        ctx.strokeStyle = "rgba(255,79,135,0.3)";
        ctx.beginPath(); ctx.arc(side * 11, 42, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      }

      // ── HEAD ──
      ctx.save();
      ctx.translate(0, -10);

      // Head glow
      const headGlow = ctx.createRadialGradient(b.eyeX * 0.5, -20, 0, b.eyeX * 0.5, -20, 70);
      headGlow.addColorStop(0, "rgba(255,79,135,0.08)");
      headGlow.addColorStop(1, "transparent");
      ctx.fillStyle = headGlow;
      ctx.beginPath(); ctx.arc(0, -20, 70, 0, Math.PI * 2); ctx.fill();

      // Head shape
      const headGrad = ctx.createLinearGradient(-50, -60, 50, 30);
      headGrad.addColorStop(0, "#252525");
      headGrad.addColorStop(1, "#141414");
      ctx.fillStyle = headGrad;
      ctx.strokeStyle = "rgba(255,79,135,0.45)";
      ctx.lineWidth = 1.5;
      drawRoundRect(ctx, -48, -58, 96, 88, 22);
      ctx.fill(); ctx.stroke();

      // Ear nodes
      for (const side of [-1, 1]) {
        ctx.fillStyle = "#1e1e1e";
        ctx.strokeStyle = "rgba(255,79,135,0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(side * 50, -18, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "rgba(255,79,135,0.6)";
        ctx.beginPath(); ctx.arc(side * 50, -18, 3, 0, Math.PI * 2); ctx.fill();
      }

      // ── EYES ──
      for (const side of [-1, 1]) {
        const ex = side * 17;
        const ey = -18;
        const eyeR = 14;

        // Eye socket
        const eyeGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, eyeR);
        eyeGrad.addColorStop(0, "#0a0a0a");
        eyeGrad.addColorStop(1, "#050505");
        ctx.fillStyle = eyeGrad;
        ctx.strokeStyle = "rgba(255,79,135,0.5)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(ex, ey, eyeR, eyeR * b.blink, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        if (b.blink > 0.1) {
          // Iris
          const irisX = ex + b.eyeX * 0.4;
          const irisY = ey + b.eyeY * 0.35;
          const irisGrad = ctx.createRadialGradient(irisX - 2, irisY - 2, 0, irisX, irisY, 8);
          irisGrad.addColorStop(0, "#ff85ad");
          irisGrad.addColorStop(0.5, "#ff4f87");
          irisGrad.addColorStop(1, "#6b0f2f");
          ctx.fillStyle = irisGrad;
          ctx.beginPath(); ctx.arc(irisX, irisY, 8, 0, Math.PI * 2); ctx.fill();

          // Pupil
          ctx.fillStyle = "#000";
          ctx.beginPath(); ctx.arc(irisX + b.eyeX * 0.1, irisY + b.eyeY * 0.1, 4, 0, Math.PI * 2); ctx.fill();

          // Shine
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.beginPath(); ctx.arc(irisX - 3, irisY - 3, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.beginPath(); ctx.arc(irisX + 3, irisY + 2, 1.2, 0, Math.PI * 2); ctx.fill();

          // Eye ring glow
          ctx.strokeStyle = "rgba(255,79,135,0.25)";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(irisX, irisY, 11, 0, Math.PI * 2); ctx.stroke();
        }
      }

      // ── MOUTH ──
      const smileAmt = 0.3 + Math.sin(b.floatT * 0.5) * 0.1;
      ctx.strokeStyle = "rgba(255,79,135,0.7)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-18, 14);
      ctx.quadraticCurveTo(0, 14 + smileAmt * 18, 18, 14);
      ctx.stroke();
      // Mouth glow dots
      for (const dx of [-18, 18]) {
        ctx.fillStyle = "rgba(255,79,135,0.6)";
        ctx.beginPath(); ctx.arc(dx, 14, 2, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore(); // head

      // ── ANTENNA ──
      ctx.save();
      ctx.translate(0, -68);
      ctx.rotate(b.antennaAngle);
      ctx.strokeStyle = "rgba(255,79,135,0.5)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -28); ctx.stroke();
      const antGrad = ctx.createRadialGradient(-2, -32, 0, 0, -32, 7);
      antGrad.addColorStop(0, "#ff85ad");
      antGrad.addColorStop(0.6, "#ff4f87");
      antGrad.addColorStop(1, "transparent");
      ctx.fillStyle = antGrad;
      ctx.beginPath(); ctx.arc(0, -32, 6, 0, Math.PI * 2); ctx.fill();
      // Antenna pulse ring
      const pulse = 0.5 + 0.5 * Math.sin(ts * 0.003);
      ctx.strokeStyle = `rgba(255,79,135,${0.5 * pulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, -32, 6 + pulse * 5, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      ctx.restore(); // main translate

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    // Replace with your actual form submission endpoint
    await new Promise(r => setTimeout(r, 1600));
    // To wire up: POST to your API route or Formspree/EmailJS etc.
    setStatus("sent");
  };

  return (
    <>
      <style>{`
        .contact-page {
          min-height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 4% 40px;
          gap: 0;
          overflow: hidden;
          position: relative;
        }

        .contact-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 50%, rgba(255,79,135,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 80% 30%, rgba(139,15,58,0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        .bot-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 520px;
        }

        .bot-canvas {
          width: 100%;
          max-width: 380px;
          height: 500px;
          display: block;
        }

        .bot-label {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Poppins', sans-serif;
          font-size: 0.72rem;
          color: rgba(255,79,135,0.5);
          letter-spacing: 2px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .form-panel {
          flex: 1;
          max-width: 480px;
          padding: 0 20px 0 40px;
        }

        .form-eyebrow {
          font-family: 'Poppins', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          color: #ff4f87;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 10px;
        }

        .form-title span { color: #ff4f87; }

        .form-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: 0.88rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.7;
          margin-bottom: 36px;
        }

        .form-subtitle a {
          color: #ff4f87;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,79,135,0.3);
          transition: border-color 0.2s;
        }
        .form-subtitle a:hover { border-color: #ff4f87; }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .field {
          position: relative;
        }

        .field label {
          display: block;
          font-family: 'Poppins', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .field.focused label { color: #ff4f87; }

        .field input,
        .field textarea {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.88rem;
          color: #fff;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          resize: none;
        }

        .field input::placeholder,
        .field textarea::placeholder { color: rgba(255,255,255,0.18); }

        .field input:hover,
        .field textarea:hover {
          border-color: rgba(255,79,135,0.25);
          background: rgba(255,255,255,0.04);
        }

        .field input:focus,
        .field textarea:focus {
          border-color: rgba(255,79,135,0.6);
          background: rgba(255,79,135,0.04);
          box-shadow: 0 0 0 3px rgba(255,79,135,0.08), 0 0 20px rgba(255,79,135,0.06);
        }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .submit-btn {
          width: 100%;
          padding: 15px 24px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #8b0f3a 0%, #c2185b 100%);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(139,15,58,0.3);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 30px rgba(194,24,91,0.4), 0 0 60px rgba(194,24,91,0.15);
        }
        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .submit-arrow {
          display: inline-flex;
          align-items: center;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .submit-btn:hover .submit-arrow { transform: translateX(4px); }

        .sent-state {
          text-align: center;
          padding: 32px 0;
          animation: fadeUp 0.4s ease;
        }

        .sent-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255,79,135,0.1);
          border: 1px solid rgba(255,79,135,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #ff4f87;
        }

        .sent-state h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 8px;
        }

        .sent-state p {
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
        }

        .social-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .social-row span {
          font-family: 'Poppins', sans-serif;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
          flex-shrink: 0;
        }

        .social-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          text-decoration: none;
          color: rgba(255,255,255,0.55);
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          transition: all 0.25s ease;
        }

        .social-pill:hover {
          border-color: rgba(255,79,135,0.4);
          color: #ff4f87;
          background: rgba(255,79,135,0.06);
        }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 860px) {
          .contact-page { flex-direction: column; padding: 100px 6% 60px; gap: 20px; }
          .bot-panel { min-height: 320px; }
          .bot-canvas { height: 320px; }
          .form-panel { padding: 0; max-width: 100%; width: 100%; }
          .form-title { font-size: 2rem; }
          .field-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <Navbar />

      <main className="contact-page">
        {/* ── BOT PANEL ── */}
        <div className="bot-panel">
          <canvas ref={canvasRef} className="bot-canvas" />
          <p className="bot-label">◈ AMAANAT-BOT · ONLINE</p>
        </div>

        {/* ── FORM PANEL ── */}
        <div className="form-panel">
          <p className="form-eyebrow">◈ Get in touch</p>
          <h1 className="form-title">Let&apos;s <span>connect.</span></h1>
          <p className="form-subtitle">
            Have a question, want to volunteer, or just say hello? Drop us a message
            or find us on{" "}
            <a href="https://www.instagram.com/project.amaanat/" target="_blank" rel="noopener noreferrer">
              @project.amaanat
            </a>.
          </p>

          {status === "sent" ? (
            <div className="sent-state">
              <div className="sent-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3>Message received!</h3>
              <p>We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <div className="field-row">
                  <div className={`field${focused === "name" ? " focused" : ""}`}>
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
                    />
                  </div>
                  <div className={`field${focused === "email" ? " focused" : ""}`}>
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
                    />
                  </div>
                </div>
                <div className={`field${focused === "message" ? " focused" : ""}`}>
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

              <button type="submit" className="submit-btn" disabled={status === "sending"}>
                {status === "sending" ? (
                  <><div className="spinner" /> Sending...</>
                ) : (
                  <>
                    Send message
                    <span className="submit-arrow">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="social-row">
            <span>or reach us on</span>
            <a href="https://www.instagram.com/project.amaanat/" target="_blank" rel="noopener noreferrer" className="social-pill">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
              @project.amaanat
            </a>
            <a href="mailto:projectamaanat@gmail.com" className="social-pill">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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