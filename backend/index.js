const express = require('express');
const cors = require('cors')
require('./db/config');
const User = require('./db/user');
const Product = require('./db/Product');

const JWT = require('jsonwebtoken');
const JWT_KEY = 'e-comm';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('get successful');
})

app.post('/register', async (req, res) => {
    console.log(req.body)
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    // res.send(result);

    JWT.sign({result}, JWT_KEY, {expiresIn: '2h'}, (err, token) => {
        if(err) {
            res.send({message : 'JWT Token error, Please contact support!'});    
        }
        res.send({user : result, auth : token});
    });


})

app.post('/login', async (req, res) => {
    console.log(req.body)
    if(req.body.password  && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if(user) {
            JWT.sign({user}, JWT_KEY, {expiresIn: '2h'}, (err, token) => {
                if(err) {
                    res.send({message : 'JWT Token error, Please contact support!'});    
                }
                res.send({user, auth : token});
            });
        } else {
            res.send({message : 'No User Found'});
        }
    }  else {
        res.send({message : 'Enter Email and Password'});
    }
})

app.post('/addProduct', verifyToken, async (req, res) => {
    console.log('Add Product');
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
})

app.get('/listProducts', verifyToken, async (req, res) => {
    console.log('Product List');
    let products = await Product.find().sort({name:1, price:1});
    if(products.length > 0) {
        res.send(products)
    } else {
        res.send({message: 'No Products found'});
    }
})

app.get('/product/:id', verifyToken, async (req, res) => {
    console.log('Find By Id',req.params.id);
    let product = await Product.findOne({ _id : req.params.id });
    if(product) {
        res.send(product)
    } else {
        res.send({message: 'No Products found'});
    }
})

app.get('/search/:key', verifyToken, async (req, res) => {
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

app.put('/updateProduct/:id', verifyToken, async (req, res) => {
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

app.delete('/deleteProduct/:id', verifyToken, async (req, res) => {
    console.log('Delete Product' + req.params.id);
    const result = await Product.deleteOne({_id:req.params.id})
    res.send(result);
})

function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if(token) {
        token = token.split(' ')[1];
        console.log("parse : ", token);
        JWT.verify(token, JWT_KEY, (err, valid) => {
            if(err) {
                res.status(401).send({message : 'Please provide the valid token!'})
            } else {
                next();
            }
        })
    } else {
        res.status(403).send({message : 'Please add token with header'})
    }
}

app.listen(5000);