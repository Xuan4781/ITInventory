import { useMsal } from "@azure/msal-react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const admins = ["boss@socotec.us", "admin@socotec.us", "angelagao04@gmail.com"];

const MicrosoftLoginButton = () => {
  const { instance } = useMsal();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 🔐 Microsoft popup login
      const loginResponse = await instance.loginPopup({ scopes: ["user.read"] });
      const email = loginResponse.account.username;

      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["api://5f7af1dd-bdea-4fbe-9947-b5142c66e7ef/access_as_user"],
        account: loginResponse.account,
      });

      const accessToken = tokenResponse.accessToken;
      localStorage.setItem("accessToken", accessToken);

      const role = admins.includes(email) ? "Admin" : "User";
      dispatch(setUser({ user: { email, role }, accessToken }));

      toast.success(`Logged in as ${email} (${role})`);
      navigate(role === "Admin" ? "/manage-requests" : "/my-requests");
    } catch (err) {
      toast.error("Login failed. Try again.");
      console.error("MSAL login error:", err);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full bg-[#0078D4] hover:bg-[#005a9e] text-white font-semibold py-2 px-4 rounded shadow-md transition-colors"
    >
      Sign in with Microsoft
    </button>
  );
};

export default MicrosoftLoginButton;
