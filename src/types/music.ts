import React from 'react';

export interface YouTubeTrack {
  id: string;
  title: string;
  channel: string;
  videoId: string;
  category: 'lofi' | 'synthwave' | 'piano' | 'ambient' | 'jazz';
  thumbnail?: string;
  description?: string;
}

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => {
  return React.createElement(
    'svg',
    {
      className,
      viewBox: '0 0 24 24',
      fill: 'currentColor'
    },
    React.createElement('path', {
      d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
    })
  );
};

export const CURATED_YOUTUBE_STATIONS: YouTubeTrack[] = [
  {
    id: 'lofi-girl-main',
    title: 'Lofi Girl - beats to relax/study to',
    channel: 'Lofi Girl',
    videoId: 'jfKfPFi43Wo',
    category: 'lofi',
    description: 'The iconic 24/7 lo-fi hip hop study stream for deep concentration.'
  },
  {
    id: 'synthwave-coding',
    title: 'Synthwave Radio - Chill Focus & Retro Vibes',
    channel: 'Lofi Girl',
    videoId: '4xDzrJKXOOY',
    category: 'synthwave',
    description: 'Nostalgic retro electronic beats tailored for programming & problem solving.'
  },
  {
    id: 'coffee-shop-rain',
    title: 'Warm Coffee Shop Lo-Fi & Gentle Rain',
    channel: 'Coffee Shop Vibes',
    videoId: '-5KAN9_CzSA',
    category: 'ambient',
    description: 'Cozy acoustic cafe ambience with soft drizzle and soothing jazz beats.'
  },
  {
    id: 'ghibli-piano',
    title: 'Studio Ghibli Peaceful Piano Collection',
    channel: 'Peaceful Melodies',
    videoId: '0K_N_p7l9O8',
    category: 'piano',
    description: 'Beautiful acoustic piano covers of beloved nostalgic animations.'
  },
  {
    id: 'deep-focus-classical',
    title: 'Mozart & Classical Focus Symphony',
    channel: 'HALIDONMUSIC',
    videoId: 'WPni755-Krg',
    category: 'piano',
    description: 'Timeless baroque and classical masterpieces for enhanced neuro-plasticity.'
  },
  {
    id: 'midnight-jazz',
    title: 'Midnight Tokyo City Study Jazz & Rain',
    channel: 'Tokyo Jazz Cafe',
    videoId: 'e3L1I6O975c',
    category: 'jazz',
    description: 'Smooth saxophone, mellow upright bass, and quiet night raindrops.'
  }
];

export const parseYouTubeVideoId = (input: string): string | null => {
  if (!input) return null;
  const trimmed = input.trim();
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};
