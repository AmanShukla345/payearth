const express = require('express');
const router = express.Router();
const  db = require('../database');
//var md5 = require("md5")
// get all users
router.get('/',(req,res,next)=>{
    var sql = "select * from user"
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
    router.get("/:mobile", (req, res, next) => {
        var sql = "select * from user where mobile = ?"
        var params = [req.params.mobile]
        db.get(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "data":row
            })
          });
    });
    // get user and mobile
    router.get("/login/:mobile/:password", (req, res, next) => {
      var sql = "select * from user where mobile = ? and password=?"
      var params = [req.params.mobile,req.params.password]
      db.get(sql, params, (err, row) => {
          if (err) {
            res.status(400).json({"error":err.message});
            return;
          }
          res.json({
              "data":row
          })
        });
  });

  //get wallet balence
  router.get("/getById/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "data":row
        })
      });
});

//get by mobile

  //add new user
  router.post("/", (req, res, next) => {
    var errors=[]
    if (!req.body.mobile){
        errors.push("No mobile specified");
    }
    if (!req.body.name){
        errors.push("No name specified");
    }
    if (!req.body.cat){
        errors.push("No cat specified");
    }
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.wallet){
        errors.push("No wallet specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        mobile: req.body.mobile,
        name: req.body.name,
        cat: req.body.cat,
        password : req.body.password,
        wallet: req.body.wallet
    }
    var sql ='INSERT INTO user (mobile,name,cat,password,wallet) VALUES (?,?,?,?,?)'
    var params =[data.mobile,data.name, data.cat, data.password ,data.wallet]
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

router.patch("/:mobile", (req, res, next) => {
  var data = {
      id: req.body.id,
      name: req.body.name,
      cat: req.body.cat,
      wallet: req.body.wallet,
      password : req.body.password 
  }
  db.run(
      `UPDATE user set 
         id = COALESCE(?,id),
         name = COALESCE(?,name), 
         cat = COALESCE(?,cat), 
         password = COALESCE(?,password) ,
         wallet = COALESCE(?,wallet) 
         WHERE mobile = ?`,
      [data.id,data.name, data.cat, data.password,data.wallet, req.params.mobile],
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
//update by id
router.patch("/updateById/:id", (req, res, next) => {
    var data = {
        mobile: req.body.mobile,
        name: req.body.name,
        cat: req.body.cat,
        wallet: req.body.wallet,
        password : req.body.password 
    }
    db.run(
        `UPDATE user set 
           mobile = COALESCE(?,mobile),
           name = COALESCE(?,name), 
           cat = COALESCE(?,cat), 
           password = COALESCE(?,password) ,
           wallet = COALESCE(?,wallet) 
           WHERE id = ?`,
        [data.mobile,data.name, data.cat, data.password,data.wallet, req.params.id],
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

router.delete("/:id", (req, res, next) => {
  db.run(
      'DELETE FROM user WHERE id = ?',
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