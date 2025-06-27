// src/app/contact/page.tsx
import type { Metadata } from 'next';
import { MessageSquare, Music, Megaphone, Instagram, Twitter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact GigDog',
  description: 'Get in touch with the GigDog team. We welcome feedback, artist submissions, and press inquiries.',
};

const ContactPage = () => {
  return (
    <main className="bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white">
            Get In Touch
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
            Have a question, a hot tip on a show, or just want to talk music? We'd love to hear from you.
          </p>
        </header>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Direct Contact Options */}
          <div className="space-y-6">
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-4 mb-3">
                <MessageSquare size={24} className="text-indigo-400" />
                <h3 className="text-xl font-semibold">General Feedback & Support</h3>
              </div>
              <p className="text-neutral-400 mb-4">
                Found a bug? Have a feature idea? Let us know what's on your mind.
              </p>
              <a href="mailto:hello@gigdog.live" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                hello@gigdog.live
              </a>
            </div>

            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-4 mb-3">
                <Music size={24} className="text-pink-400" />
                <h3 className="text-xl font-semibold">Artists, Venues, & Promoters</h3>
              </div>
              <p className="text-neutral-400 mb-4">
                Want to make sure your show is listed, or submit your band for a feature? This is the place.
              </p>
              <a href="mailto:shows@gigdog.live" className="font-semibold text-pink-400 hover:text-pink-300 transition-colors">
                shows@gigdog.live
              </a>
            </div>
            
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
              <div className="flex items-center gap-4 mb-3">
                <Megaphone size={24} className="text-yellow-400" />
                <h3 className="text-xl font-semibold">Press & Partnerships</h3>
              </div>
              <p className="text-neutral-400 mb-4">
                Interested in working with us or featuring GigDog? We're all ears.
              </p>
              <a href="mailto:press@gigdog.live" className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
                press@gigdog.live
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 flex flex-col">
            <h3 className="text-xl font-semibold mb-6">Find Us On Social</h3>
            <div className="space-y-4">
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-4 rounded-lg hover:bg-neutral-800 transition-colors">
                    <Instagram className="w-8 h-8 text-neutral-500 group-hover:text-pink-500 transition-colors" />
                    <div>
                        <p className="font-semibold text-white">Instagram</p>
                        <p className="text-sm text-neutral-400">@GigDogATL</p>
                    </div>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-4 rounded-lg hover:bg-neutral-800 transition-colors">
                    <Twitter className="w-8 h-8 text-neutral-500 group-hover:text-sky-400 transition-colors" />
                    <div>
                        <p className="font-semibold text-white">Twitter / X</p>
                        <p className="text-sm text-neutral-400">@GigDogATL</p>
                    </div>
                </a>
            </div>
            <div className="mt-auto pt-6 text-center text-neutral-500 text-sm">
                <p>The fastest way to get updates and behind-the-scenes content.</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ContactPage;