'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MenuIcon, CloseIcon, ArrowRightIcon } from './icons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileState, setMobileState] = useState({ path: '', open: false });
  const pathname = usePathname();
  const mobileOpen = mobileState.path === pathname && mobileState.open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Mentors', href: '/mentors' },
    { label: 'How It Works', href: '/#how-it-works' },
  ];

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return pathname === '/';
    return pathname === href;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)] h-[64px]'
            : 'bg-white h-[72px]'
        }`}
      >
        <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Elmentor Home">
            <Image
              src="/logo.png"
              alt="Elmentor"
              width={38}
              height={38}
              className="transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <span className="text-[22px] font-bold tracking-tight text-navy-base">
              Elmentor
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-teal'
                    : 'text-text-secondary hover:text-navy-base'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-navy-base text-white text-[14px] font-semibold px-5 py-2.5 rounded-full hover:bg-deep-navy transition-all duration-200 hover:shadow-lg"
            >
              Get Matched
              <ArrowRightIcon size={16} />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-navy-base p-2"
            onClick={() => setMobileState({ path: pathname, open: !mobileOpen })}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileState({ path: pathname, open: false })} />
          <div className="absolute top-[64px] left-0 right-0 bg-white shadow-elevated p-6 flex flex-col gap-4 animate-fade-up">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[16px] font-medium text-navy-base py-2 border-b border-border/50"
                onClick={() => setMobileState({ path: pathname, open: false })}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 bg-navy-base text-white text-[15px] font-semibold px-6 py-3 rounded-full mt-2"
              onClick={() => setMobileState({ path: pathname, open: false })}
            >
              Get Matched
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
