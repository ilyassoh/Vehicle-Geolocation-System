import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useRouter } from 'next/router';
import { Label } from 'recharts';

// Dynamically import Leaflet with SSR disabled
const Leaflet = dynamic(() => import('leaflet'), { ssr: false });

function ManagementUserSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null); // State to store the map instance
  const router = useRouter();
  const [matricule, setMatricule] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const fetchData = async (matricule, start, end) => {
    try {
      const response = await fetch(`http://localhost:8081/api/location/range/${matricule}?start=${start}&end=${end}`, {
        method: 'GET',
        headers: {
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
        const mapInstance = L.map('map').setView([31.630000, -8.008889], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);

        setMap(mapInstance);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    initializeMap();
  }, []);

  const handleSearch = async () => {
    if (new Date(dateFin) > new Date(dateDebut)) {
      const data = await fetchData(matricule, dateDebut, dateFin);

      if (data && map) {
        const L = await import('leaflet');
        const transitData = data.map(item => [item.latitude, item.longitude]);
        
        const polyline = L.polyline(transitData, { color: 'blue', weight: 10, opacity: 0.4 }).addTo(map);

        for (const latlng of polyline.getLatLngs()) {
          L.circle(latlng, { radius: 2, fillOpacity: 1 })
            .bindTooltip(`Latitude: ${latlng.lat.toFixed(4)}<br>Longitude: ${latlng.lng.toFixed(4)}`)
            .addTo(map);
        }

        map.fitBounds(polyline.getBounds());
      }
    } else {
      alert('Date de fin must be greater than Date de début');
    }
  };

  return (
    <>
      <Head>
        {/* Include Leaflet CSS */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      </Head>
      <div className="management-container">
        <div className="search-container">
          <Label>Matricule:</Label>
          <input className="search-input" value={matricule} onChange={(e) => setMatricule(e.target.value)} />
          <Label>Date de début:</Label>
          <input className="search-input" type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
          <Label>Date de fin:</Label>
          <input className="search-input" type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
          <button className="search-button" onClick={handleSearch}>Chercher</button>
        </div>
        <div id="map" className="map-container"></div>
      </div>
      <style jsx>{`
        .management-container {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .search-container {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .search-input {
          margin-right: 10px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 200px;
          font-size: 16px;
          text-align: center;
          background-color: #111633f2;
        }
        .search-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: whait;
          cursor: pointer;
          font-size: 16px;
        }
        .map-container {
          height: 85vh;
          width: 100%;
        }
      `}</style>
    </>
  );
}

ManagementUserSettings.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserSettings;