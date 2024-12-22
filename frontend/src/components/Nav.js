import React from 'react';
import { Link, useNavigate, useNavigation } from 'react-router-dom';

const Nav = () => {

    const auth = localStorage.getItem('user');
    const navigate = useNavigate();

    const logout = () => {
        console.log('logout')
        localStorage.clear();
        navigate('/signup');
    }

    return (
        <div>
            <ul className='nav-ul'>
                <li><Link to="/">Products</Link></li>
                <li><Link to="/add">Add Product</Link></li>
                <li><Link to="/update">Update Product</Link></li>
                <li><Link to="/delete">Delete Product</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li>{auth 
                     ? <Link onClick={logout} to="/signup">Logout</Link>
                     : <Link to="/signup">Signup</Link>
                    }
                </li>
            </ul>
        </div>
    );
}

export default Nav;