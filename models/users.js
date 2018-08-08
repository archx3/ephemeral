var mongoose = require('mongoose');

var userSchemaOptions = {
    collection: "users",
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'},
};

var _schema = {
    first_name: String,
    last_name: String,
    username: String,
    email: String,
    password: String,
    user_type: String,
    phone: String
};
var UserSchema = mongoose.Schema(_schema, userSchemaOptions);
var Users = mongoose.model('users', UserSchema);

module.exports = Users;