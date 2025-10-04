import React, { useState } from "react";
import signupImage from "../assets/auth/signupImage.png";
import SignUp from "../component/auth/SignUp";
import SignIn from "../component/auth/SignIn";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";

export const AuthPage: React.FC = () => {
  const [authType, setAuthType] = useState<"signup" | "signin">("signup");
  const dispatch = useDispatch();

  const handleAuthSuccess = (user: any, token: string) => {
    dispatch(setCredentials({ user, token }));
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row">
      {/* Left Side: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 my-auto md:my-0">
        <div className="w-full max-w-md">
          {authType === "signup" ? (
            <>
              <SignUp onSuccess={handleAuthSuccess} />
              <p className="text-center mt-4">
                Already have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer hover:underline"
                  onClick={() => setAuthType("signin")}
                >
                  Sign in
                </span>
              </p>
            </>
          ) : (
            <>
              <SignIn onSuccess={handleAuthSuccess} />
              <p className="text-center mt-4">
                Need an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer hover:underline"
                  onClick={() => setAuthType("signup")}
                >
                  Sign Up
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={signupImage}
          alt="Auth"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
 