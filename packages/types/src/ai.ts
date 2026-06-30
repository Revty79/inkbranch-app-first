import type { ScenePackage, SceneResult } from "./scene";

export interface AIProvider {
  readonly id: string;
  readonly displayName: string;
  generateScene(input: ScenePackage): Promise<SceneResult>;
}
