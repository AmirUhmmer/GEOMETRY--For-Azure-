// auth.mjs - token helpers and profile fetch
export async function fetchAccessToken() {
  try {
    const response = await fetch("/api/auth/token");
    if (!response.ok) {
      throw new Error("Failed to get access token");
    }
    const data = await response.json();
    localStorage.setItem("authToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    localStorage.setItem("expires_at", Date.now() + data.expires_in * 1000);
    localStorage.setItem("internal_token", data.internal_token);
    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
}

export function isTokenExpired() {
  const expires_at = localStorage.getItem("expires_at");
  return !expires_at || Date.now() >= parseInt(expires_at, 10);
}

export async function fetchUserProfile(authToken, refreshToken, expires_at, internal_token) {
  const resp = await fetch("/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "x-refresh-token": refreshToken,
      "x-expires-at": expires_at,
      "x-internal-token": internal_token,
    },
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return resp.json();
}
