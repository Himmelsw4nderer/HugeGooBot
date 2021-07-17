import HugoClient from "../../../objects/HugoClient";
import HugoCommand from "../../../objects/HugoCommand";
import Logger from "../../../tools/Logger";
import HugoMusicController from "../../../objects/music/HugoMusicController";
import { TextChannel } from "discord.js";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command
 */
const command = new HugoCommand(
  "play",
  ["play", "Play", "p"],
  "Adds a song to the playlist if there is no aktiv"
);

/**
 * The execute function of the command
 * @param message The message of the command
 * @param content The text of the command
 * @returns Is sucessful
 */
command.execute = (message, content) => {
  return new Promise<boolean>(async (resolve) => {
    if (message.channel instanceof TextChannel) {
      if (content?.split(" ").length ?? 0 < 2) {
        const links = content?.split(" ").slice(1);
        const link = (links?.toString() ?? "").replace(/,/g, " ");
        if (link) {
          const memberVoice = message.member?.voice.channel;
          if (memberVoice) {
            let botVoice = HugoClient.voice?.connections.get(
              message.guild?.id ?? ""
            );
            if (!botVoice || memberVoice == botVoice.channel) {
              await HugoMusicController.play(
                memberVoice,
                link,
                message.author.id,
                message.channel
              );
              logger.log("Sending play request to controller");
            }
            resolve(true);

            return
          }
        }
      }
    }
    message.reply("something went wrong")
    resolve(false);
  });
};

export default command;
