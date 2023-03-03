const express = require('express');
const app = express();
const cors = require('cors');
var bodyParser = require("body-parser");
const usersRoutes =require('./routes/users');
const transactionRoutes =require('./routes/transaction');
const RofferRoutes =require('./routes/Roffer');
app.use('/images',express.static('images'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.use('/users',usersRoutes);
app.use('/transactions',transactionRoutes);
app.use('/roffer',RofferRoutes);
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
app.use((req,res,next)=>{
    const error =new Error('not found');
    error.status(404);
    next(error);
})



module.exports =app;