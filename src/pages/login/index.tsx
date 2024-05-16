import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, FormEvent } from "react";
import { auth } from "../../../firebase";
import { toast } from "react-toastify";
import Register from "./register";

export default function LoginPage() {
  const [isRegisterPage, isRegisterPageSet] = useState(false);

  const [isLoading,isLoadingSet] = useState(false);

  const [formLogin, formLoginSet] = useState({
    email: "",
    password: "",
  });

  async function handleSubmitLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const userData = await signInWithEmailAndPassword(
        auth,
        formLogin.email,
        formLogin.password
      );
      toast.success(`Welcome ${userData?.user?.displayName || userData?.user?.email}`);
    } catch (error: any) {
      console.log(error);
      if (error?.message?.includes("auth/invalid-credential"))
        return toast.error("User not found");
      if (error?.message?.includes("auth/too-many-requests"))
        return toast.error("Too many request");
      return toast.error(error?.message);
    }
  }

  if (isRegisterPage) return <Register backToLogin={() => isRegisterPageSet(false)} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome to this app</h2>
          <p className="mt-2 text-center text- text-gray-600">
            Login
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmitLogin}>
          <input
           value={formLogin.email}
           onChange={({ target: { value } }) =>
             formLoginSet((prev) => ({ ...prev, email: value }))
           }
            type="email"
            required
            className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email"
          />
          <input
            value={formLogin.password}
            onChange={({ target: { value } }) =>
              formLoginSet((prev) => ({ ...prev, password: value }))
            }
            type="password"
            required
            className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2"
            placeholder="Password"
          />
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {!isLoading ? "Create Account" : "Loading..."}
          </button>
        </form>
        <p className="mt-2 text-center text-gray-600">Don't have an account? <button onClick={() => isRegisterPageSet(true)} className="hover:text-indigo-700">Register</button></p> 
      </div>
    </div>
  );
}
