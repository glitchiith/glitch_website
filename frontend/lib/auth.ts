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
  // Clear localStorage including expiration timestamps
    localStorage.removeItem("uid");
    localStorage.removeItem("authToken");
    localStorage.removeItem("guestMode");
    localStorage.removeItem("uid_expires");
    localStorage.removeItem("authToken_expires");
    localStorage.removeItem("guestMode_expires");

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



export const checkTokenExpiration = () => {
  const expiresAt = localStorage.getItem('authToken_expires');
  if (!expiresAt) return false;

  const isExpired = Date.now() > parseInt(expiresAt);
  if (isExpired) {
    handleLogout();
    return true;
  }
  return false;
};