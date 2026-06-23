import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-primary-500 bg-clip-text text-transparent mb-4">
              The Accessories
            </h3>
            <p className="text-sm text-slate-400">
              Curating premium quality audio and workspace tech gadgets for creators, developers, and audiophiles.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-350 tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">Browse Products</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-400 transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary-400 transition-colors">My Profile</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-350 tracking-wider uppercase mb-4">CodeAlpha Internship</h4>
            <p className="text-sm text-slate-400">
              Developed as a Full Stack E-Commerce store project for the CodeAlpha Full Stack Development Internship program.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} The Accessories. All rights reserved.</p>
          <p>Created by CodeAlpha Intern</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
