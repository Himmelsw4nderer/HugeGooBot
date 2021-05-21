import { MessageEmbed } from "discord.js"
import HugoClient from "../../objects/HugoClient"
import HugoCommand from "../../objects/HugoCommand"
import dotenv from 'dotenv'
dotenv.config({ path:'./src/config.env' })
import Logger from "../../tools/Logger"
const logger = new Logger('Command')

//creating the command
const uptimeCommand = new HugoCommand('SystemInfo', ['sys', 'syteminfo', 'SystemInfo', 'sysinfo', 'sys-info', 'system-info'], 'Displays the bots system info')

function  millisecToDate(millisec: number) : string {
    //milliseconds to seconds
    let secs = Math.floor(millisec / 1000)
    //calculatíng the minutes
    let mins = Math.floor(secs / 60)
    //calculating the seconds without the minutes
    secs -= mins * 60
    //calculating hours
    let hours = Math.floor(mins / 60)
    //calculating the minutes without the hours
    mins -= hours * 60
    //calculating days
    let days = Math.floor(hours / 24)
    //calculating the hours without the days
    hours -= days * 24 

    return `${days}days ${hours}hours ${mins}min ${secs}sec`
}

uptimeCommand.execute = message => {
    const client = HugoClient
    let time: number = 0
    //callculating uptime while checking if client is not null
    if(client.uptime) time = client.uptime
    //constructing the response
    const reply = new MessageEmbed()
    .setTitle(`Systeminfo`)
    .setColor(process.env.COLOR?? 0x00000)
    .setDescription(`The current systeminfo of the HugoBot`)
    .addFields(
        { name: `Runtime:`, value: millisecToDate(time) },
    )
    .setFooter('HuGoBot')
    .setTimestamp();

    //replying
    message.reply(reply)
    logger.log('Command sucessfully executed')
};

export default uptimeCommand