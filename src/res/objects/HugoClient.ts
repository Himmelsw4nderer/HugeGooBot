import { Client, ClientOptions } from "discord.js";
import HugoCommand from "./HugoCommand";

const clientOptions: ClientOptions = {
    messageCacheMaxSize: 500,
    disableMentions: 'everyone',
    ws: {
        intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'],
    },
}

class HugoClient extends Client{
    constructor(){
        super(clientOptions)
        this.commands = [];
    }

    commands: HugoCommand[];
}


export default new HugoClient();