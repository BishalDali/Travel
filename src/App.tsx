import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./features/Layout/Home";
import Packages from "./features/packages/Packages";
import Register from "./features/register/Register";
import Login from "./features/login/Login";
import Sidebar from "./components/Sidebar";
import AddTrip from "./features/trip/AddTrip";
import PackageDetail from "./features/packages/PackageDetail";
import ProtectedLayout from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Packages />} />
          <Route path=":id" element={<PackageDetail />} />
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="admin" element={<Sidebar />}>
            <Route index element={<h1>Dashboard</h1>} />
            <Route path="addtrip" element={<AddTrip />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
