import { GuildMember, TextChannel, VoiceChannel, Permissions, User } from "discord.js";
import HugoMusicPlayer from "./HugoMusicPlayer";
import Logger from "../tools/Logger";
import HugoMusicSong from "./HugoMusicSong";
import Youtube from "youtube.ts";
const logger = new Logger("MusicController");

import dotenv from "dotenv";
dotenv.config({ path: "./src/config.env" });
const youtube = new Youtube(process.env.GOOGLE_API_KEY ?? "");

let players: HugoMusicPlayer[] = new Array();

class HugoMusicController {
  async play(
    channel: VoiceChannel,
    songString: string,
    memberId: string,
    textchannel: TextChannel
  ) {
    //searching on youtube for the video
    const searchResult = (
      await youtube.videos.search({
        part: "snippet",
        q: songString,
        maxResults: 1,
      })
    ).items[0];
    //parsing the searchresult
    const song: HugoMusicSong = new HugoMusicSong(
      searchResult.id.videoId,
      searchResult.snippet.title,
      searchResult.snippet.channelTitle,
      memberId
    );
    //the id of the guild
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

  async skip(member: GuildMember | null, guildId: string) : Promise<boolean>{
    return new Promise<boolean>(async (resolve) => {
      //get the player of thee server
      const player = this.getPlayer(guildId);
      //get the song from the player
      const song = player?.getSong();
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

  async addPlayer(channel: VoiceChannel, textchannel: TextChannel) {
    //joining the voice channel
    const connection = await channel.join();
    //if the connection is sucessfull
    if (connection) {
      //adding the new player to the list
      players.push(new HugoMusicPlayer(connection, youtube, textchannel));
      logger.log("Added player");
    }
  }

  getPlayer(guildId: string): HugoMusicPlayer | null {
    //for each player
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
