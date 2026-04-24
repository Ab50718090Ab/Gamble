import GamePage from "../pages/GamePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      { path: "games", element: <Games /> },
      { path: "games/:gameSlug", element: <GamePage /> },

      { path: "profile", element: <Profile /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "deposit-money", element: <DepositMoney /> },
      { path: "withdraw-money", element: <WithdrawMoney /> },

      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-forgot-password-otp", element: <VerifyResetPasswordOTP /> },
      { path: "set-new-password", element: <SetNewPassword /> },
    ],
  },

  { path: "register", element: <RegisterPage /> },
  { path: "login", element: <LoginPage /> },
]);

export default router;