const express = require('express');
const router = express.Router();
const  db = require('../database');
//var md5 = require("md5")
// get all users
router.get('/',(req,res,next)=>{
    var sql = "select * from transTable"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json(rows);
      });
    });
     

  //get wallet balence
  router.get("/:userId", (req, res, next) => {
    var sql = "select * from transTable where userId = ?"
    var params = [req.params.userId]
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
  router.post("/", (req, res, next) => {
    var errors=[]
    if (!req.body.userId){
        errors.push("No userId specified");
    }
    if (!req.body.rechargeBal){
        errors.push("No rechargeBal specified");
    }
    if (!req.body.mobile){
        errors.push("No mobile specified");
    }
    if (!req.body.status){
        errors.push("No status specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        userId: req.body.userId,
        rechargeBal: req.body.rechargeBal,
        mobile: req.body.mobile,
        status: req.body.status
        
    }
    var sql ='INSERT INTO transTable (userId,rechargeBal,mobile, status) VALUES (?,?,?,?)'
    var params =[data.userId,data.rechargeBal, data.mobile,data.status]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "transId" : this.lastID
        })
    });
})
// detele data
router.delete("/:userId", (req, res, next) => {
  db.run(
      'DELETE FROM transTable WHERE userId = ?',
      req.params.userId,
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.json({"message":"deleted", changes: this.changes})
  });
})
                
module.exports = router;