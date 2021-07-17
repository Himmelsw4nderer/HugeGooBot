import HugoCommand from "../../../objects/HugoCommand"
import DatabaseController from "../../../database/DatabaseController";
import Logger from "../../../tools/Logger";
import { Permissions } from "discord.js";
import { noPermissions } from "../../../tools/StandardReplys";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command
 */
const command = new HugoCommand(
  "removenotification",
  [
    "removenotification",
    "removeNotification",
    "rmnotification",
    "rmNotification",
  ],
  "Removes the tiktok anouncement channel"
);

/**
 * The execute function
 */
command.execute = async (message, content) => {
    return new Promise<boolean>(async (resolve) => {
        if (message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await DatabaseController.removeNotification(message.guild?.id ?? "");
            logger.log("Command sucessfully executed");
            resolve(true);
            return;
        } else {
            message.reply(noPermissions());
        }
        resolve(false)
    });
}

export default command