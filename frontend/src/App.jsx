import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Actions from "./pages/Actions.jsx";
import FitnessPlan from "./pages/FitnessPlan.jsx";
import Training from "./pages/Training.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/fitness-plan" element={<FitnessPlan />} />
          <Route path="/training" element={<Training />} />
          {/* <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/forum" element={<Forum />} /> */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
