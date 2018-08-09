var mongoose = require('mongoose');

var _schemaOptions = {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
    collection: "warehouses"
};
var _schema = {
    location: String,
    name: String,
    area: Number, //size of warehouse
    free_space: Number, //amount of empty space //
    // msg @Shad rename this to free_space or space_free; empty sounds like a boolean
    price: Number,
    typeOfGoods: String,
    operator: {type: mongoose.Schema.Types.ObjectId},
    description: String
};
var warehouseSchema = new mongoose.Schema(_schema, _schemaOptions);
var Warehouse = mongoose.model('warehouses', warehouseSchema);

module.exports = Warehouse;