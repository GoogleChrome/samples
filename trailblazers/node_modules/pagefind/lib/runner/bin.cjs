#!/usr/bin/env node
const { spawnSync } = require("child_process");

const execname = "pagefind";
const execnames = ["pagefind_extended", "pagefind"];

(async () => {
  try {
    const { resolveBinaryPath } = await import("../resolveBinary.js");
    const args = process.argv.slice(2);
    const binaryPath = resolveBinaryPath(execnames);
    const verbose = args.filter((a) => /verbose|-v$/i.test(a)).length;
    if (verbose) {
      console.log(
        `${execname} npm wrapper: Running the executable at ${binaryPath}`,
      );
    }
    const processResult = spawnSync(binaryPath, args, {
      windowsHide: true,
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    if (verbose) {
      console.log(
        `${execname} npm wrapper: Process exited with status ${processResult.status}`,
      );
    }
    process.exit(processResult.status ?? 1);
  } catch (err) {
    console.error(`Failed to run ${execname} via the npx wrapper: ${err}`);
    console.error(
      `Please open an issue at https://github.com/pagefind/${execname} and paste this error message in full.`,
    );
    process.exit(1);
  }
})();
