import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { APP_NAME } from '../constants/app';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb items={[{ label: 'Contact Concierge', path: '/contact' }]} />

        <div className="text-center mt-12 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#382135] mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
            Contact Concierge
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Our dedicated luxury concierge team is at your absolute disposal for styling advice, bespoke requests, and assistance with your orders.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Details */}
          <div>
            <h2 className="text-2xl font-bold text-[#382135] mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>
              Get In Touch
            </h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Phone</h4>
                  <p className="text-[#382135] font-medium text-lg">+91 800 123 4567</p>
                  <p className="text-xs text-gray-500 mt-1">Mon-Sat: 10:00 AM - 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Email</h4>
                  <a href="mailto:concierge@aparnaaura.com" className="text-[#382135] font-medium text-lg hover:text-[#D4AF37] transition-colors">
                    concierge@aparnaaura.com
                  </a>
                  <p className="text-xs text-gray-500 mt-1">We aim to respond within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Flagship Boutique</h4>
                  <p className="text-[#382135] font-medium leading-relaxed">
                    123 Luxury Avenue,<br/>
                    Jubilee Hills, Hyderabad,<br/>
                    Telangana, 500033, India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-[#FAF8F5] border border-[#E6E1D8]">
              <h4 className="text-sm font-bold text-[#382135] uppercase tracking-widest mb-3">Book an Appointment</h4>
              <p className="text-sm text-gray-600 mb-4">
                Experience our collection in person. Private viewings are available by appointment at our flagship boutique.
              </p>
              <button className="border-b border-[#382135] text-[#382135] font-semibold text-sm uppercase tracking-wider pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
                Request Appointment
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 border border-gray-100 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#382135] mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
              Personal Shopping Assistance
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              Need help selecting the perfect piece? Our specialists are here to assist you with bespoke requests and personalized recommendations.
            </p>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">First Name *</label>
                  <input type="text" className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-[#D4AF37] transition-colors" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Last Name *</label>
                  <input type="text" className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-[#D4AF37] transition-colors" required />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address *</label>
                <input type="email" className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-[#D4AF37] transition-colors" required />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Subject</label>
                <select className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-[#D4AF37] transition-colors text-gray-700">
                  <option>Order Inquiry</option>
                  <option>Bespoke Design</option>
                  <option>Repairs & Maintenance</option>
                  <option>General Question</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message *</label>
                <textarea rows="4" className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none" required></textarea>
              </div>
              
              <button type="submit" className="w-full bg-[#382135] text-white py-4 font-semibold uppercase tracking-widest text-xs hover:bg-[#2a1827] transition-colors">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
