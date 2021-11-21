Twitch app that allows you to find which stream the victim is currently watching.

1. You need install [deno](https://github.com/denoland/deno) to use this app.
2. Then you need to [create](https://dev.twitch.tv/console/apps) twitch app in order to get a client-id and auth token.
3. Paste credentials in .env file.
4. Run application and provide victim username.

```
deno run --allow-net --allow-env --allow-read index.js <username>
```
