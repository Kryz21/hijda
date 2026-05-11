"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <>
      <Navbar />
      <main className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="main-title">Project Amaanat</h1>
          <p className="tagline">&ldquo;Turning empathy into action.&rdquo;</p>
          <button className="cta-btn" onClick={() => setPopupOpen(true)}>
            Learn More
          </button>
        </div>
      </main>

      <footer className="social-sidebar">
        <a href="https://www.instagram.com/project.amaanat/" target="_blank" rel="noopener noreferrer" className="insta-link">
          <i className="fab fa-instagram"></i>
          <span>@project.amaanat</span>
        </a>
      </footer>

      {popupOpen && (
        <div className="about-popup" onClick={(e) => { if (e.target === e.currentTarget) setPopupOpen(false); }}>
          <div className="popup-content">
            <button className="close-popup" onClick={() => setPopupOpen(false)}>&times;</button>
            <h2>About Project Amaanat</h2>
            <p>Project Amaanat is a youth-led NGO founded by Annanya alongside co-founder Kriday Anand.</p>
            <p>Our initiative focuses on improving access to education and basic resources for orphaned and underprivileged children across India...</p>
            <Link href="/about" className="read-more-link">Read more...</Link>
          </div>
        </div>
      )}
    </>
  );
}
