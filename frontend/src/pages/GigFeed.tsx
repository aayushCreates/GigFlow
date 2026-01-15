import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import GigCard from "../components/GigCard";
import { Search } from "lucide-react";
import type { Gig } from "../types/gig.types";
import { toast } from "sonner";
import api from "../api/api";
import { useAuth } from "../context/auth.context";

export default function GigsFeed() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const currentUserId = user?._id || "";

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/gigs/");

      if (res.data.success) {
        let fetchedGigs: Gig[] = res.data.data;

        if (status !== "all") {
          fetchedGigs = fetchedGigs.filter((gig) => gig.status === status);
        }

        if (search) {
          fetchedGigs = fetchedGigs.filter((gig) =>
            gig.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        setGigs(fetchedGigs);
      } else {
        toast.error("Failed to fetch gigs");
        setGigs([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching gigs");
      setGigs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const handleGigPosted = (newGig: Gig) => {
    toast.success("Gig posted successfully");
    setGigs((prev) => [newGig, ...prev]);
  };

  const filteredGigs = gigs.filter((gig) => {
    const matchesStatus = status === "all" ? true : gig.status === status;
    

    const matchesSearch = gig.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <Navbar onGigPosted={handleGigPosted} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">Browse Gigs</h1>
        <p className="text-gray-500 mt-1">
          Discover opportunities and find the perfect project for your skills
        </p>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search gigs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-black/20 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex gap-2">
            {["all", "open", "assigned"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  status === s
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6">Showing {gigs.length} gigs</p>

        {/* Gigs */}
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-xl bg-gray-100 animate-pulse"
              />
            ))
          ) : filteredGigs.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-lg">😔</span>
              </div>
              <h4 className="font-medium mt-4 text-gray-700">No gigs found</h4>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or filter to find gigs.
              </p>
            </div>
          ) : (
            filteredGigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} currentUserId={currentUserId} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
