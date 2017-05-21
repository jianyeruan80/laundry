
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
     tools = require('../modules/tools'),
    security = require('../modules/security'),
    settings = require('../models/settings');
    
router.get('/', function(req, res, next) {
     log.debug(req.token);
       settings.find({}, function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
     
});
router.get('/category', function(req, res, next) {
     log.debug(req.token);
     var query={"merchantId":"laundry","category":"Cash Drawers"};
       settings.find(query, function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
     
});
router.get('/merchant/id',function(req, res, next) {

     

    /* var query={"merchantId":req.token.merchantId};*/
settings.aggregate([{
   $match:{}
},{
    $sort:{"order":1}
},{
    $group:{"_id":{"group":"$group","category":"$category","merchantId":"$merchantId"},"order":{"$min":"$order"}, "items":{$push:{"item":"$item","values":"$values","_id":"$_id"}}}
},
{
     $sort:{"order":1}
},
{
    $project:{"group":"$_id.group","category":"$_id.category","merchantId":"$_id.merchantId","items":1,"_id":0,"order":1}
},
{
    $group:{"_id":{"group":"$group","merchantId":"$merchantId"}, "order":{"$min":"$order"},"categories":{$push:{"category":"$category","items":"$items"}}}
},
{
    $project:{"group":"$_id.group","merchantId":"$_id.merchantId","categories":1,"_id":0,"order":1},
   
},{
 $sort:{order:1}
}]).exec(function(err,data){
            if (err) return next(err);


            res.json(data);
        })

})


router.post('/',  function(req, res, next) {
   var info=req.body;
    info.merchantId="laundry"; 
   info.operator={};
/*info.operator.id=req.token.id;
info.operator.user=req.token.user;*/
 
   var dao = new settings(info);
   dao.save(function (err, data) {
   if (err) return next(err);
          res.json(data);
      });
})
router.put('/:id',  function(req, res, next) {
var info=req.body;
  
var id=req.params.id;
info.updatedAt=Date.now();
info.operator={};
/*info.operator.id=req.token.id;
info.operator.user=req.token.user;*/

var options = {new: true};
 settings.findByIdAndUpdate(id,info,options,function (err, data) {
          if (err) return next(err);
          res.json(data);
    });
})

router.delete('/:id',function(req, res, next) {
     settings.remove({"_id":req.params.id}, function (err, data) {
        if (err) return next(err);

          res.json(data);
      });
});

module.exports = router;

