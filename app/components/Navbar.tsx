"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const navItems = [
  {
    href: "/",
    label: "Home",
    d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    href: "/about",
    label: "About Us",
    d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    href: "/members",
    label: "Our Team",
    d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    href: "/contact",
    label: "Contact",
    d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = navRef.current;

    const handler = (e: MouseEvent) => {
      if (!el) return;

      const r = el.getBoundingClientRect();

      setGlowPos({
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      });
    };

    el?.addEventListener("mousemove", handler);

    return () => el?.removeEventListener("mousemove", handler);
  }, []);

  return (
    <>
      <style>{`
        .sidebar {
          position: fixed;
          left: 22px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;

          display: flex;
          flex-direction: column;
          align-items: center;

          gap: 8px;

          padding: 24px 12px;

          border-radius: 28px;

          background: rgba(8, 8, 8, 0.78);

          border: 1px solid rgba(255, 255, 255, 0.07);

          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);

          box-shadow:
            0 8px 40px rgba(0,0,0,0.55),
            inset 0 1px 0 rgba(255,255,255,0.06);

          overflow: hidden;

          width: 68px;

          transition:
            width 0.38s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.25s ease;
        }

        .sidebar:hover {
          transform: translateY(-50%) scale(1.01);
        }

        .sidebar.exp {
          width: 210px;
        }

        .glow {
          position: absolute;

          width: 260px;
          height: 260px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(255,79,135,0.16) 0%,
              rgba(255,79,135,0.08) 30%,
              transparent 72%
            );

          pointer-events: none;

          transform: translate(-50%, -50%);

          opacity: 0;

          transition: opacity 0.3s ease;
        }

        .sidebar:hover .glow {
          opacity: 1;
        }

        .logo-btn {
          width: 46px;
          height: 46px;

          border-radius: 50%;

          overflow: hidden;

          cursor: pointer;

          border: 2px solid rgba(255, 255, 255, 0.08);

          padding: 0;

          background: none;

          flex-shrink: 0;

          margin-bottom: 16px;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .logo-btn:hover {
          transform: scale(1.08);

          border-color: rgba(255, 79, 135, 0.6);

          box-shadow:
            0 0 0 3px rgba(255,79,135,0.2),
            0 0 20px rgba(255,79,135,0.2);
        }

        .ni {
          display: flex;
          align-items: center;
          gap: 12px;

          text-decoration: none;

          padding: 12px 12px;

          border-radius: 14px;

          width: 100%;

          color: rgba(255, 255, 255, 0.48);

          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;

          letter-spacing: 0.3px;

          white-space: nowrap;

          position: relative;

          transition:
            color 0.2s,
            background 0.2s,
            transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .ni:hover {
          color: #fff;

          background: rgba(255, 79, 135, 0.1);

          transform: translateX(3px);
        }

        .ni:active {
          transform: translateX(3px) scale(0.96);
        }

        .ni.act {
          color: #ff4f87;

          background: rgba(255, 79, 135, 0.12);
        }

        .ni.act .ic {
          filter: drop-shadow(0 0 5px rgba(255,79,135,0.7));
        }

        .ic {
          width: 19px;
          height: 19px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          transition: filter 0.2s;
        }

        .nl {
          opacity: 0;

          max-width: 0;

          overflow: hidden;

          font-size: 0.82rem;

          transition:
            opacity 0.2s ease,
            max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar.exp .nl {
          opacity: 1;
          max-width: 120px;
        }

        .divider {
          width: 28px;
          height: 1px;

          background: rgba(255, 255, 255, 0.07);

          margin: 10px 0;

          transition: width 0.35s ease;
        }

        .sidebar.exp .divider {
          width: 100%;
        }

        .donate-link {
          display: flex;
          align-items: center;
          gap: 12px;

          text-decoration: none;

          padding: 12px 12px;

          border-radius: 14px;

          width: 100%;

          color: rgba(120, 255, 120, 0.9);

          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;

          white-space: nowrap;

          border: 1px solid rgba(50, 205, 50, 0.25);

          background: rgba(50, 205, 50, 0.06);

          margin-top: 2px;

          transition:
            all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .donate-link:hover {
          background: rgba(50, 205, 50, 0.16);

          border-color: limegreen;

          color: #fff;

          transform: translateX(3px);

          box-shadow:
            0 0 18px rgba(50, 205, 50, 0.2);
        }

        .donate-link:active {
          transform: translateX(3px) scale(0.96);
        }

        .di {
          width: 18px;
          height: 18px;

          flex-shrink: 0;

          color: limegreen;

          filter:
            drop-shadow(0 0 4px rgba(50,205,50,0.5));
        }

        .chev {
          position: absolute;

          right: -13px;
          top: 50%;

          transform: translateY(-50%);

          width: 26px;
          height: 26px;

          border-radius: 50%;

          background: rgba(12, 12, 12, 0.92);

          border: 1px solid rgba(255, 255, 255, 0.09);

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          color: rgba(255, 255, 255, 0.4);

          transition:
            color 0.2s,
            background 0.2s,
            transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chev:hover {
          color: #fff;
          background: rgba(255, 79, 135, 0.25);
        }

        .sidebar.exp .chev {
          transform: translateY(-50%) rotate(180deg);
        }

        @media (max-width: 768px) {
          .sidebar {
            left: unset;
            top: unset;
            bottom: 14px;
            right: 14px;

            transform: none !important;

            flex-direction: row;

            border-radius: 20px;

            width: auto !important;

            padding: 10px 12px;

            gap: 4px;
          }

          .logo-btn {
            margin-bottom: 0;
            margin-right: 4px;
          }

          .nl {
            display: none !important;
          }

          .divider {
            width: 1px;
            height: 18px;
            margin: 0 4px;
          }

          .chev {
            display: none;
          }
        }
      `}</style>

      <nav
        ref={navRef}
        className={`sidebar${expanded ? " exp" : ""}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div
          className="glow"
          style={{
            left: glowPos.x,
            top: glowPos.y,
          }}
        />

        <button
          className="logo-btn"
          aria-label="Project Amaanat"
          onClick={() => setExpanded((v) => !v)}
        >
          <Image
            src="/670351722_1288203486153634_7558314037242710631_n.jpg"
            alt="Logo"
            width={46}
            height={46}
            style={{
              objectFit: "cover",
              display: "block",
            }}
          />
        </button>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`ni${pathname === item.href ? " act" : ""}`}
          >
            <span className="ic">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d={item.d} />
              </svg>
            </span>

            <span className="nl">{item.label}</span>
          </Link>
        ))}

        <div className="divider" />

        <Link href="/donate" className="donate-link">
          <span className="di">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </span>

          <span className="nl">Donate now</span>
        </Link>

        <button
          className="chev"
          onClick={() => setExpanded((v) => !v)}
          aria-label="Toggle sidebar"
        >
          <svg
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </nav>
    </>
  );
}