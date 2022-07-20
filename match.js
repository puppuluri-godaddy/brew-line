<<<<<<< HEAD
const userController = require("./Controllers/userController");
const interestController = require("./Controllers/interestController");

module.exports.findMatch = async function(json_input){
=======
const userController = require('./Controllers/userController');
const interestController = require('./Controllers/interestController');
module.exports.findMatch = async function (json_input){
>>>>>>> 2acb456 (new update)
    var current_user = json_input['user'];
    var current_interests = json_input['interests'];
    var currentDB = await interestController.fetchInterests(current_interests);
    await userController.createUpdateUser(json_input);

<<<<<<< HEAD
    var matchDB = {}
=======
    var matchDB = {};

>>>>>>> 2acb456 (new update)
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

    var similar_users = [];
    var most_similar_user = "";
    var most_similar_user_cnt = 0;

<<<<<<< HEAD
    for (const user of Object.keys(matchDB)){
        if (most_similar_users_cnt < matchDB[user]){
=======
    for (const user of matchDB.keys()){

        if (matchDB[user]>most_similar_user_cnt){
>>>>>>> 2acb456 (new update)
            most_similar_user = user;
            most_similar_user_cnt = matchDB[user];
        }

    }
<<<<<<< HEAD
    var most_similar_user_interests = await userController.getUserinfo(most_similar_user);
    console.log(most_similar_user_interests);
    const filteredArray = current_interests.filter(value => most_similar_user_interests.includes(value));
=======

    var most_similar_users_interests = await userController.getUserinfo(most_similar_user);
    const filteredArray = current_interests.filter(value => most_similar_users_interests.includes(value));
    console.log({"similar_user": most_similar_user, "similar_interests": filteredArray});
>>>>>>> 2acb456 (new update)

    return {"similar_user": most_similar_user, "similar_interests": filteredArray};
}
