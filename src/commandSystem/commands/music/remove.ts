import HugoCommand from "../../../objects/HugoCommand";
import Logger from "../../../tools/Logger";
import HugoMusicController from "../../../objects/music/HugoMusicController";
import { TextChannel } from "discord.js";
import HugoClient from "../../../objects/HugoClient";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command
 */
const command = new HugoCommand(
  "remove",
  ["remove", "Remove"],
  "Removes specifiq song"
);

/**
 * The execute function of the command
 * @param message The message of the command
 * @param content The text of the command
 * @returns Is sucessful
 */
command.execute = (message, content) => {
  return new Promise<boolean>(async (resolve) => {
    const memberVoice = message.member?.voice.channel;
    let botVoice = HugoClient.voice?.connections.get(message.guild?.id ?? "");
    if (memberVoice == botVoice?.channel) {
      if (message.channel instanceof TextChannel) {
        const args: string[] | undefined = content?.split(" ");
        if (args) {
          if (args?.length ?? 0 > 2) {
            const pos: number = parseInt(args[1] ?? "0") ?? 0;
            logger.log("Sending remove request to controller");
            const isSuccesfull = await HugoMusicController.remove(
              message.member,
              message.guild?.id ?? "",
              pos
            );
            if (!isSuccesfull)
              message.reply(
                "You don't have permissions to do that and neither did you suggested the song"
              );
            resolve(isSuccesfull);
          }
        }
      }
    } else {
      resolve(false);
      message.reply(`Bot is not in a voice channel with you`);
    }
  });
};

export default command;
