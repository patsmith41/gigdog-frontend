// src/app/contact/page.tsx
import type { Metadata } from 'next';
import { MessageSquare, Music, Megaphone, Instagram } from 'lucide-react';

// A simple, reusable TikTok icon component
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.85-.38-6.75-1.77-1.26-.91-2.2-2.14-2.73-3.56s-.76-2.99-.76-4.5v-4.04c.57.02 1.14-.02 1.71-.02.02 4.73.01 9.46-.02 14.19.03 2.02 1.88 3.64 3.89 3.66 2.03.02 3.8-.87 4.54-2.82.09-.24.13-.5.17-.76.01-4.26.01-8.52.01-12.78-.01-.6-.11-1.19-.24-1.77-1.11-5.11-5.71-8.59-10.95-8.59-.01.02-.02.01-.02.01H.01V4.23c1.38.01 2.75-.04 4.13.02 1.13.05 2.25.32 3.3.76.6.26 1.18.59 1.72.98.09-2.2.03-4.4-.04-6.6z" />
    </svg>
);

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
                Let us know what's on your mind.
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
                <h3 className="text-xl font-semibold">Artist Profiles</h3>
              </div>
              <p className="text-neutral-400 mb-4">
                Need to add or make changes to your bio/photos/videos?
              </p>
              <a href="mailto:bio@gigdog.live" className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
                bio@gigdog.live
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 flex flex-col">
            <h3 className="text-xl font-semibold mb-6">Find Us On Socials</h3>
            <div className="space-y-4">
            <a href="https://www.instagram.com/gigdog_atl/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-3 rounded-lg hover:bg-neutral-800 transition-colors">
                    <div>
                        <p className="font-semibold text-white">Instagram</p>
                        <p className="text-sm text-neutral-400">@GigDog_atl</p>
                    </div>
                </a>
                <a href="https://www.tiktok.com/@gig_dog_atl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-3 rounded-lg hover:bg-neutral-800 transition-colors">
                    <div>
                        <p className="font-semibold text-white">TikTok</p>
                        <p className="text-sm text-neutral-400">@GigDog_atl</p>
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