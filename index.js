const express = require('express');
const app= express();
const PORT = 5000;
const bodyParser = require('body-parser');
// limiting the incoming request.
const rateLimit = require("express-rate-limit");


require('dotenv').config(); // Load environment variables from .env file




app.use(bodyParser.json());
// request can be made in windowMS time.
const limiter = rateLimit({
    max: 5,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP"
});
 
// Add the limiter function to the express middleware
// so that every request coming from user passes
// through this middleware.

app.use(limiter);
// app.get('/', (req, res) => {
//     res.send('Hello word')
// })
const route = require('./routes/user.route');
app.use('/',route);
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})