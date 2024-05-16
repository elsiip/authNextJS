"use client";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import { auth } from "../../firebase";
import LoginPage from "@/pages/login";
import { toast } from "react-toastify";

export default function AuthPageHandler({ children }: { children: ReactNode }) {
  const [isAuth, isAuthSet] = useState(false);
  const [isReady, isReadySet] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // if user has logged in
        isReadySet(true);
        isAuthSet(true);
      } else {
        // if user hasnt logged in
        isReadySet(true);
        isAuthSet(false);
      }
    });
  }, []);

  if (!isReady)
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-4xl font-bold text-center">LOADING...</h1>
      </div>
    );
  return <div>{isAuth ? children : <LoginPage />}</div>;
}