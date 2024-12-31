import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './styles.module.css';
import SidebarLayout from 'src/layouts/SidebarLayout';


const EditVehicle = ({ vehicleId }) => {
  const [vehicle, setVehicle] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    modele: '',
    etat: 'actif',
    status: '',
    type: '',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const usertoken = localStorage.getItem("token");
        if (!usertoken) {
          router.push("/login");
          return;
        }
        
        const response = await fetch(`http://localhost:8081/api/vehicule/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${usertoken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle');
        }
        const data = await response.json();
        setVehicle(data);
        setFormData(data); // Pre-fill the form data with fetched vehicle details
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usertoken = localStorage.getItem("token");
      if (!usertoken) {
        router.push("/login");
        return; // Stop execution if token is not available
      }

      const response = await fetch(`http://localhost:8081/api/vehicule/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usertoken}`, // Include the token in the request headers
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Forbidden: You do not have permission to perform this action.');
        }
        throw new Error('Failed to update vehicle');
      }
      router.push('/'); // Redirect to the main page after successful update
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Edit Vehicle</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Matricule:</label>
          <input
            className={styles.input}
            type="text"
            name="matricule"
            value={formData.matricule}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Nom:</label>
          <input
            className={styles.input}
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Modele:</label>
          <input
            className={styles.input}
            type="text"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Etat:</label>
          <select
            className={styles.input}
            name="etat"
            value={formData.etat}
            onChange={handleChange}
          >
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Status:</label>
          <input
            className={styles.input}
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Type:</label>
          <input
            className={styles.input}
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Update Vehicle</button>
      </form>
    </div>
  );
};
EditVehicle.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default EditVehicle;
