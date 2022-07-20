
function findMatch(json_input){
    var current_user = json_input['user'];
    var current_interests = json_input['interests'];

    addToDB(json_input);

    var currentDB = fetchDB(current_interests);

    var matchDB = {}

    for (const interest of current_interests){
        
        if ( currentDB[interest] == []){
            currentDB[interest] = [current_user]
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

            currentDB[interest].push(current_user);
        }
    }

    updateDB(currentDB);

    var similar_users = [];
    var top_matches = 5;

    for (const user of matchDB.keys()){

        if (similar_users.length < top_matches){
            
        }

    }
}
