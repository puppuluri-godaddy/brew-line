const mongoose=require('mongoose');

const interestSchema=new mongoose.Schema({
    interest:{
        type: String,
        required: true,
        unique: true
    },
    users:{
        type: Array,
        required: true
    }
},{
    timestamps: true
});

const User=mongoose.model('Interest',interestSchema);

module.exports=User;