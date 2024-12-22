const express = require('express');
const cors = require('cors')
require('./db/config');
const user = require('./db/user')

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('get successful');
})

app.post('/register', async (req, res) => {
    console.log(req.body)
    let userData = new user(req.body);
    let result = await userData.save();
    res.send(result);
})

app.listen(5000);