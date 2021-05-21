import { Message } from "discord.js";
import HugoClient from "../../objects/HugoClient";
import Logger from "../../tools/Logger";
const logger = new Logger(`Command`)
//loading environmental variables
import dotenv from 'dotenv'
dotenv.config({ path:'././././config.env'})

export default function execute(message: Message) {
    //getting the commands
    const commands = HugoClient.commands
    //message content
    let content = message.content
    //if it starts with prefix is a command
    if(content.startsWith(process.env.PREFIX ?? '')){
        //content without prefix
       content = content.substr(1)
        //for each command
        for(const command of commands) {
            //for each trigger in the command
            for(const trigger of command.trigger){
                //if the content starts with the command
                if(content.startsWith(trigger)){
                    //executing the command function
                    command.execute(message)
                    logger.log(`Executing ${command.name} command`)
                }
            }
        }
    }
}
