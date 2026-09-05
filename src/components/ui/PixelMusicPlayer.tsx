'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play, Pause, Music, Disc } from 'lucide-react';

export default function PixelMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(10);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element and trigger immediate playback from 10s
  useEffect(() => {
    const audio = new Audio('/music/music.mp3');
    audio.preload = 'auto';
    audio.loop = true;
    audioRef.current = audio;

    const startFrom10 = () => {
      try {
        if (audio.currentTime < 10) {
          audio.currentTime = 10;
        }
        const promise = audio.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              setIsPlaying(true);
              setHasStartedOnce(true);
            })
            .catch(() => {
              // Autoplay policy prevented immediate playback; wait for first interaction
            });
        }
      } catch (err) {
        // browser policy fallback
      }
    };

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration || 0);
      startFrom10();
    });

    audio.addEventListener('canplay', () => {
      startFrom10();
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      audio.currentTime = 10;
      audio.play().catch(() => {});
    });

    // Try playing immediately
    startFrom10();

    // In case browser policy blocked immediate sound, play on first user step/touch/click/scroll
    const handleFirstUserStep = () => {
      if (audioRef.current && audioRef.current.paused) {
        if (audioRef.current.currentTime < 10) {
          audioRef.current.currentTime = 10;
        }
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasStartedOnce(true);
          })
          .catch(() => {});
      }
    };

    const events = ['click', 'touchstart', 'scroll', 'pointerdown', 'keydown'];
    events.forEach((evt) => {
      window.addEventListener(evt, handleFirstUserStep, { once: true, passive: true });
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleFirstUserStep);
      });
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // If playing for the first time or before 10s, start from 10 seconds
      if (!hasStartedOnce || audio.currentTime < 10) {
        audio.currentTime = 10;
        setHasStartedOnce(true);
      }
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Audio playback error:', err);
        });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside aria-label="TARZER Radio Player" className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-50 select-none">
      {/* Expanded Pixel Music Box */}
      {isExpanded ? (
        <div className="bg-[#111111] text-white border-2 border-[#FF6A00] p-3.5 shadow-[4px_4px_0px_0px_#FF6A00] max-w-xs w-72 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-white/20 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#FF6A00] flex items-center justify-center p-0.5">
                <Image
                  src="/logo.png"
                  alt="TARZER"
                  width={20}
                  height={20}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="font-pixel text-xs tracking-wider text-[#FF6A00] uppercase font-bold">
                TARZER RADIO
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[11px] font-pixel text-white/50 hover:text-white px-1 cursor-pointer"
              title="Minimize player"
            >
              [—]
            </button>
          </div>

          {/* Center Info with Animated Pixel Equalizer */}
          <div className="flex items-center gap-3 py-1">
            {/* Spinning Disc with Logo */}
            <div className="relative w-12 h-12 bg-black border border-white/30 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              <div className={`w-full h-full p-1.5 flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                <Image
                  src="/logo.png"
                  alt="Track"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="absolute w-2.5 h-2.5 bg-[#FF6A00] rounded-full border border-black" />
            </div>

            {/* Track metadata */}
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs font-bold text-white truncate">
                STREETWEAR BEAT
              </p>
              <p className="text-[10px] font-mono text-[#FF6A00] uppercase">
                TARZER ORIGINAL · 10s DROP
              </p>

              {/* Animated Pixel Equalizer Bars */}
              <div className="flex items-end gap-1 h-3.5 mt-1">
                {[0.4, 0.8, 0.6, 1.0, 0.7, 0.5, 0.9].map((heightRatio, i) => (
                  <span
                    key={i}
                    className={`w-1 bg-[#FF6A00] transition-all duration-150 ${
                      isPlaying
                        ? 'animate-pulse'
                        : 'h-1 opacity-40'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(20, heightRatio * 100)}%` : '3px',
                      animationDelay: `${i * 120}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Time & Controls Bar */}
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/60">
              {formatTime(currentTime)} / {formatTime(duration || 120)}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={togglePlay}
                className="px-3 py-1 bg-[#FF6A00] hover:bg-[#E55F00] text-white font-pixel text-xs tracking-wider uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs active:translate-y-0.5"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3 fill-current" /> PAUSE
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" /> PLAY
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Compact Floating Pixel Button */
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="group flex items-center gap-2.5 px-3 py-2 bg-[#111111] hover:bg-black text-white border-2 border-[#FF6A00] shadow-[3px_3px_0px_0px_#FF6A00] transition-all cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px]"
            title="Open TARZER Radio"
          >
            {/* Logo in tiny pixel badge */}
            <div className="relative w-5 h-5 bg-[#FF6A00] p-0.5 shrink-0 overflow-hidden">
              <Image
                src="/logo.png"
                alt="TARZER"
                width={20}
                height={20}
                className={`object-contain w-full h-full ${isPlaying ? 'animate-pulse' : ''}`}
              />
            </div>

            {/* Equalizer Visualizer Bars */}
            <div className="flex items-end gap-0.5 h-3">
              {[0.4, 0.9, 0.5, 0.8, 0.6].map((ratio, i) => (
                <span
                  key={i}
                  className={`w-0.5 bg-[#FF6A00] transition-all ${
                    isPlaying ? 'animate-pulse' : 'h-1 opacity-50'
                  }`}
                  style={{
                    height: isPlaying ? `${ratio * 100}%` : '3px',
                    animationDelay: `${i * 150}ms`
                  }}
                />
              ))}
            </div>

            <span className="font-pixel text-[11px] tracking-wider uppercase text-white group-hover:text-[#FF6A00] transition-colors font-bold">
              {isPlaying ? 'PLAYING [10s]' : 'MUSIC'}
            </span>
          </button>

          {/* Quick 1-Click Play/Pause Pill */}
          <button
            onClick={togglePlay}
            className={`w-9 h-9 flex items-center justify-center border-2 border-[#111111] transition-all cursor-pointer shadow-[2px_2px_0px_0px_#111111] ${
              isPlaying
                ? 'bg-[#FF6A00] text-white hover:bg-[#E55F00]'
                : 'bg-white text-[#111111] hover:bg-[#F5F5F5]'
            }`}
            title={isPlaying ? 'Pause Music' : 'Play Music from 10s'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      )}
    </aside>
  );
}
