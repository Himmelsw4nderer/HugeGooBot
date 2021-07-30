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
  "youtube",
  ["youtube", "YouTube", "Youtube"],
  "Creates a youtube notification that will be displayed in the channel"
);

/**
 * The execute function
 */
command.execute = async (message, content) => {
  return new Promise<boolean>(async (resolve) => {
    content = content?.substr(8);
    if (message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      if (content) {
        await DatabaseController.newNotification(
          "youtube",
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
