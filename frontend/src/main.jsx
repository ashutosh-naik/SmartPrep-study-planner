import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";
import "./index.css";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "494979891642-rl8k3c5q9h7ilu3ub64gnh8ujvnd64ro.apps.googleusercontent.com";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppErrorBoundary>
            <App />
          </AppErrorBoundary>
          <Toaster
            position="bottom-center"
            containerStyle={{
              zIndex: 99999,
            }}
            toastOptions={{
              duration: 4000,
              className: 'modern-toast',
              style: {
                background: "#1f2937",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                fontSize: "14px",
                padding: "12px 24px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                backdropFilter: "blur(8px)",
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
