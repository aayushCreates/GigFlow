import { useState } from "react";
import { X } from "lucide-react";
import api from "../api/api";
import { toast } from "sonner";

type BidModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  gigId: string;
  budget: number;
};

export default function BidModal({
  isOpen,
  onClose,
  onSuccess,
  gigId,
  budget,
}: BidModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    price: "",
    message: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/bids", {
        gigId,
        price: Number(form.price),
        message: form.message,
      });

      if (response.data.success) {
        toast.success("Bid placed successfully!");
        if (onSuccess) onSuccess();
        onClose();
        setForm({ price: "", message: "" });
      } else {
        toast.error("Failed to place bid");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error placing bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 z-10">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Place a Bid</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Price (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                required
                min={1}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-black/20 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter amount"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Client's budget: ${budget}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              required
              rows={4}
              maxLength={500}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-black/20 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Why are you the best fit for this gig?"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-black/10 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Placing Bid..." : "Confirm Bid"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
