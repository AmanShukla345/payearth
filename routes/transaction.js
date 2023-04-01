const express = require('express');
const router = express.Router();
const  db = require('../database');
//var md5 = require("md5")
// get all users
router.get('/',(req,res,next)=>{
    var sql = "select * from transTable ORDER BY id DESC"
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
    var sql = "select * from transTable  where userId = ? ORDER BY id DESC"
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


router.get("/getByMobile/:mobile_no", (req, res, next) => {
    var sql = "select * from transTable where mobile_no= ? and userId=13 ORDER BY id DESC"
    var params = [req.params.mobile_no]
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
router.get("/getById/:id", (req, res, next) => {
    var sql = "select * from transTable where id= ?"
    var params = [req.params.id]
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
    if (!req.body.amount){
        errors.push("No amount specified");
    }
    if (!req.body.mobile_no){
        errors.push("No mobile_no specified");
    }
    if (!req.body.status){
        errors.push("No status specified");
    }
    if (!req.body.recharge_date){
        errors.push("No recharge_date specified");
    }
    if (!req.body.company_id){
        errors.push("No company_id specified");
    }
    if (!req.body.tnx_id){
        errors.push("No tnx_id specified");
    }
    if (!req.body.balence){
        errors.push("No balence specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        userId: req.body.userId,
        amount: req.body.amount,
        mobile_no: req.body.mobile_no,
        status: req.body.status,
        recharge_date:req.body.recharge_date,
        company_id:req.body.company_id,
        tnx_id:req.body.tnx_id,
        balence:req.body.balence
    }
    var sql ='INSERT INTO transTable (userId,amount,mobile_no, status,recharge_date,company_id,tnx_id,balence) VALUES (?,?,?,?,?,?,?,?)'
    var params =[data.userId,data.amount, data.mobile_no,data.status,data.recharge_date,data.company_id,data.tnx_id,data.balence]
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
//update
router.patch("/updateById/:id", (req, res, next) => {
    var data = {
        userId: req.body.userId,
        amount: req.body.amount,
        mobile_no: req.body.mobile_no,
        status: req.body.status,
        recharge_date : req.body.recharge_date ,
        company_id : req.body.company_id ,
        tnx_id : req.body.tnx_id ,
        balence : req.body.balence 
    }
    db.run(
        `UPDATE transTable set 
        userId = COALESCE(?,userId),
        amount = COALESCE(?,amount), 
        mobile_no = COALESCE(?,mobile_no), 
        status = COALESCE(?,status) ,
        recharge_date = COALESCE(?,recharge_date) ,
        company_id = COALESCE(?,company_id),
        tnx_id = COALESCE(?,tnx_id),
        balence = COALESCE(?,balence)
           WHERE id = ?`,
        [data.userId,data.amount, data.mobile_no, data.status,data.recharge_date,data.company_id,data.tnx_id,data.balence, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
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
router.delete("/deleteById/:id", (req, res, next) => {
  db.run(
      'DELETE FROM transTable WHERE id = ?',
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