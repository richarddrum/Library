import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token: string | null) => {
    if (!token) return false;

    try {
        const decoded: any = jwtDecode(token); // Decode the JWT
        const currentTime = Date.now() / 1000; // Current time in seconds TODO fix
        return decoded.exp > currentTime; // Check if the token is expired
    } catch (error) {
        console.error("Token validation error:", error);
        return false;
    }
};