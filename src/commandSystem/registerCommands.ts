import HugoClient from "../objects/HugoClient";
import HugoCommand from "../objects/HugoCommand";
import Logger from "../tools/Logger";
import rawCommands from "./Commands";

const logger = new Logger("CommandLoader");

export default async (): Promise<void> => {
  //for every command in the list
  for await (const rawCommand of rawCommands) {
    //creating the path for the command
    const commandPath = `./commands/${rawCommand}`;
    //importing the command
    let command = await import(commandPath);
    //getting the command itself
    command = command.default;
    //validating the command
    if (command instanceof HugoCommand) {
      //pushing the command into the command list of the client
      HugoClient.commands.push(command);
      logger.log(`Loaded ${rawCommand} command`);
    } else {
      //logging the error
      logger.error(`Could not load ${rawCommand} command`);
    }
  }

  //calculating the size of the loading
  const loadedCommandLength: number = HugoClient.commands.length;
  const listedCommandLength: number = rawCommands.length;

  //looing the result of the command loading
  logger.log(
    `Loaded ${loadedCommandLength} out of ${listedCommandLength} command/s`
  );
};
