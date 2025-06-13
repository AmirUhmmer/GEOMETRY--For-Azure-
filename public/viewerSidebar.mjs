import { SPRITES } from '../DB8/DB8Sprites.mjs';
import { HEATMAP } from '../DB8/DB8SurfaceShading.mjs';
import { LightSPRITES } from '../DB8/DB8LightsSprites.mjs';
import { HG62HEATMAP } from '../HG62/HG62SurfaceShading.mjs';
import { HG62SPRITES } from '../HG62/HG62Sprites.mjs';

// ***************************** sidebar button to open the model browser panel **************************
document.getElementById("model-browser").addEventListener("click", modelBrowserPanel);
document.getElementById("3D-button").addEventListener("click", button3D);
document.getElementById("levels").addEventListener("click", levelsPanel);
document.getElementById("live-data").addEventListener("click", liveDataPanel);
document.getElementById("fire-plans").addEventListener("click", firePlansPanel);





document.getElementById("filter").addEventListener("keydown", function (event) {
  window.viewerInstance.search(
    document.getElementById("filter").value,
    function (dbIDs) {
      var models = window.viewerInstance.impl.modelQueue().getModels();
      // Loop through the models only once
      models.forEach((model) => {
        // Hide all objects first
        window.viewerInstance.isolate([], model);

        // Isolate the found objects
        window.viewerInstance.isolate(dbIDs, model);
      });

      // Fit to view and highlight the found objects
      window.viewerInstance.fitToView(dbIDs);

      const color = new THREE.Vector4(1, 0, 0, 1); // Red color with full intensity (RGBA)
      window.viewerInstance.setThemingColor(dbIDs, color); // Optionally highlight the objects

      // window.viewerInstance.setSelectionColor(new THREE.Color(1, 0, 0));  // RGB: red, green, blue
      // window.viewerInstance.select(dbIDs);  // Optionally highlight the objects

      // Disable further selections after this point
    },
    function (error) {
      console.error("Search error:", error); // Handle any potential search errors
    }
  );
});

document.getElementById("search").addEventListener("click", function first() {
  // viewer.search(
  //   document.getElementById("filter").value,
  //   function (dbIDs) {
  //     viewer.isolate(dbIDs);
  //     viewer.fitToView(dbIDs);
  // });

  window.viewerInstance.search(
    document.getElementById("filter").value,
    function (dbIDs) {
      var models = window.viewerInstance.impl.modelQueue().getModels();
      // Loop through the models only once
      models.forEach((model) => {
        // Hide all objects first
        window.viewerInstance.isolate([], model);

        // Isolate the found objects
        window.viewerInstance.isolate(dbIDs, model);
      });

      // Fit to view and highlight the found objects
      window.viewerInstance.fitToView(dbIDs);

      const color = new THREE.Vector4(1, 0, 0, 1); // Red color with full intensity (RGBA)
      window.viewerInstance.setThemingColor(dbIDs, color); // Optionally highlight the objects

      // window.viewerInstance.setSelectionColor(new THREE.Color(1, 0, 0));  // RGB: red, green, blue
      // window.viewerInstance.select(dbIDs);  // Optionally highlight the objects

      // Disable further selections after this point
    },
    function (error) {
      console.error("Search error:", error); // Handle any potential search errors
    }
  );
});



// ***************************** model browser panel functionality **************************

function modelBrowserPanel() {
  const levelPanel = document.getElementById("levels-panel");
  const liveDataPanel = document.getElementById("live-data-panel");
  levelPanel.style.visibility = "hidden";
  liveDataPanel.style.visibility = "hidden";
  
  const panel = document.getElementById("model-browser-panel");
  const isVisible = panel.style.visibility === "visible";
  panel.style.visibility = isVisible ? "hidden" : "visible";
  document.getElementById("preview").style.width = isVisible ? "97%" : "69%";

  setTimeout(() => {
    window.viewerInstance.resize();
  }, 300);

  const viewer = window.viewerInstance;
  const models = viewer.impl.modelQueue().getModels();

  const treeContainer = document.querySelector(".tree");
  treeContainer.innerHTML = "";

  models.forEach((model) => {
    const instanceTree = model.getInstanceTree();
    const rootId = instanceTree.getRootId();
    const modelName = model?.name || `Model ${model.id}`;

    const modelDiv = document.createElement("div");
    modelDiv.className = "tree-item parent";
    modelDiv.innerHTML = `
      <span class="expand">▸</span>
      <strong>${modelName}</strong>
    `;
    const modelChildrenDiv = document.createElement("div");
    modelChildrenDiv.className = "children hidden";

    modelDiv.querySelector(".expand").addEventListener("click", () => {
      const isHidden = modelChildrenDiv.classList.contains("hidden");
      modelChildrenDiv.classList.toggle("hidden", !isHidden);
      modelChildrenDiv.classList.toggle("show", isHidden);
      modelDiv.querySelector(".expand").textContent = isHidden ? "▾" : "▸";
    });

    treeContainer.appendChild(modelDiv);
    treeContainer.appendChild(modelChildrenDiv);

    resolveMeaningfulRoots(instanceTree, rootId, model, (realRoots) => {
      realRoots.forEach((childId) => {
        buildTreeNode(childId, modelChildrenDiv, viewer, instanceTree, model);
      });
    });
  });

  function isWrapperName(name) {
    return ["Model", "Unnamed", "Document", "Default", "RootElement"].includes(name);
  }

  function resolveMeaningfulRoots(instanceTree, nodeId, model, callback) {
    window.viewerInstance.getProperties(nodeId, (props) => {
      const name = props.name || "Unnamed";
      if (!isWrapperName(name)) {
        callback([nodeId]);
      } else {
        const realChildren = [];
        const pending = [];
        instanceTree.enumNodeChildren(nodeId, (childId) => {
          pending.push(childId);
        });

        let resolved = 0;
        pending.forEach((id) => {
          viewer.getProperties(id, (childProps) => {
            const childName = childProps.name || "Unnamed";
            if (!isWrapperName(childName)) {
              realChildren.push(id);
            } else {
              instanceTree.enumNodeChildren(id, (grandchildId) => {
                realChildren.push(grandchildId);
              });
            }
            resolved++;
            if (resolved === pending.length) {
              callback(realChildren);
            }
          }, model); // Pass model here
        });
      }
    }, model); // Pass model here
  }

  function buildTreeNode(dbId, container, viewer, instanceTree, model) {
    viewer.getProperties(dbId, (props) => {
      const nodeName = props.name || "Unnamed";

      const nodeDiv = document.createElement("div");
      nodeDiv.className = "tree-item parent";
      nodeDiv.dataset.id = dbId;
      nodeDiv.innerHTML = `
        <span class="expand">▸</span>
        <img class="eye" src="./images/visible.svg" data-dbId="${dbId}" />
        ${nodeName} [${dbId}]
      `;

      const childrenDiv = document.createElement("div");
      childrenDiv.className = "children hidden";
      childrenDiv.dataset.parent = dbId;

      nodeDiv.querySelector(".expand").addEventListener("click", () => {
        const isHidden = childrenDiv.classList.contains("hidden");
        childrenDiv.classList.toggle("hidden", !isHidden);
        childrenDiv.classList.toggle("show", isHidden);
        nodeDiv.querySelector(".expand").textContent = isHidden ? "▾" : "▸";
      });

      nodeDiv.querySelector(".eye").addEventListener("click", (e) => {
        const targetDbId = parseInt(e.target.dataset.dbid);
        const visible = viewer.isNodeVisible(targetDbId, model);
        if (visible) {
          viewer.hide(targetDbId, model);
          e.target.src = "./images/hidden.svg";
        } else {
          viewer.show(targetDbId, model);
          e.target.src = "./images/visible.svg";
        }
      });

      container.appendChild(nodeDiv);
      container.appendChild(childrenDiv);

      instanceTree.enumNodeChildren(dbId, (childDbId) => {
        buildTreeNode(childDbId, childrenDiv, viewer, instanceTree, model);
      });
    }, model); // Pass model here
  }
}





export async function button3D() {
    const viewer = window.viewerInstance;
    // const models = viewer.impl.modelQueue().getModels();
    // const urns = []
    // models.forEach(model => {
    //     urns.push(model.getSeedUrn());
    // });
// Optional: unload current models before loading new ones
    viewer.getVisibleModels().forEach(model => {
      viewer.unloadModel(model);
    });
    const access_token = localStorage.getItem('authToken');
  
    async function loadModels() {
      try {
        // Load each model sequentially
        for (let modelUrn of window.urns) {
  
          await new Promise((resolve, reject) => {
            Autodesk.Viewing.Document.load(
              'urn:' + modelUrn,
              async (doc) => {
                try {
                  await onDocumentLoadSuccess(doc);
                  resolve();
                } catch (err) {
                  reject(err);
                }
              },
              onDocumentLoadFailure,
              { accessToken: access_token }
            );
          });
        }
      } catch (error) {
        console.error("Unexpected error in loadModels:", error);
      }
    }
  
    async function onDocumentLoadSuccess(doc) {
      const loadOptions = {
        keepCurrentModels: true,
        globalOffset: { x: 0, y: 0, z: 0 },
        applyRefPoint: true
      };
  
      const defaultGeometry = doc.getRoot().getDefaultGeometry();
      const model = await viewer.loadDocumentNode(doc, defaultGeometry, loadOptions);
    }
  
    function onDocumentLoadFailure(code, message) {
      console.error("Failed to load model:", message);
      alert("Could not load model. See console for details.");
    }
  
    await loadModels();
}




// ***************************** levels panel functionality **************************


function levelsPanel() {
  const browserPanel = document.getElementById("model-browser-panel");
  const liveDataPanel = document.getElementById("live-data-panel");
  const firePanel = document.getElementById("fire-plan-panel");
  firePanel.style.visibility = "hidden";
  browserPanel.style.visibility = "hidden";
  liveDataPanel.style.visibility = "hidden";
  const panel = document.getElementById("levels-panel");
  const isVisible = panel.style.visibility === "visible";
  panel.style.visibility = isVisible ? "hidden" : "visible";
  document.getElementById("preview").style.width = isVisible ? "97%" : "69%";

  setTimeout(() => {
    window.viewerInstance.resize();
  }, 300);

  const viewer = window.viewerInstance;

  viewer.loadExtension("Autodesk.AEC.LevelsExtension").then(function (levelsExt) {
    if (levelsExt && levelsExt.floorSelector) {
      const floorSelector = levelsExt.floorSelector;

      // Wait briefly for floors to populate
      setTimeout(() => {
        const levels = floorSelector._floors;
        console.log("Floors:", levels);

        const listContainer = document.querySelector(".levels-list");
        listContainer.innerHTML = ""; // Clear existing

        let activeFloorIndex = null; // Store active floor

        // Inside the levelsExt callback
        levels.forEach((floor, index) => {
        const li = document.createElement("li");
        li.textContent = floor.name;

        li.addEventListener("click", () => {
            const isActive = activeFloorIndex === index;

            document.querySelectorAll(".levels-list li").forEach(el => el.classList.remove("active"));

            if (!isActive) {
            li.classList.add("active");
            const tempLiveData = document.getElementById("temperature");
            if (tempLiveData.classList.contains("active")) {
              if (window.LiveData === 'DB8') {
                HEATMAP(viewer, index);
              }
            }
            floorSelector.selectFloor(index, true);
            activeFloorIndex = index;
            } else {
            // No built-in unselect; simulate it by resetting camera or selecting all levels
            floorSelector.selectFloor(-1, true); // This usually resets to "all levels"
            activeFloorIndex = null;
            }
        });

        listContainer.appendChild(li);
        });

      }, 1000);
    } else {
      console.error("Levels Extension or floorSelector is not available.");
    }
  });
}



// ***************************** levels panel functionality **************************


async function liveDataPanel() {
  const viewer = window.viewerInstance;
  const dataVizExtn = await viewer.loadExtension("Autodesk.DataVisualization");

  const browserPanel = document.getElementById("model-browser-panel");
  const levelsPanel = document.getElementById("levels-panel");
  const firePanel = document.getElementById("fire-plan-panel");
  const panel = document.getElementById("live-data-panel");
  const isVisible = panel.style.visibility === "visible";

  browserPanel.style.visibility = "hidden";
  levelsPanel.style.visibility = "hidden";
  firePanel.style.visibility = "hidden";
  panel.style.visibility = isVisible ? "hidden" : "visible";
  document.getElementById("preview").style.width = isVisible ? "97%" : "69%";

  setTimeout(() => {
    viewer.resize();
  }, 300);

  const listItems = document.querySelectorAll(".live-data-list li");
  const details = document.querySelector(".live-data-details");
  const legend = document.querySelector(".live-data-legend");

  listItems.forEach(item => {
    item.addEventListener("click", () => {
      const label = item.textContent.trim().toLowerCase();
      const isAlreadyActive = item.classList.contains("active");

      // Clear all visuals
      dataVizExtn.removeSurfaceShading();
      dataVizExtn.removeAllViewables();
      if (window.heatmapSprites) {
        dataVizExtn.showHideViewables(false, false, window.heatmapSprites);
        window.heatmapSprites = null;
      }
      if (window.lightsSprites) {
        dataVizExtn.showHideViewables(false, false, window.lightsSprites);
        window.lightsSprites = null;
      }
      if (window.showLiveDataButton && showLiveDataButton.container) {
        showLiveDataButton.container.style.display = 'none';
      }

      // Handle temperature-specific UI visibility
      if (label === "temperature" && !isAlreadyActive) {
        details.classList.remove("hidden");
        legend.classList.remove("hidden");
      } else {
        details.classList.add("hidden");
        legend.classList.add("hidden");
      }

      // If clicking the same active item → deactivate and return
      if (isAlreadyActive) {
        item.classList.remove("active");
        return;
      }

      // Else: remove all 'active', set current as active
      listItems.forEach(el => el.classList.remove("active"));
      item.classList.add("active");

      // Activate the selected view
      if (label === "temperature") {
        if (window.LiveData === 'DB8') {
          HEATMAP(viewer, 0);
          window.heatmapSprites = SPRITES(viewer, 0);
        } else if (window.LiveData === 'HG62') {
          HG62HEATMAP(viewer, 0);
          window.heatmapSprites = HG62SPRITES(viewer, 0);
        }

        if (window.showLiveDataButton && showLiveDataButton.container) {
          showLiveDataButton.container.style.display = 'block';
        }

      } else if (label === "lights") {
        window.lightsSprites = LightSPRITES(viewer);
      }

      // Add more view types here as needed
    });
  });
}




async function firePlansPanel() {
  const viewer = window.viewerInstance;
  const models = viewer.impl.modelQueue().getModels();
  const browserPanel = document.getElementById("model-browser-panel");
  const levelsPanel = document.getElementById("levels-panel");
  const livedataPanel = document.getElementById("live-data-panel");
  const panel = document.getElementById("fire-plan-panel");
  const isVisible = panel.style.visibility === "visible";

  browserPanel.style.visibility = "hidden";
  levelsPanel.style.visibility = "hidden";
  livedataPanel.style.visibility = "hidden";
  panel.style.visibility = isVisible ? "hidden" : "visible";
  document.getElementById("preview").style.width = isVisible ? "97%" : "69%";

  setTimeout(() => {
    viewer.resize();
  }, 300);

  const all2DFiles = await new Promise((resolve) => {
    let promises = [];

    models.forEach((model) => {
      const docRoot = model.getDocumentNode();

      const promise = new Promise((resolveInner) => {
        setTimeout(() => {
          const twoDFiles = find2DFilesDeep(docRoot);
          resolveInner(twoDFiles);
        }, 500); // Optional delay
      });

      promises.push(promise);
    });

    Promise.all(promises).then((results) => {
      const merged = results.flat(); // Combine results
      resolve(merged);
    });
  });

  const listContainer = document.querySelector(".fire-plan-list");
  listContainer.innerHTML = ""; // Clear old list


  all2DFiles.forEach((sheetData, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = sheetData.name || `Sheet ${index + 1}`;
    listItem.addEventListener("click", () => {
      listContainer.querySelectorAll("li").forEach(el => el.classList.remove("active"));
      listItem.classList.add("active");

      let urn = models[0].getDocumentNode().getDefaultGeometry().children[1].data.urn; // Get the URN of the first model
      const modelUrn = urn.split('fs.file:')[1].split('/')[0];

      // const modelUrn = sheetData.urn; // e.g., full URN like 'dXJuOmFkc2sud2lwZW1lY...'
      const viewableID = sheetData.viewableID; // this must exist on sheetData
      const access_token = localStorage.getItem("authToken");

      Autodesk.Viewing.Document.load(
        "urn:" + modelUrn,
        (doc) => onDocumentLoadSuccess(doc, viewableID),
        onDocumentLoadFailure,
        { accessToken: access_token }
      );

      async function onDocumentLoadSuccess(doc, viewableID) {
        const geometryItems = doc.getRoot().search({ type: "geometry" });
        const viewableNode = geometryItems.find(node => node.data.viewableID === viewableID);

        if (!viewableNode) {
          console.error("❌ Viewable not found for ID:", viewableID);
          return;
        }

        // Unload existing models before loading
        viewer.getVisibleModels().forEach(model => viewer.unloadModel(model));

        const loadOptions = {
          keepCurrentModels: true,
          globalOffset: { x: 0, y: 0, z: 0 },
          applyRefPoint: true
        };

        try {
          const model = await viewer.loadDocumentNode(doc, viewableNode, loadOptions);
          console.log("✅ Loaded 2D view:", model);
        } catch (err) {
          console.error("⚠️ Error loading model:", err);
        }
      }

      function onDocumentLoadFailure(code, message) {
        console.error("❌ Failed to load document:", message);
        alert("Could not load model. See console for details.");
      }
    });

    listContainer.appendChild(listItem);
  });

}



function find2DFilesDeep(node, results = new Set(), visited = new Set()) {
  if (!node || !node.data || visited.has(node.id)) return results;

  visited.add(node.id);

  // Check if it's a 2D sheet and name includes 'fire drawings'
  if (
    node.data.type === "geometry" &&
    node.data.role === "2d" &&
    node.data.name.toLowerCase().includes("fire drawing")
  ) {
    // Optional: get URN if available
    const doc = node.getDocument && node.getDocument(); // works in some viewer versions
    const urn = doc?.getRoot()?.data?.urn?.replace("urn:", "");

    results.add({
      name: node.data.name,
      viewableID: node.data.viewableID,
      urn: urn
    });
  }

  if (Array.isArray(node.children)) {
    node.children.forEach(child => find2DFilesDeep(child, results, visited));
  }

  if (node.parent && !visited.has(node.parent.id)) {
    find2DFilesDeep(node.parent, results, visited);
  }

  return [...results];
}
