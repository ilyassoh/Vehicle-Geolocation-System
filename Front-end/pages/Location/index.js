import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useRouter } from 'next/router';
import styles from './styles/localisation.module.css';

// Dynamically import Leaflet with SSR disabled
const Leaflet = dynamic(() => import('leaflet'), { ssr: false });

function ManagementUserSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null); // State to store the map instance
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/vehicule', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const L = await import('leaflet');
        const mapInstance = L.map('map');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);
        mapInstance.setView([31.630000, -8.008889], 13);

        setMap(mapInstance);

        const updateMarkers = async () => {
          try {
            const vehicles = await fetchData();
            // Clear previous markers before adding new ones
            mapInstance.eachLayer(layer => {
              if (layer instanceof L.Marker) {
                mapInstance.removeLayer(layer);
              }
            });

            // Create markers for each vehicle
            vehicles.forEach(vehicle => {
              const { matricule, nom, modele, status, lastpostion } = vehicle;
              if (lastpostion != null) {
                L.marker(lastpostion, {
                  icon: L.icon({
                    iconUrl: './car.svg',
                    iconSize: [20, 20],
                    iconAnchor: [10, 20],
                    popupAnchor: [-3, -76],
                    shadowSize: [20, 20],
                    shadowAnchor: [10, 20],
                  })
                }).addTo(mapInstance).bindTooltip(`
                  <div>
                    <strong>${matricule}</strong><br />
                    Name: ${nom}<br />
                    Model: ${modele}<br />
                    Status: ${status}<br />
                    Coordinates: ${lastpostion.join(', ')}
                  </div>
                `);
              }
            });
          } catch (error) {
            setError(error);
            setLoading(false);
          }
        };

        // Update markers periodically
        const intervalId = setInterval(updateMarkers, 10000); // Adjust the interval as needed

        // Initial marker update
        await updateMarkers();

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);

      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    initializeMap();

    fetch('http://localhost:8081/api/vehicule', {
          // headers: {
          //   'Authorization': `Bearer ${token}`
          // }
        })
          .then(response => response.json())
          .then(data => setVehicles(data));

  
  }, []); // Run only once on component mount

  return (
    <>
      <Head>
        {/* Include Leaflet CSS */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      </Head>
      <div style={{ display: 'flex' }}>
        <div className={styles['sidebar-2']}>
          <h2 className={styles['sidebar-h2']}>Vehicles</h2>
          <div className={styles['sidebar']}>
          <ul className={styles['sidebar-ul']}>
            {vehicles.map((vehicle, index) => (
              <li key={index} className={styles['sidebar-ul-li']}>{vehicle.matricule} - {vehicle.modele}</li>
            ))}
          </ul>
        </div>
        </div>
      <div id="map" style={{ height: '85vh', width:'250vh'}}></div>
      </div>
    </>
  );
}

ManagementUserSettings.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserSettings;
