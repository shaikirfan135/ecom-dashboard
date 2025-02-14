import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
            <img 
                alt='logo'
                className='logo'
            src='https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/pijypsb7rsnimrspm45v' />
            {
                auth ?
                    <ul className='nav-ul'>
                        <li><Link to="/">Products</Link></li>
                        <li><Link to="/add">Add Product</Link></li>
                        {/* <li><Link to="/update">Update Product</Link></li> */}
                        {/* <li><Link to="/delete">Delete Product</Link></li> */}
                        {/* <li><Link to="/profile">Profile</Link></li> */}
                        <li><Link className='logoutLink' onClick={logout} to="/signup">Logout ({JSON.parse(auth).name})</Link></li>
                    </ul>
                    :
                    <ul className='nav-ul nav-right'>
                        <li><Link to="/signup">Signup</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>

            }
        </div>
    );
}

export default Nav;