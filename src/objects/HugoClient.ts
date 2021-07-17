import { Client, ClientOptions } from "discord.js";
import HugoCommand from "./HugoCommand";

/**
 * The client options
 */
const clientOptions: ClientOptions = {
  messageCacheMaxSize: 500,
  ws: {
    intents: [
      "GUILDS",
      "GUILD_MESSAGES",
      "GUILD_MESSAGE_REACTIONS",
      "DIRECT_MESSAGES",
      "DIRECT_MESSAGE_REACTIONS",
      "GUILD_VOICE_STATES",
    ],
  },
};

/**
 * The client
 */
class HugoClient extends Client {
  constructor() {
    super(clientOptions);
    this.commands = [];
  }
  /**The commands */
  commands: HugoCommand[];
  /**The events */
  events: string[] = [];
}

export default new HugoClient();
