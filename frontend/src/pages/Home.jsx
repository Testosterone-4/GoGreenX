import React, { useEffect, useState } from "react";

const Home = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  return (
    <div>
      {userName ? (
        <h2>Welcome, {userName} 🌿</h2>
      ) : (
        <h2>Welcome to Go Green X!</h2>
      )}
    </div>
  );
};

export default Home;
