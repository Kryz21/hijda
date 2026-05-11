import Navbar from "../components/Navbar";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Donate | Project Amaanat" };

export default function Donate() {
  return (
    <>
      <Navbar />
      <section className="page-section">
        <div className="page-container">
          <h1 className="page-title">Support Project Amaanat</h1>
          <p className="page-text">
            Your contribution helps us support communities through donation drives, outreach programs, and meaningful action.
          </p>
          <div className="donation-box">
            <h2>Scan To Donate</h2>
            <p className="donate-text">Every donation, no matter how small, helps us create a bigger impact.</p>
            <Image src="/qr.jpg" alt="Donation QR Code" width={300} height={300} className="qr-code" />
          </div>
        </div>
      </section>
    </>
  );
}
