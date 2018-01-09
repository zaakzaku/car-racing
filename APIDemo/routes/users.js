var express = require('express');
var user=require('../models/user');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
 user.getAllUser(function(err,rows){
    if(err)
    {
      res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
    }
    else
    {
    res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    }

  });
});

router.get('/:id?', function(req, res, next) {
 user.getUserById(req.params.id,function(err,rows){
    if(err)
    {
      res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
    }
    else
    {
    if(JSON.stringify(rows) === '[]'){
    res.send(JSON.stringify({"status": 200, "error": null, "response": "false"}));
    }
    else{
    res.send(JSON.stringify({"status": 200, "error": null, "response": rows}));
    }
    }

  });
});

router.post('/',function(req,res,next){
    user.addUser(req.body,function(err,count){

    if(err)
    {
      res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
    }
    else
    {
    res.send(JSON.stringify({"status": 200, "error": null, "response": req.body}));
    }

  });
});

module.exports = router;
