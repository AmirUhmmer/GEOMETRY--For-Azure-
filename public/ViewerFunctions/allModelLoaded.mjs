import * as functions from '../viewerSidebar.mjs';
import * as customFunctions from './workset.mjs';
import { showLiveDataPanel, createToolbarLiveDataButton, createToolbarLiveDataListButton, showLiveDataListPanel } from '../Live_Data/LiveData.mjs';
import { HardAssetSearch } from '../Hemy_Functions/HardAssets.mjs';
import { ServiceZoneSearch, spaceInventorySearch } from '../Hemy_Functions/ServiceZone.mjs';
import { FunctionalLocationSearch, zoneFunctionalLocation, highlightFLByTask, prewarmFunctionalLocationCacheFromModel } from '../Hemy_Functions/FunctionalLocation.mjs';
import { RepeatingTasks, showTasks, showAllTasks } from '../Hemy_Functions/RepeatingTasks.mjs';
import { WOServiceTask } from '../Hemy_Functions/WOServiceTask.mjs';
import { Sol11PicsSPRITES } from '../SOL11_23/sol11360pics.mjs';
import { AgreementFunctionalLocationSearch } from '../Hemy_Functions/Agreement.mjs';
import { markTaskDone } from '../Hemy_Functions/RepeatingTasks.mjs';

export async function checkAllModelsLoaded(viewer, modelsLoaded, modelsToLoad, ServiceZone, FunctionalLocation, RepeatingTask) {
  // console.log("CHECK: " + modelsLoaded);
    let model = window.LiveData;
  if (modelsLoaded === modelsToLoad.length) {
    const models = viewer.impl.modelQueue().getModels();
    // Perform actions only when all models are loaded

    // if (allModelsInitialized) return;
    if (viewer.model) {
      // allModelsInitialized = true; // 🔐 HARD STOP
      viewer.loadExtension("Autodesk.DataVisualization").then(() => {
        console.log("Autodesk.DataVisualization loaded.");
      });

      viewer.loadExtension("Autodesk.DocumentBrowser").then(() => {
        console.log("Autodesk.DocumentBrowser loaded.");
      });

      viewer.loadExtension("Autodesk.AEC.LevelsExtension").then((levelsExt) => {
        console.log("Autodesk.AEC.LevelsExtension loaded.");
      });

      viewer.loadExtension("Autodesk.FullScreen").then(() => {
        console.log("Autodesk.FullScreen loaded.");
      });

      viewer.loadExtension("Autodesk.AEC.Minimap3DExtension").then(() => {
        console.log("Autodesk.Minimap3DExtension loaded.");
      });

      viewer.unloadExtension("Autodesk.Explode");

      const navTools = viewer.toolbar.getControl("navTools");
      navTools.removeControl("toolbar-orbitTools");
      navTools.removeControl("toolbar-panTool");
      navTools.removeControl("toolbar-zoomTool");
      navTools.removeControl("toolbar-cameraSubmenuTool");

      if (model === "DB8" || model === "HG62") {
        showLiveDataPanel(viewer);
        showLiveDataListPanel(viewer, model);
        createToolbarLiveDataListButton(viewer, model);
      } else if (model === "SOL11") {
        Sol11PicsSPRITES(viewer);
      }

      // Call surface shading setup or any other actions here
      viewer
        .loadExtension("Autodesk.AEC.LevelsExtension")
        .then(function (levelsExt) {
          if (levelsExt && levelsExt.floorSelector) {
            levelsExt.floorSelector.addEventListener(
              Autodesk.AEC.FloorSelector.SELECTED_FLOOR_CHANGED,
              function (event) {
                const selectedLevelIndex = event.levelIndex; // Get the level index from the event
                console.log(`Selected Floor Index: ${selectedLevelIndex}`);

                // Check if the loaded model is named "DB8"
                //let LiveData = localStorage.getItem('LiveData');
                let LiveData = model;
                console.log(LiveData);
                if (
                  LiveData === "DB8" ||
                  (LiveData === "HG62" &&
                    selectedLevelIndex !== undefined &&
                    selectedLevelIndex >= 0)
                ) {
                  viewer.LiveDataListPanel.changedfloor(
                    viewer,
                    selectedLevelIndex,
                    LiveData,
                  ); // Call LiveDataListPanel
                }
              },
            );

          } else {
            console.error(
              "Levels Extension or floorSelector is not available.",
            );
          }
        });

      let HardAsset = localStorage.getItem("HardAssetChecker");

      // #region FUNCTIONS

      localStorage.setItem("is2D", "false");

      await prewarmFunctionalLocationCacheFromModel(models[1]);

      viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () =>
        hideGenericModels(viewer, models),
      );

      [Autodesk.Viewing.ISOLATE_EVENT, Autodesk.Viewing.SHOW_ALL_EVENT].forEach(
        (evt) =>
          viewer.addEventListener(evt, () => hideGenericModels(viewer, models)),
      );

      customFunctions.workset(viewer);

      HardAssetSearch(viewer, HardAsset);

      ServiceZoneSearch(viewer, ServiceZone);

      FunctionalLocationSearch(viewer, FunctionalLocation);

      RepeatingTasks(viewer, RepeatingTask);

      WOServiceTask(viewer);

      AgreementFunctionalLocationSearch(viewer, window.agreementFL);

      highlightFLByTask(viewer, window.serviceZone);

      spaceInventorySearch(viewer, window.spaceInventory);

      // #endregion

      // TASK colors highlight websocket
      if (window.socket) {
        window.socket.onmessage = async (event) => {
          const message = JSON.parse(event.data);
          if (message.type === "showTask") {
            console.log("Received message:", event.data);
            showTasks(viewer, message);
          } else if (message.type === "showAllTask") {
            console.log("Received message [show all task]:", event.data);
            showAllTasks(viewer, message);
          } else if (message.type === "showZone") {
            console.log("Received message [show all zones]:", event.data);
            zoneFunctionalLocation(viewer, message);
          } else if (message.type === "completeTask") {
            console.log("Received message [complete task]:", message);
            console.log(
              "Marking task as done for Hard Asset:",
              message.hardAsset,
              "Task Name:",
              message.taskName,
            );
            markTaskDone(viewer, message.hardAsset, message.taskName);
          } else if (message.type === "showFirePlan") {
            functions.firePlansPanel();
          } else if (message.type === "showSheets2D") {
            functions.sheets2DPanel();
          } else if (message.type === "showLiveData") {
            functions.liveDataPanel();
          } else if (message.type === "closeInsidePanel") {
            functions.closeInsidePanel();
          } else {
            console.log("Unknown message type received:", message.type);
          }
        };
      }

      let urn,
        modelUrn,
        urns = [];
      models.forEach((model) => {
        urn = model.getDocumentNode().getDefaultGeometry().children[1].data.urn; // Get the URN of the first model
        modelUrn = urn.split("fs.file:")[1].split("/")[0];
        urns.push(modelUrn);
      });

      window.urns = urns; // Store the URNs globally for access in other modules
      // console.log("Model URNs:", window.urns);

      const canvas = viewer.impl.canvas;

      let lastTap = 0;
      canvas.addEventListener("click", async function (event) {
        const now = Date.now();
        const aggregateSelection = viewer.getAggregateSelection();
        if (now - lastTap < 300) {
          // console.log("🔥 DOUBLE TAP FIRED ON MOBILE!");
          lastTap = 0;

          if (!aggregateSelection?.length) return;

          const iframe = document.getElementById("iframeTest");
          const closeBtn = document.getElementById("closeIframeBtn");

          // only bind close once
          if (!closeBtn._bound) {
            closeBtn._bound = true;
            closeBtn.addEventListener("click", () => {
              iframe.classList.remove("show");
              iframe.src = "";
              closeBtn.style.visibility = "hidden";
              setTimeout(() => viewer.resize(), 300);
            });
          }

          // parse userType once
          const params = new URLSearchParams(window.location.search);
          const userType = params.get("user");

          for (const selection of aggregateSelection) {
            const model = selection.model;
            const dbId = selection.selection?.[0];
            if (!dbId) continue;

            // ----- getProperties (wrap in Promise)
            const props = await new Promise((resolve) => {
              model.getProperties(dbId, (p) => resolve(p));
            });

            // ----- extract GlobalID
            let globalID = null;
            for (const prop of props.properties) {
              if (
                (prop.displayName === "Asset ID" ||
                  prop.displayName === "Asset ID (GUID)") &&
                prop.displayValue
              ) {
                globalID = prop.displayValue;
                break;
              }
            }
            if (!globalID) continue;

            // ----- classification
            let isFunctionalLocation = false;

            // CRM check (non-blocking)
            (async () => {
              try {
                const crmResp = await fetch(
                  `https://org47a0b99a.crm4.dynamics.com/api/data/v9.2/msdyn_functionallocations(${globalID})`,
                  {
                    headers: { Accept: "application/json;odata.metadata=none" },
                  },
                );
                if (crmResp.ok) {
                  isFunctionalLocation = true;
                }
              } catch {
                /* ignore */
              }
            })();

            // fallback logic
            if (!isFunctionalLocation) {
              const functionalKeywords = [
                "room",
                "rooms",
                "space",
                "spaces",
                "area",
                "areas",
                "corridor",
                "hallway",
                "hall",
                "passage",
                "lobby",
                "vestibule",
                "foyer",
                "gallery",
                "concourse",
                "stair",
                "stairs",
                "staircase",
                "stairwell",
                "escalator",
                "lift lobby",
                "elevator lobby",
                "shaft",
                "riser",
                "mechanical room",
                "electrical room",
                "communication room",
                "server room",
                "telco",
                "riser room",
                "pump room",
                "fire pump room",
                "control room",
                "plant room",
                "boiler room",
                "chiller room",
                "toilet",
                "washroom",
                "bathroom",
                "lavatory",
                "wc",
                "shower",
                "pantry",
                "kitchen",
                "storage",
                "storeroom",
                "janitor",
                "cleaner",
                "archive",
                "file room",
                "meeting room",
                "conference room",
                "boardroom",
                "office",
                "zone",
                "zones",
                "mass",
                "revit mass",
                "fire zone",
                "hvac zone",
                "text",
              ];

              for (const prop of props.properties) {
                const val = (prop.displayValue ?? "").toString().toLowerCase();

                if (prop.displayName === "Category") {
                  if (
                    ["revit mass", "rooms", "spaces", "areas"].includes(val)
                  ) {
                    isFunctionalLocation = true;
                    break;
                  }
                }

                if (
                  ["Type Name", "Family", "Name"].includes(prop.displayName)
                ) {
                  if (functionalKeywords.some((k) => val.includes(k))) {
                    isFunctionalLocation = true;
                    break;
                  }
                }
              }
            }

            const isHardAsset = !isFunctionalLocation;

            // ----- Build URL
            let appId;
            if (userType === "tenant") {
              appId = "63879c3c-5060-f011-bec1-7c1e527684d6";
            } else if (userType === "supplier") {
              appId = "230c5e7c-1bd1-ef11-8eea-000d3ab86138";
            } else {
              appId = "2019ee4f-38bc-ef11-b8e9-000d3ab86138";
            }

            const entity = isHardAsset
              ? "msdyn_customerasset"
              : "msdyn_functionallocation";
            const newUrl = `https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=${appId}&pagetype=entityrecord&etn=${entity}&id=${globalID}`;

            // ----- Show iframe instantly
            iframe.src = newUrl;
            iframe.classList.add("show");
            closeBtn.style.visibility = "visible";
            setTimeout(() => viewer.resize(), 300);

            // notify container
            window.parent.postMessage({ type: "openUrl", url: newUrl }, "*");
          }
        } else {
          if (aggregateSelection && aggregateSelection.length > 0) {
            // Check if aggregateSelection is defined and has items
            aggregateSelection.forEach((selection) => {
              // console.log("Processing selection:", selection); // Log the selection details

              const model = selection.model; // Get the selected model
              // console.log("Model:", model);            // Log the model

              const dbIdArray = selection.selection; // Get the selected object IDs from the selection array
              // console.log("dbIdArray:", dbIdArray);    // Log the dbIdArray

              if (dbIdArray && dbIdArray.length > 0) {
                // Ensure dbIdArray is defined and has objects
                const dbId = dbIdArray[0]; // Assume the first selected object for demonstration
                console.log("Selected dbId:", dbId); // Log the selected dbId

                const instanceTree = model.getInstanceTree();
                // console.log("InstanceTree:", instanceTree); // Log the instance tree to ensure it's available

                if (instanceTree) {
                  instanceTree.enumNodeFragments(dbId, (fragId) => {
                    const fragList = model.getFragmentList(); // Use the correct model's fragment list
                    const matrix = new THREE.Matrix4();
                    fragList.getWorldMatrix(fragId, matrix);

                    const position = new THREE.Vector3();
                    position.setFromMatrixPosition(matrix);

                    console.log(
                      `World Coordinates (Model ${model.id}): x=${position.x}, y=${position.y}, z=${position.z}`,
                    );
                  });
                } else {
                  console.log("InstanceTree not available for model:", model);
                }
              } else {
                console.log("No objects selected in dbIdArray.");
              }
            });
          } else {
            console.log(
              "No objects selected or aggregate selection is undefined.",
            );
          }
        }
        lastTap = now;
      });

      // ENABLE IF WANT TO SEARCH OBJECT IN MODEL

      // const overlay = document.getElementById('overlay');

      // overlay.style.visibility = 'visible';

      // document.getElementById("search").addEventListener("click", function first() {
      //     // viewer.search(
      //     //   document.getElementById("filter").value,
      //     //   function (dbIDs) {
      //     //     viewer.isolate(dbIDs);
      //     //     viewer.fitToView(dbIDs);
      //     // });

      //     viewer.search(document.getElementById("filter").value, function(dbIDs) {

      //         // Loop through the models only once
      //         models.forEach(model => {
      //             // Hide all objects first
      //             viewer.isolate([], model);

      //             // Isolate the found objects
      //             viewer.isolate(dbIDs, model);
      //         });

      //         // Fit to view and highlight the found objects
      //         viewer.fitToView(dbIDs);

      //         const color = new THREE.Vector4(1, 0, 0, 1);  // Red color with full intensity (RGBA)
      //         viewer.setThemingColor(dbIDs, color);  // Optionally highlight the objects

      //         viewer.setSelectionColor(new THREE.Color(1, 0, 0));  // RGB: red, green, blue
      //         viewer.select(dbIDs);  // Optionally highlight the objects

      //         // Disable further selections after this point

      //     }, function(error) {
      //         console.error('Search error:', error);  // Handle any potential search errors
      //     });
      // });
    }
  }
}

// #region Hide Generic Models
export async function hideGenericModels(viewer, models) {
  if (!Array.isArray(models)) return;

  for (const model of models) {

    const instanceTree = await new Promise((resolve, reject) => {
      model.getObjectTree(resolve, reject);
    });

    const rootId = instanceTree.getRootId();
    const allDbIds = [];

    instanceTree.enumNodeChildren(rootId, dbId => {
      allDbIds.push(dbId);
    }, true);

    const lockedGenericDbIds = new Set();

    const checks = allDbIds.map(dbId => {
      return new Promise(resolve => {
        model.getProperties(dbId, props => {
          if (!props?.properties) return resolve();

          const categoryProp = props.properties.find(
            p => p.displayName === 'Category'
          )?.displayValue;

          const zoneProp = props.properties.find(
            p => p.displayName === 'NV3DZoneName'
          )?.displayValue;

        //   console.log(`Checking dbId ${dbId}: Category=${categoryProp}, NV3DZoneName=${zoneProp}`);

          const isGenericCategory =
            categoryProp === 'Revit Generic Models' ||
            categoryProp === 'Generic Models' ||
            categoryProp === 'Revit Mass' ||
            categoryProp === 'Mass';

          if (isGenericCategory && zoneProp) {
            lockedGenericDbIds.add(dbId);
          }

          resolve();
        });
      });
    });

    await Promise.all(checks);

    if (!lockedGenericDbIds.size) continue;

    const ids = [...lockedGenericDbIds];

    // console.log('Ghosting Generic Models:', ids);

    viewer.setGhosting(true);
    viewer.hide(ids, model);
  }
}
// #endregion