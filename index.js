const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.json());

app.use('/',
    express.static(path.join(__dirname, '/'), {
        fallthrough: false
    }))


const port = 3031
// app.post('/', function (req, res, next) {
//     let jsonObj={"car":"red"};
//     console.log('hello world')
//     res.status(200).json(jsonObj);
// })

//need a listener pick a port number
app.listen(port || 3031, () => {
    console.log(`server started on ${port}`);
})










