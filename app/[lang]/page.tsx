import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FeaturedMentors from '../components/FeaturedMentors';
import ValueProps from '../components/ValueProps';
import StatsSection from '../components/StatsSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: Props) {
  const { lang } = await params;

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedMentors lang={lang} />
        <HowItWorks lang={lang} />
        <ValueProps lang={lang} />
        <StatsSection lang={lang} />
        <CTASection lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
