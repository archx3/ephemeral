var mongoose = require('mongoose');

var connection = require('../routes/database');
var Users = mongoose.model('users');

describe("User test suite", function(){
  it("Stores cookie in a response", function(){
    //Authenticate a user, simulate a request with the user and check that cookies are saved
    
  })
});
