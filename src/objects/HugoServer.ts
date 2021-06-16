import { Snowflake } from "discord.js";

export default class HugoServer {
  id: Snowflake;
  prefix: string | null | undefined;
  tiktokchannel: string | undefined;
  tiktoktextchannel: string | undefined;
  tiktoklastvideo: string | undefined;

  constructor(
    id: string,
    prefix: string | null | undefined,
    tiktokchannel?: string,
    tiktoktextchannel?: string,
    tiktoklastvideo?: string
  ) {
    this.id = id;
    this.prefix = prefix;
    this.tiktokchannel = tiktokchannel;
    this.tiktoktextchannel = tiktoktextchannel;
    this.tiktoklastvideo = tiktoklastvideo;
  }
}
