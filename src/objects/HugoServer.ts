import { Snowflake } from "discord.js";

export default class HugoServer {
  id: Snowflake;
  prefix: string | null | undefined;

  constructor(id: string, prefix: string | null | undefined) {
    this.id = id;
    this.prefix = prefix;
  }
}
