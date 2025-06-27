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
            For Music Fans, By Music Fans.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
            GigDog is a modern, curated concert discovery platform built on a simple idea: finding live music should be exciting, not exhausting.
          </p>
        </header>

        {/* Mission Section */}
        <section className="prose prose-invert prose-lg max-w-none text-neutral-300 leading-relaxed space-y-6">
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          <p>
            We got tired of generic, ad-cluttered event sites that just dump data on you. They lack soul. They don't know the local scene. GigDog's mission is to be your trusted guide to live shows in your city, starting with our hometown of Atlanta, GA.
          </p>
          <p>
            We believe in the power of human curation, rich media, and local expertise. Our goal is to be the indispensable companion for your entire concert-going journey—from discovering a new local artist to planning the logistics of a great night out.
          </p>
        </section>

        {/* Features Section */}
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
        </section>

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