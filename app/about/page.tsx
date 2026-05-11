"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import type { Metadata } from "next";

// Note: remove this export if "use client" causes issues — move metadata to a separate layout
// export const metadata: Metadata = { title: "About Us | Project Amaanat" };

/* ─── Floating particles background ─── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const particles: { x: number; y: number; r: number; vx: number; vy: number; o: number }[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.5 + 0.1,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,79,135,${p.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* ─── Intersection observer hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(start);
    }, 20);
    return () => clearInterval(id);
  }, [visible, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 200, suffix: "+", label: "Children Reached" },
  { value: 12, suffix: "+", label: "Partner Orphanages" },
  { value: 3, suffix: " yrs", label: "Of Impact" },
  { value: 50, suffix: "+", label: "Young Volunteers" },
];

const pillars = [
  {
    icon: "🌍",
    title: "Community Reach",
    desc: "Connecting generous hearts with communities that need support most — from Delhi to rural villages across India.",
  },
  {
    icon: "✨",
    title: "Youth Leadership",
    desc: "Empowering students and young changemakers to take initiative and create tangible, lasting social impact.",
  },
  {
    icon: "🤝",
    title: "Real Change",
    desc: "Practical support, educational access, and a more hopeful future for children who deserve better opportunities.",
  },
];

export default function About() {
  const hero = useReveal();
  const missionRef = useReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --pink: #ff4f87;
          --pink-dim: rgba(255,79,135,0.15);
          --pink-glow: rgba(255,79,135,0.35);
          --black: #05050d;
          --surface: rgba(255,255,255,0.03);
          --border: rgba(255,79,135,0.15);
        }

        .about-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--black);
          color: #fff;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .a-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 6% 80px;
          z-index: 1;
        }

        .a-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .a-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border);
          background: var(--pink-dim);
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--pink);
          margin-bottom: 28px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .a-badge.visible { opacity: 1; transform: none; }

        .a-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 700;
          line-height: 1.05;
          margin-bottom: 24px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }

        .a-h1.visible { opacity: 1; transform: none; }

        .a-h1 em {
          font-style: italic;
          background: linear-gradient(135deg, #ff4f87, #ff85ad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .a-sub {
          font-size: 1.05rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.55);
          max-width: 480px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }

        .a-sub.visible { opacity: 1; transform: none; }

        .a-btns {
          display: flex;
          gap: 14px;
          margin-top: 36px;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s;
        }

        .a-btns.visible { opacity: 1; transform: none; }

        .btn-primary {
          padding: 14px 28px;
          background: var(--pink);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.25s, box-shadow 0.25s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px var(--pink-glow);
        }

        .btn-ghost {
          padding: 14px 28px;
          background: var(--surface);
          color: rgba(255,255,255,0.7);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition: border-color 0.25s, color 0.25s;
        }

        .btn-ghost:hover { border-color: var(--pink); color: var(--pink); }

        /* ── GLASS CARD ── */
        .a-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 40px;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateX(40px) rotateY(8deg);
          transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .a-card.visible {
          opacity: 1;
          transform: translateX(0) rotateY(0deg);
        }

        .a-card:hover {
          border-color: rgba(255,79,135,0.35);
          transform: translateY(-6px) rotateY(-2deg);
          box-shadow: 0 30px 80px rgba(255,79,135,0.12);
        }

        .a-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(255,79,135,0.15), transparent, rgba(255,133,173,0.08));
          pointer-events: none;
        }

        .card-icon-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }

        .card-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: var(--pink-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }

        .card-h { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; }
        .card-sub { font-size: 0.82rem; color: rgba(255,255,255,0.4); margin-top: 2px; }

        .card-body { font-size: 0.95rem; line-height: 1.85; color: rgba(255,255,255,0.6); }

        .card-body strong { color: var(--pink); font-weight: 600; }

        .card-divider {
          height: 1px;
          background: var(--border);
          margin: 24px 0;
        }

        .card-quote {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.05rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.7;
        }

        /* ── STATS ── */
        .a-stats {
          position: relative;
          z-index: 1;
          padding: 60px 6%;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          backdrop-filter: blur(12px);
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,79,135,0.4);
          box-shadow: 0 20px 60px rgba(255,79,135,0.1);
        }

        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.2rem;
          font-weight: 700;
          color: var(--pink);
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* ── PILLARS ── */
        .a-pillars {
          position: relative;
          z-index: 1;
          padding: 80px 6%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--pink);
          margin-bottom: 16px;
        }

        .section-h {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          margin-bottom: 56px;
          max-width: 500px;
          line-height: 1.15;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .pillar {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 36px 28px;
          backdrop-filter: blur(12px);
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s;
          cursor: default;
        }

        .pillar.visible { opacity: 1; transform: none; }
        .pillar:nth-child(2) { transition-delay: 0.1s; }
        .pillar:nth-child(3) { transition-delay: 0.2s; }

        .pillar:hover {
          border-color: rgba(255,79,135,0.4);
          box-shadow: 0 24px 60px rgba(255,79,135,0.1);
          transform: translateY(-4px);
        }

        .pillar-icon {
          font-size: 2rem;
          margin-bottom: 20px;
          display: block;
          filter: drop-shadow(0 0 12px rgba(255,79,135,0.4));
          transition: transform 0.3s;
        }

        .pillar:hover .pillar-icon { transform: scale(1.2) rotate(-8deg); }

        .pillar-h { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 14px; }
        .pillar-p { font-size: 0.92rem; line-height: 1.8; color: rgba(255,255,255,0.55); }

        /* ── MISSION BANNER ── */
        .a-mission {
          position: relative;
          z-index: 1;
          margin: 0 6% 100px;
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(255,79,135,0.08), rgba(255,79,135,0.02));
          backdrop-filter: blur(20px);
          padding: 80px 72px;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .a-mission.visible { opacity: 1; transform: none; }

        .a-mission::before {
          content: '"';
          position: absolute;
          top: -20px;
          left: 48px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18rem;
          line-height: 1;
          color: rgba(255,79,135,0.06);
          pointer-events: none;
          user-select: none;
        }

        .mission-inner { position: relative; z-index: 1; max-width: 720px; }

        .mission-h {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .mission-h em {
          font-style: italic;
          background: linear-gradient(135deg, #ff4f87, #ff85ad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mission-p { font-size: 1rem; line-height: 1.9; color: rgba(255,255,255,0.6); max-width: 600px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .a-hero-inner { grid-template-columns: 1fr; gap: 40px; }
          .a-card { transform: translateY(30px) !important; }
          .a-stats { grid-template-columns: repeat(2, 1fr); }
          .pillars-grid { grid-template-columns: 1fr; }
          .a-mission { padding: 48px 32px; margin-bottom: 60px; }
        }

        @media (max-width: 540px) {
          .a-stats { grid-template-columns: 1fr 1fr; }
          .a-mission { margin: 0 4% 60px; padding: 40px 24px; }
        }
      `}</style>

      <ParticleCanvas />
      <div className="about-root">
        <Navbar />

        {/* ── HERO ── */}
        <section className="a-hero">
          <div className="a-hero-inner">
            {/* Left */}
            <div ref={hero.ref}>
              <div className={`a-badge ${hero.visible ? "visible" : ""}`}>◈ Youth-Led Initiative</div>
              <h1 className={`a-h1 ${hero.visible ? "visible" : ""}`}>
                Turning<br /><em>compassion</em><br />into impact.
              </h1>
              <p className={`a-sub ${hero.visible ? "visible" : ""}`}>
                Project Amaanat is a youth-driven NGO focused on improving access to
                education, support, and opportunities for orphaned and underprivileged
                children across India.
              </p>
              <div className={`a-btns ${hero.visible ? "visible" : ""}`}>
                <button className="btn-primary">Join Our Mission</button>
                <button className="btn-ghost">Learn More ↓</button>
              </div>
            </div>

            {/* Glass card */}
            <div className={`a-card ${hero.visible ? "visible" : ""}`}>
              <div className="card-icon-row">
                <div className="card-icon">🤝</div>
                <div>
                  <div className="card-h">Our Purpose</div>
                  <div className="card-sub">Building futures through empathy.</div>
                </div>
              </div>
              <div className="card-body">
                <p>
                  Founded by{" "}
                  <strong>Annanya</strong> alongside co-founder{" "}
                  <strong>Kriday Anand</strong>, Project Amaanat believes that
                  meaningful change begins with collective action.
                </p>
              </div>
              <div className="card-divider" />
              <p className="card-quote">
                &ldquo;Some trash is someone&rsquo;s treasure.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="a-stats">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-num">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── PILLARS ── */}
        <section className="a-pillars">
          <p className="section-label">◈ What we do</p>
          <h2 className="section-h">Three pillars that drive our work</h2>
          <div className="pillars-grid">
            {pillars.map((p, i) => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const r = useReveal();
              return (
                <div key={i} ref={r.ref} className={`pillar ${r.visible ? "visible" : ""}`}>
                  <span className="pillar-icon">{p.icon}</span>
                  <div className="pillar-h">{p.title}</div>
                  <p className="pillar-p">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── MISSION BANNER ── */}
        <div ref={missionRef.ref} className={`a-mission ${missionRef.visible ? "visible" : ""}`}>
          <div className="mission-inner">
            <p className="section-label">◈ Our Mission</p>
            <h2 className="mission-h">
              Small actions can create<br /><em>lifelong impact.</em>
            </h2>
            <p className="mission-p">
              We aim to transform compassion into meaningful action by building a bridge
              between those who wish to help and children who deserve better opportunities,
              resources, and care. Every donation, every volunteer hour, every shared post
              creates a ripple that changes lives.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
