import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';


const UpdateProduct = () => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const params = useParams();
    const navigate = useNavigate();
    const [msgCss, setMsgCss] = useState('');

    useEffect(() => {
        console.warn("params : ", params);
        loadData();
    }, [])

    const loadData = async () => {
        let result = await fetch(`http://localhost:5000/product/${params.id}`, {
            headers : {
                authorization : `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        console.warn('result', result);
        setName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company);
    }

    const updateProduct = async () => {
        let userId = JSON.parse(localStorage.getItem('user'))._id;
        console.warn(name, price, category, userId, company);
        if(!name || !price || !category || !company) {
            setError(true);
            return false;
        }
        let result = await fetch(`http://localhost:5000/updateProduct/${params.id}`, {
            method:'put',
            body : JSON.stringify({name, price, category, userId, company}),
            headers : {
                'Content-Type' : 'application/json',
                authorization : `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });

        result = await result.json();
        console.warn(result);
        if(result.modifiedCount > 0) {
            setMsgCss('successMessage');
            setMessage('Product Updated Successfully');
            setTimeout(() => {navigate('/')}, 2000);
        } else {
            setMsgCss('errorMessage');
            setMessage(result.message);
        }
    }




    return (
        <div className='product'>
            {message !='' && <span className={msgCss}>{message}</span>}
            <h1>Update Product</h1>
            <input value={name} onChange={(e) => setName(e.target.value)} className='inputBox' type='text' placeholder='Enter Product Name' />
            {error && !name && <span className='invalidInput'>Enter valid Name</span>}
            <input value={price} onChange={(e) => setPrice(e.target.value)} className='inputBox' type='text' placeholder='Enter Product Price' />
            {error && !price && <span className='invalidInput'>Enter valid Price</span>}
            <input value={category} onChange={(e) => setCategory(e.target.value)} className='inputBox' type='text' placeholder='Enter Product Category' />
            {error && !category && <span className='invalidInput'>Enter valid Category</span>}
            <input value={company} onChange={(e) => setCompany(e.target.value)} className='inputBox' type='text' placeholder='Enter Product Company' />
            {error && !company && <span className='invalidInput'>Enter valid Company</span>}
            <button onClick={updateProduct} className='appButton'>Update Product</button>
            <button onClick={() => navigate('/')}  className='appButton'>Back</button>
        </div>
    )
}

export default UpdateProduct;