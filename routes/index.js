var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var Warehouses = mongoose.model('warehouses');

/* GET home page. */
router.get('/', function (req, res)
{
   req.isAuthenticated() ? res.redirect('/users/dashboard') : res.redirect('/users/login');
});

router.get('/register', function (req, res)
{
   req.isAuthenticated() ? res.redirect('/users/dashboard') : res.redirect('/users/register')
});

router.get('/logout', function (req, res)
{
   req.logout();
   res.redirect('/');
});

router.get('/home', function (req, res)
{
   req.isAuthenticated() ? res.render('home') : res.redirect('/users/login');
});

//using get for search since search params don't have to be hidden
//

/**
 *
 * @param req
 * @param params
 */
let getMatchingWarehouseList = function (req, res, params)
{
   Warehouses.find(params).then(function (warehouses)
                                {
                                   //the warehouses <- list
                                   res.render('search', {
                                      warehouses,
                                      user        : req.user,
                                      size        : req.query.size || "",
                                      location    : req.query.location || "",
                                      typeOfGoods : req.query.type || "",
                                      togs        : ["General", "Food and Beverages",
                                                     "Petroleum", "Furniture",
                                                     "Electronics", "Vehicles"]
                                   })
                                }).catch(function (err)
                                         {
                                            //error occured
                                            throw err;
                                         });
};

router.get('/search', function (req, res)
{

   if (!(req.isAuthenticated()))
   {
      //not loggeg in, ask them to
      res.redirect('/users/login');
   }
   else
   {
      let filterParams = {};
      //TODO Get warehouses list based on saerch parameter
      //At least one search param should be provided
      let params = req.query;
      //console.log(params);
      //QUERY
      /*
      * {size: <size>, location: <location>, type_of_goods: <tog>}
      * atleast size [free space]
      * in location [location]
      * */

      //TODO replace with a proper matching algorithm
      //Let's first find out how many params were supplied
      //if there's only one param
      //let's get that and use it to do the find() operation
      const paramKeys = Object.keys(params);
      console.log("Step in: " +paramKeys);

      const numberOfParams = paramKeys.length;
//console.log(numberOfParams, " : numberOfParams");
      //Let's
      if (numberOfParams === 1)
      {
         //Aligning the names of schema attributes and param keys will make
         //it easy to do the search in this case
         /**
          * e.g
          * Warehouses.find({ Object.keys(params)[0] : { $gte : params[Object.keys(params)[0]] }}) ......
          * the only cause for a worry will be the greaterOrEqual to
          * and so for any such value, let's test for their existence manually
          * there's only one such param here so it's easy
          */

         if (params.size !== undefined)
         {
            //it's only the size that was passed, let's deal with it that way
            getMatchingWarehouseList(req, res, { free_space : { $gte : parseInt(params.size, 10) } })
         }
         else
         {
            //either location or type_of_goods
            let key = paramKeys[0], obj = {};
            obj[key] = params[key];
            getMatchingWarehouseList(req, res, obj)
         }
      }
      else if (numberOfParams === 2)
      {
         //Aligning the names of schema attributes and param keys will make
         //it easy to do the search in this case
         /**
          * e.g
          * Warehouses.find({ Object.keys(params)[0] : { $gte : params[Object.keys(params)[0]] }}) ......
          * the only cause for a worry will be the greaterOrEqual to
          * and so for any such value, let's test for their existence manually
          * there's only one such param here so it's easy
          */

         if (params.size !== undefined)
         {
            let size = params.size; // let's store the size in a temp var
            console.log(params);
            delete params["size"]; // and remove the key and value from the object because we do not know
            //
            console.log(params);
            //now the value in the first key is the other one(not size)
            //we
            let key = Object.keys(params)[0],
                obj = { free_space : { $gte : size } };
            if(params[key].length > 0){
               obj[key] = params[key];
            }

            console.log(obj);

            getMatchingWarehouseList(req, res, obj)
         }
         else
         {

            //msg shelving this block for now cos type_of_good pram is not implemented
            //msg the assignment of obj[key<n>] can be done using destructuring
            /*let keys = Object.keys(params);

            let key1 = keys[0], key2 = keys[1], obj = {};
            obj[key1] = params[key1];
            obj[key2] = params[key2];
            getMatchingWarehouseList(req, obj)*/
         }
      }
      else if (numberOfParams === 3)
      {
         // the param were supplied
         //let's pass them all to the find method
         getMatchingWarehouseList(req, res, {
            free_space : { $gte : params.size },
            location   : params.location,
            //type_of_goods : params.type_of_goods
            //FIXME dealing with them like they are two now
         })
      }
      else
      {
         // there cannot be more than three search params
         // but here could be none at all
         // which is most likely the case here
         // let's deal with it as such
      }

      Warehouses.find(filterParams).then(function (warehouses)
                                   {
                                      //the warehouses <- list
                                      res.render('search', {
                                         warehouses,
                                         user        : req.user,
                                         size        : req.query.size || "",
                                         location    : req.query.location || "",
                                         typeOfGoods : req.query.type || "",
                                         togs        : ["General", "Food and Beverages",
                                                        "Petroleum", "Furniture",
                                                        "Electronics", "Vehicles"]
                                      })
                                   }).catch(function (err)
                                            {
                                               //error occured
                                               throw err;
                                            });

      /*Warehouses.find({
                         free_space : { $gte : params.size },
                         location   : params.location,
                         //FIXME type_of_goods
                      }).then(function (warehouses)
                              {
                                 //the warehouses <- list
                                 res.render('search', {
                                    warehouses,
                                    user        : req.user,
                                    size        : req.query.size || "",
                                    location    : req.query.location || "",
                                    typeOfGoods : req.query.type || "",
                                    togs        : ["General", "Food and Beverages",
                                                   "Petroleum", "Furniture",
                                                   "Electronics", "Vehicles"]
                                 })
                              }).catch(function (err)
                                       {
                                          //error occured
                                          throw err;
                                       });*/

   }
});

router.get('/error', function (req, res)
{
   res.render('permission', { user : req.user })
});

router.get('/preview/:id', function (req, res)
{
   Warehouses.findOne({ _id : req.params.id })
             .then(function (wh)
                   {
                      wh ? res.render('full-preview', { warehouse : wh, user : req.user }) : res.send("No warehouse");
                   }).catch(function (err) {res.send("An error occured!")})
});

module.exports = router;
