var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');

var Warehouse = mongoose.model('warehouses');

var router = express.Router();

let Schema = mongoose.Schema;

var _schema = {
   operator : { type : Schema.Types.ObjectId, ref : 'users' },
   depositor : { type : Schema.Types.ObjectId, ref : 'users' },
   warehouse    : { type : Schema.Types.ObjectId, ref : 'warehouses' },
   bill         : Number,
   starting     : Date, //move-in date
   end          : Date,
   space : Number, //amount of space req'd
   status : {type : String, enum : ['accepted', 'declined', 'pending']}, //TODO set default to pending
   autoComputed : Boolean,     //Was the period auto computed, or provided... Just a flexibility feature
   period       : Number
};
var _options = {
   useNewUrlParser : true
};

var Bookings = mongoose.model('bookings', new Schema(_schema, _options));

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
function compute_bill(warehouse, period)
{
   //early sanity
   if (!warehouse)
   {
      console.log("Compute bill has no warehouse yet");
      return false;
   }
   //compute the bill required to be paid for period in the warehouse
   period = parseFloat(period);
   let _autoComputed = false;
   if (Number.isNaN(period))
   {
      period = 1;     //calculate for a period of a month if no period is provided
      _autoComputed = true;
   }

   //Get the ppsqm and compute the bill
   //FIXME stub to replace the warehouse
   var price = warehouse.price_per_sqm;
   let ppsqm = parseFloat(price);
   if (Number.isNaN(ppsqm))
   {
      return false;
   }

   let _bill = ppsqm * period; //safely assume the equation won't be a NaN
   let booking = {
      bill         : _bill,
      period       : period,
      autoComputed : _autoComputed
   };

   return booking;

}

//Date functions
/*
A depositor provides the date of start, we use it to match warehouse that are available, and also compute the bill.
*/
function get_end_period(sp, period)
{
   //Get the finishing period offset sp, period in months
   period = period || 1; //defaults to a month
   let _starting_period = moment(sp);
   if (!_starting_period.isValid())
   {
      //FIXME get better way to convey error
      return false;
   }
   let months = _starting_period.month();
   let final = months + period;

   _starting_period.add(final, 'months');
   return _starting_period;
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

   let period = moment.duration(_ep - _sp).asMonths(); //seconds from epoch
   return period;
}

router.post('/:id', function (req, res, next)
{
   var booking = req.body;
   var id = req.params.id;
   // var warehouse;
   var period;
   var ep;
   var sp;

   if (!booking)
   {
      console.log("Invalid bill.");
      res.json({ "status" : "error", "message" : "Invalid bill" });
   }
   console.log(booking);
   if (!id)
   {
      console.log("Invalid warehouse");
      res.json({ "status" : "error", "message" : "Invalid warehouse" });
   }
   console.log(id);

   //warehouse may potentially be undefined... Do other ops in the hope that at completion it will be alright
   //Booking either specifies an end periof(ep) or a period (period) for time, find out which
   if ('ep' in booking)
   {
      //end period, - Calculate the period itself
      period = get_storage_period(booking.sp, booking.ep);
      if (!period)
      {
         //could not compute period
         console.log("Could not compute the period. \n");
         //res.json({"status":"error", "message":"Could not compute the period."});
      }
   }
   else
   {
      //period
      ep = get_end_period(booking.sp, booking.period);
      if (!ep)
      {
         //could not compute the sp
         console.log("Could not compute the end period");
         res.json({ "status" : "error", "message" : "Could not compute the end period" });
      }
   }

   period = period || booking.period || 1;
   var bill = compute_bill(warehouse, period);
   if (!bill)
   {
      //some problem
      console.log("Problem computing the bill");
      res.json({ "status" : "error", "message" : "Problem computing the bill" });
   }

   //Create a posting before posting it
   bill.starting = booking.sp;
   bill.ending = ep || booking.ep;
   Warehouse.findOne({ _id : id })
            .then(function (_warehouse)
                  {
                     bill.warehouse = _warehouse;
                  })
            .catch(function (err)
                   {
                      console.error("Error booking - Not found: ", err);
                      res.json({ "status" : "error", "message" : "Warehouse not found" });
                   });

   if (!post_booking(bill))
   {
      //An error occured
      console.log("An error occured adding the booking");
      res.json({ "status" : "error", "message" : "An error occured booking. Please retry" });
   }
   res.json(bill);
});

module.exports = router;
