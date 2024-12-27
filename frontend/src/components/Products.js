import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
        
    }, [])

    const getProducts = async () => {
        let result = await fetch('http://localhost:5000/listProducts', {
            headers : {
                authorization : `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        setProducts(result);
    }

    const deleteProduct = async (id) => {
        console.log('Delete Product : ', id)
        let result = await fetch(`http://localhost:5000/deleteProduct/${id}`, {
            method: 'Delete',
            headers : {
                authorization : `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        console.log(result);
        if(result.deletedCount > 0) {
            alert('Record is deleted');
            getProducts();
        }
    }

    const copyProduct = async (id) => {

        let product = await fetch(`http://localhost:5000/product/${id}`, {
            headers : {
                authorization : `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        product = await product.json();
        console.warn('product to be copied', product);
        let name = product.name;
        let price = product.price;
        let category = product.category;
        let company = product.company;

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

        if(result.__v === 0) {
            alert('Product Copied Successfully');
            getProducts();
        } else {
            alert('Error occurred while copy, please contact support.');
        }
    }

    const handleSearch = async (event) => {
        const searchTerm = event.target.value;
        if(searchTerm.length >= 2) { 
            console.warn(searchTerm)
            let result = await fetch(`http://localhost:5000/search/${searchTerm}`,{
                headers : {
                    authorization : `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            result = await result.json();
            console.warn(result)
            if(result) {
                setProducts(result)
            }
        } else {
            if(!searchTerm) {
                getProducts();
            }
        }
    }

    
    return (
        <div className='productList'>
            <input className='searchProduct' onChange={handleSearch} type='text' placeholder='Search Product' />
            <h3>Product List</h3>
            <ul>
                <li>S.No</li>
                <li>Product Name</li>
                <li>Price</li>
                <li>Category</li>
                <li>Company</li>
                <li>Operations</li>
            </ul>
            {
                products.length > 0 ? products.map((item, index) => 
                    <ul key={item._id}>
                        <li>{index+1}</li>
                        <li>{item.name}</li>
                        <li>{item.price}</li>
                        <li>{item.category}</li>
                        <li>{item.company}</li>
                        <li>
                            <img alt='Delete Product' className='deleteProduct' onClick={() => deleteProduct(item._id)} src='/images/delete-icon.webp'/>
                            <Link className='updateLink' to={`/update/${item._id}`}><img alt='Update Product' className='updateProduct' src='/images/update-icon.webp'/></Link>
                            <img alt='Copy Product' className='updateProduct' onClick={() => copyProduct(item._id)} src='/images/copy-icon.png'/>
                        </li>
                    </ul>
                )
                : <h1>No Result Found</h1>
            }
        </div>
    )
    
}

export default ProductList;