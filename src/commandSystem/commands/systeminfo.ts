import { MessageEmbed } from "discord.js";
import HugoClient from "../../objects/HugoClient";
import HugoCommand from "../../objects/HugoCommand";
import dotenv from "dotenv";
dotenv.config({ path: "./src/config.env" });
import Logger from "../../tools/Logger";
import loadedcommands from "../Commands";
import loadedevents from "../../eventSystem/Events";

/**
 * The logger
 */
const logger = new Logger("Command");

/**
 * The command
 */
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

/**
 * The date from the date in miliseconds
 * @param millisec The runtime in milisec
 * @returns The date
 */
function millisecToDate(millisec: number): string {
  let secs = Math.floor(millisec / 1000);
  let mins = Math.floor(secs / 60);
  secs -= mins * 60;
  let hours = Math.floor(mins / 60);
  mins -= hours * 60;
  let days = Math.floor(hours / 24);
  hours -= days * 24;

  return `${days}days ${hours}hours ${mins}min ${secs}sec`;
}

/**
 * Gets the names of a list of commands
 * @param commands The loaded commands
 * @returns The command names
 */
function mapCommands(commands: HugoCommand[]): string[] {
  return commands.map((command: HugoCommand): string => {
    return command.name.toLowerCase();
  });
}

/**
 * The execute function of the command
 * @param message The message of the command
 * @returns Is sucessful
 */
command.execute = (message) => {
  return new Promise<boolean>((resolve) => {
    const client = HugoClient;
    let time: number = 0;
    if (client.uptime) time = client.uptime;
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

    message.reply(reply);
    logger.log("Command sucessfully executed");
    resolve(true)
  });
};

export default command;
