const { App } = require("@slack/bolt");
const matchUser = require('./match');
const { spawn } = require('child_process');
const { homeBlocks, getOptions, updateInterestResult, processData, publishHome, matchButton, displayMatch, updateInterests } = require('./homeBlocks');
const userController = require('./Controllers/userController');
const db = require('./config/mongoose');
const {findMatch} = require('./match');

require("dotenv").config();
// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, // enable the following to use socket mode
    appToken: process.env.APP_TOKEN
});

let channel_id;
let user;
let match = 'Bob';
let matchPart;
let userInterestArray = [];
let displayBlocks;
let matchersInterests;
let chosenInterest;

app.command("/test", async ({ command, ack, say }) => {
    try {
        await ack();
        say("Test is a success!");
    } catch (error) {
        console.log("err")
        console.error(error);
    }
});





app.event("app_home_opened", async ({ event, client, context }) => {
    try {
        console.log("Home tab of app has now been opened!");
        channel_id = event.channel;
        user = event.user;
        let displayBlocks = homeBlocks;
        console.log(user);
        // TODO: 
        // check if user is already in the database, if yes, homeBlock need update data,
        // otherwise, display default homeBlock data
        // use external selection component

        userInterestArray =  await userController.getUserinfo(user);  // it is a string array, may be empty
        console.log(userInterestArray);

        if (await userInterestArray.length !== 0){
            const dataToSave = processData(userInterestArray, user);
            let resultJson = await findMatch(dataToSave, false);
            match = resultJson.similar_user ;

            matchPart = await displayMatch(match);
            console.log('match: '+ match);
            displayBlocks = updateInterests(homeBlocks, userInterestArray);
       
            const { interests, results } = updateInterestResult(userInterestArray, false);
            displayBlocks = [...displayBlocks, results, matchButton, matchPart];
        }
        
        const result = publishHome(user, client, displayBlocks);

    } catch (error) {
        console.log("home opened err");
        console.error(error.data.response_metadata);
    }
});

app.action("submit_button", async ({ event, body, client, ack }) => {
    let choices = body.view.state.values.multi_interest_select_block['multi_static_select-action'].selected_options
    let { results, interests } = updateInterestResult(choices, true);
    chosenInterest = results;
    userInterestArray = interests;
    displayBlocks = updateInterests(homeBlocks, userInterestArray);
    await ack();

    const dataToSave = processData(interests, user);

    // match = await findMatch(dataToSave);
    let resultJson = await findMatch(dataToSave, true)
    match = resultJson.similar_user ;
 
    matchersInterests = resultJson.similar_interests;
    console.log('get matcherInterests: '+ matchersInterests);
    const newBlock = [...displayBlocks, chosenInterest, matchButton];
    
    const result = publishHome(user, client, newBlock );
});

function generateMsg(userId, interestArray, matchId){
    const ans = "Congraduataions, :tada:,"+userId+". We foud someone who is as amazing as you:" + matchId+". There is your common interest list: "+ interestArray;
    return ans;
}

app.action("find_button", async ({ event, body, client, ack }) => {
    await ack();
    matchPart = displayMatch(match);
    const result = publishHome(user, client, [...displayBlocks, chosenInterest, matchButton, matchPart]);
 
    let msg1 = generateMsg(user, matchersInterests, match);
    let msg2 = generateMsg(match, matchersInterests, user);
    await publishMessage(channel_id, msg1);
    await publishMessage(match, msg2);
    
}); 

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
    try {
      // Call the chat.postMessage method using the built-in WebClient
      const result = await app.client.chat.postMessage({
        // The token you used to initialize your app
        token: process.env.SLACK_BOT_TOKEN,
        channel: id,
        text: text
        // You could also use a blocks[] array to send richer content
      });
  
      // Print result, which includes information about the message (like TS)
    //   console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  }
  


(async () => {
    const port = 3000
    // Start your app
    await app.start(process.env.PORT || port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
