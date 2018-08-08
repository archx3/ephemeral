const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var _schema = {
    operator : { type : Schema.Types.ObjectId, ref : 'users' },
    depositor : { type : Schema.Types.ObjectId, ref : 'users' },
    warehouse    : { type : Schema.Types.ObjectId, ref : 'warehouses' },
    bill         : Number,
    starting     : Date, //move-in date
    end          : Date,
    space : Number, //amount of space req'd
    status : {type : String, enum : ['accepted', 'declined', 'pending'], default: 'pending'}, //TODO set default to pending
    period       : Number
};
const _options = {
    collection: "bookings",
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'},
};

var Bookings = mongoose.model('bookings', new Schema(_schema, _options));

module.exports = Bookings;