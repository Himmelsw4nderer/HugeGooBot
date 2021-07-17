import HugoCommand from "../../objects/HugoCommand";
import Logger from "../../tools/Logger";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command
 */
const command = new HugoCommand("ping", ["ping", "ping", "Ping"], "Ping!");

/**
 * The execute function of the command
 * @param message The message of the command
 * @returns Is sucessful
 */
command.execute = (message) => {
  return new Promise<boolean>((resolve) => {
    const reply = "pong";
    message.reply(reply);
    logger.log("Command sucessfully executed");
    resolve(true);
  });
};

export default command;
