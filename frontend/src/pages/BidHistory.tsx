import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { ArrowRight, Gavel } from "lucide-react";
import api from "../api/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { Bid } from "../types/bid.types";

// Extended Bid type to include populated gigId
interface PopulatedBid extends Omit<Bid, "gigId"> {
  gigId: {
    _id: string;
    title: string;
    budget: number;
    status: string;
    owner: {
      _id: string;
      name: string;
      email: string;
    };
  };
}

export default function BidHistory() {
  const [bids, setBids] = useState<PopulatedBid[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bids/my-bids");
      if (res.data.success) {
        setBids(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch bid history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Bid History</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : bids.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Gavel className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No bids yet</h3>
            <p className="text-gray-500 mt-1">
              You haven't placed any bids on gigs yet.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Browse Gigs <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className="bg-white border border-black/10 rounded-xl p-6"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold">
                        {bid.gigId.title}
                      </h2>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-sm shadow-xs capitalize ${
                          bid.status === "hired"
                            ? "bg-green-100 text-green-800"
                            : bid.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Gig Budget: ${bid.gigId.budget} • Posted by{" "}
                      {bid.gigId.owner?.name}
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Your Proposal
                      </p>
                      <p className="text-gray-600 text-sm">{bid.message}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between min-w-30">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">You Bidded</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        ${bid.price}
                      </p>
                    </div>
                    <Link
                      to={`/gig/${bid.gigId._id}`}
                      className="text-sm text-indigo-600 hover:underline mt-4 md:mt-0"
                    >
                      View Gig Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
