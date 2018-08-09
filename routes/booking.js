var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');

var Warehouse = mongoose.model('warehouses');
const Bookings = mongoose.model('bookings');

var router = express.Router();



router.get('/', function (req, res, next)
{
   Bookings.find({})
           .then(function (bookings)
                 {
                    res.json(JSON.stringify(bookings));
                 })
           .catch(function (err)
                  {
                     console.error("Error retrieving bills: ", err);
                     res.json({ "status" : "error", "message" : "Error retrieving bills." });
                  });

});

//Post a booking to the DB
function post_booking(booking)
{
   if (!booking)
   {
      console.error("Invalid booking");
      return false;
   }
   let _bill = parseFloat(booking.bill);
   if (Number.isNaN(bill))
   {
      console.log("Invalid bill");
      return false;
   }
   let _autoComputed = false;
   let _period = parseInt(booking.period);
   if (Number.isNaN(_period))
   {
      console.log("Invalid bill");
      //assume a period of one month, and indicate
      _period = 1;
      _autoComputed = true;
   }

   if (!booking.warehouse)
   {
      return false;
   }

   //process other fiels
   let _booking = Bookings.create({
                                     bill         : _bill,
                                     autoComputed : _autoComputed,
                                     period       : _period,
                                     warehouse    : booking.warehouse
                                  });

   _booking.then(function (bill)
                 {
                    return true;
                 }).catch(function (err)
                          {
                             console.error(err);
                             return false;
                          })

}

//Return a booking, that can be added to the DB
function compute_bill(warehouse, period, space)
{
   //early sanity
   if (!warehouse)
   {
      console.log("Compute bill has no warehouse yet");
      return false;
   }
   //compute the bill required to be paid for period in the warehouse
   period = parseFloat(period);
   if (Number.isNaN(period))
   {
      period = 1;     //calculate for a period of a month if no period is provided
   }

   //Get the ppsqm and compute the bill
   const price = parseFloat(warehouse.price);
   if (Number.isNaN(price))
   {
      return false;
   }


    //safely assume the equation won't be a NaN
    return price * period * space;

}

//Date functions
/*
A depositor provides the date of start, we use it to match warehouse that are available, and also compute the bill.
*/
function get_end_period(sp, period)
{
   period = period || 1; //defaults to a month
   let _sp = moment(sp);
   if (!_sp.isValid())
   {
      return false;
   }
    _sp.add(period, 'months');
   return _sp;
}

//Get period, of storage
// If the depositor chooses both the starting date and final date, calculate the period
//@starting period - Init date
//@final period - Final date
//Make sure the callers, check the results of the function for errors...Not checking is a big source of bugs
function get_storage_period(sp, ep)
{
   let _sp = moment(sp);
   let _ep = moment(ep);

   if (!(_sp.isValid() && _ep.isValid()))
   {
      return false;
   }


    //seconds from epoch
    return moment.duration(_ep - _sp).asMonths();
}

router.post('/:id', function (req, res)
{
   const space = req.body.space || 20;
   const period = req.body.period || 1;
   const sp = req.body.sp || Date.now();
   const ep = get_end_period(sp, period);
   const id = req.params.id;

   if (!id)
   {
      res.redirect('/users/login');
   }

   Warehouse.findOne({_id: id})
       .then(function (wh) {
           //Use it to compose a booking
           const bill = compute_bill(wh, period, space);
           if(!bill){
              //Could'nt calculate bill
               console.log("Could not compute the bill");
              res.send("Could not compute the bill");
           }else{
              //ensure that space is less than wh.empty
               if(space > wh.free_space) res.send("Requires more than available");
              //post a booking?
               const booking = {
                  operator: wh.operator,
                   depositor: req.user,
                   warehouse: wh,
                   bill: bill,
                   starting: sp,
                   period: period,
                   ending: ep,
                   space: space,
               };

               //TODO if a booking is accepted
              //TODO reduce the amount of space available by the amount booked
               Bookings.create(booking)
                   .then(function (booking) {
                        //
                       res.redirect('/users/home'); //changedhere
                   }).catch(function (err) {
                   throw err;
               })
           }

       }).catch(function (err) {
       //handle err
       throw err;
   });
});

module.exports = router;
