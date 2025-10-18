import { deleteCookie } from 'cookies-next';
import { auth } from './firebase';

export const handleLogout = async () => {
  const isProd = process.env.NODE_ENV === "production";
  
  // Clear cookies
  const cookieOptions = {
    path: "/",
    domain: isProd ? ".glitchiith.co.in" : undefined,
    secure: isProd,
    sameSite: isProd ? ("none" as const) : ("lax" as const),

  };

  try {
    deleteCookie("authToken", cookieOptions);
    deleteCookie("uid", cookieOptions);
    deleteCookie("guestMode", cookieOptions);

    // Clear localStorage
    localStorage.removeItem("uid");
    localStorage.removeItem("authToken");
    localStorage.removeItem("guestMode");

    // Sign out from Firebase
    await auth.signOut();

    // Force reload to login page
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error:", error);
    // Force reload even if there's an error
    window.location.href = "/login";
  }
};