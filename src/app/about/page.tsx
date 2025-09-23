// src/app/about/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { PawPrint, Bone, Youtube, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About GigDog - Your Curated Concert Guide',
  description: 'Learn about GigDog\'s mission to provide the best, human-curated concert discovery experience for music fans.',
};

const AboutPage = () => {
  return (
    <main className="bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white">
            Discover Live Music
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
            Gig Dog is a modern, curated concert discovery platform built on a simple idea: how can we help connect future fans to the shows that are happening right now.
          </p>
        </header>

        {/* Mission Section */}
        <section className="prose prose-invert prose-lg max-w-none text-neutral-300 leading-relaxed space-y-6">
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          <p>
          Gig Dog Live is a hand‑curated concert calendar for Atlanta built to fix an obvious problem: generic, ad‑heavy event sites make it hard to see real shows and even harder to fall in love with someone new. Instead of starting with a playlist and hoping the tour shows up later, reverse discovery begins here—see who’s actually in town this week, tap a few previews, and walk into a room ready to become a fan. Gig Dog Live highlights indie rooms, local bands, and emerging tours so the neighborhood stages feel visible next to the big machines of ticketing and promotion.          </p>
          <p>
            Gig Dog is your concert companion. 
          </p>
        </section>

        {/* Features Section 
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-4 mb-3">
                <Sparkles size={28} className="text-indigo-400" />
                <h3 className="text-xl font-semibold">Human Curation</h3>
              </div>
              <p className="text-neutral-400">
                We don't just list events. We use a badge system—<PawPrint size={16} className="inline-block" /> for local artists, <Bone size={16} className="inline-block" /> for cheap shows—and an editorial shelf to highlight the most interesting shows, acting as a local tastemaker.
              </p>
            </div>

            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-4 mb-3">
                <Youtube size={28} className="text-red-500" />
                <h3 className="text-xl font-semibold">Rich Media Discovery</h3>
              </div>
              <p className="text-neutral-400">
                "Try before you buy." We integrate YouTube previews directly into the interface so you can sample an artist's live style or music videos without ever leaving the site.
              </p>
            </div>
          </div>
        </section>*/}

        {/* CTA Section */}
        <section className="text-center mt-20">
          <h2 className="text-2xl font-bold text-white">Ready to Find a Show?</h2>
          <p className="text-neutral-400 mt-2 mb-6">Let's get back to the music.</p>
          <Link
            href="/"
            className="inline-block px-10 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500 transition-colors duration-300"
          >
            See All Shows
          </Link>
        </section>

      </div>
    </main>
  );
};

export default AboutPage;