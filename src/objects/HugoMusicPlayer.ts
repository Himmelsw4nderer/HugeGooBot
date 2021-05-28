import {
  Message,
  MessageEmbed,
  StreamDispatcher,
  TextChannel,
  VoiceConnection,
} from "discord.js";
import Youtube from "youtube.ts";
import Logger from "../tools/Logger";
import HugoClient from "./HugoClient";
const logger = new Logger("MusicController");
import HugoMusicController from "./HugoMusicController";
import HugoMusicSong from "./HugoMusicSong";

const items: HugoMusicSong[] = new Array(0);
let connection: VoiceConnection | undefined;
let currentSong: HugoMusicSong | undefined;
let dispatcher: StreamDispatcher | undefined;
let youtube: Youtube;
let message: Message;
let textChannel: TextChannel;

export default class HugoMusicPlayer {
  constructor(
    newConnection: VoiceConnection,
    newYoutube: Youtube,
    newTextChannel: TextChannel
  ) {
    dispatcher = undefined;
    connection = newConnection;
    youtube = newYoutube;
    textChannel = newTextChannel;
  }

  async play(song: HugoMusicSong) {
    //putting the song in the playlist
    items.push(song);
    //if there is no song playing
    if (!dispatcher) {
      //setting up the song to play
      currentSong = items.shift();
      if (currentSong) {
        if (connection) {
          //setting up the song
          dispatcher = connection.play(
            await youtube.util.streamMP3(currentSong.link)
          );
          //applying settings
          this.addDispatcherOptions();
          this.makeMessage(textChannel);
        }
      }
    }
    logger.debug(items);
  }

  async nextSong() {
    logger.log("Finished a song");
    //getting the next song
    currentSong = items.shift();
    //if there is a new song
    if (currentSong) {
      if (connection) {
        logger.log("Playing next song");
        //setting the next Song
        dispatcher = connection.play(
          await youtube.util.streamMP3(currentSong.link)
        );
        //applying settings
        this.addDispatcherOptions();
        this.editMessage();
        return;
      }
    }
    //dropping the player
    HugoMusicController.dropPlayer(this.getGuildId());
  }

  addDispatcherOptions() {
    if (dispatcher) {
      //applying settings
      dispatcher.setVolume(0.5);
      //applying on finish event
      dispatcher.on("finish", () => {
        this.nextSong();
      });
    }
  }

  drop() {
    //destroying dispatcher
    dispatcher?.destroy;
    message.delete();
    //disconnecting
    connection?.disconnect();
    logger.log("Disconnecting from voice channel");
  }

  async makeMessage(textChannel: TextChannel) {
    message = await textChannel.send(this.getMessageContent());
    message.react("⏸️");
    message.react("⏭️");
    message.react("⏹️");
  }

  async editMessage() {
    if (message) {
      await message.edit(this.getMessageContent());
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
        { name: "Title", value: currentSong?.title, inline: true },
        { name: "Artist", value: currentSong?.author, inline: true },
        {
          name: "Suggested by",
          value: HugoClient.users.cache.get(currentSong?.memberId ?? ""),
          inline: true,
        },
        { name: "Link", value: currentSong?.link },
        { name: "Paused", value: dispatcher?.paused, inline: true },
        { name: "Volume", value: dispatcher?.volume, inline: true }
      )
      .setFooter("HuGoBot")
      .setTimestamp();

    return reply;
  }

  getGuildId(): string {
    return connection?.channel.guild.id ?? "";
  }

  getSong(): HugoMusicSong | undefined{
    return currentSong;
  }
}
