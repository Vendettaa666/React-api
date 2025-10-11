import { useState, useRef, useEffect } from 'react';

export const useAudioPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playTrack = (track) => {
    if (currentTrack?.id === track.id && audioRef.current) {
      // Toggle play/pause for current track
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // New track
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // Small delay to ensure state updates
      setTimeout(() => {
        if (audioRef.current && track.preview_url) {
          audioRef.current.src = track.preview_url;
          audioRef.current.play().catch(console.error);
        }
      }, 100);
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
  };

  return {
    currentTrack,
    isPlaying,
    progress,
    audioRef,
    playTrack,
    stopTrack
  };
};