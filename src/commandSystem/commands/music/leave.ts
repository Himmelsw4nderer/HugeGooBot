import HugoClient from "../../../objects/HugoClient";
import HugoCommand from "../../../objects/HugoCommand";
import HugoMusicController from "../../../objects/music/HugoMusicController";
import Logger from "../../../tools/Logger";
const logger = new Logger("Command");

//creating the command
const command = new HugoCommand(
  "leave",
  ["leave", "Leave", "l"],
  "Leaves the voice channel!"
);

command.execute = (message) => {
  return new Promise<boolean>(async (resolve) => {
    //the voice channel the bot is on from the specific discord server
    const botVoice = HugoClient.voice?.connections.get(message.guild?.id ?? "");
    //the voice channel the member is currently activ in
    const memberVoice = message.member?.voice.channel;
    //if they are in the same channel
    if (botVoice && memberVoice == botVoice.channel) {
      //disconnect from the voice channel
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
