import HugoClient from "../../../objects/HugoClient";
import HugoCommand from "../../../objects/HugoCommand";
import Logger from "../../../tools/Logger";
import HugoMusicController from "../../../objects/HugoMusicController";
import { TextChannel } from "discord.js";
import exp from "constants";
const logger = new Logger("Command");

//creating the command
const command = new HugoCommand(
  "skip",
  ["skip", "Skip", "s"],
  "Skips the currently playing song"
);

command.execute = (message, content) => {
    return new Promise<boolean>(async (resolve) => {
        resolve(
          await HugoMusicController.skip(
            message.member,
            message.guild?.id ?? ""
          )
        );
    });
}

export default command