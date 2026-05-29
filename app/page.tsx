import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FeaturedMentors from './components/FeaturedMentors';
import ValueProps from './components/ValueProps';
import StatsSection from './components/StatsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedMentors />
        <HowItWorks />
        <ValueProps />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
