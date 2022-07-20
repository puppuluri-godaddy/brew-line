const userController = require("./Controllers/userController");
const interestController = require("./Controllers/interestController");

module.exports.findMatch = async function(json_input, bool){

    var current_user = json_input['user']; // current user
    var current_interests = json_input['interests'];
    var currentDB = await interestController.fetchInterests(current_interests);
    let name;
    if (current_user === 'U03PHCQ3W4X')
        name = 'tingting';
    else name = 'Basheer'

    // this function means we want save current user and his interest into db
    if (bool){
        
        console.log('need save data-> '+   current_interests);
        console.log('need save data-> '+ name);
        await userController.createUpdateUser(json_input);
    }
       //let's try again, cmd+r to udapte
    await userController.createUpdateUser(json_input);


    var matchDB = {}
    for (const interest of current_interests){

        if ( currentDB[interest] == []){
            continue;
        }

        else{

            if (Object.keys(currentDB).includes(interest)){
                for (const user of currentDB[interest]){

                    if (Object.keys(matchDB).includes(user)){
                        matchDB[user] += 1;
                    }
                    else{
                        matchDB[user] = 1;
                    }

                }

            }
        }
    }


    // var similar_users = [];
    var most_similar_user = "";
    var most_similar_user_cnt = 0;


    for (const user of Object.keys(matchDB)){

        if (most_similar_user_cnt < matchDB[user] && user !== current_user){


            most_similar_user = user;
            most_similar_users_cnt = matchDB[user];
        }

    }
    var most_similar_user_interests = await userController.getUserinfo(most_similar_user);
    console.log("common interest -->"+ most_similar_user_interests);

    const filteredArray = current_interests.filter(value => most_similar_user_interests.includes(value))
  

    return {"similar_user": most_similar_user, "similar_interests": filteredArray};
}

