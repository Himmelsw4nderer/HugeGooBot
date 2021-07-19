# HugoBot
A discord Bot with multiple features

## ToDo
- [x] Basic bot features
- [x] Basic musicbot features
- [x] TikTok upload notifications
- [x] Automatic database creation if no exist
- [ ] More notifications (YT, Twitch, Instagramm, etc)
- [ ] Slash command support
- [ ] More modern music bot features (with Discord interactions)
- [ ] More features :D

## Usage
1. Clone repository `git clone https://...`
2. Compile `tsc`
3. Add `src/config.env` with:
```env
DISCORD_TOKEN="{Your token}"
COLOR="{Bot embed color}"
NOTIFICATION_SPEED="{Delay in ms}" #Remember the qouta limit for the youtube api
TWITCH_CLIENT_ID="{Your client id}"
TWITCH_SECRET="{Your secret}"
YOUTUBE_API_KEY="{Your api key}"
```
4. Run `npm start`

## Commands
### General
- `ping` - Replys pong
- `prefix` - Displays the current prefix of the server
- `changeprefix [new prefix]` - Sets a new prefix to the server
- `systeminfo` - displys the systeminfo of the bot
### Music
- `play [song title]` - Suggest a song
- `leave` - Removes the bot from the voice channel
- `remove [song index]` - Removes the song with the index (only admin and suggestor)
- `skip` - Skips the current playing song (only admin and suggestor)
### Notifications
- `tiktok [tiktok username]` - Adds TikTok notification in the channel
- `twitch [twitch username]` - Adds twitch notification in the channel
- `youtube [youtube username]` - Adds youtube notification in the channel
- `listnotifications` - Lists all notifications of the channel
- `removenotification [position]` - Removes a notification from the channel with the index from `listnotifications`