import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AnimatedRoutes from "./components/jsx/AnimatedRoutes";
import { UserProvider } from "./contexts/UserContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
