import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import GigCard from "../components/GigCard";
import { Plus } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/auth.context";
import { toast } from "sonner";
import type { Gig } from "../types/gig.types";
import PostGigModal from "../components/GigModal";

export default function GigsPosted() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [openGigPostModal, setOpenGigPostModal] = useState(false);
  const { user } = useAuth();

  const fetchMyGigs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/gigs/");
      if (res.data.success) {
        const myGigs = res.data.data.filter(
          (gig: Gig) => gig.owner?._id === user?._id || gig.ownerId === user?._id
        );
        setGigs(myGigs);
      }
    } catch (error) {
      toast.error("Failed to fetch your gigs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyGigs();
    }
  }, [user]);

  const handleGigPosted = (newGig: Gig) => {
    setGigs((prev) => [newGig, ...prev]);
  };

  return (
    <>
      <Navbar onGigPosted={handleGigPosted} />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gigs Posted</h1>
          <button
            onClick={() => setOpenGigPostModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm"
          >
            <Plus size={18} />
            Post New Gig
          </button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Plus className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No gigs posted</h3>
            <p className="text-gray-500 mt-1">
              You haven't posted any gigs yet. Create one to get started!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} currentUserId={user?._id || ""} />
            ))}
          </div>
        )}

        {openGigPostModal && (
          <PostGigModal
            isOpen={openGigPostModal}
            onClose={() => setOpenGigPostModal(false)}
            onSuccess={handleGigPosted}
          />
        )}
      </div>
    </>
  );
}
