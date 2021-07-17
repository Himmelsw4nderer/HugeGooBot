import HugoClient from "../objects/HugoClient";
import HugoCommand from "../objects/HugoCommand";
import Logger from "../tools/Logger";
import rawCommands from "./Commands";

/**
 * The logger
 */
const logger = new Logger("CommandLoader");

/**
 * The function that loades the commands
 */
export default async (): Promise<void> => {
  for await (const rawCommand of rawCommands) {
    const commandPath = `./commands/${rawCommand}`;
    let command = await import(commandPath);
    command = command.default;
    if (command instanceof HugoCommand) {
      HugoClient.commands.push(command);
      logger.log(`Loaded ${rawCommand} command`);
    } else {
      logger.error(`Could not load ${rawCommand} command`);
    }
  }

  const loadedCommandLength: number = HugoClient.commands.length;
  const listedCommandLength: number = rawCommands.length;

  logger.log(
    `Loaded ${loadedCommandLength} out of ${listedCommandLength} command/s`
  );
};
