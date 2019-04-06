How to make your own Statbot!

Step 1. Host your bot by pressing the button below

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Once you're on the page below, just add a name for your bot and press deploy.

![Deploy to Heroku](https://i.groupme.com/1432x1032.png.ddf556487fab4a988db5225f9900c1d8)

After you're app has deployed, you'll see the screen below

![Success](https://i.groupme.com/1418x1190.png.13600aa937ee4384bfaf9f67ae1f8ff8)

Click manage app, then open a new tab and navigate to:
https://dev.groupme.com/session/new

Login with your groupme info.

Once logged in, go to: https://dev.groupme.com/bots/new

![Create your new bot](https://i.groupme.com/1574x806.png.d9845b1243fc4d3f9ede627431430ac2)

Enter the information just like in the picture above!

After creating the bot, go to: https://dev.groupme.com/bots to see it's status!

![Select your new bot](https://i.groupme.com/1752x568.png.5cb81f525e9241b6a6ee894827f54151)

On this page, copy the bot ID (ctl-C)

After getting your bot ID, return to your Heroku app at: https://dashboard-next.heroku.com/apps

On your dashboard, go to the settings tab, visible in the picture below:

![Go to your app's settings](https://i.groupme.com/2498x1124.png.812f23e47ee64f8a919412c9935a6461)

Once on the settings page, click on the "reveal config vars" button, shown in the picture below:

![Reveal your environment variables](https://i.groupme.com/2488x884.png.4d4ceeee17f745c1a5165e8ba16e8c1e)

In the config variables section, add two variables as below: BOT_ID, and ACCESS_TOKEN:

Your BOT_ID should still be copied from earlier, so just paste that in there.

To find your access token, go back to https://dev.groupme.com/bots and click "access token" in the top right hand corner

![Find Acess Token](https://i.groupme.com/2370x722.png.40b899b44a314fd291d8bf66a8624a86)

Then go back and add it to the environment variables on Heroku, then press save.

![Edit your environment variables](https://i.groupme.com/2448x494.png.44493d2b530e476ebf6cf0c0204f3423)

And you're good to go!

Go to the group that you added Statbot to, and simply type !menu to get started!
