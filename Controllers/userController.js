const User = require('../Models/user');
const Interest = require('../Models/interest');

module.exports.getUserinfo = async function (user_id) {
    try {
        const existingUser = await User.findOne({ user_id: user_id });
        if (existingUser){
            return existingUser.interests;
        }
           
        return [];
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.createUpdateUser = async function (user) {
    try {
        const existingUser = await User.findOne({ user_id: user.user });
        if (existingUser) {
            const existingInterests = existingUser.interests;
            for(const interest of existingInterests){
                const existingInterest = await Interest.findOne({ interest: interest });
                if(existingInterest){
                    var filteredArray = existingInterest.users.filter(function(e) { return e !== user.user })
                    await Interest.findOneAndUpdate({interest:interest},{users:filteredArray})
                }
            }
            existingUser.interests = user.interests;
            await User.findOneAndUpdate({user_id:user.user},existingUser);
        }
        else {
            const userObj = {};
            userObj.user_id=user.user;
            userObj.interests=user.interests;
            await User.create(userObj);
        }
        const interests = user.interests;
        for(const interest of interests){
            const existingInterest = await Interest.findOne({ interest: interest });
            if(existingInterest){
                if(!existingInterest.users.includes(user.user)){
                    existingInterest.users.push(user.user);
                    await Interest.findOneAndUpdate({interest:interest},existingInterest);
                }
            }
            else{
                const users = [];
                users.push(user.user);
                const newInterest = {
                    interest : interest,
                    users: users
                }
                await Interest.create(newInterest);
            }
        };
        return;
    }
    catch (err) {
        console.log(err);
    }
}