import HugoCommand from "../../../objects/HugoCommand";
import Logger from "../../../tools/Logger";
import { getWord } from "../../../tools/Language";
import HugoMusicController from "../../../objects/music/HugoMusicController";
import HugoClient from "../../../objects/HugoClient";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command
 */
const command = new HugoCommand(
  "skip",
  ["skip", "Skip", "s"],
  "Skips the currently playing song"
);

/**
 * The execute function of the command
 * @param message The message of the command
 * @returns Is sucessful
 */
command.execute = (message) => {
  return new Promise<boolean>(async (resolve) => {
    const memberVoice = message.member?.voice.channel;
    let botVoice = HugoClient.voice?.connections.get(message.guild?.id ?? "");
    if (memberVoice == botVoice?.channel) {
      logger.log("Sending skip request to controller");
      const isSuccesfull = await HugoMusicController.skip(
        message.member,
        message.guild?.id ?? ""
      );
      if (!isSuccesfull)
        message.reply(await getWord(message.guild?.id ?? "", 1));
      resolve(isSuccesfull);
    } else {
      resolve(false);
      message.reply(`Bot is not in a voice channel with you`);
    }
  });
};

export default command;
