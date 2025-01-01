// TODO:
// - Save redux to localStorage
// - How to easy export to sailwave?
// - Settings page for TimeInput

import { useState, useEffect } from "react";
import { TimeInput } from "@nextui-org/date-input";
import { Time } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import DefaultLayout from "@/layouts/default";
import {
  updateCompetitor,
  startRaceTimer,
  resetRaceTimer,
} from "@/reducers/race";
import { getYardstick } from "@/boat-classes";
import {
  useRaceTimer,
  formattedTime,
  TimeSinceStart,
} from "@/components/race-timer";

function LapDetails({ competitor, startTime }) {
  if (!competitor.laps) {
    if (competitor.finalTime) return <>0 Laps Completed</>;

    return false;
  }

  const yardstick = getYardstick(competitor);

  return (
    <ol className="list-decimal">
      {competitor.laps.map((lap, index) => (
        <li key={index}>
          <TimeSinceStart startTime={startTime} time={lap} />
          {yardstick && (
            <>
              &nbsp; (adj:{" "}
              <TimeSinceStart
                startTime={startTime}
                time={lap}
                withYardstick={yardstick}
              />
              )
            </>
          )}
        </li>
      ))}
    </ol>
  );
}

function FinishedDetails({ competitor, startTime }) {
  const yardstick = getYardstick(competitor);

  if (!competitor.completed) {
    if (competitor.finalTime < startTime)
      return <div>Retired before race started</div>;

    return (
      <div>
        Retired after{" "}
        <TimeSinceStart startTime={startTime} time={competitor.finalTime} />
      </div>
    );
  }

  return (
    <div>
      Final Time:{" "}
      <TimeSinceStart startTime={startTime} time={competitor.finalTime} />
      {yardstick && (
        <>
          {" "}
          (adj:{" "}
          <TimeSinceStart
            startTime={startTime}
            time={competitor.finalTime}
            withYardstick={yardstick}
          />
          )
        </>
      )}
    </div>
  );
}

function RaceTable({ startTime }) {
  const [raceIsStarted, setRaceIsStarted] = useState(false);

  // Watch for when the race should start and only enable certain functionality then
  useEffect(() => {
    if (!startTime) setRaceIsStarted(false);
    else if (Date.now() >= startTime) setRaceIsStarted(true);
    else {
      const waiter = setTimeout(
        () => setRaceIsStarted(true),
        startTime - Date.now(),
      );

      return () => clearTimeout(waiter);
    }
  }, [startTime]);

  const competitors = useSelector((state) => state.race.competitors);
  const dispatch = useDispatch();

  const newLap = (competitor) => {
    const laps = competitor.laps || [];

    dispatch(updateCompetitor({ ...competitor, laps: [...laps, Date.now()] }));
  };

  const finishedRace = (competitor, completed) => {
    dispatch(
      updateCompetitor({
        ...competitor,
        finalTime: Date.now(),
        completed: completed,
      }),
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableColumn>Helm</TableColumn>
        <TableColumn>Boat Class</TableColumn>
        <TableColumn>Sail Number</TableColumn>
        <TableColumn>PY Number</TableColumn>
        <TableColumn>Laps</TableColumn>
        <TableColumn>Finish</TableColumn>
      </TableHeader>
      <TableBody>
        {competitors
          .filter((c) => c.name || c.boatClass || c.sailNumber)
          .map((competitor) => (
            <TableRow key={competitor.id}>
              <TableCell>{competitor.name}</TableCell>
              <TableCell>{competitor.boatClass}</TableCell>
              <TableCell>{competitor.sailNumber}</TableCell>
              <TableCell>{getYardstick(competitor)}</TableCell>
              <TableCell>
                <LapDetails competitor={competitor} startTime={startTime} />
                {!competitor.finalTime && (
                  <Button
                    color="primary"
                    isDisabled={!raceIsStarted}
                    onPress={() => newLap(competitor)}
                  >
                    New Lap
                  </Button>
                )}
              </TableCell>
              <TableCell>
                {competitor.finalTime ? (
                  <FinishedDetails
                    competitor={competitor}
                    startTime={startTime}
                  />
                ) : (
                  <>
                    <Button
                      className="m-2"
                      color="primary"
                      isDisabled={!raceIsStarted}
                      onPress={() => finishedRace(competitor, true)}
                    >
                      Finish
                    </Button>
                    <Button
                      className="m-2"
                      color="danger"
                      isDisabled={!startTime}
                      onPress={() => finishedRace(competitor, false)}
                    >
                      Retired
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

import ClassFlag from "@/images/flags/ICS_Hotel.svg";
import PreparatoryFlag from "@/images/flags/ICS_Papa.svg";
import UpArrow from "@/images/up-arrow.svg";
import DownArrow from "@/images/down-arrow.svg";

function ShowTimeToNextPrompt({ timeRemaining, text }) {
  if (timeRemaining < 0) return <>{text}</>;

  return (
    <>
      {text} in {formattedTime(timeRemaining)}
    </>
  );
}

const FlagHelp = {
  Warning: ({ timeRemaining }) => (
    <div>
      <h2>
        <ShowTimeToNextPrompt
          text="Raise class flag"
          timeRemaining={timeRemaining}
        />
      </h2>
      <div className="flags-container">
        <img className="" src={UpArrow} />
        <img className="border-black border-2" src={ClassFlag} />
      </div>
    </div>
  ),
  PreparatorySignal: ({ timeRemaining }) => (
    <div>
      <h2>
        <ShowTimeToNextPrompt
          text="Raise preparatory flag"
          timeRemaining={timeRemaining}
        />
      </h2>
      <div className="flex flex-row items-center">
        <img className="mr-1 w-60" src={UpArrow} />
        <img
          className="mr-1 w-60 border-black border-2"
          src={PreparatoryFlag}
        />
      </div>
    </div>
  ),
  OneMinute: ({ timeRemaining }) => (
    <div>
      <h2>
        <ShowTimeToNextPrompt
          text="Lower preparatory flag"
          timeRemaining={timeRemaining}
        />
      </h2>
      <div className="flex flex-row items-center">
        <img className="mr-1 w-60" src={DownArrow} />
        <img
          className="mr-1 w-60 border-black border-2"
          src={PreparatoryFlag}
        />
      </div>
    </div>
  ),
  Start: ({ timeRemaining }) => (
    <div>
      <h2>
        <ShowTimeToNextPrompt
          text="Lower class flag"
          timeRemaining={timeRemaining}
        />
      </h2>
      <div className="flex flex-row items-center">
        <img className="mr-1 w-60" src={DownArrow} />
        <img className="mr-1 w-60 border-black border-2" src={ClassFlag} />
      </div>
    </div>
  ),
};

function StartProcedureComponent() {
  const secsToStart = -useRaceTimer();

  if (isNaN(secsToStart)) return false;

  const showPromptBefore = 30; // How long to show the prompt before each event
  const showPromptAfter = 5; // How long to show the prompt after each event

  const promptStates = [
    { state: FlagHelp.Warning, time: 5 * 60 },
    { state: FlagHelp.PreparatorySignal, time: 4 * 60 },
    { state: FlagHelp.OneMinute, time: 1 * 60 },
    { state: FlagHelp.Start, time: 0 * 60 },
  ];

  const promptState = promptStates.find(
    (promptState) =>
      secsToStart < promptState.time + showPromptBefore &&
      secsToStart > promptState.time - showPromptAfter,
  );

  // Hide component if countdown has completed
  if (secsToStart < 0 && !promptState) return false;

  const PromptComponent = promptState ? promptState.state : null;

  return (
    <div className="font-sans text-xl py-2">
      {PromptComponent ? (
        <PromptComponent timeRemaining={secsToStart - promptState.time} />
      ) : (
        <>Time to start: {formattedTime(secsToStart)}</>
      )}
    </div>
  );
}

export default function RacePage() {
  const [countdownTime, setCountdownTime] = useState(new Time(0, 5, 20));
  const startTime = useSelector((state) => state.race.startTime);
  const secsFromStart = useRaceTimer();

  const dispatch = useDispatch();

  const getCountdownSeconds = () =>
    countdownTime.hour * 60 * 60 +
    countdownTime.minute * 60 +
    countdownTime.second;

  const doStart = () =>
    dispatch(startRaceTimer(Date.now() + getCountdownSeconds() * 1000));
  const doReset = () => dispatch(resetRaceTimer());

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center my-6">
        <div className="inline-block max-w-lg text-center justify-center">
          <StartProcedureComponent />
        </div>
      </section>

      {!startTime && (
        <section className="flex flex-col items-center justify-center my-6">
          <div className="inline-block max-w-lg text-center justify-center">
            <TimeInput
              granularity="second"
              hourCycle={24}
              label="Time before start"
              max={new Time(0, 10, 20)}
              min={new Time(0, 0)}
              value={countdownTime}
              onChange={setCountdownTime}
            />
          </div>
        </section>
      )}

      <section className="flex flex-col items-center justify-center my-2">
        <div className="inline-block max-w-lg text-center justify-center">
          <Button
            className="m-2"
            color="primary"
            isDisabled={startTime}
            onPress={doStart}
          >
            Start Race Countdown
          </Button>
          <Button
            className="m-2"
            color="danger"
            isDisabled={!startTime}
            onPress={doReset}
          >
            Reset Race
          </Button>
        </div>
      </section>

      <RaceTable startTime={startTime} />
    </DefaultLayout>
  );
}
