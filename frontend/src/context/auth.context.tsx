import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  LoginDetailsType,
  RegisterDetailsType,
} from "../types/auth.types";
import type { User } from "../types/user.types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/api";
import { toast } from "sonner";
import { socket } from "../api/socket";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  register: (userDetail: RegisterDetailsType) => void;
  login: (loginDetail: LoginDetailsType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsedUser = JSON.parse(storedAuth);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse auth from local storage", error);
        localStorage.removeItem("auth");
      }
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit("join", user._id);
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const register = async (userDetail: RegisterDetailsType) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/auth/register`,
        userDetail
      );

      setUser(res.data?.data);
      localStorage.setItem(
        "auth",
        JSON.stringify({
          _id: res.data?.data?._id,
          email: res.data?.data?.email,
          name: res.data?.data?.name,
        })
      );

      if (res.data.success) {
        toast.message(res.data.message as string);
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data?.message || "Registration failed");
      } else {
        toast.error("Error in user registration.");
      }
    }
  };

  const login = async (loginDetail: LoginDetailsType) => {
    try {
      const res = await api.post("/auth/login", loginDetail);

      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem(
          "auth",
          JSON.stringify({
            _id: res.data?.data?._id,
            email: res.data?.data?.email,
            name: res.data?.data?.name,
          })
        );
        setIsAuthenticated(true);
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      console.log("called");
      const res = await api.post("/auth/logout");
      if (res.data.success) {
        localStorage.removeItem("auth");
        setUser(null);
        setIsAuthenticated(false);
        navigate("/login");
      }
    } catch (err) {
      toast.error("Error in loggingout");
      return;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
