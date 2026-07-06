'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';

const DEMO_VIDEO_ID = 'HQ9ikh6NKsg';

export default function LandingPage(): React.ReactElement {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [loading, user, router]);

  return (
    <div className="h-dvh overflow-hidden flex flex-col bg-black font-sans text-white px-4 sm:px-6 py-4 sm:py-5">
      <header className="shrink-0 text-center">
        <span className="text-4xl sm:text-5xl font-bold tracking-tighter">AERO</span>
        <p className="mt-2 text-xs sm:text-sm text-white/60 max-w-xl mx-auto leading-snug">
          Monitor brands and Amazon ASINs across AI-powered search. Track mentions, analyze citations, and stay ahead of competitors.
        </p>
      </header>

      <section className="flex-1 min-h-0 flex flex-col w-full max-w-3xl mx-auto my-3 sm:my-4">
        <div className="flex-1 min-h-0 flex flex-col bg-white/5 border border-white/10 p-3 sm:p-4">
          <p className="shrink-0 text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">
            Product Demo
          </p>
          <div className="flex-1 min-h-0 relative">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${DEMO_VIDEO_ID}`}
              title="Aero Product Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <footer className="shrink-0 flex flex-col sm:flex-row gap-3 justify-center max-w-3xl mx-auto w-full">
        <Link
          href="/signin"
          className="font-bold uppercase tracking-widest text-xs py-3 px-8 text-center bg-primary text-black hover:bg-primary/90 transition-all"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="font-bold uppercase tracking-widest text-xs py-3 px-8 text-center bg-white/5 hover:bg-white/10 border border-white/20 text-white transition-all"
        >
          Create Account
        </Link>
      </footer>
    </div>
  );
}
