import { initViewer, loadModel } from "./viewer.mjs";
import { initTree } from "./sidebar.mjs";
import { fetchAccessToken, isTokenExpired, fetchUserProfile } from "./accessToken.mjs";
import {
  geometryMapById,
  geometryMapByProperty,
  defaultGeometry,
  projectMap,
  propertyMap,
  abbreviationToRecordId,
} from "./config/constants.mjs";
import { parseQueryParams } from "./utils/urlParams.mjs";
import { initSocket } from "./live/socket.mjs";

const login = document.getElementById("login");

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("authToken") || isTokenExpired()) {
    fetchAccessToken(); // Starts fetching early, before user clicks anything
  }
});

async function initApp() {
  try {
    let authToken = localStorage.getItem("authToken");
    let refreshToken = localStorage.getItem("refreshToken");
    let expires_at = localStorage.getItem("expires_at");
    let internal_token = localStorage.getItem("internal_token");

    // console.log(authToken);

    // If the token is expired or not present, fetch a new one
    if (!authToken || isTokenExpired()) {
      console.log("Fetching new access token...");
      authToken = await fetchAccessToken(); // Get a new token if expired
    }

    const user = await fetchUserProfile(authToken, refreshToken, expires_at, internal_token);

    if (user) {
      login.innerText = `Logout`;
      login.style.visibility = "hidden"; //test
      login.onclick = () => {
        // Logout logic
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("internal_token");
        window.location.reload(); // Reload the page after logout
      };

      // retrieve query parameters from the URL
      const params = parseQueryParams();

      // get the entity name and record ID
      let entityType = params["typename"];
      let recordId = params["id"];
      let property = params["property"];
      let uniqueID = params["uniqueID"];
      let ServiceZone = params["SZ"];
      let FunctionalLocation = params["FL"];
      let RepeatingTask = params["RT"];
      let WOST = params["WOST"];
      let sessionId = params["sessionId"];
      let userType = params["user"];
      const userGuid = params["userGuid"];
      let sidebar = params["sidebar"]; // The sidebar, if it exists
      window.userGuid = userGuid; // Store userGuid in the global window object

      if (sidebar === "off") {
        document.getElementById("viewerSidebar").style.display = "none";
        document.getElementById("layoutRow").style.right = "0px";
        document.getElementById("toggleSidebar").style.display = "none";
      }
      
      if (userGuid) {
        initSocket(userGuid);
      }

      if (userType == "tenant" || userType == "supplier") {
        // document.getElementById("3D-button").style.display = "none";
        document.getElementById("2D-sheets-item").style.display = "none";
        document.getElementById("live-data-button-item").style.display = "none";
        document.getElementById("zones-button-item").style.display = "none";
        document.getElementById("model-browser-button-item").style.display = "none";
        document.getElementById("levels-item").style.display = "none";
      } else if (userType == "supplier") {
        // document.getElementById("3D-button").style.display = "none";
        document.getElementById("2D-sheets").style.display = "none";
        document.getElementById("live-data").style.display = "none";
        document.getElementById("zones-button").style.display = "none";
        document.getElementById("model-browser").style.display = "none";
        document.getElementById("levels").style.display = "none";
      }

      if (RepeatingTask || WOST) {
        let abbreviation = params["abbreviation"];
        recordId = abbreviationToRecordId[abbreviation];
      }

      if (uniqueID) {
        localStorage.setItem("uniqueID", uniqueID);
        console.log("uniqueID stored in localStorage:", uniqueID);
      } else {
        console.log("uniqueID not found in URL");
      }

      if (property) {
        property = decodeURIComponent(property); // Decode the URL encoded property value
        console.log("Decoded Property:", property); // Logs the decoded property value
      }

      // Log the full URL to the console
      let fullURL = window.location.href;
      console.log("Full URL:", fullURL); // This will log the full URL, e.g., http://localhost:8080/index.html?etn=iotdatapoint&id=12345678-1234-1234-1234-123456789abc

      // Now you can use `entityType` and `recordId` in your web app logic
      console.log("Entity Type:", entityType);
      console.log("Record ID:", recordId);

      // Initialize the viewer and sidebar
      const viewer = await initViewer(document.getElementById("preview"));

      // initTree('#tree', (id) => loadModel(viewer, window.btoa(id).replace(/=/g, '')));



      // Attempt to find geometry based on recordId
      let geometry = geometryMapById[recordId];

      let projectId = "";
      let folderId = "";
      let hardAsset = "Hard Asset";
      let liveData = "";
      let model = "";

      if (projectMap[recordId]) {
        ({ projectId, folderId = "", liveData = "", hardAsset, model } = projectMap[recordId]);
        localStorage.setItem("LiveData", liveData);
      } else if (propertyMap[property]) {
        projectId = propertyMap[property];
        localStorage.setItem("LiveData", liveData);
      }

      if (!geometry && property) {
        geometry = geometryMapByProperty[property];
        localStorage.setItem("ASSET", uniqueID);
        localStorage.setItem("LiveData", liveData);
      }

      if (!geometry) {
        geometry = defaultGeometry;
        projectId = "b.bf8f603c-7e37-4367-9900-69e279377191";
        folderId = "urn:adsk.wipemea:fs.folder:co.fMNGzoIyQyiq5KhAEpvDHw";
        liveData = "DB8";
        model = "DB8";
        hardAsset = "No Hard Asset";
        localStorage.setItem("LiveData", liveData);
        localStorage.removeItem("ASSET");
      }

      // Final localStorage updates
      localStorage.setItem("HardAssetChecker", hardAsset);

      // Initialize the tree and handle model loading
      let hubId = "b.7a656dca-000a-494b-9333-d9012c464554"; // Hub ID
      ServiceZone = ServiceZone || "No Service Zone";
      FunctionalLocation = FunctionalLocation || "No Functional Location";
      RepeatingTask = RepeatingTask || "No Repeating Task";
      initTree("#tree", (id) => {
        // If no ID is provided, use the sample URN
        console.log(id);
        const urn = id !== 0 ? window.btoa(id).replace(/=/g, "") : geometry;
        loadModel(
          viewer,
          urn,
          hubId,
          projectId,
          folderId,
          ServiceZone,
          FunctionalLocation,
          model,
          RepeatingTask
        );
      });
    } else {
      login.style.visibility = "hidden"; //test
      throw new Error("Failed to authenticate");
    }

    // console.log(resp);
    login.style.visibility = "hidden"; //test
    // login.style.visibility = 'visible';
  } catch (err) {
    alert(
      "Could not initialize the application. See console for more details."
    );
    console.error(err);
  }
}

// Initialize the app
initApp();
