// pages/vehicle-list.js
import { useRouter } from 'next/router';
import SidebarLayout from 'src/layouts/SidebarLayout';

function VehicleList() {
  const router = useRouter();

  const handleModify = (id) => {
    console.log(`Modify vehicle with ID: ${id}`);
    router.push(`/edit-vehicle/${id}`);
  };

  const vehicles = [
    { id: 1, name: 'Vehicle 1' },
    { id: 2, name: 'Vehicle 2' },
    { id: 3, name: 'Vehicle 3' }
  ];

  return (
    <div>
      <h1>Vehicle List</h1>
      <ul>
        {vehicles.map(vehicle => (
          <li key={vehicle.id}>
            {vehicle.name}
            <button onClick={() => handleModify(vehicle.id)}>Edit Vehicle</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
VehicleList.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default VehicleList;
