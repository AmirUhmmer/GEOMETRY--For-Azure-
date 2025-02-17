export function HardAssetSearch(viewer, HardAsset) {
  // Assuming this is part of your search function when Hard Asset is selected
  if (HardAsset === "Hard Asset") {
    let assetValue = localStorage.getItem("ASSET");
    console.log("SEARCHED:" + assetValue);

    // First, get the models from the viewer
    const models = viewer.impl.modelQueue().getModels();
    const specificModel = models[1]; // Select the specific model you want to search in

    // Ensure models are loaded before proceeding
    if (models && models.length > 0 && assetValue) {
      const models = viewer.impl.modelQueue().getModels();
      // Perform the search within the loaded models
      viewer.search(
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
          viewer.fitToView(dbIDs);
          let color = "";

          // // Get the service tasks from the URL query string
          // let params = {};
          // let queryString = window.location.search.substring(1);
          // let queryParts = queryString.split("&");

          // for (let i = 0; i < queryParts.length; i++) {
          //     let param = queryParts[i].split("=");
          //     params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
          // }

          // let serviceTasks = params["subgridData"];  // The service task data, if it exists

          // // Check if there are service tasks and split them into an array
          // let serviceTaskList = [];
          // if (serviceTasks) {
          //     serviceTaskList = serviceTasks.split("\n");  // Split by newline to convert into an array
          //     console.log('Service Tasks Array:', serviceTaskList);  // Array of service tasks
          // }

          // // Display the service tasks in a docking panel
          // showServiceTasksDockingPanel(viewer, serviceTaskList);
          // createToolbarButton(viewer);

          color = new THREE.Vector4(0, 1, 0, 1); // Green color with full intensity (RGBA)
          viewer.setSelectionColor(new THREE.Color(0, 1, 0)); // RGB: red, green, blue

          // Optionally highlight the objects
          viewer.setThemingColor(dbIDs, color);
          viewer.select(dbIDs); // Optionally highlight the objects
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
