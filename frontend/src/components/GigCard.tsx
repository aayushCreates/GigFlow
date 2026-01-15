import type { Gig } from "../types/gig.types";
import { Link } from "react-router-dom";
import { useState } from "react";
import BidModal from "./BidModal";
import { useAuth } from "../context/auth.context";

interface GigCardProps {
  gig: Gig;
  currentUserId: string;
  onBidSuccess?: (gigId: string) => void;
}

export default function GigCard({
  gig,
  currentUserId,
  onBidSuccess,
}: GigCardProps) {
  // Handle case where ownerId might be populated object or just ID string
  const ownerId = gig.owner?._id || gig.ownerId;
  const isOwner = ownerId === currentUserId;
  const hasUserBidded = gig.bids?.some((bid) => {
    const freelancerId =
      typeof bid.freelancer === "object" ? bid.freelancer?._id : bid.freelancer;
    return freelancerId === currentUserId;
  });

  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="border rounded-lg p-6 bg-white shadow-xs border-black/10 transition">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{gig.title}</h3>
          <span
            className={`text-xs px-3 py-1 rounded-sm ${
              gig.status === "open"
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {gig.status}
          </span>
        </div>

        <p className="text-gray-600 mt-2 line-clamp-2">{gig.description}</p>

        <div className="flex items-center gap-4 text-sm mt-4">
          <span className="font-medium">${gig.budget}</span>
          <span className="text-gray-500">
            {new Date(gig.createdAt as string).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4">
          <span className="text-sm text-gray-500">
            Posted by {gig.owner?.name}
          </span>

          <div className="flex gap-2">
            <Link
              to={`/gig/${gig._id}`}
              className="px-4 py-2 rounded-sm bg-gray-100 text-sm hover:bg-gray-200 transition border border-black/10"
            >
              View Details
            </Link>

            {isAuthenticated &&
              !isOwner &&
              !hasUserBidded &&
              gig.status === "open" && (
                <button
                  onClick={() => setIsBidModalOpen(true)}
                  className="px-4 py-2 rounded-sm bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                >
                  Bid Now
                </button>
              )}

            {hasUserBidded && (
              <span className="px-4 py-2 text-sm text-green-600 font-medium">
                Bid Placed
              </span>
            )}
          </div>
        </div>
      </div>

      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        onSuccess={() => onBidSuccess && onBidSuccess(gig._id as string)}
        gigId={gig._id as string}
        budget={gig.budget}
      />
    </>
  );
}
