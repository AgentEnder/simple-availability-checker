#!/usr/bin/env node
import yargs from "yargs/yargs";
import { registerOptions, checkHandler } from "./commands/check";

if (require.main === module) {
    let program = yargs(process.argv.slice(2)).scriptName(
        "simple-availability-checker"
    );
    if (
        registerOptions(program)
    ) {
        checkHandler(program.argv);
    }
}
