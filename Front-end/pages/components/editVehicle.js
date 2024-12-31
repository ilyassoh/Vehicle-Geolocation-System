import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
console.log('Component mounted');
const EditVehicle = () => {
  const router = useRouter();
  const { id } = router.query;
  const [vehicle, setVehicle] = useState(null);

  console.log('Router query:', router.query); // Log the router query object

  useEffect(() => {
    if (id) {
      console.log('Received ID:', id); // Log the received ID
      // Fetch the vehicle data using the id
      const fetchVehicle = async () => {
        try {
          const response = await fetch(`http://localhost:8081/api/vehicule/${id}`);
          if (response.ok) {
            const data = await response.json();
            setVehicle(data);
            console.log('Vehicle data:', data); // Log the fetched vehicle data
          } else {
            console.error('Error fetching vehicle data');
          }
        } catch (error) {
          console.error('Error fetching vehicle data:', error);
        }
      };

      fetchVehicle();
    } else {
      console.log('ID is not available yet'); // Log if ID is not available
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/api/vehicule/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicle),
      });
      if (response.ok) {
        router.push('/');
      } else {
        console.error('Error updating vehicle data');
      }
    } catch (error) {
      console.error('Error updating vehicle data:', error);
    }
  };

  if (!vehicle) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>Edit Vehicle</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Matricule"
          name="matricule"
          value={vehicle.matricule}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Nom"
          name="nom"
          value={vehicle.nom}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Modele"
          name="modele"
          value={vehicle.modele}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained">Save Changes</Button>
      </form>
    </Box>
  );
};
EditVehicle.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default EditVehicle;
