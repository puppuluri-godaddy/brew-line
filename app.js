const { App } = require("@slack/bolt");
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

app.message('meet', async(message, say)=>{
    await say(homeBlocks);

})

let homeBlocks =
    /* body of the view */
    [
        {
            "type": "input",
            "dispatch_action": true,
            "block_id": "multi_interest_select_block",
            "element": {
                "type": "multi_static_select",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Select interests",
                    "emoji": true
                },
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Fishing",
                            "emoji": true
                        },
                        "value": "value-0"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Coding",
                            "emoji": true
                        },
                        "value": "value-1"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "New Grad",
                            "emoji": true
                        },
                        "value": "value-2"
                    }
                ],
                "action_id": "multi_static_select-action"
            },
            "label": {
                "type": "plain_text",
                "text": "What are your interests?",
                "emoji": true
            }
        },
        {
            "type": "actions",
            "block_id": "actions1",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Submit"
                    },
                    "value": "submit",
                    "action_id": "button_1",
                    "style": "primary"
                }
            ]
        }
    ];

let interests = [];

app.event("app_home_opened", async ({ event, client, context }) => {
    try {
        console.log("Home tab of app has now been opened!");
        channel_id = event.channel;
        user = event.user;
        // TODO: 
        // check if user is already in the database, if yes, homeBlock need update data,
        // otherwise, display default homeBlock data
        // use external selection component

        /* view.publish is the method that your app uses to push a view to the Home tab */
        const result = await client.views.publish({
            /* the user that opened your app's app home */
            user_id: event.user,

            /* the view object that appears in the app home*/
            view: {
                type: "home",
                callback_id: "home_view",
                /* body of the view */
                blocks: homeBlocks
            }
        });
    } catch (error) {
        console.log("home opened err");
        console.error(error.data.response_metadata);
    }
});

function updateInterestResult(interest){
    let str = '';
    interest.forEach((item)=>{
        interests.push(item.text.text);
        str+= item.text.text+ ', ';
    });
    return str.substring(0, text.length - 2);
   
};
app.action("button_1", async ({ event, body, client, ack }) => {
    let choices = body.view.state.values.multi_interest_select_block['multi_static_select-action'].selected_options
    let displayMsg = updateInterestResult(choices);
    let results = {
        "type": "section",
        "text": {
            "type": "plain_text",
            "text": "You've choosen the following: " + displayMsg,
            "emoji": true
        }
    };
    await ack();
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
