import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const [error,setError] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [msgCss, setMsgCss] = useState('');

    const addProduct = async () => {
        console.warn(name, price, category, company);
        if(!name || !price || !category || !company) {
            setError(true);
            return false;
        }

        let userId = JSON.parse(localStorage.getItem('user'))._id;
        let result = await fetch('http://localhost:5000/addProduct',{
            method: 'post',
            body: JSON.stringify({name, price, category, userId, company}),
            headers : {
                'Content-Type' : 'application/json',
                authorization : `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json();
        console.warn(result);
        if(result.__v == 0) {
            setMsgCss('successMessage');
            setMessage('Product Added Successfully');
            // setTimeout(() => {navigate('/')}, 5000);
        } else {
            setMsgCss('errorMessage');
            setMessage(result.message);
        }
        
    }

    const clearAll = () => {
        setName('');
        setPrice('');
        setCategory('');
        setCompany('');
        setMessage('');
    }

    return (
        <div className='product'>
            {message !='' && <span className='successMessage'>Product Added Successfully</span>}
            <h1>Add Product</h1>
            <input value={name} onChange={(e) => setName(e.target.value)} className='inputBox' type='text' placeholder='Enter Product Name' />
            {error && !name && <span className='invalidInput'>Enter valid Name</span>}
            <input value={price} onChange={(e) => setPrice(e.target.value)} className='inputBox' type='text' placeholder='Enter Product Price' />
            {error && !price && <span className='invalidInput'>Enter valid Price</span>}
            <input value={category} onChange={(e) => setCategory(e.target.value)} className='inputBox' type='text' placeholder='Enter Product Category' />
            {error && !category && <span className='invalidInput'>Enter valid Category</span>}
            <input value={company} onChange={(e) => setCompany(e.target.value)} className='inputBox' type='text' placeholder='Enter Product Company' />
            {error && !company && <span className='invalidInput'>Enter valid Company</span>}
            <button onClick={addProduct} className='appButton'>Add Product</button>
            <button onClick={clearAll} className='appButton'>Clear</button>
        </div>
    )
}

export default AddProduct;