import {
  GuildMember,
  TextChannel,
  VoiceChannel,
  Permissions,
} from "discord.js";
import HugoMusicPlayer from "./HugoMusicPlayer";
import Logger from "../../tools/Logger";
import YouTube from "youtube-sr";
import HugoMusicSong from "./HugoMusicSong";
const logger = new Logger("MusicController");

import dotenv from "dotenv";
dotenv.config({ path: "./src/config.env" });

let players: HugoMusicPlayer[] = new Array();

class HugoMusicController {
  constructor(){
  }
  
  async play(
    channel: VoiceChannel,
    songString: string,
    memberId: string,
    textchannel: TextChannel
  ) {
    //searching on youtube for the video
    const searchResult = await YouTube.searchOne(songString, "video" );
    //parsing the searchresult
    const song: HugoMusicSong = new HugoMusicSong(
      searchResult.id ?? "",
      searchResult.title ?? "",
      searchResult.channel?.name ?? "",
      memberId
    );
    //the id of the guil
    const guildId = channel.guild.id;
    //the player of the server
    let player = this.getPlayer(guildId);
    //if there is a aktiv player already
    if (!player) {
      //adding a new player
      await this.addPlayer(channel, textchannel);
      //getting the newly added player
      player = this.getPlayer(guildId);
    }
    if (player) {
      //add the song to the quene
      player.play(song);
    }
  }

  async skip(member: GuildMember | null, guildId: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      //get the player of thee server
      const player = this.getPlayer(guildId);
      //get the song from the player
      const song = player?.getCurrentSong();
      //if there is a song
      if (song && member) {
        //if the member is admin or suggested the song
        if (
          member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ||
          member.id == song.memberId
        ) {
          //skipping the song
          await player?.nextSong();
          resolve(true);
          return;
        }
      }
      resolve(false);
    });
  }

  async remove(member: GuildMember | null, guildId: string, pos: number) {
    return new Promise<boolean>(async (resolve) => {
      logger.debug(pos);
      //skipping if index is 0
      if (pos == 0) {
        resolve(this.skip(member, guildId));
        return;
      }
      //pos -- to get the value from the arraylist
      pos--;
      logger.debug(pos);
      //get the player of thee server
      const player = this.getPlayer(guildId);
      if (player) {
        if (
          member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ||
          player.getSong(pos)?.memberId == member?.id
        ) {
          player.removeSong(pos);
          resolve (true);
          return
        }
      }
      resolve(false)
    });
  }

  async addPlayer(channel: VoiceChannel, textchannel: TextChannel) {
    //joining the voice channel
    const connection = await channel.join();
    //if the connection is sucessfull
    if (connection) {
      //adding the new player to the list
      players.push(new HugoMusicPlayer(connection, textchannel));
      logger.log("Added player");
    }
  }

  getPlayer(guildId: string): HugoMusicPlayer | null {
    //for each playernpm i youtube-sr
    for (const player of players) {
      //if they have the same guild id
      if (player.getGuildId() == guildId) {
        //returns the player
        return player;
      }
    }
    //there is no player with that id
    return null;
  }

  dropPlayer(guildId: string) {
    let oldplayer: HugoMusicPlayer | undefined;
    players = players.filter((player) => {
      oldplayer = player;
      //setting up the condition
      const condition = player.getGuildId() != guildId;
      //finnaly remove player from list
      return condition;
    });
    if (oldplayer) oldplayer.drop();
    logger.log("Dropped player");
  }
}

export default new HugoMusicController();
