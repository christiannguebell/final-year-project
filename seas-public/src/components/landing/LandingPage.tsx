import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Overview } from './Overview';
import { Timeline } from './Timeline';
import { Deadlines } from './Deadlines';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen selection:bg-secondary-fixed selection:text-secondary">
      <Navbar />
      <main>
        <Hero />
        <Overview />
        <Timeline />
        <Deadlines />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;