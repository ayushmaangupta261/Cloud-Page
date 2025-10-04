import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/operations/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";

type SignUpFormValues = {
    name: string;
    email: string;
    password: string;
    dob: string;
    keepMeLoggedIn: boolean;
};

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormValues>();

    const inputClass = `peer w-full border rounded-md px-3 pt-5 pb-2 text-sm
        border-[#9A9A9A] focus:border-[#367AFF] focus:outline-none`;

    const labelClass = `absolute left-3 top-1 text-gray-400 text-sm transition-all bg-white px-2
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500
        peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:text-sm`;

    const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
        try {
            const response = await signupUser({
                name: data.name,
                email: data.email,
                password: data.password,
                dob: data.dob,
            });

            if (!response) return;

            dispatch(setCredentials({ token: response.token, user: response.user }));
            navigate("/dashboard");
            toast.success("Signup successful!");
        } catch (error: any) {
            console.error(error.message || "Signup failed");
            toast.error(error.message || "Signup failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 flex flex-col gap-y-[2rem]">
            <div>
                <h1 className="text-2xl font-bold mb-1">Sign Up</h1>
                <p className="text-[#969696] text-sm mt-3">
                    Create an account to enjoy full features
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="relative">
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        placeholder=" "
                        className={inputClass}
                    />
                    <label className={labelClass}>Your Name</label>
                    {errors.name && (
                        <span className="text-red-500 text-xs">{errors.name.message}</span>
                    )}
                </div>

                {/* DOB */}
                <div className="relative">
                    <input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        {...register("dob", { required: "Date of Birth is required" })}
                        placeholder=" "
                        className={inputClass}
                    />
                    <label className={labelClass}>Date of Birth</label>
                    {errors.dob && (
                        <span className="text-red-500 text-xs">{errors.dob.message}</span>
                    )}
                </div>

                {/* Email */}
                <div className="relative">
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                        })}
                        placeholder=" "
                        className={inputClass}
                    />
                    <label className={labelClass}>Email</label>
                    {errors.email && (
                        <span className="text-red-500 text-xs">{errors.email.message}</span>
                    )}
                </div>

                {/* Password */}
                <div className="relative">
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                        })}
                        placeholder=" "
                        className={inputClass}
                    />
                    <label className={labelClass}>Password</label>
                    {errors.password && (
                        <span className="text-red-500 text-xs">{errors.password.message}</span>
                    )}
                </div>

                {/* Keep me logged in */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        defaultChecked={true}
                        {...register("keepMeLoggedIn")}
                        className="h-4 w-4 border-[#9A9A9A] text-[#367AFF] focus:ring-[#367AFF]"
                    />
                    <label className="text-sm text-gray-700">Keep me logged in</label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;
