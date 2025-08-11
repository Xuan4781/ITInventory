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
      const loginResponse = await instance.loginPopup({ scopes: ["user.read"] });
      const email = loginResponse.account.username;

      const accessTokenRequest = {
        scopes: ["api://5f7af1dd-bdea-4fbe-9947-b5142c66e7ef/access_as_user"],
        account: loginResponse.account,
      };

      const tokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
      const accessToken = tokenResponse.accessToken;

      localStorage.setItem("accessToken", accessToken);

      const role = admins.includes(email) ? "Admin" : "User";
      dispatch(setUser({ user: { email, role }, accessToken }));

      toast.success(`Logged in as ${email} (${role})`);
      navigate(role === "Admin" ? "/manage-requests" : "/my-requests");
    } catch (error) {
      toast.error("Login failed or cancelled");
      console.error("MSAL login error:", error);
    }
  };

  return (
    <button onClick={handleLogin} className="your-button-styles">
      Sign in with Microsoft
    </button>
  );
};

export default MicrosoftLoginButton;
