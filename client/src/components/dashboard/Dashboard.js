import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Import your Axios instance

const Dashboard = () => {
  const [data, setData] = useState(null);

  // Example of making a protected request to a backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await api.get('/protected-endpoint'); // This will automatically send the cookie
        // setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <p>This is a protected page only accessible to authenticated users.</p>
      {data ? <div>{JSON.stringify(data)}</div> : <p>Loading...</p>}
    </div>
  );
};

export default Dashboard;
