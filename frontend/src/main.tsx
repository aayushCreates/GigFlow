import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth.context";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
);
