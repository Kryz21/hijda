"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

const delhiTeam = [
  { name: "Shreekant", role: "President", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { name: "Ambreen", role: "President", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { name: "Harvir", role: "Secretary Head", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { name: "Aadya", role: "Co-Secretary", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { name: "Vansh", role: "Finance Head", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { name: "Rooney", role: "Finance Head", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { name: "Advika", role: "Social Media Head", icon: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" },
  { name: "Tanish", role: "PR / Outreach Head", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
  { name: "Vedant", role: "Marketing Head", icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { name: "Aryan", role: "Marketing Head", icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { name: "Siddhi", role: "Organiser", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { name: "Trisha", role: "Organiser", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { name: "Aaira", role: "Organiser", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
];

const hyderabadTeam = [
  { name: "Kriday", role: "President", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { name: "Aishwarya", role: "Secretary Head", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { name: "Azaliah", role: "Organiser", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { name: "Kiara", role: "Co Secretary", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { name: "Eliza", role: "Creative Head", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { name: "Joshika", role: "Social Media Head", icon: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" },
  { name: "Naasir", role: "Social Media Head", icon: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" },
  { name: "Kaku", role: "Marketing Head", icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { name: "Kruthi", role: "Action Head", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
];

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function MemberCard({ member, index }: { member: typeof delhiTeam[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 60);
    return () => clearTimeout(t);
  }, [index]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 16, y: (x - 0.5) * -16 });
    setGlow({ x: x * 100, y: y * 100 });
  };

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`mc${hovered ? " mc-h" : ""}${visible ? " mc-v" : ""}`}
      style={{
        transform: hovered
          ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) scale(1.02)`
          : "perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)",
        "--gx": `${glow.x}%`,
        "--gy": `${glow.y}%`,
        transitionDelay: visible ? "0ms" : `${index * 60}ms`,
      } as React.CSSProperties}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
    >
      <div className="mc-glow" />
      <div className="mc-shine" />

      <div className="mc-avatar">
        <span className="mc-initials">{getInitials(member.name)}</span>
        <div className="mc-avatar-ring" />
      </div>

      <div className="mc-icon">
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d={member.icon} />
        </svg>
      </div>

      <h2 className="mc-name">{member.name}</h2>
      <p className="mc-role">{member.role}</p>

      <div className="mc-bottom-line" />
    </div>
  );
}

function FounderCard({ name, title, index }: { name: string; title: string; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 14, y: (x - 0.5) * -14 });
    setGlow({ x: x * 100, y: y * 100 });
  };

  return (
    <div
      ref={cardRef}
      className={`fc${hovered ? " fc-h" : ""}`}
      style={{
        transform: hovered
          ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px) scale(1.03)`
          : "perspective(600px) rotateX(0) rotateY(0) translateY(0) scale(1)",
        "--gx": `${glow.x}%`,
        "--gy": `${glow.y}%`,
        animationDelay: `${index * 120}ms`,
      } as React.CSSProperties}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
    >
      <div className="fc-glow" />
      <div className="fc-shine" />

      <div className="fc-crown">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      <div className="fc-avatar">
        <span>{getInitials(name)}</span>
        <div className="fc-avatar-ring" />
      </div>

      <h2 className="fc-name">{name}</h2>
      <p className="fc-title">{title}</p>

      <div className="fc-badge">Founding Member</div>
    </div>
  );
}

export default function Members() {
  const [activeTeam, setActiveTeam] = useState<"delhi" | "hyderabad">("delhi");
  const [animKey, setAnimKey] = useState(0);
  const team = activeTeam === "delhi" ? delhiTeam : hyderabadTeam;

  const switchTeam = (t: "delhi" | "hyderabad") => {
    setActiveTeam(t);
    setAnimKey(k => k + 1);
  };

  return (
    <>
      <style>{`
        .team-page {
          min-height: 100vh;
          background: #000;
          padding: 100px 6% 80px;
          position: relative;
          overflow: hidden;
        }

        .team-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,79,135,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 30% 50% at 0% 50%, rgba(139,15,58,0.05) 0%, transparent 50%),
            radial-gradient(ellipse 30% 50% at 100% 60%, rgba(139,15,58,0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        .team-page::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,79,135,0.3), transparent);
        }

        .team-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
        }

        .team-header {
          text-align: center;
          margin-bottom: 64px;
          animation: fadeDown 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        .team-eyebrow {
          font-family: 'Poppins', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          color: #ff4f87;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .team-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 14px;
        }

        .team-title span { color: #ff4f87; }

        .team-desc {
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.35);
          max-width: 420px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ── FOUNDERS ── */
        .founders-row {
          display: flex;
          justify-content: center;
          gap: 28px;
          flex-wrap: wrap;
          margin-bottom: 64px;
        }

        .fc {
          position: relative;
          width: 220px;
          padding: 32px 24px 28px;
          border-radius: 20px;
          background: rgba(12,12,12,0.9);
          border: 1px solid rgba(255,79,135,0.25);
          cursor: default;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, border-color 0.25s ease;
          animation: riseIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
          overflow: hidden;
          text-align: center;
        }

        .fc-h {
          border-color: rgba(255,79,135,0.55);
          box-shadow: 0 20px 60px rgba(255,79,135,0.15), 0 0 0 1px rgba(255,79,135,0.1);
        }

        .fc-glow {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: radial-gradient(circle at var(--gx) var(--gy), rgba(255,79,135,0.12) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .fc-h .fc-glow { opacity: 1; }

        .fc-shine {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        .fc-crown {
          position: absolute;
          top: 14px;
          right: 14px;
          color: #ff4f87;
          opacity: 0.6;
        }

        .fc-avatar {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,79,135,0.25) 0%, rgba(139,15,58,0.15) 100%);
          border: 1.5px solid rgba(255,79,135,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .fc-h .fc-avatar {
          border-color: rgba(255,79,135,0.8);
          box-shadow: 0 0 20px rgba(255,79,135,0.2);
        }

        .fc-avatar span {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #ff85ad;
        }

        .fc-avatar-ring {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px dashed rgba(255,79,135,0.2);
          animation: spin 12s linear infinite;
        }

        .fc-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 5px;
        }

        .fc-title {
          font-family: 'Poppins', sans-serif;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }

        .fc-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 50px;
          background: rgba(255,79,135,0.1);
          border: 1px solid rgba(255,79,135,0.25);
          font-family: 'Poppins', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          color: #ff4f87;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* ── SWITCHER ── */
        .switcher-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 48px;
          animation: fadeDown 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }

        .switcher {
          display: flex;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 50px;
          padding: 5px;
          gap: 4px;
          position: relative;
        }

        .sw-btn {
          position: relative;
          z-index: 1;
          padding: 10px 28px;
          border-radius: 50px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.25s ease;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sw-btn.sw-a { color: #fff; }

        .sw-pill {
          position: absolute;
          top: 5px;
          bottom: 5px;
          border-radius: 50px;
          background: linear-gradient(135deg, #8b0f3a, #c2185b);
          box-shadow: 0 4px 16px rgba(194,24,91,0.3);
          transition: left 0.35s cubic-bezier(0.34,1.56,0.64,1), width 0.35s cubic-bezier(0.34,1.56,0.64,1);
          pointer-events: none;
        }

        .sw-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.6;
        }

        .sw-count {
          font-size: 0.68rem;
          opacity: 0.6;
          background: rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 1px 6px;
        }

        /* ── SECTION LABEL ── */
        .section-label {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }

        .section-label-text {
          font-family: 'Poppins', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(255,79,135,0.6);
          letter-spacing: 3px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .section-label-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,79,135,0.2), transparent);
        }

        /* ── MEMBER CARDS ── */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 20px;
        }

        .mc {
          position: relative;
          padding: 28px 20px 22px;
          border-radius: 18px;
          background: rgba(10,10,10,0.85);
          border: 1px solid rgba(255,255,255,0.06);
          cursor: default;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, border-color 0.25s ease, opacity 0.45s ease;
          overflow: hidden;
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
        }

        .mc.mc-v {
          opacity: 1;
          transform: translateY(0);
        }

        .mc-h {
          border-color: rgba(255,79,135,0.3);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,79,135,0.08);
        }

        .mc-glow {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          background: radial-gradient(circle at var(--gx) var(--gy), rgba(255,79,135,0.09) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .mc-h .mc-glow { opacity: 1; }

        .mc-shine {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          border-radius: 18px 18px 0 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%);
          pointer-events: none;
        }

        .mc-icon {
          position: absolute;
          top: 12px;
          right: 12px;
          color: rgba(255,79,135,0.3);
          transition: color 0.2s;
        }
        .mc-h .mc-icon { color: rgba(255,79,135,0.6); }

        .mc-avatar {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .mc-h .mc-avatar {
          border-color: rgba(255,79,135,0.4);
          background: rgba(255,79,135,0.06);
          box-shadow: 0 0 14px rgba(255,79,135,0.1);
        }

        .mc-initials {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          transition: color 0.25s;
        }
        .mc-h .mc-initials { color: #ff85ad; }

        .mc-avatar-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px dashed rgba(255,255,255,0.06);
          transition: border-color 0.25s;
        }
        .mc-h .mc-avatar-ring { border-color: rgba(255,79,135,0.2); }

        .mc-name {
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          margin-bottom: 5px;
          transition: color 0.2s;
        }
        .mc-h .mc-name { color: #fff; }

        .mc-role {
          font-family: 'Poppins', sans-serif;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.3px;
          transition: color 0.2s;
        }
        .mc-h .mc-role { color: rgba(255,79,135,0.7); }

        .mc-bottom-line {
          position: absolute;
          bottom: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,79,135,0.35), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .mc-h .mc-bottom-line { opacity: 1; }

        /* ── STATS BAR ── */
        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 48px;
          margin-top: 64px;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.05);
          animation: fadeUp 0.6s 0.4s cubic-bezier(0.22,1,0.36,1) both;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-num span { color: #ff4f87; }

        .stat-label {
          font-family: 'Poppins', sans-serif;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.3);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .team-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; }
          .founders-row { gap: 16px; }
          .fc { width: 180px; padding: 26px 18px 22px; }
          .stats-bar { gap: 28px; }
          .sw-btn { padding: 9px 18px; font-size: 0.78rem; }
        }
      `}</style>

      <Navbar />

      <div className="team-page">
        <div className="team-inner">

          {/* Header */}
          <div className="team-header">
            <p className="team-eyebrow">◈ The people behind the mission</p>
            <h1 className="team-title">Meet our <span>team.</span></h1>
            <p className="team-desc">Passionate young individuals working together to create meaningful change across India.</p>
          </div>

          {/* Founders */}
          <div className="founders-row">
            <FounderCard name="Annanya" title="Founder" index={0} />
            <FounderCard name="Kriday" title="Co-Founder" index={1} />
          </div>

          {/* Switcher */}
          <div className="switcher-wrap">
            <SwitcherWithPill active={activeTeam} onChange={switchTeam} />
          </div>

          {/* Section label */}
          <div className="section-label">
            <span className="section-label-text">
              {activeTeam === "delhi" ? "Delhi Chapter" : "Hyderabad Chapter"}
            </span>
            <div className="section-label-line" />
            <span className="section-label-text">{team.length} members</span>
          </div>

          {/* Grid */}
          <div className="team-grid" key={animKey}>
            {team.map((member, i) => (
              <MemberCard key={member.name + member.role} member={member} index={i} />
            ))}
          </div>

          {/* Stats */}
          <div className="stats-bar">
            <div className="stat">
              <div className="stat-num">2<span>+</span></div>
              <div className="stat-label">Cities</div>
            </div>
            <div className="stat">
              <div className="stat-num">22<span>+</span></div>
              <div className="stat-label">Members</div>
            </div>
            <div className="stat">
              <div className="stat-num">1<span></span></div>
              <div className="stat-label">Mission</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function SwitcherWithPill({ active, onChange }: { active: "delhi" | "hyderabad"; onChange: (t: "delhi" | "hyderabad") => void }) {
  const dRef = useRef<HTMLButtonElement>(null);
  const hRef = useRef<HTMLButtonElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = active === "delhi" ? dRef.current : hRef.current;
    if (el) {
      const parent = el.offsetParent as HTMLElement;
      setPill({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [active]);

  return (
    <div className="switcher">
      <div className="sw-pill" style={{ left: pill.left, width: pill.width }} />
      <button ref={dRef} className={`sw-btn${active === "delhi" ? " sw-a" : ""}`} onClick={() => onChange("delhi")}>
        <span className="sw-dot" />
        Delhi Team
        <span className="sw-count">{delhiTeam.length}</span>
      </button>
      <button ref={hRef} className={`sw-btn${active === "hyderabad" ? " sw-a" : ""}`} onClick={() => onChange("hyderabad")}>
        <span className="sw-dot" />
        Hyderabad Team
        <span className="sw-count">{hyderabadTeam.length}</span>
      </button>
    </div>
  );
}