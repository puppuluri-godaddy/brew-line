const Interest = require('../Models/interest');

module.exports.fetchInterests = async function(interests){
    const userAndInterests = {};
    for(const interest of interests){
        const interestObject = await Interest.findOne({interest:interest})
        if(interestObject){
            const users=interestObject.users;
            userAndInterests[interest] = users;
        }
    }
    
    return userAndInterests;
}

module.exports.getAllInterests = async function(){
    const interestObjects = await Interest.find({});
    const interests=[];
    interestObjects.forEach((interestObject)=>{
        interests.push(interestObject.interest);
    })
    return interests;
}

module.exports.addInterest = async function(interest){
    await Interest.create({
        interest:interest,
        users:[]
    });
    return;
}