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

/**
 * The logger
 */
const logger = new Logger("MusicController");

/**
 * The active music players
 */
let players: HugoMusicPlayer[] = new Array();

/**
 * This controls every interaktion with music players
 */
class HugoMusicController {
  
  /**
   * Plays a song
   * @param channel The voice channel of the user
   * @param songString The song title or link
   * @param memberId The discord id of the user
   * @param textchannel The text chanel in witch the message was send
   */
  async play(
    channel: VoiceChannel,
    songString: string,
    memberId: string,
    textchannel: TextChannel
  ) {
    const searchResult = await YouTube.searchOne(songString, "video" );
    const song: HugoMusicSong = new HugoMusicSong(
      searchResult.id ?? "",
      searchResult.title ?? "",
      searchResult.channel?.name ?? "",
      memberId
    );
    const guildId = channel.guild.id;
    let player = this.getPlayer(guildId);
    if (!player) {
      await this.addPlayer(channel, textchannel);
      player = this.getPlayer(guildId);
    }
    if (player) {
      player.play(song);
    }
  }

  /**
   * Skips the currently playing song
   * @param member The user that send the skip request
   * @param guildId The discord server id of the request
   * @returns if sucessful
   */
  async skip(member: GuildMember | null, guildId: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const player = this.getPlayer(guildId);
      const song = player?.getCurrentSong();
      if (song && member) {
        if (
          member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ||
          member.id == song.memberId
        ) {
          await player?.nextSong();
          resolve(true);
          return;
        }
      }
      resolve(false);
    });
  }

  /**
   * Removes a song from the list
   * @param member The member that created the request
   * @param guildId The discord server id of the request
   * @param pos The position of the song that should be deleted
   * @returns if sucessful
   */
  async remove(member: GuildMember | null, guildId: string, pos: number) {
    return new Promise<boolean>(async (resolve) => {
      logger.debug(pos);
      if (pos == 0) {
        resolve(this.skip(member, guildId));
        return;
      }
      pos--;
      logger.debug(pos);
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

  /**
   * Creates a player that plays music in a specific channel
   * @param channel The voicechannel where the bot should play
   * @param textchannel The textchannel from the request
   */
  async addPlayer(channel: VoiceChannel, textchannel: TextChannel) {
    const connection = await channel.join();
    if (connection) {
      players.push(new HugoMusicPlayer(connection, textchannel));
      logger.log("Added player");
    }
  }

  /**
   * Gets the player
   * @param guildId The server on which the player should be
   * @returns The player
   */
  getPlayer(guildId: string): HugoMusicPlayer | null {
    for (const player of players) {
      if (player.getGuildId() == guildId) {
        return player;
      }
    }
    return null;
  }

  /**
   * Drops a specific music player
   * @param guildId The discord server id from which the player should be deleted
   */
  dropPlayer(guildId: string) {
    let oldplayer: HugoMusicPlayer | undefined;
    players = players.filter((player) => {
      oldplayer = player;
      const condition = player.getGuildId() != guildId;
      return condition;
    });
    if (oldplayer) oldplayer.drop();
    logger.log("Dropped player");
  }
}

export default new HugoMusicController();
