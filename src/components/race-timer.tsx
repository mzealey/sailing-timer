import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const formattedTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function TimeSinceStart({ startTime, time, withYardstick }) {
  let secsSinceStart = (time - startTime) / 1000;

  if (withYardstick) secsSinceStart *= 1000 / withYardstick;

  return <span>{formattedTime(secsSinceStart)}</span>;
}

/*
function useTimer(callback, timerRunning) {
    useEffect(() => {
      // Force an instant re-render whatever happens
      callback();

      if (timerRunning) {
        const timer = setInterval(callback, 50);

        return () => clearInterval(timer);
      }
    }, [timerRunning]);
}
*/

// 2.2 seconds should show 2 seconds, -2.2 should show as -3 seconds
const calcSecsFromStart = (startTime) =>
  startTime > 0 ? Math.floor((Date.now() - startTime) / 1000) : NaN;

export function useRaceTimer() {
  const [secsFromStart, setSecsFromStart] = useState();
  const startTime = useSelector((state) => state.race.startTime);
  const callback = () => setSecsFromStart(calcSecsFromStart(startTime));

  useEffect(() => {
    // Force an instant re-render whatever happens
    callback();

    if (startTime) {
      const timer = setInterval(callback, 50);

      return () => clearInterval(timer);
    }
  }, [startTime]);

  return secsFromStart;
}

export function RaceTimer() {
  const secsFromStart = useRaceTimer();

  if (secsFromStart >= 0) return <>Elapsed: {formattedTime(secsFromStart)}</>;
  else if (secsFromStart < 0)
    return <>To start of race: {formattedTime(-secsFromStart)}</>;
}
