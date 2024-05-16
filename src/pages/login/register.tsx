import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "../../../firebase";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {toast } from "react-toastify";

interface Inputs {
    email: string;
    password: string;
    fullName: string;
    isStudent: string;
  }

export default function RegisterPage({ backToLogin }: { backToLogin: () => void }){
    const { register, handleSubmit } = useForm<Inputs>();
    const [isLoading,isLoadingSet] = useState(false);

    const onHandleSubmit: SubmitHandler<Inputs> = async (val) => {
        try {
          isLoadingSet(true);
          const dataUser = await createUserWithEmailAndPassword(auth, val.email, val.password);
          await updateProfile(dataUser.user, {
            displayName: val.fullName
          })
          await sendEmailVerification(dataUser.user)
          isLoadingSet(false);
          toast.success(`Welcome to the app, ${val.fullName}`);
        } catch (error: any) {
          isLoadingSet(false);
          toast.error(error?.message);
          console.log(error);
        }
    };
    
      const requiredConfig = {
        required: {
          value: true,
          message: "This field is required",
        },
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome to this app</h2>
                    <p className="mt-2 text-center text- text-gray-600">
                        Register
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onHandleSubmit)}>
                    <input
                        {...register("email", { ...requiredConfig })}
                        type="text"
                        required
                        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2"
                        placeholder="Email"
                    />
                    <input
                        {...register("fullName")}
                        type="fullName"
                        required
                        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Full Name"
                    />
                    <input
                        {...register("password", { ...requiredConfig })}
                        type="password"
                        required
                        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2"
                        placeholder="Password"
                    />
                    <select
                        {...register("isStudent")}
                        required
                        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2"
                    >
                        <option value={"true"}>Student</option>
                        <option value={"false"}>Non Student</option>
                    </select>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {!isLoading ? "Create Account" : "Loading..."}
                    </button>
                </form>
                <p className="mt-2 text-center text-gray-600">Don't have an account? <span onClick={backToLogin} className="hover:text-indigo-700">Login</span></p> 
            </div>
        </div>
    );
}
