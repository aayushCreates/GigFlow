import { Briefcase, Bell, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PostGigModal from "./GigModal";
import { useAuth } from "../context/auth.context";
import type { Gig } from "../types/gig.types";
import api from "../api/api";
import { toast } from "sonner";
import { socket } from "../api/socket";

type NavbarProps = {
  onGigPosted?: (gig: Gig) => void;
};

type Notification = {
  type: "HIRED";
  message: string;
  gigId: string;
  bidId: string;
};

export default function Navbar({ onGigPosted }: NavbarProps) {
  const [openGigPostModal, setOpenGigPostModal] = useState<boolean>(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [openNotifications, setOpenNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.length;

  useEffect(() => {
    socket.on("gig:hired", (data: Notification) => {
      console.log("📩 Notification received:", data);
      setNotifications((prev) => [data, ...prev]);
      toast.success(data.message);
    });
  
    return () => {
      socket.off("gig:hired");
    };
  }, []);
  

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenProfileMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmitPost = async (data: Gig) => {
    try {
      const response = await api.post("/gigs", data);

      if (response.data.success) {
        if (onGigPosted) {
          onGigPosted(response.data.data);
        }
      } else {
        throw new Error("Failed to post gig");
      }
    } catch (error: any) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403 ||
        error.response?.data?.message === "User not found"
      ) {
        toast.error("User not found");
      }
      throw error;
    }
  };

  return (
    <>
      <nav className="w-full shadow-xs border border-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-indigo-600 rounded-full flex items-center justify-center">
              <Briefcase className="text-white" size={18} />
            </div>
            <Link to="/" className="text-lg font-semibold">
              GigFlow
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  className="flex items-center gap-2 bg-indigo-600/10 text-indigo-600 border border-indigo-600/40 px-4 py-2 rounded-md shadow-xs"
                  onClick={() => {
                    setOpenGigPostModal(true);
                  }}
                >
                  <Plus size={16} />
                  Post a Gig
                </button>

                <div ref={notificationRef} className="relative">
                  <button
                    onClick={() => {
                      setOpenNotifications((prev) => !prev);

                      setNotifications((prev) =>
                        prev.map((n) => ({ ...n, isRead: true }))
                      );
                    }}
                    className="relative"
                  >
                    <Bell className="text-gray-500 cursor-pointer" />

                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {openNotifications && (
                    <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="px-4 py-2 text-sm font-semibold bg-gray-100">
                        Notifications
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-4 text-sm text-gray-500">
                            No notifications
                          </p>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.gigId}
                              className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 border border-black/10`}
                            >
                              {notification.message}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div ref={menuRef} className="relative">
                  <button
                    onClick={() => setOpenProfileMenu((prev) => !prev)}
                    className="relative h-9 w-9 rounded-full text-white bg-indigo-600 flex items-center justify-center text-sm font-medium"
                  >
                    {user?.name
                      ?.trim()
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((word) => word[0].toUpperCase())
                      .join("")}
                  </button>

                  {openProfileMenu && (
                    <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-md shadow-md z-50">
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          setOpenProfileMenu(false);
                        }}
                      >
                        Profile
                      </button>

                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => {
                          logout();
                          setOpenProfileMenu(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium text-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium text-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {openGigPostModal && (
          <PostGigModal
            isOpen={openGigPostModal}
            onClose={() => setOpenGigPostModal(false)}
            onSuccess={handleSubmitPost}
          />
        )}
      </nav>
    </>
  );
}
