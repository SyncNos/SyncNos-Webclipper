import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function resolveRepoRoot(importMetaUrl) {
  const scriptDir = dirname(fileURLToPath(importMetaUrl));
  return resolve(scriptDir, "..", "..", "..");
}

export function resolveWebclipperRoot(repoRoot) {
  const projectRoot = repoRoot;
  if (!existsSync(join(projectRoot, "package.json"))) {
    throw new Error(`project root not found: ${projectRoot}`);
  }
  return projectRoot;
}

export function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { cwd, stdio: "inherit" });
  if (res.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed`);
}
