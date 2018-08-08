const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();


var Warehouse = mongoose.model('warehouses');

//APIs
//GET a list of all warehouses
router.get('/', function(req, res, next){
  req.isAuthenticated() ? res.redirect('/users/dashboard') : res.redirect('/');
});


router.post('/', function(req, res){
  console.log(req.body);
    const wh = {
        location: req.body.location,
        name: req.body.name,
        area: req.body.area,
        free_space: req.body.empty,
        price: req.body.price,
        operator: req.user,

    };
    const warehouse = Warehouse.create(wh);
    warehouse.then(function(wh){
       Warehouse.find({operator : req.user}).then(function(warehouses){
          res.render("operator-dashboard", {warehouses: warehouses, user: req.user});
       }).catch(function(err){
          throw err;
       });

    })
        .catch(function(err){
          console.error(err);
          res.send("An error occured");
        });
});

router.get('/listings/id/:id', function (req, res) {
    const id = req.params.id;
    console.log(id);

    Warehouse.findOne({_id: id}).then(function (wh) {
        res.render('listing', {warehouse: wh});
    }).catch(function (err) {
        throw err;
    });
});

router.get('/add', function (req, res) {
   res.render('add_warehouse');
});

router.get('/manage', function(req, res){
    res.render('listing', {
        warehouse: {
            name: "TemaWHQ2",
            location: "Tema",
            empty: 220,
            area: 2500,
            price: 6,
        }
    })
});

router.get('/store', function(req, res){
    res.render('storage', {
        any:
            {
                name: "Mr Kamau",
                start: "3rd Aug 2018",
                end: "5th Sept 2018",
                goods: "Electronics",
                notes: "Handle with care. Delicate goods",
                rent: 30
            }

    })
});



//exports.warehouseRouter = router;
 module.exports = router;
