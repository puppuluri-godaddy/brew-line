const mongoose = require("mongoose");
mongoose.connect(
    "mongodb+srv://brewline:RQMC7IAsUW87Pt8S@cluster0.vr2kyfe.mongodb.net/?retryWrites=true&w=majority"
);
console.log("connected");
const userSchema = new mongoose.Schema({
    userId:String,
    interests:[String]
});

const User = mongoose.model("User", userSchema);

module.exports = User;