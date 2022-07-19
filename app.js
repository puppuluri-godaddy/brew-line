const { App } = require("@slack/bolt");
const { homeBlocks, getOptions, updateInterestResult, processData } = require('./homeBlocks');
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

app.command("/test", async ({ command, ack, say }) => {
    try {
        await ack();
        say("Test is a success!");
    } catch (error) {
        console.log("err")
        console.error(error);
    }
});

let interests = [];

app.event("app_home_opened", async ({ event, client, context }) => {
    try {
        console.log("Home tab of app has now been opened!");
        channel_id = event.channel;
        user = event.user;
        let blocks = homeBlocks;
        // TODO: 
        // check if user is already in the database, if yes, homeBlock need update data,
        // otherwise, display default homeBlock data
        // use external selection component
        const userInterestArray = ['Fishing']; // getInfo(user);  // it is a string array, may be empty
        if (userInterestArray.length !== 0){
            homeBlocks[0].element = { ...homeBlocks[0].element, "initial_options": getOptions(userInterestArray) }
            const { results } = updateInterestResult(userInterestArray);
            blocks = [...homeBlocks, results]
        }
        /* view.publish is the method that your app uses to push a view to the Home tab */
        const result = await client.views.publish({
            /* the user that opened your app's app home */
            user_id: event.user,

            /* the view object that appears in the app home*/
            view: {
                type: "home",
                callback_id: "home_view",
                /* body of the view */
                blocks
            }
        });
    } catch (error) {
        console.log("home opened err");
        console.error(error.data.response_metadata);
    }
});

let match;

app.action("button_1", async ({ event, body, client, ack }) => {
    let choices = body.view.state.values.multi_interest_select_block['multi_static_select-action'].selected_options
    let { results, interests } = updateInterestResult(choices, true);
    await ack();

    const dataToSave = processData(interests, user);
    // match = findMatch(dataToSave);


    const result = await client.views.publish({
        /* the user that opened your app's app home */
        user_id: user,

        /* the view object that appears in the app home*/
        view: {
            type: "home",
            callback_id: "home_view",
            /* body of the view */
            blocks: [...homeBlocks, results]
        }
    });
});

(async () => {
    const port = 3000
    // Start your app
    await app.start(process.env.PORT || port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
