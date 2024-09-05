#!/usr/bin/env node
import yargs from "yargs/yargs";
import { registerOptions, checkHandler } from "./commands/check";
import { cli } from "cli-forge";

if (require.main === module) {
  cli("simple-availability-checker", {
    builder: (argv) => registerOptions(argv),
    handler: checkHandler,
  }).forge();
}
