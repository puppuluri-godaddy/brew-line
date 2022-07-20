// const userController = require('./Controllers/userController');
// const interestController = require('./Controllers/interestController');
// module.exports = function findMatch(json_input){
//     var current_user = json_input['user'];
//     var current_interests = json_input['interests'];

//     var currentDB = interestController.fetchInterests(current_interests);

//     userController.createUpdateUser(json_input);

//     var matchDB = {};

//     for (const interest of current_interests){
        
//         if ( currentDB[interest] == []){
//             continue;
//         }

//         else{
//             for (const user of currentDB[interest]){
//                 if (matchDB.has(user)){
//                     matchDB[user] += 1;
//                 }
//                 else{
//                     matchDB[user] = 1;
//                 }
//             }
//         }
//     }

//     var similar_users = [];
//     var most_similar_user = "";
//     var most_similar_user_cnt = 0;

//     for (const user of matchDB.keys()){

//         if (matchDB[user]>most_similar_user_cnt){
//             most_similar_user = user;
//             most_similar_user_cnt = matchDB[user];
//         }

//     }

//     var most_similar_users_interests = userController.getUserinfo(most_similar_user);
//     const filteredArray = current_interests.filter(value => most_similar_users_interests.includes(value));
//     console.log({"similar_user": most_similar_user, "similar_interests": filteredArray});

//     return {"similar_user": most_similar_user, "similar_interests": filteredArray};
// }

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
                if (matchDB.has(user)){
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

    for (const user of matchDB.keys()){

        if (most_similar_users_cnt > matchDB[user]){
            most_similar_user = user;
            most_similar_users_cnt = matchDB[user];
        }

    }

    var most_similar_user_interests = await userController.getUserinfo(most_similar_user);
    const filteredArray = current_interests.filter(value => most_similar_user_interests.includes(value));

    return {"similar_user":most_similar_user,"similar_interests":filteredArray};
}