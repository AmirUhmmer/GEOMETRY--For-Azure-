import * as viewerFunctions from './ViewerFunctions/allModelLoaded.mjs';
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
        // console.log('Access Token Retrieved:', access_token);
        // console.log('Token Expires In:', expires_in);
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
                    // 'IconMarkupExtension',
                ]
            };
            const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);

            viewer.start();
            viewer.setTheme('dark-theme');
            viewer.setOptimizeNavigation(true)
            viewer.setQualityLevel(false, false);
            viewer.setGroundShadow(false);
            viewer.setGroundReflection(false);
            viewer.setProgressiveRendering(true);



            const canvas = viewer.impl.canvas;

            window.viewerInstance = viewer; // Store the viewer instance globally for access in other modules

            resolve(viewer);
        });
    });
}
// ******************************* WORKING ************************


export function loadModel(viewer, urns, hubId, projectId, folderId, ServiceZone, FunctionalLocation, model, RepeatingTask) {
    window.LiveData = model; // Store LiveData globally for access in other modules
    let modelsToLoad = urns;
    let modelAbbreviation = model;

    let modelsLoaded = 0; // Keep track of how many models have loaded

    // console.log(modelsToLoad);
    // keep it outside so it's remembered across calls
    let offset = null;

    // #region load options

    async function onDocumentLoadSuccess(doc) {
        let viewables = doc.getRoot().getDefaultGeometry();

        let loadOptions;
        if (modelsLoaded === 0) {
            loadOptions = {
                keepCurrentModels: true,
                applyRefPoint: true,
                skipHiddenFragments: true
            };
        } else {
            loadOptions = {
                keepCurrentModels: true,
                globalOffset: offset, // now it has the first model’s value
                applyRefPoint: true,
                skipHiddenFragments: true
            };
        }

        try {
            console.log("Loading model with options:", loadOptions);
            const model = await viewer.loadDocumentNode(doc, viewables, loadOptions);

            // save offset from the *first* model
            if (modelsLoaded === 0) {
                offset = model.getData().globalOffset || { x: 0, y: 0, z: 0 };
                console.log("Saved offset from first model:", offset);
            }

            modelsLoaded++;
            
            viewerFunctions.checkAllModelsLoaded(viewer, modelsLoaded, modelsToLoad, ServiceZone, FunctionalLocation, RepeatingTask);

        } catch (error) {
            console.error("Error loading model into viewer:", error);
            alert("Error loading model into viewer. See console for details.");
        }
    }
    // #endregion



    // Failure handler for loading models
    function onDocumentLoadFailure(code, message) {
        console.error("Failed to load model:", message);
        alert("Could not load model. See console for details.");
    }


    // Function to fetch the latest version URN of a file inside a folder
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
            if (latestVersionUrn === 'urn:adsk.wipemea:fs.file:vf.q8g1LE0vQ2WO5AHJ9Kd55A?version=3asda0') {
                latestVersionUrn = 'urn:adsk.wipemea:fs.file:vf.q8g1LE0vQ2WO5AHJ9Kd55A?version=20';
            } else if (latestVersionUrn === 'urn:adsk.wipemea:fs.file:vf.Oiuj-KZlQGWHcvIe4nDKKQ?version=73') {
                latestVersionUrn = 'urn:adsk.wipemea:fs.file:vf.Oiuj-KZlQGWHcvIe4nDKKQ?version=70';
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


