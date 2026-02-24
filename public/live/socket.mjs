// socket.mjs - initialize WebSocket for a given userGuid
export function initSocket(userGuid) {
  if (!userGuid) return null;
  try {
    // const socket = new WebSocket(`ws://localhost:8080/ws/${userGuid}`); // localhost
    const socket = new WebSocket(`wss://hemydigitaltwin-dra9gjbxbsaydxdz.northeurope-01.azurewebsites.net/ws/${userGuid}`);
    window.socket = socket;
    socket.addEventListener("open", () => {
      console.log("🔌 WebSocket connected");
      socket.send(JSON.stringify({ type: "ping" }));
    });
    socket.addEventListener("message", (event) => {
      console.log("📩 WebSocket message received:", event.data);
    });
    socket.addEventListener("close", () => {
      console.log("❌ WebSocket closed");
    });
    socket.addEventListener("error", (error) => {
      console.error("⚠️ WebSocket error:", error);
    });
    return socket;
  } catch (err) {
    console.error("Failed to initialize socket", err);
    return null;
  }
}
