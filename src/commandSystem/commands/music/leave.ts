import HugoClient from "../../../objects/HugoClient";
import HugoCommand from "../../../objects/HugoCommand";
import HugoMusicController from "../../../objects/music/HugoMusicController";
import Logger from "../../../tools/Logger";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command
 */
const command = new HugoCommand(
  "leave",
  ["leave", "Leave", "l"],
  "Leaves the voice channel!"
);

/**
 * The execute function of the command
 * @param message The message of the command
 * @returns Is sucessful
 */
command.execute = (message) => {
  return new Promise<boolean>(async (resolve) => {
    const botVoice = HugoClient.voice?.connections.get(message.guild?.id ?? "");
    const memberVoice = message.member?.voice.channel;
    if (botVoice && memberVoice == botVoice.channel) {
      botVoice.disconnect();
      HugoMusicController.dropPlayer(message.guild?.id ?? "");
      resolve(true);
      logger.log(`Command sucessfully executed`);
    } else {
      resolve(false);
      message.reply(`Bot is not in a voice channel with you`);
    }
  });
};

export default command;
