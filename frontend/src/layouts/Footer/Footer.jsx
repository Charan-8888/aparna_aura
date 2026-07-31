import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Truck, Gem } from 'lucide-react';
import { FOOTER_SECTIONS } from '../../constants/navigation';
import { APP_NAME } from '../../constants/app';

const TRUST_BADGES = [
  { icon: Shield, label: 'SSL Secure', desc: 'Encrypted Checkout' },
  { icon: Award, label: 'Hallmark Certified', desc: 'BIS Standard' },
  { icon: Gem, label: '100% Genuine', desc: 'Authentic Jewellery' },
  { icon: Truck, label: 'Insured Delivery', desc: 'Safe & Tracked' },
];

const Footer = () => {
  return (
    <footer className="relative mt-8 bg-[#301b2f] text-white">
      {/* Trust Badges Bar */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TRUST_BADGES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
                  <Icon size={20} className="text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-white/40">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gold Divider */}
      <div className="gold-divider" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-20 pb-9">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-4xl font-medium font-heading text-[#f1d593] tracking-wide mb-6 inline-block">
              {APP_NAME}
            </Link>
            <p className="text-white/50 mb-8 max-w-md leading-relaxed text-sm">
              Discover our exquisite collection of premium jewellery designed to elevate your everyday elegance and celebrate life's special moments.
            </p>

            <div className="mb-8">
              <h4 className="text-[10px] font-bold text-white/70 uppercase tracking-[0.22em] mb-4">
                Subscribe to our Newsletter
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border border-white/10 rounded-l-full px-5 py-3.5 w-full focus:outline-none focus:border-[#D4AF37] text-white placeholder:text-white/30 text-sm transition-colors"
                />
                <button className="bg-[#D4AF37] hover:bg-[#e0c55c] text-[#382135] px-5 py-3 rounded-r-full transition-colors flex items-center justify-center font-semibold">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              {[
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { label: 'Instagram', path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z' },
                { label: 'Twitter', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
                { label: 'YouTube', path: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17zM10 15l5-3-5-3z' },
              ].map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#D4AF37]/20 flex items-center justify-center text-white/40 hover:text-[#D4AF37] transition-all duration-300"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={path}/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {FOOTER_SECTIONS.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-[10px] font-bold text-white/70 uppercase tracking-[0.22em] mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3.5">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.path}
                      className="text-white/40 hover:text-[#D4AF37] transition-colors text-sm inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 transition-all duration-300 overflow-hidden">→</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Gold Divider */}
        <div className="gold-divider mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved. Handcrafted with passion.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/25">
            <span>Premium Quality</span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
            <span>Secure Checkout</span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
            <span>Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
