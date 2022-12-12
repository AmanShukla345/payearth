const http =require('http');
const path=require('path');
const fs=require('fs');
const app =require('./app');
const port =process.env.PORT || 3000;
const server =http.createServer(app);
server.listen(port);



/////////////////////////////////////

