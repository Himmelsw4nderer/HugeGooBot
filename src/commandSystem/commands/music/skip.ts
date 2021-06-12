import HugoCommand from "../../../objects/HugoCommand";
import Logger from "../../../tools/Logger";
import HugoMusicController from "../../../objects/music/HugoMusicController";
import HugoClient from "../../../objects/HugoClient";
const logger = new Logger("Command");

//creating the command
const command = new HugoCommand(
  "skip",
  ["skip", "Skip", "s"],
  "Skips the currently playing song"
);

command.execute = (message, content) => {
  return new Promise<boolean>(async (resolve) => {
    //the voice channel the member is currently activ in
    const memberVoice = message.member?.voice.channel;
    //the voice channel the bot is on from the specific discord server
    let botVoice = HugoClient.voice?.connections.get(message.guild?.id ?? "");
    //check if bot is not in a voicechannel of the server or both are in the same voice
    if (memberVoice == botVoice?.channel) {
      logger.log("Sending skip request to controller");
      //executing command and saving the result
      const isSuccesfull = await HugoMusicController.skip(
        message.member,
        message.guild?.id ?? ""
      );
      //sending reply if not sucessful
      if (!isSuccesfull)
        message.reply(
          "You don't have permissions to do that and neither did you suggested the song try the voteskip command"
        );
      //resolving
      resolve(isSuccesfull);
    } else {
      resolve(false);
      message.reply(`Bot is not in a voice channel with you`);
    }
  });
};

export default command;
