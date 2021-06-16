import { sleep } from "../../tools/Sleep";
import DatabaseController from "../../database/DatabaseController";
import Logger from "../../tools/Logger";
import HugoClient from "../HugoClient";
import { MessageEmbed, TextChannel } from "discord.js";

const TikTokScraper = require("tiktok-scraper");

const logger = new Logger("HugoTikTokController");
class HugoTikTokController {
  connected: boolean = false;

  async run() {
    //setting the connection to true
    this.connected = true;
    //aslong as discord is connected
    while (this.connected) {
      logger.log("Checking for new videos");
      //check the tiktok accounts for new videos
      await this.check();
      //sleep for 200 sek
      await sleep(200000);
    }
  }

  async stop() {
    //setting the connection to false
    this.connected = false;
  }

  async check(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      //getting all serveers from the bot
      const servers = await DatabaseController.getServers();
      //for each server
      for (let server of servers) {
        //checking if it is valid
        if (server.tiktokchannel && server.tiktoktextchannel) {
          //getting the tiktok channel
          const posts = await TikTokScraper.user("ToneyZYA", {
            number: 1,
          });
          //getting the video
          const video = posts.collector[0];
          //checking if video is new
          if (video.id == server.tiktoklastvideo) {
              resolve();
              return;
          }
          //printing video
          logger.debug(video);
          //getting the channel
          const channel = await HugoClient.channels.fetch(
            server.tiktoktextchannel
          );
          //if its a text channel
          if (channel.isText() && channel instanceof TextChannel) {
            //create embedded
            const reply = new MessageEmbed()
              .setTitle(
                `${video.authorMeta.nickName} has just uploaded a Video`
              )
              .setDescription(video.text)
              .setThumbnail(video.authorMeta.avatar)
              .setImage(video.covers.origin)
              .setColor(process.env.COLOR ?? 0x00000)
              .addFields(
                {
                  name: "Channel",
                  value: video.authorMeta.nickName,
                  inline: true,
                },
                { name: "Link", value: video.webVideoUrl, inline: true }
              )
              .setFooter("HuGoBot")
              .setTimestamp();
            //send embedded
            (await channel.send("@everyone,")).edit(reply)
          }
          //adding the video to the database
          DatabaseController.newTikTokVideo(server.id, posts.collector[0].id);
        }
      }
      resolve();
    });
  }
}

export default new HugoTikTokController();
