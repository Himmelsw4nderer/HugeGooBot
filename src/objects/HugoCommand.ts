import { Message } from "discord.js";

/**
 * A basic command
 */
export default class HugoCommand {
  /**The name of the command */
  name: string;
  /**The trigger words of the command */
  trigger: string[];
  /**The describtion of the command */
  description: string;

  /**
   * Creatges a incetance of HugoCommand
   * @param name The name of the command
   * @param trigger The trigger words of the command
   * @param description The describtion of the command
   */
  constructor(name: string, trigger?: string[], description?: string) {
    this.name = name;
    this.trigger = trigger ?? new Array(0);
    this.description = description ?? "";
  }

  /**
   * The execute function will be called by the message event if it the command gets executed
   * @param message the message triggering the command
   * @param content the content of the message
   * @returns if sucessfull
   */
  async execute(message: Message, content?: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      //sending message if their is no edited command yet
      message.reply("This command has no specified function yet");
      resolve(true);
    });
  }
}
