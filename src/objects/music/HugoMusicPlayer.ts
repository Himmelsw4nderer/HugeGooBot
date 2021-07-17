import {
  Message,
  MessageEmbed,
  StreamDispatcher,
  TextChannel,
  VoiceConnection,
} from "discord.js";
import Logger from "../../tools/Logger";
import HugoClient from "./../HugoClient";
import HugoMusicController from "./HugoMusicController";
import HugoMusicSong from "./HugoMusicSong";
import ytdl from "ytdl-core";

/**
 * The logger
 */
const logger = new Logger("MusicController");

/**
 * A player that plays music in a discord channel
 */
export default class HugoMusicPlayer {
  /**The quene */
  items: HugoMusicSong[] = new Array(0);
  /**The voice channel conection */
  connection: VoiceConnection | undefined;
  /**The currently playing song */
  currentSong: HugoMusicSong | undefined;
  /**The player */
  dispatcher: StreamDispatcher | undefined;
  /**The message that displays the players info */
  message: Message | undefined;
  /**The text channel where the Bot listens to*/
  textChannel: TextChannel;

  /**
   * Creates a instance of HugoMusicPlayer
   * @param newConnection The voicechannel connection were the song should be played
   * @param newTextChannel The textchannel of the request for the message
   */
  constructor(newConnection: VoiceConnection, newTextChannel: TextChannel) {
    this.dispatcher = undefined;
    this.connection = newConnection;
    this.textChannel = newTextChannel;
  }

  /**
   * Plays a song or adds it to the quene
   * @param song The song that should be played
   */
  async play(song: HugoMusicSong) {
    this.items.push(song);
    if (!this.dispatcher) {
      this.currentSong = this.items.shift();
      if (this.currentSong) {
        if (this.connection) {
          if (ytdl.validateURL(this.currentSong.link)) {
            this.dispatcher = this.connection.play(
              ytdl(this.currentSong.link, { filter: "audioonly" })
            );
            this.addDispatcherOptions();
            this.makeMessage(this.textChannel);
          } else {
            this.nextSong();
          }
        }
      }
    }
    this.editMessage();
  }

  /**
   * Skips the song and plays the next if it is possible
   */
  async nextSong() {
    logger.log("Finished a song");
    //getting the next song
    this.currentSong = this.items.shift();
    if (this.currentSong) {
      if (this.connection) {
        if (ytdl.validateURL(this.currentSong.link)) {
          this.dispatcher = this.connection.play(
            ytdl(this.currentSong.link, {
              filter: "audioonly",
              quality: "highest",
            })
          );
          this.addDispatcherOptions();
          this.editMessage();
        } else {
          this.nextSong();
        }
        return;
      }
    }
    HugoMusicController.dropPlayer(this.getGuildId());
  }

  /**
   * Removes a song from the quene
   * @param pos The position of the song
   */
  removeSong(pos: number) {
    logger.debug(pos);
    this.items.splice(pos, 1);
    this.editMessage();
    logger.log("Removed Song");
  }

  /**
   * Sets the options of the dispatcher
   */
  addDispatcherOptions() {
    if (this.dispatcher) {
      this.dispatcher.setVolume(0.5);
      this.dispatcher.on("finish", () => {
        this.nextSong();
      });
    }
  }

  /**
   * Closes the conection and drops the player
   */
  drop() {
    this.dispatcher?.destroy();
    if (this.message && !this.message?.deleted) {
      this.message.delete();
    }
    this.connection?.disconnect();
    logger.log("Disconnecting from voice channel");
  }

  /**
   * Makes the message displaying informations of this player
   * @param textChannel The text channel where the message should be send
   */
  async makeMessage(textChannel: TextChannel) {
    this.message = await textChannel.send(this.getMessageContent());
  }

  /**
   * Updates the message to fit the new informations
   */
  async editMessage() {
    if (this.message && !this.message?.deleted) {
      await this.message.edit(this.getMessageContent());
      logger.log("Updated message");
    }
  }

  /**
   * Creates the message content for the player information
   * @returns The message
   */
  getMessageContent(): MessageEmbed {
    const reply = new MessageEmbed()
      .setTitle(`Currently playing`)
      .setColor(process.env.COLOR ?? 0x00000)
      .addFields(
        { name: "Title", value: this.currentSong?.title, inline: true },
        { name: "Artist", value: this.currentSong?.author, inline: true },
        {
          name: "Suggested by",
          value: HugoClient.users.cache.get(this.currentSong?.memberId ?? ""),
          inline: true,
        },
        { name: "Link", value: this.currentSong?.link },
        { name: "Paused", value: this.dispatcher?.paused, inline: true },
        { name: "Volume", value: this.dispatcher?.volume, inline: true }
      )
      .setFooter("HuGoBot")
      .setTimestamp();

    const shortItems = this.items.slice(0, 10);

    for (const pos in shortItems) {
      reply.addFields({
        name: `${parseInt(pos) + 1}.`,
        value: `${shortItems[pos].title} from ${shortItems[pos].author}`,
      });
    }

    return reply;
  }

  /**
   * Gets the discord server id
   * @returns The discord server id
   */
  getGuildId(): string {
    return this.connection?.channel.guild.id ?? "";
  }

  /**
   * Gets the currently playing song
   * @returns The currently playing song
   */
  getCurrentSong(): HugoMusicSong | undefined {
    return this.currentSong;
  }

  /**
   * Gets a song from the quene
   * @param pos The positon of the song
   * @returns The song
   */
  getSong(pos: number): HugoMusicSong | undefined {
    return this.items[pos];
  }
}
