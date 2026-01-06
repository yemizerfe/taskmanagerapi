import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './home.css'

function Home() {
  const navigete = useNavigate();
  const [signUp, setSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logIn, setLogIn] = useState(false);
  const [res, setRes] = useState('');



  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/newUsers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    setRes(data.message);
    setEmail('');
    setPassword('');


  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/logInUsers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setRes(data.message);
        return;
      }

      const token = data.token;

      localStorage.setItem('token', token);
      setRes('LogIn successful!');
      setEmail('');
      setPassword('');
      navigete('/tasks');

    }
    catch (e) {
      setRes('Unable to connect. Please check your internet or try again later.')
    }

  }

  return (
    <div className='container-fluid'>
      <h1 className='text-center p-5 fw-bolder my-5' style={{ textShadow: '1px 2px 2px black' }}>Task Manager App</h1>
      <hr />
      <h3 className='text-center my-4 fw-bold fst-italic'>Welcome to the task manager app.
        <br />Here you can create, update, view and delete your tasks.
      </h3>
      <div className='d-flex justify-content-center my-5'>

        <button className='btn btn-dark' onClick={() => {
          setLogIn(true);
          setSignUp(false);
          setRes('');

        }}>LogIn</button>
        <button className='btn btn-primary mx-3' onClick={() => {
          setSignUp(true)
          setLogIn(false)
        }}>SignUp</button>
      </div>

      {signUp && <form onSubmit={handleRegister} className='my-5 d-flex flex-column align-items-center'>
        <input type="email" className='form-control'
          name='email'
          placeholder='Enter your email...'
          autoComplete='off'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required

        />
        <br />
        <input type="password" className='form-control'
          name='password'
          placeholder='Enter your password...'
          value={password}
          autoComplete='off'
          onChange={(e) => setPassword(e.target.value)}
          required

        />
        <br />
        <button className=' btn btn-dark' type='submit'>Register</button>
        <br />
        {res && <p className='text-center bg-dark text-white p-3'>{res}</p>}
      </form>}

      {logIn && <form className='my-5 d-flex flex-column align-items-center' onSubmit={handleLogin}>
        <input type="email" className='form-control'
          name='email'
          placeholder='Enter your email...'
          autoComplete='off'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required

        />
        <br />
        <input type="password" className='form-control'
          name='password'
          placeholder='Enter your password...'
          autoComplete='off'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required

        />
        <br />
        <button className=' btn btn-dark' type='submit'>LogIn</button>
        <br />

        {res && <p className='text-center bg-dark text-white p-3'>{res}</p>
        }
      </form>}




    </div>
  )
}

export default Home
