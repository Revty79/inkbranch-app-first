import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReaderRun, SceneResult } from "@inkbranch/types";
import type { StorySummary } from "../services/inkbranchApi";
import { storyService } from "../services/storyService";

interface ReaderRunContextValue {
  stories: StorySummary[];
  selectedStory?: StorySummary;
  currentRun?: ReaderRun;
  currentScene?: SceneResult;
  runHistory: ReaderRun[];
  loading: boolean;
  error?: string;
  refreshStories: () => Promise<void>;
  startStory: (storyId: string) => Promise<void>;
  restartCurrentRun: () => Promise<void>;
  choose: (choiceId: string) => Promise<void>;
  chooseCustomChoice: (customChoiceText: string) => Promise<void>;
  clearError: () => void;
}

const ReaderRunContext = createContext<ReaderRunContextValue | undefined>(undefined);

function upsertRun(history: ReaderRun[], run: ReaderRun): ReaderRun[] {
  const existingIndex = history.findIndex((candidate) => candidate.id === run.id);

  if (existingIndex === -1) {
    return [run, ...history];
  }

  return history.map((candidate) => (candidate.id === run.id ? run : candidate));
}

export function ReaderRunProvider({ children }: PropsWithChildren) {
  const [stories, setStories] = useState<StorySummary[]>([]);
  const [currentRun, setCurrentRun] = useState<ReaderRun | undefined>();
  const [currentScene, setCurrentScene] = useState<SceneResult | undefined>();
  const [runHistory, setRunHistory] = useState<ReaderRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const refreshStories = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      setStories(await storyService.getStories());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load stories.");
    } finally {
      setLoading(false);
    }
  }, []);

  const startStory = useCallback(async (storyId: string) => {
    setLoading(true);
    setError(undefined);

    try {
      const result = await storyService.startRun(storyId);
      setCurrentRun(result.run);
      setCurrentScene(result.scene);
      setRunHistory((history) => upsertRun(history, result.run));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to start story.");
    } finally {
      setLoading(false);
    }
  }, []);

  const commitChoice = useCallback(
    async (input: { choiceId?: string; customChoiceText?: string }) => {
      if (!currentRun || !currentScene) {
        setError("No active run.");
        return;
      }

      setLoading(true);
      setError(undefined);

      try {
        const result = await storyService.choose(currentRun, currentScene, input);
        setCurrentRun(result.run);
        setCurrentScene(result.scene);
        setRunHistory((history) => upsertRun(history, result.run));
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to commit choice.");
      } finally {
        setLoading(false);
      }
    },
    [currentRun, currentScene]
  );

  const choose = useCallback(
    (choiceId: string) => commitChoice({ choiceId }),
    [commitChoice]
  );

  const chooseCustomChoice = useCallback(
    (customChoiceText: string) => commitChoice({ customChoiceText }),
    [commitChoice]
  );

  const restartCurrentRun = useCallback(async () => {
    const storyId = currentRun?.bookId ?? stories[0]?.id;

    if (!storyId) {
      setError("No story available to restart.");
      return;
    }

    await startStory(storyId);
  }, [currentRun?.bookId, startStory, stories]);

  useEffect(() => {
    void refreshStories();
  }, [refreshStories]);

  const selectedStory = useMemo(
    () => stories.find((story) => story.id === currentRun?.bookId),
    [currentRun?.bookId, stories]
  );

  const value = useMemo<ReaderRunContextValue>(
    () => ({
      stories,
      selectedStory,
      currentRun,
      currentScene,
      runHistory,
      loading,
      error,
      refreshStories,
      startStory,
      restartCurrentRun,
      choose,
      chooseCustomChoice,
      clearError: () => setError(undefined)
    }),
    [choose, chooseCustomChoice, currentRun, currentScene, error, loading, refreshStories, restartCurrentRun, runHistory, selectedStory, startStory, stories]
  );

  return <ReaderRunContext.Provider value={value}>{children}</ReaderRunContext.Provider>;
}

export function useReaderRun() {
  const context = useContext(ReaderRunContext);

  if (!context) {
    throw new Error("useReaderRun must be used within ReaderRunProvider.");
  }

  return context;
}
