import { apiConnector } from "../apiconnector";
import { authEndpoint } from "../endpoints/authEndpoints";
import toast from "react-hot-toast";
import { logout } from "../../redux/slices/authSlice";

const { signup, login } = authEndpoint;

interface SignupData {
  name: string;
  email: string;
  dob: string;
  password: string;
}
 
export const signupUser = async (data: SignupData) => {
  const loadingToastId = toast.loading("Signing up...");
  try {
    const { name, email, dob, password } = data;

    // Validations
    if (!name || name.trim().length < 3) throw new Error("Name must be at least 3 characters long");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) throw new Error("Invalid email address");
    if (!password || password.length < 6) throw new Error("Password must be at least 6 characters long");

    const response = await apiConnector("POST", signup, { name, email, dob, password });

    if (response.success === false) throw new Error(response.message || "Signup failed");

    toast.success("Signup successful!", { id: loadingToastId });
    return response; // { user, token }
  } catch (error: any) {
    console.error("Error signing up ->", error);
    toast.error(error.message || "Something went wrong", { id: loadingToastId });
  }
};

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData) => {
  const loadingToastId = toast.loading("Logging in...");
  try {
    const { email, password } = data;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) throw new Error("Invalid email address");
    if (!password || password.length < 6) throw new Error("Password must be at least 6 characters long");

    const response = await apiConnector("POST", login, { email, password });

    if (response.success === false) throw new Error(response.message || "Login failed");

    toast.success("Login successful!", { id: loadingToastId });
    return response; // { user, token }
  } catch (error: any) {
    console.error("Error logging in ->", error);
    toast.error(error.message || "Something went wrong", { id: loadingToastId });
  }
};

export const logOutUser = (dispatch: any) => {
  const loadingToastId = toast.loading("Logging Out");
  try {
    dispatch(logout());
    toast.success("Logged Out Successfully", { id: loadingToastId });
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Log Out Error", { id: loadingToastId });
  }
};
