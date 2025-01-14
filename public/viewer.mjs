//push test
import { HEATMAP } from './DB8SurfaceShading.mjs';
import { SPRITES } from './DB8Sprites.mjs';
// import './extensions/LoggerExtension.mjs';
import './extensions/HistogramExtension.mjs';



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
            viewer.start();
            viewer.setTheme('dark-theme');


            const canvas = viewer.impl.canvas;

            // canvas.addEventListener('click', function (event) {
            //     // console.log("Canvas clicked:", event); // Log the event to ensure the click is firing
            
            //     const aggregateSelection = viewer.getAggregateSelection(); // Get selections from all loaded models
            //     // console.log("Aggregate selection:", aggregateSelection); // Log the aggregate selection
            
            //     if (aggregateSelection && aggregateSelection.length > 0) { // Check if aggregateSelection is defined and has items
            //         aggregateSelection.forEach(selection => {
            //             // console.log("Processing selection:", selection); // Log the selection details
            
            //             const model = selection.model;           // Get the selected model
            //             // console.log("Model:", model);            // Log the model
            
            //             const dbIdArray = selection.selection;   // Get the selected object IDs from the selection array
            //             // console.log("dbIdArray:", dbIdArray);    // Log the dbIdArray
            
            //             if (dbIdArray && dbIdArray.length > 0) { // Ensure dbIdArray is defined and has objects
            //                 const dbId = dbIdArray[0];           // Assume the first selected object for demonstration
            //                 console.log("Selected dbId:", dbId); // Log the selected dbId
            
            //                 const instanceTree = model.getInstanceTree();
            //                 // console.log("InstanceTree:", instanceTree); // Log the instance tree to ensure it's available
            
            //                 if (instanceTree) {
            //                     instanceTree.enumNodeFragments(dbId, (fragId) => {
            //                         const fragList = model.getFragmentList();    // Use the correct model's fragment list
            //                         const matrix = new THREE.Matrix4();
            //                         fragList.getWorldMatrix(fragId, matrix);
            
            //                         const position = new THREE.Vector3();
            //                         position.setFromMatrixPosition(matrix);
            
            //                         console.log(`World Coordinates (Model ${model.id}): x=${position.x}, y=${position.y}, z=${position.z}`);
            //                     });
            //                 } else {
            //                     console.log("InstanceTree not available for model:", model);
            //                 }
            //             } else {
            //                 console.log("No objects selected in dbIdArray.");
            //             }
            //         });
            //     } else {
            //         console.log('No objects selected or aggregate selection is undefined.');
            //     }
            // });
            
            
            

            // canvas.addEventListener('dblclick', function (event) {
            //     event.preventDefault(); // Prevents default zoom on double-click
            
            //     const selectedItems = viewer.getSelection();
            //     if (selectedItems.length > 0) {
            //         const dbid = selectedItems[0];
            //         console.log("DOUBLE CLICK -- Selected DBID:", dbid);
            
            //         // Retrieve properties using the DBID
            //         viewer.getProperties(dbid, function(props) {
            //             // Find the GlobalID property
            //             let globalID = null;
            //             props.properties.forEach(function(prop) {
            //                 if (prop.displayName === "Asset ID") {
            //                     globalID = prop.displayValue;
            //                 }
            //             });
            
            //             if (globalID) {
            //                 // Construct the URL using the GlobalID retrieved from the properties
            //                 var newUrl = "https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=msdyn_customerasset&id=" + globalID;
            //                 console.log("New URL:", newUrl);
            
            //                 // Open the URL in a new tab
            //                 window.open(newUrl, '_blank');
            //             } else {
            //                 console.log("GlobalID not found.");
            //             }
            //         });
            //     }
            // });


            // Double-click event handler with aggregate selection support
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
                                props.properties.forEach(function (prop) {
                                    if (prop.displayName === "Asset ID") {
                                        globalID = prop.displayValue;
                                    }
                                });

                                if (globalID) {
                                    // Construct the URL using the GlobalID retrieved from the properties
                                    const newUrl = "https://org47a0b99a.crm4.dynamics.com/main.aspx?appid=b86bd27b-2e83-ec11-8d21-000d3a64cba3&pagetype=entityrecord&etn=msdyn_customerasset&id=" + globalID;
                                    console.log("New URL:", newUrl);

                                    // Open the URL in a new tab
                                    window.open(newUrl, '_blank');
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


// DB8

// {3D - dsa3J29U}
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmN1eTlfS1FpU3lhZHFVdTJhSV9Cc2c/dmVyc2lvbj0xMw
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmN1eTlfS1FpU3lhZHFVdTJhSV9Cc2c/dmVyc2lvbj0xMg     --Without archi
// SMY-DB8-SITE
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnNSZk9sS1BJVE1HM3pTZ0JvZUYzV3c/dmVyc2lvbj00   -- Site
// SMY-DB8-ARCHI
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg


// HG62
// MEP
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnZGZ01YNjRUVDBDcWU4THhZa2RvVUE/dmVyc2lvbj0xNw --old
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnZGZ01YNjRUVDBDcWU4THhZa2RvVUE/dmVyc2lvbj0yMA --new
// ARCHI
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLlV3aG1UYUU1UlEyMS0tbm1DUWQycEE/dmVyc2lvbj05OQ --old
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLlV3aG1UYUU1UlEyMS0tbm1DUWQycEE/dmVyc2lvbj0xMDc --new


// SOL10
// MEP
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnE4ZzFMRTB2UTJXTzVBSEo5S2Q1NUE/dmVyc2lvbj04
// ARCHI
// dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmdzMFBSQjNlUlVTNkFOTEswOXZEWUE/dmVyc2lvbj0xOQ



// ******************************* WORKING ************************


export function loadModel(viewer, urns, hubId, projectId, folderId, BIM) {
    const loadOptions = {
        globalOffset: { x: 0, y: 0, z: 0 },  // force all models to origin
        placementTransform: (new THREE.Matrix4()).setPosition({ x: 0, y: 0, z: 0 }),  // Force placement to origin
        keepCurrentModels: true // Keeps existing models in the viewer
    };

    let modelsToLoad = urns;

    // Track the number of models to load and the count of successfully loaded models
    // let modelsToLoad = urns.length ? urns : [
    //     { name: '3D - dsa3J29U', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmN1eTlfS1FpU3lhZHFVdTJhSV9Cc2c/dmVyc2lvbj0xMw' },
    //     { name: 'SMY-DB8-SITE', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnNSZk9sS1BJVE1HM3pTZ0JvZUYzV3c/dmVyc2lvbj00' },
    //     { name: 'SMY-DB8-xxx-SIT-R24', urn: 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg' }
    // ];

    let modelsLoaded = 0; // Keep track of how many models have loaded

    console.log(modelsToLoad);

    function checkAllModelsLoaded() {
        console.log("CHECK: " + modelsLoaded);

        if (modelsLoaded === modelsToLoad.length) {
            console.log("All models have been loaded.");
            const models = viewer.impl.modelQueue().getModels();
            console.log(models);
            // Perform actions only when all models are loaded
            if (viewer.model) {
                viewer.loadExtension('Autodesk.DataVisualization').then(() => {
                    console.log('Autodesk.DataVisualization loaded.');
                });
    
                viewer.loadExtension('HistogramExtension').then(() => {
                    console.log('HistogramExtension loaded.');
                });

                viewer.loadExtension('Autodesk.DocumentBrowser').then(() => {
                    console.log('Autodesk.DocumentBrowser loaded.');
                });
    
                viewer.loadExtension('Autodesk.AEC.LevelsExtension').then((levelsExt) => {
                    console.log('Autodesk.AEC.LevelsExtension loaded.');
                });
                
                console.log("Geometry loaded.");
                // Call surface shading setup or any other actions here
                viewer.loadExtension('Autodesk.AEC.LevelsExtension').then(function(levelsExt) {
                    levelsExt.floorSelector.addEventListener(Autodesk.AEC.FloorSelector.SELECTED_FLOOR_CHANGED, function(event) {
                        // const selectedFloorName = event.floor.name;
                        // console.log(event);
                        const selectedLevelIndex = event.levelIndex; // Get the level index from the event
                        console.log(`Selected Floor: ${selectedLevelIndex}`);
    
    
                        // Check if the loaded model is named "DB8"
                        // const modelName = viewer.model.getDocumentNode().data.name;
                        // console.log(modelName);
                        // if (modelName === 'DB8-SEMY-ARST-ASBUILT' && selectedLevelIndex !== undefined) {
                        //     HEATMAP(viewer, selectedLevelIndex); // Call HEATMAP only if the model name is DB8
                        //     SPRITES(viewer, selectedLevelIndex); // SPRITES will be called
                        // }



                        // Check if the loaded model is named "DB8"
                        let LiveData = localStorage.getItem('LiveData');
                        console.log(LiveData);
                        if (LiveData === 'DB8' && selectedLevelIndex !== undefined) {
                            // HEATMAP(viewer, selectedLevelIndex); // Call HEATMAP only if the model name is DB8
                            // SPRITES(viewer, selectedLevelIndex); // SPRITES will be called
                        }
                        else if (LiveData === 'NOT YET LIVE' && selectedLevelIndex === undefined) {
                            SPRITES(viewer, selectedLevelIndex); // SPRITES will be called
                        }
                    });
    
                    // Optionally, you can set a default floor after loading the extension
                    // levelsExt.floorSelector.selectFloor(0, true); // Replace 0 with the default floor index if needed
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

                let HardAsset = localStorage.getItem('HardAssetChecker');

                console.log(HardAsset);

                // Assuming this is part of your search function when Hard Asset is selected
                if (HardAsset === 'Hard Asset') {

                    let assetValue = localStorage.getItem('ASSET');
                    console.log('SEARCHED:' + assetValue);

                    // First, get the models from the viewer
                    const models = viewer.impl.modelQueue().getModels();

                    // Ensure models are loaded before proceeding
                    if (models && models.length > 0 && assetValue) {

                        // Perform the search within the loaded models
                        viewer.search(assetValue, function(dbIDs) {

                            // If no objects are found, handle it gracefully
                            if (!dbIDs || dbIDs.length === 0) {
                                console.log('No matching objects found for: ' + assetValue);
                                return;
                            }

                            // Loop through the models only once
                            models.forEach(model => {
                                // Hide all objects first
                                viewer.isolate([], model);

                                // Isolate the found objects
                                viewer.isolate(dbIDs, model);
                            });

                            // Fit to view and highlight the found objects
                            viewer.fitToView(dbIDs);
                            let color = '';
                            if(BIM === 'false') {
                                color = new THREE.Vector4(1, 0, 0, 1);  // Red color with full intensity (RGBA)
                                viewer.setSelectionColor(new THREE.Color(1, 0, 0));  // RGB: red, green, blue
                            }
                            else if(BIM === 'true') {
                                color = new THREE.Vector4(0, 1, 0, 1);  // Red color with full intensity (RGBA)
                                viewer.setSelectionColor(new THREE.Color(0, 1, 0));  // RGB: red, green, blue
                            }

                            // const color = new THREE.Vector4(1, 0, 0, 1);  // Red color with full intensity (RGBA)
                            viewer.setThemingColor(dbIDs, color);  // Optionally highlight the objects
   
                            
                            viewer.select(dbIDs);  // Optionally highlight the objects
                
                            // Disable further selections after this point
                            
                        }, function(error) {
                            console.error('Search error:', error);  // Handle any potential search errors
                        });
                    } else {
                        console.warn('No models loaded or invalid asset value.');
                    }

                }
                




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
        console.log("Model loaded successfully:", doc);
        
        let viewables = doc.getRoot().getDefaultGeometry();

        try {
            // Load the document node and aggregate models in the viewer
            const node = await viewer.loadDocumentNode(doc, viewables, loadOptions);
            console.log("Model node loaded into viewer:", node);

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

    // // Async function to load all models
    // async function loadModels() {
    //     for (let model of modelsToLoad) {
    //         // Base64 encode the URN if it's not encoded already
    //         const base64Urn = btoa(model);

    //         console.log(`Attempting to load model with URN: urn:${base64Urn}`);
            
    //         // Load the model document and wait for the load to complete before moving to the next
    //         await new Promise((resolve, reject) => {
    //             Autodesk.Viewing.Document.load(
    //                 'urn:' + base64Urn, 
    //                 async (doc) => {
    //                     // Load and aggregate each model without replacing the previous one
    //                     await onDocumentLoadSuccess(doc).then(resolve).catch(reject);
    //                 }, 
    //                 onDocumentLoadFailure
    //             );
    //         });
    //     }
    // }

    // // Load each model sequentially
    // loadModels();


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
            const latestVersionUrn = latestVersion.id;  // This will be the URN for the latest version
            console.log('Latest Version URN:', latestVersionUrn);
            const base64Urn = btoa(latestVersionUrn);  // This encodes the URN to base64
            // console.log('Base64 URN:', base64Urn);
            return base64Urn;
        } else {
            console.error('No versions found for the file.');
        }

    }

    // Function to load all models with their latest versions
    async function loadModels() {
        const updatedModelsToLoad = [];
        
        // Fetch the latest URNs for all base URNs
        for (let baseUrn of modelsToLoad) {
            try {
                const latestUrn = await fetchLatestUrn(hubId, projectId, folderId, baseUrn); // Fetch latest version URN
                updatedModelsToLoad.push(latestUrn); // Add latest version URN to the array
            } catch (error) {
                console.error(`Failed to fetch latest URN for ${baseUrn}:`, error);
                alert(`Could not fetch latest URN for ${baseUrn}. See console for details.`);
            }
        }

        // Now load the models with the latest URNs
        for (let modelUrn of updatedModelsToLoad) {
            console.log(`Attempting to load model with URN: urn:${modelUrn}`);

            // Load the model document and wait for the load to complete before moving to the next
            await new Promise((resolve, reject) => {
                Autodesk.Viewing.Document.load(
                    'urn:' + modelUrn,
                    async (doc) => {
                        // Success handler: model loaded successfully
                        await onDocumentLoadSuccess(doc).then(resolve).catch(reject);
                    },
                    onDocumentLoadFailure  // Failure handler
                );
            });
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










