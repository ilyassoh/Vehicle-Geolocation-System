"use client";
import { useRouter } from 'next/router';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const forms = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
      return token;
    };

    const token = checkAuthentication();
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/vehicule', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setVehicles(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleAddNewVehicle = () => {
    router.push('/add-vehicle');
  };

  const handleModify = (id) => {
    router.push(`/editVehicule/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this vehicle?');
    if (!confirmed) {
      return;
    }

    try {
      const usertoken = localStorage.getItem("token");
      if (!usertoken) {
        router.push("/login");
      }
      const response = await fetch(`http://localhost:8081/api/vehicule/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${usertoken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Failed to delete vehicle: Forbidden (403)');
        }
        throw new Error('Failed to delete vehicle');
      }

      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setError(error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading vehicles</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <button className={styles.addButton} onClick={handleAddNewVehicle}>Add New Vehicle</button>
        <table className={styles.userstable}>
          <thead>
            <tr className={styles.tr1}>
              <th className={styles.th1}>ID</th>
              <th className={styles.th1}>Matricule</th>
              <th className={styles.th1}>Nom</th>
              <th className={styles.th1}>Modele</th>
              <th className={styles.th1}>Etat</th>
              <th className={styles.th1}>Status</th>
              <th className={styles.th1}>Type</th>
              <th className={styles.th1}>Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, i) => {
              let etatDisplay;
              let etatColor;
              if (vehicle.etat === true) {
                etatDisplay = "actif";
                etatColor = "green";
              } else if (vehicle.etat === false) {
                etatDisplay = "inactif";
                etatColor = "red";
              }
              console.log(`Vehicle ID: ${vehicle.id}, Etat: ${vehicle.etat}, Display: ${etatDisplay}`);
              return (
                <tr className={styles.tr1} key={i}>
                  <td className={styles.th1}>{vehicle.id}</td>
                  <td className={styles.th1}>{vehicle.matricule}</td>
                  <td className={styles.th1}>{vehicle.nom}</td>
                  <td className={styles.th1}>{vehicle.modele}</td>
                  <td className={styles.th1} style={{ color: etatColor }}>{etatDisplay}</td>
                  <td className={styles.th1}>{vehicle.status}</td>
                  <td className={styles.th1}>{vehicle.type}</td>
                  <td className={styles.th1}>
                    <button className={styles.modifyButton} onClick={() => handleModify(vehicle.id)}>Modify</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(vehicle.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

forms.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default forms;
