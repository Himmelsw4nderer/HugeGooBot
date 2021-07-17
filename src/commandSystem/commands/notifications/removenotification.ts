import HugoCommand from "../../../objects/HugoCommand";
import Logger from "../../../tools/Logger";
import { Permissions } from "discord.js";
import { noPermissions } from "../../../tools/StandardReplys";
import DatabaseController from "../../../database/DatabaseController";

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
  "Removes a notification of this channel"
);

/**
 * The execute function
 */
command.execute = async (message, content) => {
  return new Promise<boolean>(async (resolve) => {
    if (message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const notifications = await DatabaseController.getNotificationsByChannel(
        message.channel.id
      );
      const posString = content?.split(" ")[1] ?? "0";
      const pos = +posString;
      if (0 < pos && pos <= notifications.length + 1) {
        DatabaseController.removeNotification(notifications[pos - 1].id);
        resolve(true);
        return;
      }
      message.reply("Thats not a valid notification position");
    } else {
      message.reply(noPermissions());
    }
    resolve(false);
  });
};

export default command;
