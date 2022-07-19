const interestData = ['Fishing', 'Coding', 'New Grad']; // all data
const userOptions = []; // user specific 

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

module.exports = { homeBlocks, getOptions, updateInterestResult, processData};
