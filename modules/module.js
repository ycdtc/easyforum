var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/local');


var ForumContent = new mongoose.Schema({
        summary: {type: String, unique: true},
        content: String,
        account: String
    },
    {collection: "forum_info"}
);

var UserInfo = new mongoose.Schema({
        account: {type: String, unique: true},
        password: String
    },
    {collection: "user_info"}
);

var ForumReply = new mongoose.Schema({
        summary: String,
        account:String,
        reply: String
    },
    {collection: "forum_reply"}
);

var module_collection = {
    "UserInfo":UserInfo,
    "ForumContent":ForumContent,
    "ForumReply":ForumReply
}

module.exports = module_collection;