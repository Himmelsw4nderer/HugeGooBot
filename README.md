# HugoBot
A discord Bot with multiple features

## ToDo
- [x] Basic bot features
- [x] Basic musicbot features
- [ ] TikTok upload notifications
- [ ] Slash command support
- [ ] more features :D

## Usage
1. Clone repository `git clone https://...`
2. Compile `tsc`
3. Add `src/config.env` with:
```env
DISCORD_TOKEN={Your Token}
```
4. Add the database `res/database/hugo.db`
```md
CREATE TABLE ...
```
5. Run with node `node src/index.js`

## Commands
### General
- `ping`
- `prefix`
- `changeprefix [new prefix]`
- `systeminfo`
### Music
- `play [song title]`
- `leave`
- `remove [song index]`
- `skip`
### TikTok
- `tiktok [tiktok username]`