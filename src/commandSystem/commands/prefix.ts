import DatabaseController from "../../database/DatabaseController";
import HugoCommand from "../../objects/HugoCommand";
import Logger from "../../tools/Logger";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command
 */
const command = new HugoCommand(
  "prefix",
  ["prefix", "Prefix"],
  "Shows the current prefix on this server"
);

/**
 * The execute function of the command
 * @param message The message of the command
 * @returns Is sucessful
 */
command.execute = (message) => {
  return new Promise<boolean>(async (resolve) => {
    const server = await DatabaseController.getServerById(
      message.guild?.id ?? ""
    );
    const prefix = (await server.prefix) ?? "!";
    const reply = `The prefix on this server is ${prefix}`;
    message.reply(reply);
    logger.log("Command sucessfully executed");
    resolve(true);
  });
};

export default command;
