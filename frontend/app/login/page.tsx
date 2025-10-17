"use client";
import { setCookie } from "cookies-next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user.email || !user.email.endsWith("@iith.ac.in")) {
      setError("Please use your IIT Hyderabad account to log in.");
      await auth.signOut();
      return;
    }

    const uid = user.uid;
    const token = await user.getIdToken();

    // Instead of setCookie
    setCookie("authToken", token, { path: "/", maxAge: 60*60*24 });
    setCookie("uid", uid, { path: "/", maxAge: 60*60*24 });
    setCookie("guestMode", false, { path: "/", maxAge: 60*60*24 });

    // 🚀 Register new user in DB if first time
    await fetch("/api/register-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: user.email,
        name: user.displayName,
      }),
    });
    console.log("User registered or already exists.");
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  } catch (err: any) {
    setError(err.message);
  }
};


  const handleGuestMode = () => {
    setCookie("guestMode", "true", { path: "/", maxAge: 60 * 60 * 24 });
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="p-8 rounded-2xl w-[420px] border border-green-500 shadow-[0_0_15px_#00ff00,0_0_30px_#00ff00]">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>

        <div className="space-y-4 mt-8">
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-2 rounded-md bg-green-600 text-black font-bold hover:bg-green-500 transition"
          >
            Sign in with Google
          </button>

          <button
            onClick={handleGuestMode}
            className="w-full py-2 rounded-md bg-transparent text-green-400 border border-green-400 font-bold hover:bg-green-700/20 transition"
          >
            Continue without login
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
