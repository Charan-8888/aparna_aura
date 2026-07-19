import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FOOTER_SECTIONS } from '../../constants/navigation';
import { APP_NAME } from '../../constants/app';

const Footer = () => {
  return (
    <footer className="bg-[#FAF8F6] dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-3xl font-bold font-heading text-[#382135] dark:text-[#D4AF37] tracking-wider mb-6 inline-block">
              {APP_NAME}
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
              Discover our exquisite collection of premium jewellery designed to elevate your everyday elegance and celebrate life's special moments.
            </p>

            <div className="mb-8">
              <h4 className="text-sm font-bold text-[#382135] dark:text-white uppercase tracking-wider mb-4">
                Subscribe to our Newsletter
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#382135] dark:focus:ring-[#D4AF37] dark:text-white"
                />
                <button className="bg-[#382135] hover:bg-[#2a1827] dark:bg-[#D4AF37] dark:hover:bg-[#b5952f] text-white dark:text-black px-4 py-2 rounded-r-md transition-colors flex items-center justify-center">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#382135] dark:hover:text-[#D4AF37] transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#382135] dark:hover:text-[#D4AF37] transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#382135] dark:hover:text-[#D4AF37] transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#382135] dark:hover:text-[#D4AF37] transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {FOOTER_SECTIONS.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-bold text-[#382135] dark:text-white uppercase tracking-wider mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-500">
            <span>Premium Quality</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
