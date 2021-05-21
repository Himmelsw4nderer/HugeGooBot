import HugoCommand from "../../objects/HugoCommand";
import Logger from "../../tools/Logger";
const logger = new Logger('Command')

//creating the command
const pingCommand = new HugoCommand('Ping', ['ping', 'Ping'], 'Ping!')

pingCommand.execute = message => {
    //constructing reply
    const reply = 'pong'
    //sending response
    message.reply(reply)
    logger.log('Command sucessfully executed')
};

export default pingCommand