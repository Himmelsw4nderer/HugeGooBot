import { Snowflake } from "discord.js";

export default class HugoServer {
  id: Snowflake;
  prefix: string | null | undefined;
  tiktokchannel: string | undefined;
  tiktoktextchannel: string | undefined;

  constructor(id: string, prefix: string | null | undefined, tiktokchannel?: string, tiktoktextchannel?: string) {
    this.id = id;
    this.prefix = prefix;
    this.tiktokchannel = tiktokchannel;
    this.tiktokchannel = tiktokchannel;
  }
}
