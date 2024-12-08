const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('get successful');
})

app.listen(5000);