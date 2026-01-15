import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, User, Gavel } from "lucide-react";
import Navbar from "../components/Navbar";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import { toast } from "sonner";
import { useAuth } from "../context/auth.context";
import type { Gig } from "../types/gig.types";
import { type Bid } from "../types/bid.types";

export default function GigDetails() {
  const { gigId } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [gig, setGig] = useState<Gig | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [form, setForm] = useState({
    price: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const isOwner = gig?.owner?._id === user?._id;
  const hasUserBidded = bids.some((bid) => {
    const freelancerId =
      typeof bid.freelancer === "object" ? bid.freelancer?._id : bid.freelancer;
    return freelancerId === user?._id;
  });

  const fetchGigDetails = async () => {
    try {
      setPageLoading(true);
      const res = await api.get(`/bids/${gigId}`);

      if (res.data.success) {
        const gigData = res.data.data;
        setGig(gigData);
        setBids(gigData.bids || []);
      }
    } catch (error) {
      toast.error("Error fetching gig details");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (gigId) {
      fetchGigDetails();
    }
  }, [gigId]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/bids`, {
        gigId,
        price: Number(form.price),
        message: form.message,
      });

      if (res.data.success) {
        toast.success("Bid submitted");
        fetchGigDetails(); // refresh
        setForm({ price: "", message: "" });
      }
    } catch (err) {
      toast.error("Failed to submit bid");
    } finally {
      setLoading(false);
    }
  };

  const handleBidAction = async (
    bidId: string,
    status: "hired" | "rejected"
  ) => {
    try {
      const res = await api.patch(`/bids/${bidId}/hire`, { status });
      if (res.data.success) {
        toast.success(`Bid ${status}`);
        fetchGigDetails();
      } else {
        toast.error("Failed to update bid status");
      }
    } catch (error) {
      toast.error("Error updating bid status");
    }
  };

  if (pageLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">Gig Not Found</h2>
            <Link
              to="/"
              className="mt-4 inline-block text-indigo-600 hover:underline"
            >
              Back to Gigs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back */}
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-gray-700 w-fit"
        >
          <ArrowLeft size={16} /> Back to Gigs
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gig Info */}
            <div className="rounded-xl p-6 bg-gray-50 border border-black/10">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{gig.title}</h1>
                <span className="px-3 py-1 text-xs rounded-sm shadow-xs bg-indigo-100 text-indigo-600">
                  {gig.status}
                </span>
              </div>

              <div className="flex gap-6 text-sm text-gray-500 mt-3">
                <span className="font-medium text-black">
                  ${gig.budget} budget
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Posted{" "}
                  {new Date(gig.createdAt as string).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <User size={14} /> by {gig.owner?.name}
                </span>
              </div>

              <h3 className="font-semibold mt-6">Description</h3>
              <p className="text-gray-600 mt-2">{gig.description}</p>
            </div>

            {/* Bids - Visible to owner (all) or freelancer (own only) */}
            {(isOwner || bids.length > 0) && (
              <div className="border border-black/10 rounded-xl p-6 bg-gray-50">
                <h2 className="text-lg font-semibold mb-4">
                  {isOwner ? `Bids (${bids.length})` : "Your Bid"}
                </h2>

                {bids.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Gavel className="text-gray-400" />
                    </div>
                    <h4 className="font-medium mt-4">No bids yet</h4>
                    <p className="text-sm text-gray-500">
                      Be the first to bid on this gig!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <div
                        key={bid._id}
                        className="border border-black/10 bg-white shadow-xs rounded-lg p-4 flex flex-col gap-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            {isOwner && (
                              <p className="text-sm text-gray-500">
                                Bidder: {bid.freelancer.name}
                              </p>
                            )}
                            <p className="font-medium text-lg">${bid.price}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {bid.message || "No message"}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <p
                              className={`text-xs px-2 py-1 rounded-sm shadow-xs capitalize ${
                                bid.status === "hired"
                                  ? "bg-green-100 text-green-700"
                                  : bid.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {bid.status}
                            </p>
                            {isOwner && bid.status === "pending" && (
                              <div className="flex gap-2 justify-end pt-2">
                                <button
                                  onClick={() =>
                                    handleBidAction(
                                      bid._id as string,
                                      "rejected"
                                    )
                                  }
                                  className="px-3 py-1 text-xs border border-red-600/20 bg-red-500/10 text-red-600 rounded-sm hover:bg-red-500/20"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() =>
                                    handleBidAction(bid._id as string, "hired")
                                  }
                                  className="px-3 py-1 text-xs bg-green-500/10 text-green-600 rounded-sm border border-green-500/30 hover:bg-green-500/20"
                                >
                                  Accept
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: BID FORM */}
          {isAuthenticated && !isOwner && gig.status === "open" && (
            <div className="border border-black/10 rounded-xl p-6 bg-white h-fit">
              {hasUserBidded ? (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 rounded-md bg-green-100 flex items-center justify-center mb-3">
                    <Gavel className="text-green-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-800">Bid Placed</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    You have already submitted a proposal for this gig.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-4">Submit a Bid</h2>

                  <form onSubmit={handleBidSubmit} className="space-y-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Your Bid (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          min={1}
                          required
                          value={form.price}
                          onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                          }
                          className="w-full border border-black/20 rounded-lg pl-8 pr-4 py-3"
                          placeholder="Enter amount"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Client budget: ${gig.budget}
                      </p>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Message (optional)
                      </label>
                      <textarea
                        maxLength={500}
                        rows={4}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        className="w-full border border-black/20 rounded-lg px-4 py-3 resize-none"
                        placeholder="Explain why you're the right fit..."
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {form.message.length}/500 characters
                      </p>
                    </div>

                    <button
                      disabled={loading}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                      >
                      {loading ? "Submitting..." : "Submit Bid"}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
