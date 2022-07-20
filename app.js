const { App } = require("@slack/bolt");
const { spawn } = require('child_process');
const { homeBlocks, getOptions, updateInterestResult, processData, publishHome, matchButton, displayMatch, updateInterests } = require('./homeBlocks');

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
let match;
let matchPart;
let userInterestArray = [];
let displayBlocks;

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
        // TODO: 
        // check if user is already in the database, if yes, homeBlock need update data,
        // otherwise, display default homeBlock data
        // use external selection component
        userInterestArray = ['Fishing']; // getInfo(user);  // it is a string array, may be empty
        if (userInterestArray.length !== 0){
            match = 'Fake name from db';   // call getMatch Function
            matchPart = displayMatch(match);
            displayBlocks = updateInterests(homeBlocks, userInterestArray);
            const { interests, results } = updateInterestResult(userInterestArray);
            displayBlocks = [...displayBlocks, results, matchButton, matchPart];
        }
        
        const result = publishHome(user, client, displayBlocks);

    } catch (error) {
        console.log("home opened err");
        console.error(error.data.response_metadata);
    }
});

// let match;

app.action("submit_button", async ({ event, body, client, ack }) => {
    let choices = body.view.state.values.multi_interest_select_block['multi_static_select-action'].selected_options
    let { results, interests } = updateInterestResult(choices, true);
    userInterestArray = interests;
    displayBlocks = updateInterests(homeBlocks, userInterestArray);
    await ack();

    const dataToSave = processData(interests, user);
    // match = findMatch(dataToSave);
    match = 'Fake name after click';

    // const pythonProcess = spawn('python',["./process.py", dataToSave]);
    // pythonProcess.stdout.on('data', function(data) {
    //     console.log(JSON.stringify(data));

    // });
    
    const result = publishHome(user, client, [...displayBlocks, results, matchButton]);
});

app.action("find_button", async ({ event, body, client, ack }) => {
    await ack();
    matchPart = displayMatch(match);
    let { results, interests } = updateInterestResult(userInterestArray);
    userInterestArray = interests;
    const result = publishHome(user, client, [...displayBlocks, results, matchButton, matchPart]);
});

(async () => {
    const port = 3000
    // Start your app
    await app.start(process.env.PORT || port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
