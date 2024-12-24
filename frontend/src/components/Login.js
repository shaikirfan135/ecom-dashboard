import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if(auth) {
            navigate('/');
        }
    }, [])

    const handleLogin = async () => {
        console.log(email, password)
        let result = await fetch('http://localhost:5000/login', {
            method: 'post',
            body: JSON.stringify({email, password}),
            headers: {
                'Content-Type':'application/json'
            }
        });
        result = await result.json();
        console.warn(result)
        if(result.name) {
            localStorage.setItem('user', JSON.stringify(result))
            navigate('/');
        } else {
            alert(JSON.stringify(result))
        }
    }

    return (
        <div className='login'>
            <input className="inputBox" type='text' placeholder='Enter Email' 
            onChange={(e) => setEmail(e.target.value)}/>
            <input className="inputBox" type='password' placeholder='Enter Password' 
            onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleLogin} type="button" className="appButton">Login</button>
        </div>
    );
}

export default Login;