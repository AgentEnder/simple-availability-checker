import Enquirer from "enquirer";
import { ParsedArgs } from "@cli-forge/parser";
import { CLI } from "cli-forge";
import { loadOptionsFromProfile, saveProfile } from "../configuration";
import { startChecker } from "../core/checker";
import { SimpleAvailabilityCheckerConfig } from "../models";
import { removeKeysWhenValueUndefined } from "../utils";

type YargsRunArgs = Partial<SimpleAvailabilityCheckerConfig> & {
  profile?: string;
};

export function registerOptions<T extends ParsedArgs>(cli: CLI<T>) {
  return cli
    .option("profile", {
      alias: ["p"],
      description: "Load options from a saved profile",
      type: "string",
    })
    .option("url", {
      description: "What url should be checked?",
      type: "string",
    })
    .option("interval", {
      description: "How often should the check be performed",
      type: "number",
    })
    .option("forceInterval", {
      hidden: true,
      description: "Should the ddos protection be overridden?",
      type: "boolean",
    })
    .option("productName", {
      description: "Provides a readable product name.",
      type: "string",
    })
    .option("selector", {
      description: "What CSS selector should we use to detect availability?",
      type: "string",
    });
}

type PromptResponse = SimpleAvailabilityCheckerConfig &
  (
    | {
        save: false;
      }
    | { save: true; profileName: string }
  );

async function promptForMissingOptions(
  opts: Partial<SimpleAvailabilityCheckerConfig>
): Promise<SimpleAvailabilityCheckerConfig> {
  const enquirer = new Enquirer<PromptResponse>();
  const answers = await enquirer.prompt([
    {
      name: "url",
      type: "input",
      message: "What url should be checked?",
      skip: () => !!opts.url,
    },
    {
      name: "interval",
      type: "numeral",
      message: "How often should it be checked (s)?",
      skip: () => !!opts.interval,
    },
    {
      name: "selector",
      type: "input",
      message: "What CSS selector should we look for?",
      skip: () => !!opts.selector,
    },
    {
      name: "productName",
      type: "input",
      message: "What product name should we display in the alert?",
      skip: () => !!opts.productName,
    },
    {
      name: "save",
      type: "confirm",
      message: "Save this profile?",
    },
    {
      name: "profileName",
      type: "input",
      message: "Profile Name:",
      skip: function (this: any): boolean {
        return !this.enquirer.answers.save;
      },
    },
  ]);
  const value: SimpleAvailabilityCheckerConfig & {
    save?: boolean;
    profileName?: string;
  } = { ...opts, ...answers };
  delete value.save;
  delete value.profileName;
  if (answers.save) {
    const profileName = answers.profileName;
    saveProfile(profileName, value);
  }
  return value;
}

export type ArgumentsOf<T> = T extends CLI<infer T> ? T : never;

export const checkHandler = async (
  args: ArgumentsOf<ReturnType<typeof registerOptions>>
) => {
  let partial: Partial<SimpleAvailabilityCheckerConfig> =
    removeKeysWhenValueUndefined({
      forceInterval: args.forceInterval,
      interval: args.interval,
      selector: args.selector,
      url: args.url,
      productName: args.productName,
    });
  let options: SimpleAvailabilityCheckerConfig;
  if (args.profile) {
    options = loadOptionsFromProfile(args.profile, partial);
  } else {
    options = await promptForMissingOptions(partial);
  }
  startChecker(options);
};
