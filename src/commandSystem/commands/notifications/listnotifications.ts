import HugoCommand from "../../../objects/HugoCommand";
import Logger from "../../../tools/Logger";
import { MessageEmbed, Permissions } from "discord.js";
import { noPermissions } from "../../../tools/Response";
import DatabaseController from "../../../database/DatabaseController";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command
 */
const command = new HugoCommand(
  "listnotifications",
  ["listnotifications", "listNotifications", "lsnotifications", "lsNotifications"],
  "Lists all notifications of the channel"
);

/**
 * The execute function
 */
command.execute = async (message, content) => {
  return new Promise<boolean>(async (resolve) => {
    if (message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        const notifications = await DatabaseController.getNotificationsByChannel(message.channel.id);
        const embed = new MessageEmbed()
          .setTitle(`Notification list`)
          .setColor(process.env.COLOR ?? 0x00000)
          .setFooter("HuGoBot")
          .setTimestamp();
        let pos = 0;
        for (let notification of notifications){
          pos++;
          embed.addField(`${pos}.`, `${notification.place} on ${notification.type}`);
        }
        if(notifications.length == 0) embed.addField("No notifications", "There are currently no notification in this channel")
        message.reply(embed);
        logger.debug(notifications.length)
      return;
    } else {
      message.reply(noPermissions());
    }
    resolve(false);
  });
};

export default command;
