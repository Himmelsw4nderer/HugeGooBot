import {
  Message,
  MessageEmbed,
  StreamDispatcher,
  TextChannel,
  VoiceConnection,
} from "discord.js";
import Logger from "../../tools/Logger";
import HugoClient from "./../HugoClient";
const logger = new Logger("MusicController");
import HugoMusicController from "./HugoMusicController";
import HugoMusicSong from "./HugoMusicSong";
import ytdl from "ytdl-core";

export default class HugoMusicPlayer {
  items: HugoMusicSong[] = new Array(0);
  connection: VoiceConnection | undefined;
  currentSong: HugoMusicSong | undefined;
  dispatcher: StreamDispatcher | undefined;
  message: Message | undefined;
  textChannel: TextChannel;

  constructor(
    newConnection: VoiceConnection,
    newTextChannel: TextChannel
  ) {
    this.dispatcher = undefined;
    this.connection = newConnection;
    this.textChannel = newTextChannel;
  }

  async play(song: HugoMusicSong) {
    //putting the song in the playlist
    this.items.push(song);
    //if there is no song playing
    if (!this.dispatcher) {
      //setting up the song to play
      this.currentSong = this.items.shift();
      if (this.currentSong) {
        if (this.connection) {
          if (ytdl.validateURL(this.currentSong.link)) {
            //setting up the song
            this.dispatcher = this.connection.play(
              ytdl(this.currentSong.link, { filter: "audioonly" })
            );
            //applying settings
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

  async nextSong() {
    logger.log("Finished a song");
    //getting the next song
    this.currentSong = this.items.shift();
    //if there is a new song
    if (this.currentSong) {
      if (this.connection) {
        if (ytdl.validateURL(this.currentSong.link)) {
          //setting up the song
          this.dispatcher = this.connection.play(
            ytdl(this.currentSong.link, {
              filter: "audioonly",
              quality: "highest",
            })
          );
          //applying settings
          this.addDispatcherOptions();
          this.makeMessage(this.textChannel);
        } else {
          this.nextSong();
        }
        return;
      }
    }
    //dropping the player
    HugoMusicController.dropPlayer(this.getGuildId());
  }

  removeSong(pos: number) {
    logger.debug(pos);
    this.items.splice(pos, 1);
    this.editMessage();
    logger.log("Removed Song");
    return;
  }

  addDispatcherOptions() {
    if (this.dispatcher) {
      //applying settings
      this.dispatcher.setVolume(0.5);
      //applying on finish event
      this.dispatcher.on("finish", () => {
        this.nextSong();
      });
    }
  }

  drop() {
    //destroying dispatcher
    this.dispatcher?.destroy();
    if (this.message && !this.message?.deleted) {
      this.message.delete();
    }
    //disconnecting
    this.connection?.disconnect();
    logger.log("Disconnecting from voice channel");
  }

  async makeMessage(textChannel: TextChannel) {
    this.message = await textChannel.send(this.getMessageContent());
  }

  async editMessage() {
    if (this.message && !this.message?.deleted) {
      await this.message.edit(this.getMessageContent());
      //adding options
      logger.log("Updated message");
    }
  }

  getMessageContent(): MessageEmbed {
    //creating the embed
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

  getGuildId(): string {
    return this.connection?.channel.guild.id ?? "";
  }

  getCurrentSong(): HugoMusicSong | undefined {
    return this.currentSong;
  }

  getSong(pos: number): HugoMusicSong | undefined {
    return this.items[pos];
  }
}
