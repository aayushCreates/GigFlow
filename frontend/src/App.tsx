import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import GigsFeed from "./pages/GigFeed";
import GigDetails from "./pages/GigDetails";
import BidHistory from "./pages/BidHistory";
import GigsPosted from "./pages/GigsPosted";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<GigsFeed />} />
        <Route path="/gigs/:gigId" element={<GigDetails />} />
        <Route path="/bid-history" element={<BidHistory />} />
        <Route path="/gigs-posted" element={<GigsPosted />} />
      </Route>
    </Routes>
  );
}

export default App;