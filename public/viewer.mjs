import * as functions from './viewerSidebar.mjs';
import { showLiveDataPanel, createToolbarLiveDataButton, createToolbarLiveDataListButton, showLiveDataListPanel } from './Live_Data/LiveData.mjs';
import { HardAssetSearch } from './Hemy_Functions/HardAssets.mjs';
import { ServiceZoneSearch } from './Hemy_Functions/ServiceZone.mjs';
import { FunctionalLocationSearch } from './Hemy_Functions/FunctionalLocation.mjs';
import { RepeatingTasks, showTasks } from './Hemy_Functions/RepeatingTasks.mjs';
import { WOServiceTask } from './Hemy_Functions/WOServiceTask.mjs';
import { Sol11PicsSPRITES } from './SOL11_23/sol11360pics.mjs';
import { ToolbarButton2DFaro } from './panelFor2DFaro.mjs';
import { button3D } from './button3D.mjs';
import { AgreementFunctionalLocationSearch } from './Hemy_Functions/Agreement.mjs';
import { rightToolbar } from './rightToolbar.mjs';



async function getAccessToken(callback) {
    try {
        // const resp = await fetch('/api/auth/token');

        const access_token = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const expires_in = localStorage.getItem('expires_at');
        const internal_token = localStorage.getItem('internal_token');


        // if (!resp.ok)
        //     throw new Error(await resp.text());
        // const { access_token, expires_in } = await resp.json();
        
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);        
    }
}

export function initViewer(container) {
    return new Promise(function (resolve, reject) {
        Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, async function () {
            const config = {
                extensions: [
                    // 'Autodesk.DocumentBrowser',
                    // 'Autodesk.AEC.LevelsExtension',
                    // 'Autodesk.DataVisualization',
                    // 'HistogramExtension',
                ]
            };
            const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            // const viewer = new Autodesk.Viewing.AggregatedView(container, config);

            viewer.start();
            viewer.setTheme('dark-theme');
            viewer.setQualityLevel(true, true);
            // console.log(accessToken);



            const canvas = viewer.impl.canvas;

            window.viewerInstance = viewer; // Store the viewer instance globally for access in other modules

            canvas.addEventListener('click', function (event) {
                // console.log("Canvas clicked:", event); // Log the event to ensure the click is firing
            
                const aggregateSelection = viewer.getAggregateSelection(); // Get selections from all loaded models
                // console.log("Aggregate selection:", aggregateSelection); // Log the aggregate selection
            
                if (aggregateSelection && aggregateSelection.length > 0) { // Check if aggregateSelection is defined and has items
                    aggregateSelection.forEach(selection => {
                        // console.log("Processing selection:", selection); // Log the selection details
            
                        const model = selection.model;           // Get the selected model
                        // console.log("Model:", model);            // Log the model
            
                        const dbIdArray = selection.selection;   // Get the selected object IDs from the selection array
                        // console.log("dbIdArray:", dbIdArray);    // Log the dbIdArray
            
                        if (dbIdArray && dbIdArray.length > 0) { // Ensure dbIdArray is defined and has objects
                            const dbId = dbIdArray[0];           // Assume the first selected object for demonstration
                            console.log("Selected dbId:", dbId); // Log the selected dbId
            
                            const instanceTree = model.getInstanceTree();
                            // console.log("InstanceTree:", instanceTree); // Log the instance tree to ensure it's available
            
                            if (instanceTree) {
                                instanceTree.enumNodeFragments(dbId, (fragId) => {
                                    const fragList = model.getFragmentList();    // Use the correct model's fragment list
                                    const matrix = new THREE.Matrix4();
                                    fragList.getWorldMatrix(fragId, matrix);
            
                                    const position = new THREE.Vector3();
                                    position.setFromMatrixPosition(matrix);
            
                                    console.log(`World Coordinates (Model ${model.id}): x=${position.x}, y=${position.y}, z=${position.z}`);
                                });
                            } else {
                                console.log("InstanceTree not available for model:", model);
                            }
                        } else {
                            console.log("No objects selected in dbIdArray.");
                        }
                    });
                } else {
                    console.log('No objects selected or aggregate selection is undefined.');
                }
            });
                     
        

            
            resolve(viewer);
        });
    });
}

// export function loadModel(viewer, urn) {
//     function onDocumentLoadSuccess(doc) {
//         // Load the model geometry
//         viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry())
//             .then(() => {
//                 // Once the geometry is loaded, call surface shading setup
//                 viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function () {
//                     if (viewer.model) {
//                     }
//                 });
//             })
//             .catch((error) => {
//                 console.error("Error loading geometry:", error);
//             });
//     }
    

//     function onDocumentLoadFailure(code, message) {
//         alert('Could not load model. See console for more details.');
//         console.error(message);
//     }

//     console.log(urn);
//     Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
// }



// ******************************* WORKING ************************


export function loadModel(viewer, urns, hubId, projectId, folderId, ServiceZone, FunctionalLocation, model, RepeatingTask) {
    window.LiveData = model; // Store LiveData globally for access in other modules
    let modelsToLoad = urns;
    let modelAbbreviation = model;

    let modelsLoaded = 0; // Keep track of how many models have loaded

    // console.log(modelsToLoad);

    async function checkAllModelsLoaded() {

        // console.log("CHECK: " + modelsLoaded);

        if (modelsLoaded === modelsToLoad.length) {
            // console.log(viewer.getAllModels(), "All models have been loaded.");
            const accessToken = localStorage.getItem('authToken'); // Retrieve the access token
            // console.log('Access Token:', accessToken);
            const models = viewer.impl.modelQueue().getModels();
            // Perform actions only when all models are loaded

            // let model = viewer.getAllModels()[0]; //!<< Check the first model just for demo
            // let fragList = model.getFragmentList();
            // let hiddenDbIds = Object.keys( fragList.vizflags ).filter(fragId => !fragList.isFragVisible( fragId )).map(fragId => fragList.getDbIds( fragId ) );

            // // hiddenDbIds.forEach(dbId => viewer.getProperties(dbId, console.log))


            if (viewer.model) {
                viewer.loadExtension('Autodesk.DataVisualization').then(() => {
                    console.log('Autodesk.DataVisualization loaded.');
                });

                viewer.loadExtension('Autodesk.DocumentBrowser').then(() => {
                    console.log('Autodesk.DocumentBrowser loaded.');
                });
    
                viewer.loadExtension('Autodesk.AEC.LevelsExtension').then((levelsExt) => {
                    console.log('Autodesk.AEC.LevelsExtension loaded.');
                    // levelsExt.floorSelector.selectFloor(1);
                });

                viewer.loadExtension('Autodesk.FullScreen').then(() => {
                    console.log('Autodesk.FullScreen loaded.');
                });

                viewer.loadExtension('Autodesk.AEC.Minimap3DExtension').then(() => {
                    console.log('Autodesk.Minimap3DExtension loaded.');
                });

                viewer.unloadExtension('Autodesk.Explode');
                
                const navTools = viewer.toolbar.getControl('navTools');
                navTools.removeControl('toolbar-orbitTools');
                navTools.removeControl('toolbar-panTool');
                navTools.removeControl('toolbar-zoomTool');
                navTools.removeControl('toolbar-cameraSubmenuTool');
                


                const settingsTools = viewer.toolbar.getControl('settingsTools');
                settingsTools.removeControl('toolbar-settingsTool');
                

                
                

                if(model === 'DB8' || model === 'HG62'){
                    showLiveDataPanel(viewer);
                    showLiveDataListPanel(viewer, model);
                    createToolbarLiveDataListButton(viewer, model);
                    hideGenericModels(viewer, models[0]);
                }else if(model === 'SOL11'){
                    Sol11PicsSPRITES(viewer);
                }

                function hideGenericModels(viewer, model) {
                    model.getObjectTree(function (instanceTree) {
                        const dbIdsToHide = [];
                        console.log(dbIdsToHide);
                        instanceTree.enumNodeChildren(instanceTree.getRootId(), function (dbId) {
                            model.getProperties(dbId, function (props) {
                                if (props && props.properties) {
                                    const categoryProp = props.properties.find(p => p.displayName === 'Category');
                                    if (categoryProp && categoryProp.displayValue === 'Revit Generic Models') {
                                        const zoneNameProp = props.properties.find(p => p.displayName === 'NV3DZoneName');
                                        if (zoneNameProp) {
                                            if (zoneNameProp.displayValue.includes("Parking Area")) {
                                                // Do nothing
                                            } else {
                                                dbIdsToHide.push(dbId);
                                            }
                                        }
                                    }
                                }
                            }, true);
                        }, true);
                
                        // Wait a short delay to allow getProperties to complete for multiple dbIds
                        setTimeout(() => {
                            if (dbIdsToHide.length > 0) {
                                //console.log("Hiding Generic Models:", dbIdsToHide);
                                viewer.hide(dbIdsToHide);

                                // const frags = model.getFragmentList();
                                // dbIdsToHide.forEach(dbId => {
                                //     model.getData().instanceTree.enumNodeFragments(dbId, fragId => {
                                //         frags.setVisibility(fragId, false);
                                //     });
                                // });
                                // viewer.impl.sceneUpdated(true);
                            }
                        }, 2000);
                    });
                }
                
                // viewer.anyLayerHidden();
                // console.log("Aggregate Hidden Nodes:", viewer.anyLayerHidden());

                
                // Call surface shading setup or any other actions here
                viewer.loadExtension('Autodesk.AEC.LevelsExtension').then(function(levelsExt) {
                    if (levelsExt && levelsExt.floorSelector) {
                        levelsExt.floorSelector.addEventListener(Autodesk.AEC.FloorSelector.SELECTED_FLOOR_CHANGED, function(event) {
                            const selectedLevelIndex = event.levelIndex; // Get the level index from the event
                            console.log(`Selected Floor Index: ${selectedLevelIndex}`);
                
                            // Check if the loaded model is named "DB8"
                            //let LiveData = localStorage.getItem('LiveData');
                            let LiveData = model;
                            console.log(LiveData);
                            if (LiveData === 'DB8' || LiveData === 'HG62' && selectedLevelIndex !== undefined && selectedLevelIndex >= 0) {
                                viewer.LiveDataListPanel.changedfloor(viewer, selectedLevelIndex, LiveData); // Call LiveDataListPanel
                             }//else if (LiveData === 'HG62' && selectedLevelIndex !== undefined && selectedLevelIndex >= 0) {
                            //     viewer.LiveDataListPanel.changedfloor(viewer, selectedLevelIndex); // Call LiveDataListPanel
                            // }
                        });
                
                        // Optionally, set a default floor after loading the extension
                        // levelsExt.floorSelector.selectFloor(0, true);
                
                        // Get and log the floor data
                        // const floorData = levelsExt.floorSelector;
                        // console.log("Initial Floor Data:", floorData);

                        // setTimeout(() => {
                        //     const floorAr = floorData._floors;
                        //     console.log("Floor Array after delay:", floorAr);

                        //     if (floorAr && floorAr.length > 0) {
                        //         floorAr.forEach((floor, index) => {
                        //             console.log(`Floor ${index}:`, floor);
                        //         });
                        //     } else {
                        //         console.error("Floors array is still empty.");
                        //     }
                        // }, 1000); // Wait for 1 second before checking


                    } else {
                        console.error("Levels Extension or floorSelector is not available.");
                    }
                });
                
                
                


                // Add click event listener to show the dbid of the selected object
                // viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (event) {
                //     const selectedItems = viewer.getSelection();
                //     if (selectedItems.length > 0) {
                //         const dbid = selectedItems[0];
                //         console.log("Selected object dbid: " + dbid);

                //         // Get the screen coordinates from the mouse click
                //             const screenPoint = new THREE.Vector2(event.canvasX, event.canvasY);
                            
                //             // Convert screen coordinates to world coordinates
                //             const worldPoint = viewer.clientToWorld(screenPoint);

                //             console.log('World Coordinates:', worldPoint);
                //     }
                // }); 


                // const aecModelData = viewer.model.getData();
                // if (aecModelData) {
                //     console.log('AEC Model Data available:', aecModelData);
                // } else {
                //     console.log('AEC Model Data not available for this model.');
                // }


                let HardAsset = localStorage.getItem('HardAssetChecker');

                //console.log(HardAsset);

                HardAssetSearch(viewer, HardAsset);

                ServiceZoneSearch(viewer, ServiceZone);

                FunctionalLocationSearch (viewer, FunctionalLocation);

                RepeatingTasks(viewer, RepeatingTask);

                WOServiceTask(viewer);

                // ToolbarButton2DFaro(viewer, modelAbbreviation);
                if (window.socket) {
                    window.socket.onmessage = async (event) => {
                    const message = JSON.parse(event.data);
                    console.log("Received message:", event.data);
                        if (message.type === "showTask") {
                            console.log("Received message:", event.data);
                            

                            showTasks(viewer, message);
                        }
                    };
                }


                // window.addEventListener("message", (event) => {
                //     console.log("📨 Message received in iframe:", event.data);

                //     if (event.data?.type === "functionallocations") {
                //         console.log("✅[VIEWER LISTENER] FL payload received:", event.data.payload);
                //         window.agreementFL.push(...event.data.payload);
                //         AgreementFunctionalLocationSearch(viewer, event.data.payload);
                //     }
                // });



                let urn, modelUrn, urns = [];
                models.forEach(model => {
                    urn = model.getDocumentNode().getDefaultGeometry().children[1].data.urn; // Get the URN of the first model
                    modelUrn = urn.split('fs.file:')[1].split('/')[0];
                    urns.push(modelUrn);
                });

                window.urns = urns; // Store the URNs globally for access in other modules

                // button3D(viewer, urns);

                // rightToolbar(viewer, modelAbbreviation);

                AgreementFunctionalLocationSearch(viewer, window.agreementFL);

                const canvas = viewer.impl.canvas;




                canvas.addEventListener('dblclick', function (event) {
                    event.preventDefault(); // Prevent default zoom on double-click
                
                    const aggregateSelection = viewer.getAggregateSelection(); // Get selections from all loaded models
                
                    if (aggregateSelection && aggregateSelection.length > 0) {
                        // Loop through all selections across models
                        aggregateSelection.forEach(selection => {
                            const model = selection.model;           // Get the selected model
                            const dbIdArray = selection.selection;   // Get the selected object IDs from the selection array
                
                            if (dbIdArray && dbIdArray.length > 0) {
                                const dbId = dbIdArray[0];           // Assume the first selected object for demonstration
                                console.log("DOUBLE CLICK -- Selected DBID:", dbId);
                
                                // Retrieve properties using the DBID and the model (since there are multiple models)
                                model.getProperties(dbId, function (props) {
                                    // Find the GlobalID or Asset ID property
                                    let globalID = null;
                                    let identity = null;
                                    props.properties.forEach(function (prop) {
                                        if (prop.displayName === "Asset ID" && prop.displayValue != '') {
                                            globalID = prop.displayValue;
                                            // console.log(selection.model);
                                            // console.log(viewer.impl.modelQueue().getModels()[1]);
                                        }
                                        if (prop.displayName === "Asset ID (GUID)" && prop.displayValue != '') {
                                            console.log("Asset ID (GUID):", prop.displayValue);
                                            globalID = prop.displayValue;
                                        }
                                    });
                
                                    if (globalID) {
                                        // Check if the selected model is the first or second model
                                        let newUrl;
                                        let HardAssetInsideARModel = false;
                                        console.log('Properties:', props);
                                        props.properties.forEach((prop) => {
                                            if (prop.displayName === "Category" && prop.displayValue !==  'Revit Mass') {
                                                HardAssetInsideARModel = true;
                                                console.log('Properties HARD ASSET');
                                            }
                                        });



                                       

                                        if (HardAsset === 'Hard Asset' || FunctionalLocation === 'TRUE' || ServiceZone === 'TRUE') {
                                            if (model === viewer.impl.modelQueue().getModels()[1]) {
                                                // Second model
                                                // newUrl = "https://semydev.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=msdyn_functionallocation&id=" + globalID;
                                                if (HardAssetInsideARModel) {
                                                    newUrl = "https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=msdyn_customerasset&id=" + globalID;
                                                } else {
                                                    newUrl = "https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=msdyn_functionallocation&id=" + globalID;
                                                }
                                            } else {
                                                // Default case if neither first nor second model
                                                newUrl = "https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=msdyn_customerasset&id=" + globalID;
                                            }

                                        }else{
                                            
                                            if (model === viewer.impl.modelQueue().getModels()[1]) {
                                                // Second model
                                                newUrl = "https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=msdyn_customerasset&id=" + globalID;                                         
                                            } else {
                                                // Default case if neither first nor second model
                                                if (HardAssetInsideARModel) {
                                                    newUrl = "https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=msdyn_customerasset&id=" + globalID;
                                                } else {
                                                    newUrl = "https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=msdyn_functionallocation&id=" + globalID;
                                                }
                                            }
                                        }
                
                                        // console.log("New URL:", newUrl);
                                        // const response = fetch('https://prod-189.westeurope.logic.azure.com:443/workflows/648f7d062b8f4fb7bb200fb9a0cd7ca4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0TJSRQdgZwnOnfxsrHgpuqeNJK5s1zkrx-4mctfQJ9U', {
                                        //     method: 'POST',
                                        //     headers: { 'Content-Type': 'application/json' },
                                        //     body: JSON.stringify({ urn: urn, data: markupData, projectid: projectid })
                                        // });
                                        // Open the URL in a new tab
                                        window.open(newUrl, '_blank');
                                        window.parent.postMessage({ type: 'openUrl', url: newUrl }, '*');
                                    } else {
                                        console.log("GlobalID not found.");
                                    }
                                });
                            }
                        });
                    } else {
                        console.log('No objects selected or aggregate selection is undefined.');
                    }
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

    // Success handler for loading individual models
    async function onDocumentLoadSuccess(doc) {
        // const geometry = doc.getRoot().getDefaultGeometry();
        // const offset = geometry?.globalOffset || { x: 0, y: 0, z: 0 };
        // console.log("Model global offset:", offset);
        const loadOptions = {
            keepCurrentModels: true, // Keeps existing models in the viewer
            globalOffset: { x: 0, y: 0, z: 0 },  // Force all models to origin
            applyRefPoint: true, // Apply reference point for 3D shared coordinates
            skipHiddenFragments: true
            // placementTransform: new THREE.Matrix4().setPosition(offset),
        };
        // console.log("Model loaded successfully:", doc);
        
        let viewables = doc.getRoot().getDefaultGeometry();

        try {
            // Load the document node and aggregate models in the viewer
            const node = await viewer.loadDocumentNode(doc, viewables, loadOptions);
            // console.log("Model node loaded into viewer:", node);

            // const offset = viewer.model.getData().globalOffset //= { x: 0, y: 0, z: 0 }; Set the global offset for all models
            // console.log(offset);

            modelsLoaded++;  // Increment after successful load
            checkAllModelsLoaded();  // Check if all models are loaded
        } catch (error) {
            console.error("Error loading model into viewer:", error);
            alert("Error loading model into viewer. See console for details.");
        }

    }

    // Failure handler for loading models
    function onDocumentLoadFailure(code, message) {
        console.error("Failed to load model:", message);
        alert("Could not load model. See console for details.");
    }


    // Function to fetch the latest version URN of a file inside a folder
    async function fetchLatestUrn(hubId, projectId, folderId, baseUrn) {
        const accessToken = localStorage.getItem('authToken'); // Retrieve the access token
        const versionsUrl = `https://developer.api.autodesk.com/data/v1/projects/${projectId}/items/${baseUrn}/versions`;
        const response = await fetch(versionsUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        const versionsData = await response.json();
        // console.log('Latest Version URN:', versionsData);
        if (versionsData.data && versionsData.data.length > 0) {
            const latestVersion = versionsData.data[0];  // Assuming the first item is the latest
            let latestVersionUrn = latestVersion.id;  // This will be the URN for the latest version
            console.log('Latest Version URN:', latestVersionUrn);
            const base64Urn = btoa(latestVersionUrn);  // This encodes the URN to base64
            // console.log('Base64 URN:', base64Urn);
            return base64Urn;
        } else {
            console.error('No versions found for the file.');
        }

    }

    async function fetchLatestUrn(hubId, projectId, folderId, baseUrn) {
        const accessToken = localStorage.getItem('authToken');
    
        const versionsUrl = `https://developer.api.autodesk.com/data/v1/projects/${projectId}/items/${baseUrn}/versions`;
        const response = await fetch(versionsUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
    
        const versionsData = await response.json();
    
        if (versionsData.data && versionsData.data.length > 0) {
            let latestVersionUrn = versionsData.data[0].id;
            
            const AppState = {
                URN: latestVersionUrn
              };              
            // Your override logic
            if (latestVersionUrn === 'urn:adsk.wipemea:fs.file:vf.xdXReqV0T1azoWueEiSnzg?version=97') {
                latestVersionUrn = 'urn:adsk.wipemea:fs.file:vf.xdXReqV0T1azoWueEiSnzg?version=96';
            }
    
            console.log('Latest Version URN:', latestVersionUrn);
            return btoa(latestVersionUrn); // Base64 encode
        } else {
            console.error('No versions found for the file.');
            throw new Error('No versions found');
        }
    }
    
    async function loadModels() {
        try {
            // ✅ Fetch all latest URNs in parallel
            const latestUrns = await Promise.all(
                modelsToLoad.map(async (baseUrn) => {
                    try {
                        return await fetchLatestUrn(hubId, projectId, folderId, baseUrn);
                    } catch (error) {
                        console.error(`Failed to fetch latest URN for ${baseUrn}:`, error);
                        alert(`Could not fetch latest URN for ${baseUrn}. See console for details.`);
                        return null; // Skip this model
                    }
                })
            );
    
            // ✅ Filter out failed fetches (nulls)
            const validUrns = latestUrns.filter(urn => urn);
    
            // 🔄 Load each model sequentially
            for (let modelUrn of validUrns) {
                console.log(`Attempting to load model with URN: urn:${modelUrn}`);
    
                await new Promise((resolve, reject) => {
                    Autodesk.Viewing.Document.load(
                        'urn:' + modelUrn,
                        async (doc) => {
                            await onDocumentLoadSuccess(doc).then(resolve).catch(reject);
                        },
                        onDocumentLoadFailure
                    );
                });
            }
        } catch (error) {
            console.error("Unexpected error in loadModels:", error);
        }
    }
    
    
    // Load each model sequentially
    loadModels();
    



}


// ******************************* WORKING ************************


// export function loadModel(viewer, urns) {
//     function onDocumentLoadSuccess(doc) {
//         // Load the model geometry
//         let viewables = doc.getRoot().getDefaultGeometry();

//         // Load the model and apply the placement transform
//         return viewer.loadDocumentNode(doc, viewables, {
//             globalOffset: { x: 0, y: 0, z: 0 },  // force all models to origin
//             placementTransform: (new THREE.Matrix4()).setPosition({ x: 0, y: 0, z: 0 })  // Force placement to origin
//         });
//     }

//     function onDocumentLoadFailure(code, message) {
//         console.error('Could not load model. See console for more details.', message);
//         alert('Could not load model. See console for more details.');
//     }

//     function loadModelSequentially(viewer, urns) {
//         if (!urns || urns.length === 0) return;

//         const loadDocument = (urn) => {
//             return new Promise((resolve, reject) => {
//                 Autodesk.Viewing.Document.load('urn:' + urn, (doc) => {
//                     onDocumentLoadSuccess(doc)
//                         .then(() => {
//                             console.log(`Loaded model with URN: ${urn}`);
//                             resolve();
//                         })
//                         .catch((error) => {
//                             console.error(`Error loading model: ${urn}`, error);
//                             reject(error);
//                         });
//                 }, onDocumentLoadFailure);
//             });
//         };

//         // Sequentially load the models one after another
//         urns.reduce((promise, urn) => {
//             return promise.then(() => loadDocument(urn));
//         }, Promise.resolve())
//             .then(() => {
//                 console.log("All models loaded successfully.");
//             })
//             .catch((error) => {
//                 console.error("Error loading models:", error);
//             });
//     }

//     // If no URNs are provided, use sample URNs for testing
//     const sampleUrns = [
//         { name: '3D - dsa3J29U', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmN1eTlfS1FpU3lhZHFVdTJhSV9Cc2c/dmVyc2lvbj0xMw' },
//         { name: 'SMY-DB8-SITE', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnNSZk9sS1BJVE1HM3pTZ0JvZUYzV3c/dmVyc2lvbj00' },
//         { name: 'SMY-DB8-xxx-SIT-R24', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg' }
//     ];

//     const modelsToLoad = urns.length > 0 ? urns : sampleUrns.map(model => model.urn); // Use provided URNs or fallback to sample URNs
//     console.log(modelsToLoad);

//     // Load models sequentially
//     loadModelSequentially(viewer, modelsToLoad);
// }


// export function loadModel(viewer, urns = null) {
//     function onDocumentLoadSuccess(doc) {
//         // Load the model geometry
//         viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry())
//             .then(() => {
//                 // Once the geometry is loaded, call surface shading setup
//                 viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function () {
//                     if (viewer.model) {
//                     }
//                 });
//             })
//             .catch((error) => {
//                 console.error("Error loading geometry:", error);
//             });
//     }
    

//     function onDocumentLoadFailure(code, message) {
//         alert('Could not load model. See console for more details.');
//         console.error(message);
//     }

//     // If no URNs are provided, use sample URNs for testing
//     const sampleUrns = [
//         { name: '3D - dsa3J29U', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmN1eTlfS1FpU3lhZHFVdTJhSV9Cc2c/dmVyc2lvbj0xMw', xform: {x:50,y:0,z:100} },
//         { name: 'SMY-DB8-xxx-SIT-R24', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnNSZk9sS1BJVE1HM3pTZ0JvZUYzV3c/dmVyc2lvbj00', xform: {x:50,y:0,z:-50} },
//         { name: 'SMY-DB8-xxx-SIT-R24', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg', xform: {x:50,y:0,z:-50} }

//         // { name: 'HG62 MEP', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnZGZ01YNjRUVDBDcWU4THhZa2RvVUE/dmVyc2lvbj0xNw' },
//         // { name: 'HG62 ARCHI', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLlV3aG1UYUU1UlEyMS0tbm1DUWQycEE/dmVyc2lvbj05OQ' }
//     ];

//     const modelsToLoad = sampleUrns; // Use provided URNs or fallback to sample URNs

//     // Loop through each model and load them
//     modelsToLoad.forEach((model) => {
//         console.log(`Loading model: ${model.name || "Unnamed"} with URN: ${model.urn}`);
//         Autodesk.Viewing.Document.load('urn:' + model.urn, onDocumentLoadSuccess, onDocumentLoadFailure);
//     });
// }














//                                WORKING
//added levels filter
// async function getAccessToken(callback) {
//     try {
//         const resp = await fetch('/api/auth/token');
//         if (!resp.ok)
//             throw new Error(await resp.text());
//         const { access_token, expires_in } = await resp.json();
//         callback(access_token, expires_in);
//     } catch (err) {
//         alert('Could not obtain access token. See the console for more details.');
//         console.error(err);        
//     }
// }

// export function initViewer(container) {
//     return new Promise(function (resolve, reject) {
//         Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, function () {
//             const config = {
//                 extensions: ['Autodesk.DocumentBrowser', 'Autodesk.AEC.LevelsExtension'] // Load custom extension here
//             };
//             const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
//             viewer.start();
//             viewer.setTheme('dark-theme');
//             resolve(viewer);
//         });
//     });
// }

// export function loadModel(viewer, urn) {
//     function onDocumentLoadSuccess(doc) {
//         viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry());
//     }
//     function onDocumentLoadFailure(code, message) {
//         alert('Could not load model. See console for more details.');
//         console.error(message);
//     }
//     Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
// }


// ******************************* WORKING ************************










