
// const interestController = require('./Controllers/interestController');
// const interestData = await interestController.getAllInterests(); 
// const interestData = ['Fishing', 'Coding', 'New Grad',"Texting","Coding","Reading", "Cooking"]; // all data
let homeBlocks;
let hardcoding = [
    'Texting',       'Coding',        'Reading',
    'Cricket',       'Cooking',       'Traveling',
    'Fishing',       'Crafting',      'Television',
    'Collecting',    'Music',         'Gardening',
    'Yoga',          'Backpacking',   'Hunting',
    'Kayaking',      'Experimenting', 'Beat Boxing',
    'Shopping',      'Picnicing',     'Martial arts',
    'Farming',       'Swimming',      'Skiing',
    'Film Making',   'Streaming',     'Gaming',
    'Video Editing', 'Writing',       'Ice Skating',
    'Home Brewing',  'Modeling',      'Playing',
    'Camping',       'Tennis',        'Bird Watching',
    'Bee Keeping',   'Badminton',     'New Grad',
    'Running',       'Jogging',       'Insgram',
    'Ice cream',     'Stamp',         'Dogs',
    'Cats',          'Candies',       'Soccer',
    'Volleyball',    'Rugby',         'Roller skating',
    'Darts',         'Football',      'Stretching',
    'Gymnastics',    'Rock climbing', 'Surfing' ,
    'Dancing',       'Karate',        'BJJ' , 
    'Horse racing',  'Snowboarding',  'Skateboarding', 
    'Cycling',       'Novels',        'Science',
    'Food',          'Music',         'Painting', 
    'Coffee Lover',  'Cleaning',      'Chocolate Lover', 
    'Walking',       'Kickboxing',    'Board games', 
    'Hiking',        'Bowling',       'Juggling', 
    'Oil painting',  'Color painting',  'Designing', 
    'Poetry writing',  'Web dev', 'Java', 
    'Python', 'Technology', 'Cameras', 
    // 'Driving', 'Beer', 'Wine',
    // 'Parties', 'Animal Lovers', 
    // 'Salad', 'Meat', 'Washing', 
    // 'Biking', 'Sunshine', 'California', 
    // 'Tempe', 'Seattle', 'Interns', 
    // 'Manager', 'Software Engineer', 
    // 'Product manager', 'UX design',
    // 'Recruiter', 'HR', 'IT guy', 
    // 'Acting', 'San Francisco' , ' Los Angeles', 
    // 'New York City', 'Boston', 'MENA', 
    // 'Bay Area', 'Santa Clara',
  ];
  
  function getOptions(array) {

    // try{
    //   array = await interestController.getAllInterests(); 
    // } catch(err){
    //     console.log(err);
    // }
    // console.log(array);
    let options = [];
    array.forEach((item)=>{
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

 homeBlocks =
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
                "options": getOptions(hardcoding),
                "action_id": "multi_static_select-action"
            },
            "label": {
                "type": "plain_text",
                "text": "Hey! We love how you want to meet new people! We want you to pick your interests, hobbies, career goals or a thing you would like to learn about from this list below..",
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
            "text": `Check your Brewline inbox :eyes: we guessed who would've waved at you if you were in the office kitchen`,
            "emoji": true
        }
    };

}

function updateInterests(homeBlocks, interestArray){
    const newOptions = getOptions(interestArray);

    let ans = [...homeBlocks];
    ans[0].element = { ...homeBlocks[0].element, "initial_options": newOptions };

    return ans;

}

module.exports = { homeBlocks, getOptions, updateInterestResult, processData, publishHome, matchButton, displayMatch, updateInterests};
