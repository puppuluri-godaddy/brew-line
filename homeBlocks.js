
// const interestController = require('./Controllers/interestController');
// const interestData = await interestController.getAllInterests(); 
const interestData = ['Fishing', 'Coding', 'New Grad',"Texting","Coding","Reading", "Cooking"]; // all data


function getOptions(array) {
    let options = [];
    array.map((item)=>{
        options.push(
            {
                "text": {
                    "type": "plain_text",
                    "text": `${item}`,
                    "emoji": true
                },
                "value": `value-${item}`,
            }

        )
    })
    return options;
}
function processData(interests, user){
    const dataToSave = {
        interests,
        user
    };
    return dataToSave;
}

function updateInterestResult(array, fromState = false) {
    let interests = [];
    let str = '';
    array.forEach((item) => {
        const name = fromState ? item.text.text : item;
        interests.push(name);
        str += name + ', ';
    });
    let results = {
        "type": "section",
        "text": {
            "type": "plain_text",
            "text": "You've choosen the following interests: " + str.substring(0, str.length - 2),
            "emoji": true
        }
    };
    return {interests, results};
};

async function publishHome(user, client, blocks) {
    const result = await client.views.publish({
        /* the user that opened your app's app home */
        user_id: user,

        /* the view object that appears in the app home*/
        view: {
            type: "home",
            callback_id: "home_view",
            /* body of the view */
            blocks
        }
    });
    return result
};

const homeBlocks =
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
                "options": getOptions(interestData),
                "action_id": "multi_static_select-action"
            },
            "label": {
                "type": "plain_text",
                "text": "Hey! We love how you want to meet new people! We want you to pick your interests, hobbies, career goals or anything you would like to learn about from this list below..",
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
                    "action_id": "submit_button",
                    "style": "primary"
                }
            ]
        }
    ];

const matchButton = {
    "type": "actions",
    "block_id": "actions2",
    "elements": [
        {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": "Find My Match"
            },
            "value": "find",
            "action_id": "find_button"
        }
    ]
};

function displayMatch(match){
    return {
        "type": "section",
        "text": {
            "type": "plain_text",
            "text": `${match} is your perfect match`,
            "emoji": true
        }
    };

}

function updateInterests(homeBlocks = '', interestArray){
    const newOptions = getOptions(interestArray);
    homeBlocks[0].element = { ...homeBlocks[0].element, "initial_options": newOptions };
    return homeBlocks;

}

module.exports = { homeBlocks, getOptions, updateInterestResult, processData, publishHome, matchButton, displayMatch, updateInterests};
