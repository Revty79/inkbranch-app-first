import type { AIProvider, ScenePackage, SceneResult } from "@inkbranch/types";
import { FakeAIProvider } from "@inkbranch/ai";

export class SceneGenerator {
  constructor(private readonly provider: AIProvider = new FakeAIProvider()) {}

  generate(scenePackage: ScenePackage): Promise<SceneResult> {
    return this.provider.generateScene(scenePackage);
  }
}
