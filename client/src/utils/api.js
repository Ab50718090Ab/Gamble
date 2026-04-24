import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";

// Pages
import Home from "../pages/Home.jsx";
import Games from "../pages/Games.jsx";
import GamePage from "../pages/GamePage.jsx";

import Profile from "../pages/Profile.jsx";
import Dashboard from "../pages/Dashboard.jsx";

import DepositMoney from "../pages/DepositMoney.jsx";
import WithdrawMoney from "../pages/WithdrawMoney.jsx";

import ForgotPassword from "../pages/ForgotPassword.jsx";
import VerifyResetPasswordOTP from "../pages/VerifyResetPasswordOTP.jsx";
import SetNewPassword from "../pages/SetNewPassword.jsx";

import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // ✅ Home
      { index: true, element: <Home /> },

      // ✅ Games
      { path: "games", element: <Games /> },

      // ✅ Dynamic Game Route (IMPORTANT)
      { path: "games/:gameSlug", element: <GamePage /> },

      // ✅ User pages
      { path: "profile", element: <Profile /> },
      { path: "dashboard", element: <Dashboard /> },

      // ✅ Wallet pages
      { path: "deposit-money", element: <DepositMoney /> },
      { path: "withdraw-money", element: <WithdrawMoney /> },

      // ✅ Auth recovery
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-forgot-password-otp", element: <VerifyResetPasswordOTP /> },
      { path: "set-new-password", element: <SetNewPassword /> },
    ],
  },

  // ✅ Auth routes (outside layout)
  { path: "register", element: <RegisterPage /> },
  { path: "login", element: <LoginPage /> },
]);

export default router;