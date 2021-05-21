import { Message } from "discord.js";


export default class HugoCommand{
    //name of the command
    name: string;
    //other triggers
    trigger: string[];

    constructor(name: string, trigger?: string[]){
        this.name = name;
        this.trigger = trigger ?? new Array(0);
    }

    //this function will execute when command is triggerd
    execute(message: Message): void{
        message.reply('This command has no specified function yet')
    }
}