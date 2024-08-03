import { useState, useEffect } from 'react';

export const useTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isActive) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = (newTime = initialTime) => {
    setIsActive(false);
    setTime(newTime);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return { time, minutes, seconds, startTimer, stopTimer, resetTimer };
};
