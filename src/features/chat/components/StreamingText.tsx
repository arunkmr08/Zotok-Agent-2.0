"use client";

import { useEffect, useState, useRef } from "react";

interface Props {
  text: string;
  isLatest: boolean;
}

export function StreamingText({ text, isLatest }: Props) {
  const [displayedText, setDisplayedText] = useState(isLatest ? "" : text);
  const [isStreaming, setIsStreaming] = useState(isLatest);
  const wordsRef = useRef<string[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isLatest) {
      setDisplayedText(text);
      setIsStreaming(false);
      return;
    }

    // Split text into words (including spaces) so we preserve formatting but stream by word
    const words = text.split(/(\s+)/);
    wordsRef.current = words;
    indexRef.current = 0;
    setDisplayedText("");
    setIsStreaming(true);

    const interval = setInterval(() => {
      if (indexRef.current >= wordsRef.current.length) {
        clearInterval(interval);
        setIsStreaming(false);
        return;
      }
      
      const nextWord = wordsRef.current[indexRef.current];
      setDisplayedText((prev) => prev + nextWord);
      indexRef.current += 1;
    }, 45); // Snappy streaming speed (approx 20 words per second)

    return () => clearInterval(interval);
  }, [text, isLatest]);

  return (
    <div className="relative inline">
      <span>{displayedText}</span>
    </div>
  );
}
