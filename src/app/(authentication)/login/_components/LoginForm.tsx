"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { LoginFormData, loginSchema } from "@/lib/schema/zod/login-schema";

export default function LoginForm() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    // Initialize React Hook Form with Zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },

        // reset,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
        mode: "onChange",
    });

    const onSubmit = async (data: LoginFormData) => {
        console.log("login form data:", data);
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="flex flex-col gap-2">
                <label className="flex flex-col w-full">
                    <p className="text-[#101819] text-sm font-semibold pb-2">
                        Email Address
                    </p>

                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                            mail
                        </span>

                        <input
                            {...register("email")}
                            type="email"
                            placeholder="name@example.com"
                            className={`flex w-full h-14 rounded-xl border bg-white pl-12 pr-4 text-base transition-all
            focus:outline-0 focus:ring-2 focus:ring-custom-primary/20
            ${
                errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-custom-primary"
            }`}
                        />
                    </div>

                    {errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </label>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <p className="text-[#101819] text-sm font-semibold">
                        Password
                    </p>
                    <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-custom-primary hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <label className="flex flex-col w-full">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                            lock
                        </span>

                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`flex w-full h-14 rounded-xl border bg-white pl-12 pr-12 text-base transition-all
            focus:outline-0 focus:ring-2 focus:ring-custom-primary/20
            ${
                errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-custom-primary"
            }`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-custom-primary"
                        >
                            <span className="material-symbols-outlined">
                                {showPassword ? "visibility_off" : "visibility"}
                            </span>
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </label>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 px-1">
                <input
                    {...register("rememberMe")}
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-custom-primary focus:ring-custom-primary"
                />
                <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer select-none"
                >
                    Remember this device
                </label>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl bg-custom-primary text-white text-base font-bold
      hover:bg-custom-primary/90 transition-all shadow-lg shadow-custom-primary/20
      active:scale-[0.98] disabled:opacity-50`}
            >
                {isSubmitting ? "Logging in..." : "Log In"}
            </button>
        </form>
    );
}
