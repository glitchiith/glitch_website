// import { getCookie } from "cookies-next";

// export const submitScore = async () => {
//   try {
//     const token = getCookie("authToken");
//     const uid = getCookie("uid"); 
//     if (!token || !uid) {
//       console.error("User not authenticated or UID missing");
//       return;
//     }

//     const payload = (window as any).get_payload?.(); // Unity payload
//     if (!payload || !payload.encrypted) {
//       console.error("No encrypted payload from Unity");
//       return;
//     }

//     // Send encrypted string directly to backend
//     const res = await fetch("/api/submit-score", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//       body: JSON.stringify({ data: payload.encrypted }),
//     });

//     const result = await res.json();
//     if (!res.ok) console.error("Failed to submit score:", result.error);
//     else console.log("Score submitted successfully:", result.message);

//   } catch (err) {
//     console.error("Error submitting score:", err);
//   }
// };
