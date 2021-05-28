import { Message } from "discord.js";

export default class HugoCommand {
  //name of the command
  name: string;
  //other triggers
  trigger: string[];
  //description of the command
  description: string;

  constructor(name: string, trigger?: string[], description?: string) {
    this.name = name;
    this.trigger = trigger ?? new Array(0);
    this.description = description ?? "";
  }

  //this function will execute when command is triggerd
  async execute(message: Message, content?: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      //sending message if their is no edited command yet
      message.reply("This command has no specified function yet");
      resolve(true);
    });
  }
}
