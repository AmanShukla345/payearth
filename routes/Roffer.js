const express = require('express');
const router = express.Router();
const  db = require('../database');
//var md5 = require("md5")
// get all users
router.get('/',(req,res,next)=>{
    var sql = "select * from RofferTable"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json(rows);
      });
    });
    // get one user at a time
    router.get("/:oprator", (req, res, next) => {
        var sql = "select * from RofferTable where oprator = ?"
        var params = [req.params.oprator]
        db.all(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "data":row
            })
          });
    });
   

  //add new user
  router.post("/", (req, res, next) => {
    var errors=[]
    if (!req.body.oprator){
        errors.push("No oprator specified");
    }
    if (!req.body.price){
        errors.push("No price specified");
    }
    if (!req.body.cat){
        errors.push("No call category");
    }
    if (!req.body.discription){
        errors.push("No validity discription");
    }
    
    
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        oprator: req.body.oprator,
        price: req.body.price,
        cat: req.body.cat,
        discription : req.body.discription,
    }
    var sql ='INSERT INTO RofferTable (oprator,price,cat,discription) VALUES (?,?,?,?)'
    var params =[data.oprator,data.price, data.cat, data.discription]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

// update infomation


//update by id

// detele data

router.delete("/:id", (req, res, next) => {
  db.run(
      'DELETE FROM RofferTable WHERE id = ?',
      req.params.id,
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({"message":"deleted", changes: this.changes})
  });
})
                
module.exports = router;