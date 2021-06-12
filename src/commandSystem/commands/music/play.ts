import HugoClient from "../../../objects/HugoClient";
import HugoCommand from "../../../objects/HugoCommand";
import Logger from "../../../tools/Logger";
import HugoMusicController from "../../../objects/music/HugoMusicController";
import { TextChannel } from "discord.js";
const logger = new Logger("Command");

//creating the command
const command = new HugoCommand(
  "play",
  ["play", "Play", "p"],
  "Adds a song to the playlist if there is no aktiv"
);

command.execute = (message, content) => {
  return new Promise<boolean>(async (resolve) => {
    //if it is in a text channel
    if (message.channel instanceof TextChannel) {
      //if it is in a valid format
      if (content?.split(" ").length ?? 0 < 2) {
        //getting the link in the request
        const links = content?.split(" ").slice(1);
        const link = (links?.toString() ?? "").replace(/,/g, " ");
        //checking if there are link
        if (link) {
          //the voice channel the member is currently activ in
          const memberVoice = message.member?.voice.channel;
          //check if member is in voicechannel
          if (memberVoice) {
            //the voice channel the bot is on from the specific discord server
            let botVoice = HugoClient.voice?.connections.get(
              message.guild?.id ?? ""
            );
            //check if bot is not in a voicechannel of the server or both are in the same voice
            if (!botVoice || memberVoice == botVoice.channel) {
              //playing the song
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
