import GamePage from "@/pages/GamePage.jsx"; // MUST ADD

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },

      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-forgot-password-otp", element: <VerifyResetPasswordOTP /> },
      { path: "set-new-password", element: <SetNewPassword /> },

      { path: "profile", element: <Profile /> },
      { path: "dashboard", element: <Dashboard /> },

      { path: "deposit-money", element: <DepositMoney /> },
      { path: "withdraw-money", element: <WithdrawMoney /> },

      { path: "games", element: <Games /> },

      // ✅ dynamic route
      { path: "games/:gameSlug", element: <GamePage /> },
    ],
  },

  { path: "register", element: <RegisterPage /> },
  { path: "login", element: <LoginPage /> },
]);

export default router;