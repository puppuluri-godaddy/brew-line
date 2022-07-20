const Interest = require('../Models/interest');

module.exports.fetchInterests = async function(interests){
    const userAndInterests = {};
    for(const interest of interests){
        const interestObject = await Interest.findOne({interest:interest})
        const users=interestObject.users;
        userAndInterests[interest] = users;
    }
    
    return userAndInterests;
}

module.exports.updateInterets = function(user){
    return;
}