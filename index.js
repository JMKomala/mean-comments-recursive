const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')



mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/gallery')
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/comments')

app.use(bodyParser.json());
// routes ==========================
//more specific routes come first otherwise the more general route will catch first
app.use(require('./app/routes'))

app.use('/',
    express.static(path.join(__dirname, '/'), {
        fallthrough: false
    }))



const port = 3031


app.listen(port || 3031, () => {
    console.log(`server started on ${port}`);
})
