//loading environmental variables
import dotenv from 'dotenv'
import registerCommands from './modules/commandSystem/registerCommands';
import registerEvents from './modules/eventSystem/registerEvents';
dotenv.config({ path:'./src/config.env' })

//creating the client
import HugoClient from './modules/objects/HugoClient';

//logging in the client
Promise.all([registerCommands(), registerEvents()]).then(() => {
    HugoClient.login(process.env.DISCORD_TOKEN);
});