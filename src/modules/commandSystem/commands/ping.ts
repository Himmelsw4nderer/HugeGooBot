import HugoCommand from "../../objects/HugoCommand";

const pingCommand = new HugoCommand('Ping', ['ping', 'Ping'])

pingCommand.execute= message => {
    message.reply('pong')
};

export default pingCommand