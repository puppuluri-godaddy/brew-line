const userController = require("./Controllers/userController");
const interestController = require("./Controllers/interestController");

module.exports.findMatch = async function(json_input){
    var current_user = json_input['user'];
    var current_interests = json_input['interests'];
    var currentDB = await interestController.fetchInterests(current_interests);
    await userController.createUpdateUser(json_input);

    var matchDB = {}
    for (const interest of current_interests){

        if ( currentDB[interest] == []){
            continue;
        }

        else{
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

    var most_similar_user= "";
    var most_similar_users_cnt=0;

    for (const user of Object.keys(matchDB)){
        if (most_similar_users_cnt < matchDB[user]){
            most_similar_user = user;
            most_similar_users_cnt = matchDB[user];
        }

    }
    var most_similar_user_interests = await userController.getUserinfo(most_similar_user);
    console.log(most_similar_user_interests);
    const filteredArray = current_interests.filter(value => most_similar_user_interests.includes(value));

    return {"similar_user":most_similar_user,"similar_interests":filteredArray};
}