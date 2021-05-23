import { MessageEmbed } from "discord.js";
import HugoClient from "../../objects/HugoClient";
import HugoCommand from "../../objects/HugoCommand";
import dotenv from "dotenv";
dotenv.config({ path: "./src/config.env" });
import Logger from "../../tools/Logger";
import loadedcommands from "../Commands";
import loadedevents from "../../eventSystem/Events";
const logger = new Logger("Command");

//creating the command
const command = new HugoCommand(
  "systeminfo",
  [
    "sys",
    "syteminfo",
    "SystemInfo",
    "sysinfo",
    "sys-info",
    "system-info",
    "System-Info",
  ],
  "Displays the bots system info"
);

function millisecToDate(millisec: number): string {
  //milliseconds to seconds
  let secs = Math.floor(millisec / 1000);
  //calculatíng the minutes
  let mins = Math.floor(secs / 60);
  //calculating the seconds without the minutes
  secs -= mins * 60;
  //calculating hours
  let hours = Math.floor(mins / 60);
  //calculating the minutes without the hours
  mins -= hours * 60;
  //calculating days
  let days = Math.floor(hours / 24);
  //calculating the hours without the days
  hours -= days * 24;

  return `${days}days ${hours}hours ${mins}min ${secs}sec`;
}

function mapCommands(commands: HugoCommand[]): string[] {
  //returning the map
  return commands.map((command: HugoCommand): string => {
    //returning the name
    return command.name.toLowerCase();
  });
}

command.execute = (message) => {
  return new Promise<void>(() => {
    const client = HugoClient;
    let time: number = 0;
    //callculating uptime while checking if client is not null
    if (client.uptime) time = client.uptime;
    //constructing the response
    const reply = new MessageEmbed()
      .setTitle(`Systeminfo`)
      .setColor(process.env.COLOR ?? 0x00000)
      .setDescription(`The current systeminfo of the HugoBot`)
      .addFields(
        { name: `Runtime:`, value: millisecToDate(time) },
        {
          name: `Active Commands`,
          value: `Loaded ${HugoClient.commands.length}/${
            loadedcommands.length
          } commands: ${mapCommands(HugoClient.commands)}`,
          inline: true,
        },
        {
          name: `Active Events`,
          value: `Loaded ${HugoClient.events.length}/${loadedevents.length} events: ${loadedevents}`,
          inline: true,
        }
      )
      .setFooter("HuGoBot")
      .setTimestamp();

    //replying
    message.reply(reply);
    logger.log("Command sucessfully executed");
  });
};

export default command;
