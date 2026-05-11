import Navbar from "../components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us | Project Amaanat" };

export default function About() {
  return (
    <>
      <Navbar />
      <section className="page-section">
        <div className="page-container">
          <h1 className="page-title">About Project Amaanat</h1>
          <p className="page-text">
            I&apos;m Annanya, founder of a youth-led NGO called Project Amaanat, along with my co-founder Kriday Anand.
            We are building an initiative focused on one clear issue in India today—the lack of access to education
            and basic resources for orphaned and underprivileged children, which severely affects their development
            and future opportunities.
          </p>
          <p className="page-text">
            Our motto is: &ldquo;Some trash is someone&apos;s treasure.&rdquo; We are still in the early stages, but we are
            committed to building something that creates real and lasting change.
          </p>
          <div className="mission-box">
            <h2>Our Mission</h2>
            <p>
              To transform compassion into meaningful impact by connecting people who want to help with people who
              genuinely need support.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
