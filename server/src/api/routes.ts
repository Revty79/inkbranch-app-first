import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { StoryRuntimeService } from "../runtime/StoryRuntimeService";

function getRouteParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function createApiRouter(service: StoryRuntimeService = new StoryRuntimeService()): Router {
  const router = Router();

  router.get("/health", (_request: Request, response: Response) => {
    response.json({
      ok: true,
      service: "inkbranch-server"
    });
  });

  router.get("/stories", (_request: Request, response: Response) => {
    response.json({
      stories: service.listStories()
    });
  });

  router.post("/runs/start", async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body as { bookId?: string };
      const result = await service.startRun(body.bookId);
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/runs/:runId", (request: Request, response: Response, next: NextFunction) => {
    try {
      const runId = getRouteParam(request.params.runId);

      if (!runId) {
        response.status(400).json({ error: { message: "runId is required." } });
        return;
      }

      response.json(service.getRun(runId));
    } catch (error) {
      next(error);
    }
  });

  router.post("/runs/:runId/choose", async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body as { choiceId?: string; customChoiceText?: string };

      if (!body.choiceId && !body.customChoiceText) {
        response.status(400).json({ error: { message: "choiceId or customChoiceText is required." } });
        return;
      }

      const runId = getRouteParam(request.params.runId);

      if (!runId) {
        response.status(400).json({ error: { message: "runId is required." } });
        return;
      }

      const result = await service.choose(runId, {
        choiceId: body.choiceId,
        customChoiceText: body.customChoiceText
      });
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
