import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vite = path.join(root, "node_modules", ".bin", "vite");

execFileSync(process.execPath, [path.join(root, "scripts", "generate-faq-schema.mjs")], {
  cwd: root,
  stdio: "inherit",
});
execFileSync(vite, ["build"], { cwd: root, stdio: "inherit" });
execFileSync(vite, ["build", "--ssr", "src/entry-server.jsx", "--outDir", "dist-ssr"], {
  cwd: root,
  stdio: "inherit",
});
execFileSync(process.execPath, [path.join(root, "scripts", "prerender.mjs")], {
  cwd: root,
  stdio: "inherit",
});
