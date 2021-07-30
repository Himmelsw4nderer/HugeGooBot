import { Message, MessageEmbed, Permissions } from "discord.js";
import DatabaseController from "../../database/DatabaseController";
import HugoCommand from "../../objects/HugoCommand";
import Logger from "../../tools/Logger";
import { noPermissions } from "../../tools/Response";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command
 */
const command = new HugoCommand(
  "changeprefix",
  ["changeprefix", "ChangePrefix", "change-prefix", "Change-Prefix"],
  "Changes the prefix of the server"
);

/**
 * The execute function of the command
 * @param message The message of the command
 * @param content The text of the command
 * @returns Is sucessful
 */
command.execute = (message, content) => {
  return new Promise<boolean>(async (resolve) => {
    if (message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const args = content?.split(" ") ?? new Array(1);
      if (!args.length ?? 0 >= 1){ 
        notMatchGuidelines(message, "");
        resolve(false);
        return;
      }
      const newPrefix = content?.split(" ")[1] ?? "";
      const regex = new RegExp(`[&.,!"§$%&/()=?*'+#~_:;°^]\S{0,2}`);
      if (regex.test(newPrefix)) {
        await DatabaseController.changePrefix(message.guild?.id ?? "", newPrefix);
        message.reply(`Successfully changed the prefix to ${newPrefix}`);
        logger.log(`Changed prefix of a guild to ${newPrefix}`);
        resolve(true);
        return;
      } else {
        notMatchGuidelines(message, newPrefix);
        resolve(false);
        return;
      }
    } else {
      message.reply(noPermissions());
      logger.log("User has not enough permissions");
      resolve(false);
      return;
    }
  });
};

/**
 * Send message if the guidelines do not match with the new prefix
 * @param message The message of the command
 * @param newPrefix The new prefix
 */
function notMatchGuidelines(message: Message, newPrefix: string) {
  const reply = new MessageEmbed()
    .setTitle(`Could not change the Prefix`)
    .setColor(0xe84e43)
    .setDescription(
      `Can not change the prefix to ${newPrefix}. It does not match with Guidelines`
    )
    .addFields(
      {
        name: `First Letter:`,
        value: `Must be one of &.,!"§$%&/()=?*'+#~_:;°^`,
        inline: true,
      },
      {
        name: `Next two Letters`,
        value: `Anything but whitespaces`,
        inline: true,
      }
    )
    .setFooter("HuGoBot")
    .setTimestamp();
  message.reply(reply);
  logger.log("New prefix does not match guidelines");
}

export default command;
