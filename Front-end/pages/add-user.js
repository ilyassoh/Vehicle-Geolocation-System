import { useState ,useEffect} from 'react';
import { useRouter } from 'next/router';
import SidebarLayout from 'src/layouts/SidebarLayout';
import styles from './styles.module.css';


function AddUser() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
      return token;
    };
    let a=checkAuthentication()
  })
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append('firstname', first_name);
    formData.append('lastname', last_name);
    formData.append('email', email);
    formData.append('password', password);
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
      return token;
    };
    const token=checkAuthentication()
    try {
      const response = await fetch('http://localhost:8081/api/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      console.log('User added successfully');
      router.push('/management/profile'); // Navigate back to the main page or user list
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Add New User</h1>
      <form onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.formGroup}>
          <label className={styles.label}>First Name:</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Last Name:</label>
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Add User</button>
      </form>
    </div>
  );
}

AddUser.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default AddUser;
