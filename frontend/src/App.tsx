import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GigsFeed from "./pages/GigFeed";
import GigDetails from "./pages/GigDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GigsFeed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/gig/:gigId" element={<GigDetails />} />
    </Routes>
  );
}

export default App;
