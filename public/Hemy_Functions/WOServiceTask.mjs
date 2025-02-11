export function WOServiceTask(viewer) {
// Assuming this is part of your search function when Hard Asset is selected
// retrieve query parameters from the URL
let params = {};
let queryString = window.location.search.substring(1);
let queryParts = queryString.split("&");
for (let i = 0; i < queryParts.length; i++) {
    let param = queryParts[i].split("=");
    params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
}

let WOST = params["WOST"];  // The Work Order Service Task, if it exists
if (WOST) {
    let assetValue = params["asset"];;
    console.log("SEARCHED:" + assetValue);

    // First, get the models from the viewer
    const models = viewer.impl.modelQueue().getModels();
    const specificModel = models[1]; // Select the specific model you want to search in

    // Ensure models are loaded before proceeding
    if (models && models.length > 0 && assetValue) {
      const models = viewer.impl.modelQueue().getModels();
      // Perform the search within the loaded models
      specificModel.search(
        assetValue,
        function (dbIDs) {
          // If no objects are found, handle it gracefully
          if (!dbIDs || dbIDs.length === 0) {
            console.log("No matching objects found for: " + assetValue);
            return;
          }

          // Loop through the models only once
          models.forEach((model) => {
            // Hide all objects first
            viewer.isolate([], model);

            // Isolate the found objects
            viewer.isolate(dbIDs, model);
          });

          // Fit to view and highlight the found objects
          viewer.fitToView(dbIDs, models[1]);
          let color = "";

          color = new THREE.Vector4(0, 1, 0, 1); // Green color with full intensity (RGBA)
          viewer.setSelectionColor(new THREE.Color(0, 1, 0)); // RGB: red, green, blue

          // Optionally highlight the objects
          models[1].setThemingColor(dbIDs, color);
          viewer.select(dbIDs, models[1]); // Optionally highlight the objects
          console.log(dbIDs);
        },
        function (error) {
          console.error("Search error:", error); // Handle any potential search errors
        }
      );
    } else {
      console.warn("No models loaded or invalid asset value.");
    }
  }
}