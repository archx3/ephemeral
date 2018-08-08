var express = require('express');
var mongoose = require('mongoose');


var Users = mongoose.model('users');

var Schema = mongoose.Schema;

//setup
var _schema = {
  from: {type: Schema.Types.ObjectId, ref: 'users'},
  to: {type: Schema.Types.ObjectId, ref: 'users' },
  subject: String,
  message: String,
  read: Boolean
};

var Messages = mongoose.model('messages', new Schema(_schema));

//user - a user object or user id
function retrieve_inbox(user){
  //retrieve all inbox messages belonging to the user
  if(!user){
    return false;
  }

  if(typeof user === 'object'){
    //retrieve for the user._id
    Messages.find({to: user}).then(function(records){
      return records;
    }).catch(function(err){throw err;});

  }else if(typeof user == 'string'){
    //fetch from db
    var _query = Users.findOne({_id: user});
    _query.then(function(_user){
      //extract the messages
      var _messages = Messages.find({to: _user}).then(function(records){
        return records;
      }).catch(function(err) {
        throw err;
      })
    })
  }else{
    return false;
  }
}

//retrieve the sentbox
function retrieve_sentbox(user){
  //ensure the user is an object
  if(!user){
    return false;
  }

  Messages.find({from: user}).then(function(records){
    return records;
  }).catch(function(err){
    throw err;
  });
}

//send a message
function send_message(to, from, subject, message){
  if(!(to && from && subject && message)){
    return false;
  }
  //general validation
  if(typeof to === 'string'){
    Users.findOne({_id: to}).then(function(_to){
      var message = new Messages({
        to: _to,
        from: from,
        subject: subject,
        message: message,
        read: false
      });
      message.save().then(function(succ){return true;}).catch(function(err){throw err;});
    })
  }

  var message = new Messages({
    to: to,
    from: from,
    subject: subject,
    message: message,
    read: false
  });
  message.save().then(function(succ){return true;}).catch(function(err){throw err;});
}

function retrieve_all_unread(user){
  //retrieve all unread messages, for a user object
  //restrict user to being user object
  if(!user){
    return false;
  }
  var query = Messages.find({read: false});
  query.then(function(records){
    return records;
  }).catch(function(err){throw err;});
}


var router = express.Router();

var test_support = {
  retrieve_inbox,
  send_message,
  retrieve_sentbox,
  retrieve_all_unread
};

//exports.messagingRouter = router;
module.exports = router;