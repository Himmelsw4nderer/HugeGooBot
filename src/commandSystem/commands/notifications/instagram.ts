import HugoCommand from "../../../objects/HugoCommand";
import DatabaseController from "../../../database/DatabaseController";
import Logger from "../../../tools/Logger";
import { Permissions } from "discord.js";
import { noPermissions } from "../../../tools/Response";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command itself
 */
const command = new HugoCommand(
  "instagram",
  ["instagram", "Instagram"],
  "Creates a instagramm notification that will be displayed in the channel"
);

/**
 * The execute function
 */
command.execute = async (message, content) => {
  return new Promise<boolean>(async (resolve) => {
    content = content?.substr(11);
    if (message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      if (content) {
        await DatabaseController.newNotification(
          "instagram",
          message.channel.id,
          content
        );
        logger.log("Command sucessfully executed");
        resolve(true);
        return;
      }
    } else {
      message.reply(noPermissions());
    }
    resolve(false);
  });
};

export default command;