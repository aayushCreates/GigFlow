import api from "../api/api";
import { useState } from "react";
import { X } from "lucide-react";
import { GigStatus, type Gig } from "../types/gig.types";
import { toast } from "sonner";

type PostGigModalType = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: Gig) => Promise<void> | void;
};

type GigFormState = {
  title: string;
  description: string;
  budget: number;
};

export default function PostGigModal({
  isOpen,
  onClose,
  onSuccess,
}: PostGigModalType) {
  const [form, setForm] = useState<GigFormState>({
    title: "Software Developer",
    description: "Need an ai full stack engineer",
    budget: 1500,
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "budget" ? Number(value) || "" : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        budget: Number(form.budget),
      };

      const res = await api.post("/gigs", payload);

      if (res.data.success) {
        toast.success("Gig posted successfully!");
        onSuccess(res.data.data); // Pass the newly created gig data
        onClose();
        setForm({
          title: "",
          description: "",
          budget: 0,
        });
      } else {
        toast.error(res.data.message || "Failed to post gig.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to Post Gig");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">Post a New Gig</h2>
            <p className="text-sm text-gray-500">
              Describe your project and find the right freelancer
            </p>
          </div>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Gig Title</label>
            <input
              type="text"
              name="title"
              maxLength={100}
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Build a React Dashboard"
              className="w-full border border-black/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.title.length}/100 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              maxLength={1000}
              required
              value={form.description}
              onChange={handleChange}
              placeholder="Describe requirements, deliverables, and expectations"
              className="w-full border border-black/20 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.description.length}/1000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Budget (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                name="budget"
                min={1}
                required
                value={form.budget}
                onChange={handleChange}
                placeholder="500"
                className="w-full border border-black/20 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-black/10 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Posting..." : "Post Gig"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
