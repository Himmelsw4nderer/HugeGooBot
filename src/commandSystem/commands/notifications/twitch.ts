import HugoCommand from "../../../objects/HugoCommand";
import DatabaseController from "../../../database/DatabaseController";
import Logger from "../../../tools/Logger";
import { Permissions } from "discord.js";
import { getWord } from "../../../tools/Language";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command itself
 */
const command = new HugoCommand(
  "twitch",
  ["twitch", "Twitch"],
  "Creates a twitch notification that will be displayed in the channel"
);

/**
 * The execute function
 */
command.execute = async (message, content) => {
  return new Promise<boolean>(async (resolve) => {
    content = content?.substr(7);
    if (message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      if (content) {
        await DatabaseController.newNotification(
          "twitch",
          message.channel.id,
          content
        );
        logger.log("Command sucessfully executed");
        resolve(true);
        return;
      }
    } else {
      message.reply(await getWord(message.guild?.id ?? "", 1));
    }
    resolve(false);
  });
};

export default command;
