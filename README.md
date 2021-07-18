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
DISCORD_TOKEN="{Your Token}"
COLOR="{Bot Embed Color}"
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
- `listnotifications` - Lists all notifications of the channel
- `removenotification [position]` - Removes a notification from the channel with the index from `listnotifications`