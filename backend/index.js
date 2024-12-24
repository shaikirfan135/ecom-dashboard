const express = require('express');
const cors = require('cors')
require('./db/config');
const user = require('./db/user');
const Product = require('./db/Product');

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
    result = result.toObject();
    delete result.password;
    res.send(result);
})

app.post('/login', async (req, res) => {
    console.log(req.body)
    if(req.body.password  && req.body.email) {
        let userData = await user.findOne(req.body).select("-password");
        if(userData) {
            res.send(userData);
        } else {
            res.send({message : 'No User Found'});
        }
    }  else {
        res.send({message : 'Enter Email and Password'});
    }
})

app.post('/addProduct', async (req, res) => {
    console.log('Add Product');
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
})

app.get('/listProducts', async (req, res) => {
    console.log('Product List');
    let products = await Product.find().sort({name:1, price:1});
    if(products.length > 0) {
        res.send(products)
    } else {
        res.send({message: 'No Products found'});
    }
})

app.get('/product/:id', async (req, res) => {
    console.log('Find By Id',req.params.id);
    let product = await Product.findOne({ _id : req.params.id });
    if(product) {
        res.send(product)
    } else {
        res.send({message: 'No Products found'});
    }
})

app.get('/search/:key', async (req, res) => {
    let result = await Product.find({
        '$or':[
            { name : { $regex : req.params.key } },
            { company : { $regex : req.params.key } },
            { category : { $regex : req.params.key } }
        ]
    }).sort({price:1});
    console.log(result)
    res.send(result);
})

app.put('/updateProduct/:id', async (req, res) => {
    console.log('Update Product',req.params.id);
    let result = await Product.updateOne(
        { _id : req.params.id },
        {
            $set : req.body
        }
    )
    console.log('Product Updated : ', result);
    if(result.modifiedCount > 0) {
        res.send(result);
    } else {
        res.send({message : 'No Records updated.'})
    }
})

app.delete('/deleteProduct/:id', async (req, res) => {
    console.log('Delete Product' + req.params.id);
    const result = await Product.deleteOne({_id:req.params.id})
    res.send(result);
})

app.listen(5000);