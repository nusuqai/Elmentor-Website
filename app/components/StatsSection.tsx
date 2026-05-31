'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function StatsSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const stats = [
    { value: 30, suffix: '+', label: 'Expert Mentors' },
    { value: 8, suffix: '+', label: 'Career Domains' },
    { value: 95, suffix: '%', label: 'Match Satisfaction' },
    { value: 500, suffix: '+', label: 'Sessions Completed' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 px-6 lg:px-10 bg-navy-base relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-[20%] w-[400px] h-[400px] rounded-full bg-teal/30 blur-[120px]" />
        <div className="absolute bottom-0 right-[10%] w-[300px] h-[300px] rounded-full bg-purple/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-[48px] md:text-[56px] font-bold text-white leading-none mb-2">
              {visible ? <Counter target={stat.value} /> : '0'}
              <span className="text-teal-light">{stat.suffix}</span>
            </div>
            <p className="text-[15px] text-white/60 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target]);

  return <>{count}</>;
}
