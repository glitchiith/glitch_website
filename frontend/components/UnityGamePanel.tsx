"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiJSON } from "@/lib/api";
import {
  encryptScore,
  isUnityScoreMessage,
  isValidScore,
  MAX_SCORE,
  type RunSession,
  type SubmissionResult,
} from "@/lib/scoreSubmission";

type Props = {
  bestScore: number | null;
  onScoreAccepted: (bestScore: number) => void;
};

const gamePath = process.env.NEXT_PUBLIC_UNITY_GAME_PATH;
const simulatorEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_ENABLE_SCORE_SIMULATOR === "true";

function messageFrom(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function runStatus(run: RunSession | null, preparing: boolean) {
  if (run) return "Game run ready";
  if (preparing) return "Preparing run…";
  return "Game unavailable";
}

export default function UnityGamePanel({ bestScore, onScoreAccepted }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const runRequestStarted = useRef(false);
  const submissionInProgress = useRef(false);
  const [run, setRun] = useState<RunSession | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [testScore, setTestScore] = useState("100");

  const prepareRun = useCallback(async () => {
    if (runRequestStarted.current) return;

    runRequestStarted.current = true;
    setPreparing(true);
    setError("");
    try {
      const session = await apiJSON<RunSession>(
        "/api/runs",
        { method: "POST" },
        true,
      );
      setRun(session);
    } catch (error) {
      runRequestStarted.current = false;
      setError(messageFrom(error, "Could not prepare a game run."));
    } finally {
      setPreparing(false);
    }
  }, []);

  useEffect(() => {
    if (gamePath || simulatorEnabled) void prepareRun();
  }, [prepareRun]);

  const sendResultToGame = useCallback(
    (success: boolean, resultMessage: string) => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "website-score-result",
          success,
          message: resultMessage,
        },
        window.location.origin,
      );
    },
    [],
  );

  const submitScore = useCallback(
    async (score: number) => {
      if (submissionInProgress.current || submitted) return;
      if (!run) {
        setError("The game run is not ready. Please retry.");
        return;
      }
      if (!isValidScore(score)) {
        setError("The game sent an invalid score.");
        return;
      }

      submissionInProgress.current = true;
      setSubmitting(true);
      setMessage("");
      setError("");
      try {
        const data = encryptScore(run, score);
        const result = await apiJSON<SubmissionResult>(
          "/api/submit-score",
          {
            method: "POST",
            body: JSON.stringify({ data }),
          },
          true,
        );
        const resultMessage = result.newBest
          ? `New personal best: ${result.bestScore.toLocaleString()}`
          : `Score accepted. Personal best: ${result.bestScore.toLocaleString()}`;

        setSubmitted(true);
        setMessage(resultMessage);
        onScoreAccepted(result.bestScore);
        sendResultToGame(true, resultMessage);
        notifyLeaderboards();
      } catch (error) {
        const resultMessage = messageFrom(error, "Could not submit the score.");
        setError(resultMessage);
        sendResultToGame(false, resultMessage);
      } finally {
        submissionInProgress.current = false;
        setSubmitting(false);
      }
    },
    [onScoreAccepted, run, sendResultToGame, submitted],
  );

  useEffect(() => {
    function receiveUnityMessage(event: MessageEvent) {
      const gameWindow = iframeRef.current?.contentWindow;
      if (
        event.origin !== window.location.origin ||
        !gameWindow ||
        event.source !== gameWindow ||
        !isUnityScoreMessage(event.data)
      ) {
        return;
      }
      void submitScore(event.data.score);
    }

    window.addEventListener("message", receiveUnityMessage);
    return () => window.removeEventListener("message", receiveUnityMessage);
  }, [submitScore]);

  return (
    <div className="rounded-xl border border-green-900 bg-gray-950 p-6 text-center">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-300">
        <span>
          Personal best: {bestScore === null
            ? "No score yet"
            : bestScore.toLocaleString()}
        </span>
        <span>{runStatus(run, preparing)}</span>
      </div>

      {gamePath && run ? (
        <iframe
          ref={iframeRef}
          src={gamePath}
          title="Competition game"
          className="mx-auto h-[610px] w-full max-w-[800px] border-0"
          allowFullScreen
        />
      ) : (
        <div className="px-4 py-14">
          <h2 className="text-3xl font-bold text-green-400">Game coming soon</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-300">
            The score connection is ready. The new Unity WebGL build has not
            been added yet.
          </p>
        </div>
      )}

      {message && (
        <p role="status" className="mt-4 text-green-300">
          {message}
        </p>
      )}
      {error && (
        <div role="alert" className="mt-4 text-red-300">
          <p>{error}</p>
          {!run && !preparing && (
            <button
              type="button"
              className="mt-2 underline"
              onClick={() => void prepareRun()}
            >
              Retry preparing the run
            </button>
          )}
        </div>
      )}

      {simulatorEnabled && (
        <div className="mx-auto mt-6 max-w-sm rounded-lg border border-dashed border-gray-600 p-4 text-left">
          <p className="mb-3 text-sm text-gray-300">
            Development-only Unity submission simulator
          </p>
          <div className="flex gap-2">
            <input
              aria-label="Simulated score"
              type="number"
              min="0"
              max={MAX_SCORE}
              step="1"
              value={testScore}
              onChange={(event) => setTestScore(event.target.value)}
              className="min-w-0 flex-1 rounded bg-gray-800 px-3 py-2"
            />
            <button
              type="button"
              disabled={!run || submitting || submitted}
              onClick={() => void submitScore(Number(testScore))}
              className="rounded bg-green-700 px-4 py-2 font-semibold disabled:opacity-40"
            >
              {submitting ? "Submitting…" : "Test submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function notifyLeaderboards() {
  window.dispatchEvent(new Event("scores-updated"));
  try {
    localStorage.setItem("scores-updated", Date.now().toString());
  } catch {
    // The current tab still refreshes through the custom event.
  }
}
