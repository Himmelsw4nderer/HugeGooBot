import { sleep } from "../../tools/Sleep";
import tiktok = require('tiktok-app-api');
import { TikTok } from "tiktok-app-api/dist/core";
import DatabaseController from "../../database/DatabaseController";
class HugotikTokController{
    connected: boolean = false;
    tiktokApp: TikTok | undefined;

    async run(){
        //start the tiktok
        this.tiktokApp = await tiktok()
        //setting the connection to true
        this.connected = true
        //aslong as discord is connected
        while(this.connected){
            //check the tiktok accounts for new videos
            this.check()
            //sleep for 200 sek
            await sleep(200000)
        }
    }

    async stop(){
      //setting the connection to false
      this.connected = false;
    }

    async check(){
        //getting all serveers from the bot
        const servers = await DatabaseController.getServers();
        //for each server
        for(let server of servers) {
            //checking if it is valid
            if(server.tiktokchannel && server.tiktoktextchannel) {
                //getting the tiktok channel
                const tikTokUser = this.tiktokApp?.getUserByName(server.tiktokchannel);
            }
        }
    }
}

export default new HugotikTokController()

