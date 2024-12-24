import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
        
    }, [])

    const getProducts = async () => {
        let result = await fetch('http://localhost:5000/listProducts');
        result = await result.json();
        setProducts(result);
    }

    const deleteProduct = async (id) => {
        console.log('Delete Product : ', id)
        let result = await fetch(`http://localhost:5000/deleteProduct/${id}`, {
            method: 'Delete'
        });
        result = await result.json();
        console.log(result);
        if(result.deletedCount > 0) {
            alert('Record is deleted');
            getProducts();
        }
    }

    const handleSearch = async (event) => {
        const searchTerm = event.target.value;
        if(searchTerm.length >= 2) { 
            console.warn(searchTerm)
            let result = await fetch(`http://localhost:5000/search/${searchTerm}`);
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
                            <img alt='Delete Product' className='deleteProduct' onClick={() => deleteProduct(item._id)} src='https://www.shutterstock.com/image-vector/delete-icon-no-sign-close-600nw-1077922715.jpg'/>
                            <Link className='updateLink' to={`/update/${item._id}`}><img alt='Update Product' className='updateProduct' src='https://cdn.pixabay.com/photo/2021/08/23/22/40/refresh-6568981_640.png'/></Link>
                        </li>
                    </ul>
                )
                : <h1>No Result Found</h1>
            }
        </div>
    )
    
}

export default ProductList;