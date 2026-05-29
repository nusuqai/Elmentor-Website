import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-deep-navy text-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Elmentor" width={28} height={28} className="brightness-0 invert" />
              <span className="text-[20px] font-bold tracking-tight text-white">
                Elmentor
              </span>
            </Link>
            <p className="text-[14px] text-white/50 leading-relaxed max-w-[240px]">
              Personalized mentorship that connects you with the right professionals for your career journey.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[14px] font-semibold text-white/80 mb-4 uppercase tracking-wider">
              Platform
            </h4>
            <div className="flex flex-col gap-3">
              <Link href="/mentors" className="text-[14px] text-white/50 hover:text-white transition-colors">
                Browse Mentors
              </Link>
              <Link href="/chat" className="text-[14px] text-white/50 hover:text-white transition-colors">
                Get Matched
              </Link>
              <Link href="/#how-it-works" className="text-[14px] text-white/50 hover:text-white transition-colors">
                How It Works
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-[14px] font-semibold text-white/80 mb-4 uppercase tracking-wider">
              Domains
            </h4>
            <div className="flex flex-col gap-3">
              <span className="text-[14px] text-white/50">Product Management</span>
              <span className="text-[14px] text-white/50">Software Engineering</span>
              <span className="text-[14px] text-white/50">UX Design</span>
              <span className="text-[14px] text-white/50">Growth Marketing</span>
            </div>
          </div>

          <div>
            <h4 className="text-[14px] font-semibold text-white/80 mb-4 uppercase tracking-wider">
              Company
            </h4>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-[14px] text-white/50 hover:text-white transition-colors">
                About
              </Link>
              <Link href="#" className="text-[14px] text-white/50 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-[14px] text-white/50 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-white/40">
            &copy; 2025 Elmentor. All rights reserved.
          </p>
          <p className="text-[13px] text-white/40">
            Made with care for the MENA region.
          </p>
        </div>
      </div>
    </footer>
  );
}
