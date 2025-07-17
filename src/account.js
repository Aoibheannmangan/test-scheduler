import React, { useEffect, useState } from 'react';
import './account.css';

const Account = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userInfo");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  if (!userData) {
    return <p>No User data</p>;
  }

  return (
    <div className="AccountInfo">
      <h1>My Account Information</h1>
      <div className="display">
        <ul>
          <li><strong>First Name:</strong> {userData.FirstName}</li>
          <li><strong>Last Name:</strong> {userData.LastName}</li>
          <li><strong>Date of Birth:</strong> {userData.DOB}</li>
          <li><strong>Age:</strong> {userData.Age}</li>
          <li><strong>Sex:</strong> {userData.Sex}</li>
          <li><strong>Address:</strong> {userData.Address}</li>
          <li><strong>Condition:</strong> {userData.Condition}</li>
          <li><strong>General Practitioner:</strong> {userData.GP}</li>
        </ul>
      </div>
      
    </div>
  );
};

export default Account;
