// pages/login.js

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './styles/login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8081/api/auth/authenticate', { email, password });
      // Assuming your response contains a token
      const { token } = response.data;
      // Store token in localStorage or any state management library
      localStorage.setItem('token', token);
      // Redirect to a protected page
      router.push('/dashboards/tasks');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <body>
      <div className={styles['background']}>
        <div className={styles['shape']}></div>
        <div className={styles['shape']}></div>
      </div>
      <Head>
        <title>Login</title>
      </Head>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form className={styles['login-form']} onSubmit={handleSubmit}>
        <h3>Welcome</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <label className={styles['login-label']} htmlFor="username">Email</label>
        <input className={styles['login-input']}
          type="text"
          placeholder="Email"
          id="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className={styles['login-label']} htmlFor="password">Password</label>
        <input className={styles['login-input']}
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={styles['login-button']} type="submit">Log In</button>
      </form>
    </body>
  );

}
