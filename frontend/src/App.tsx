import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GigsFeed from "./pages/GigFeed";
import GigDetails from "./pages/GigDetails";
import BidHistory from "./pages/BidHistory";
import GigsPosted from "./pages/GigsPosted";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<GigsFeed />} />
        <Route path="/gig/:gigId" element={<GigDetails />} />
        <Route path="/bid-history" element={<BidHistory />} />
        <Route path="/gigs-posted" element={<GigsPosted />} />
      </Route>
    </Routes>
  );
}

export default App;
