// import { initViewer, loadModel } from './viewer.mjs';
// import { initTree } from './sidebar.mjs';


// const login = document.getElementById('login');

// try {
//     // const resp = await fetch('/api/auth/profile');

//     const authToken = localStorage.getItem('authToken');
//     const refreshToken = localStorage.getItem('refreshToken');
//     const expires_at = localStorage.getItem('expires_at');
//     const internal_token = localStorage.getItem('internal_token');

//     console.log(expires_at);

//     const resp = await fetch('/api/auth/profile', {
//         headers: {
//             'Authorization': `Bearer ${authToken}`,  // Send authToken in the Authorization header
//             'x-refresh-token': refreshToken,         // Send refreshToken in a custom header
//             'x-expires-at': expires_at,              // Send expires_at in a custom header
//             'x-internal-token': internal_token       // Send internal_token in a custom header
//         }
//     });


//     if (resp.ok) {
//         const user = await resp.json();
//         login.innerText = `Logout (${user.name})`;
//         login.onclick = () => {
//             // Logout logic
//             localStorage.removeItem('authToken');
//             window.location.reload();  // Reload the page after logout
//         };


//         // retrieve query parameters from the URL
//         let params = {};
//         let queryString = window.location.search.substring(1);
//         let queryParts = queryString.split("&");
//         for (let i = 0; i < queryParts.length; i++) {
//             let param = queryParts[i].split("=");
//             params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
//         }

//         // get the entity name and record ID
        
//         let entityType = params["typename"];  // The entity type name (e.g., iotdatapoint)
//         let recordId = params["id"];     // The unique identifier (GUID) of the record

//         // Log the full URL to the console
//         let fullURL = window.location.href;
//         console.log("Full URL:", fullURL); // This will log the full URL, e.g., http://localhost:8080/index.html?etn=iotdatapoint&id=12345678-1234-1234-1234-123456789abc


//         // Now you can use `entityType` and `recordId` in your web app logic
//         console.log("Entity Type:", entityType);
//         console.log("Record ID:", recordId);



//         // Initialize the viewer and sidebar
//         const viewer = await initViewer(document.getElementById('preview'));

//         // initTree('#tree', (id) => loadModel(viewer, window.btoa(id).replace(/=/g, '')));


//         // Mapping of recordId to geometry URN values
//         const geometryMap = {
//             //DB8
//             '2e85182d-a8b7-ef11-b8e8-7c1e5275e0ca': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg',

//             //HG62
//             '766fb31a-a8b7-ef11-b8e8-7c1e5275e0ca': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLlV3aG1UYUU1UlEyMS0tbm1DUWQycEE/dmVyc2lvbj04NQ',

//             //SOL10
//             'f8c64108-adb7-ef11-b8e8-7c1e5275e0ca': 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmdzMFBSQjNlUlVTNkFOTEswOXZEWUE/dmVyc2lvbj0xOQ'

//         };

//         // Default geometry if no match is found
//         let geometry = geometryMap[recordId] || 'dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg';


//         // Initialize the tree and handle model loading
//         initTree('#tree', (id) => {
//             // If no ID is provided, use the sample URN
//             console.log(id);
//             const urn = id !== 0 ? window.btoa(id).replace(/=/g, '') : geometry;
//             loadModel(viewer, urn);
//         });

//     } else {
//         login.innerText = 'Login';
//         login.onclick = () => {
//             const loginWindow = window.open('/api/auth/login', 'Login', 'width=600,height=600');
        
//             window.addEventListener('message', (event) => {
//                 if (event.origin !== window.location.origin) {
//                     return;  // Ignore messages from other origins
//                 }
                
//                 const { token, refreshToken, expires_at, internal_token } = event.data;
//                 if (token) {
//                     localStorage.setItem('authToken', token);  
//                     localStorage.setItem('refreshToken', refreshToken); 
//                     localStorage.setItem('expires_at', expires_at); 
//                     localStorage.setItem('internal_token', internal_token); 

//                     window.location.reload();  // Reload the page to load viewer with token

//                     console.log(token);
//                 }
//             });
//         };
//     }
//     console.log(resp);
//     login.style.visibility = 'visible';
// } catch (err) {
//     alert('Could not initialize the application. See console for more details.');
//     console.error(err);
// }


// ENABLE TOP CODE TO VIEW THE SIDEBAR MAIN.MJS, AUTH/TOKEN, AUTH/PROFILE


import { initViewer, loadModel } from './viewer.mjs';
import { initTree } from './sidebar.mjs';

const login = document.getElementById('login');

// Function to fetch access token using Client Credentials from your server
export async function fetchAccessToken() {
    try {
        const response = await fetch('/api/auth/token');  // Fetch the token from the server-side endpoint
        if (!response.ok) {
            throw new Error('Failed to get access token');
        }
        const data = await response.json();
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        localStorage.setItem('expires_at', Date.now() + data.expires_in * 1000); // Store expiry time in milliseconds
        localStorage.setItem('internal_token', data.internal_token);

        return data.access_token;  // Return the access token
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

// Function to check if the token is still valid
function isTokenExpired() {
    const expires_at = localStorage.getItem('expires_at');
    return !expires_at || Date.now() >= parseInt(expires_at, 10);
}

async function initApp() {
    try {
        let authToken = localStorage.getItem('authToken');
        let refreshToken = localStorage.getItem('refreshToken');
        let expires_at = localStorage.getItem('expires_at');
        let internal_token = localStorage.getItem('internal_token');

        // console.log(authToken);
        // console.log(refreshToken);
        // console.log(expires_at);
        // console.log(internal_token);

        // If the token is expired or not present, fetch a new one
        if (!authToken || isTokenExpired()) {
            console.log('Fetching new access token...');
            authToken = await fetchAccessToken();  // Get a new token if expired
        }

        // Fetch user profile using the access token
        const resp = await fetch('/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${authToken}`,  // Send authToken in the Authorization header
                'x-refresh-token': refreshToken,         // Send refreshToken in a custom header
                'x-expires-at': expires_at,              // Send expires_at in a custom header
                'x-internal-token': internal_token       // Send internal_token in a custom header
            }
        });

        if (resp.ok) {
            const user = await resp.json();
            login.innerText = `Logout`;
            login.style.visibility = 'hidden'; //test
            login.onclick = () => {
                // Logout logic
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('expires_at');
                localStorage.removeItem('internal_token');
                window.location.reload();  // Reload the page after logout
            };

            // retrieve query parameters from the URL
            let params = {};
            let queryString = window.location.search.substring(1);
            let queryParts = queryString.split("&");
            for (let i = 0; i < queryParts.length; i++) {
                let param = queryParts[i].split("=");
                params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
            }

            // get the entity name and record ID
            
            let entityType = params["typename"];  // The entity type name (e.g., iotdatapoint)
            let recordId = params["id"];     // The unique identifier (GUID) of the record
            let property = params["property"];  // The property value, if it exists
            let uniqueID = params["uniqueID"];  // The uniqueID, if it exists
            let ServiceZone = params["SZ"];  // The uniqueID, if it exists
            let FunctionalLocation = params["FL"];  // The uniqueID, if it exists

            if (uniqueID) {
                localStorage.setItem('uniqueID', uniqueID);
                console.log("uniqueID stored in localStorage:", uniqueID);
            } else {
                console.log("uniqueID not found in URL");
            }

            if (property) {
                property = decodeURIComponent(property); // Decode the URL encoded property value
                console.log("Decoded Property:", property);  // Logs the decoded property value
            }
            
            // Log the full URL to the console
            let fullURL = window.location.href;
            console.log("Full URL:", fullURL); // This will log the full URL, e.g., http://localhost:8080/index.html?etn=iotdatapoint&id=12345678-1234-1234-1234-123456789abc


            // Now you can use `entityType` and `recordId` in your web app logic
            console.log("Entity Type:", entityType);
            console.log("Record ID:", recordId);


            // Initialize the viewer and sidebar
            const viewer = await initViewer(document.getElementById('preview'));

            // initTree('#tree', (id) => loadModel(viewer, window.btoa(id).replace(/=/g, '')));


            // Mapping of recordId to geometry URN values
            const geometryMapById = {
                // DB8
                // ARCHI
                // dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLnhkWFJlcVYwVDFhem9XdWVFaVNuemc/dmVyc2lvbj0xNg
                // MEP
                // dXJuOmFkc2sud2lwZW1lYTpmcy5maWxlOnZmLmN1eTlfS1FpU3lhZHFVdTJhSV9Cc2c/dmVyc2lvbj0xMg


                '2e85182d-a8b7-ef11-b8e8-7c1e5275e0ca': ['urn:adsk.wipemea:dm.lineage:xdXReqV0T1azoWueEiSnzg', // archi
                                                         'urn:adsk.wipemea:dm.lineage:cuy9_KQiSyadqUu2aI_Bsg', // mep
                                                         'urn:adsk.wipemea:dm.lineage:sRfOlKPITMG3zSgBoeF3Ww' // site
                                                        ],

                // DB8 for Production
                '06eddd02-c366-ef11-bfe2-000d3ab1d1c2': ['urn:adsk.wipemea:dm.lineage:xdXReqV0T1azoWueEiSnzg', // archi
                                                         'urn:adsk.wipemea:dm.lineage:cuy9_KQiSyadqUu2aI_Bsg', // mep
                                                         'urn:adsk.wipemea:dm.lineage:sRfOlKPITMG3zSgBoeF3Ww' // site
                                                        ],
                
                // HG62
                '766fb31a-a8b7-ef11-b8e8-7c1e5275e0ca': ['urn:adsk.wipemea:dm.lineage:vFgMX64TT0Cqe8LxYkdoUA', //mep
                                                         'urn:adsk.wipemea:dm.lineage:UwhmTaE5RQ21--nmCQd2pA' //archi
                                                        ],

                // HG62 for Production
                '422be7c5-ef69-ef11-bfe2-000d3a6735d4': ['urn:adsk.wipemea:dm.lineage:vFgMX64TT0Cqe8LxYkdoUA', //mep
                                                        'urn:adsk.wipemea:dm.lineage:UwhmTaE5RQ21--nmCQd2pA' //archi
                                                        ],
                
                // SOL10
                'f8c64108-adb7-ef11-b8e8-7c1e5275e0ca': ['urn:adsk.wipemea:dm.lineage:gs0PRB3eRUS6ANLK09vDYA', //archi
                                                         'urn:adsk.wipemea:dm.lineage:q8g1LE0vQ2WO5AHJ9Kd55A', //mep
                                                        ],


                // SOL10 for Production
                '10ff2730-d365-ef11-bfe3-6045bddd062a': ['urn:adsk.wipemea:dm.lineage:gs0PRB3eRUS6ANLK09vDYA', //archi
                                                         'urn:adsk.wipemea:dm.lineage:q8g1LE0vQ2WO5AHJ9Kd55A', //mep
                                                        ],
                                                    

                 // JV3 for Production                                        
                '92e191ec-cb66-ef11-bfe2-000d3ab1d1c2': ['urn:adsk.wipemea:dm.lineage:U9tz-MHvQfS2Hg9gRITkdA', //MEP
                                                         'urn:adsk.wipemea:dm.lineage:Ty5wLZ92TqCHkIn80Mmipg', //COMMON AREAS
                                                         'urn:adsk.wipemea:dm.lineage:VLzD-rrOS9SQvV6rnJT7LA', //ARCHI
                                                        ]

            };

            // HARD ASSET CONDITIONS
            // Mapping of property value to geometry URN values
            const geometryMapByProperty = {
                // DB8
                'Drengsrudbekken 8 AS': [
                                         'urn:adsk.wipemea:dm.lineage:cuy9_KQiSyadqUu2aI_Bsg', // mep
                                         'urn:adsk.wipemea:dm.lineage:xdXReqV0T1azoWueEiSnzg', // archi
                                         'urn:adsk.wipemea:dm.lineage:sRfOlKPITMG3zSgBoeF3Ww' // site
                                        ],

                // HG62
                'Helgesensgate 62': ['urn:adsk.wipemea:dm.lineage:vFgMX64TT0Cqe8LxYkdoUA', //mep
                                    'urn:adsk.wipemea:dm.lineage:UwhmTaE5RQ21--nmCQd2pA' //archi
                                    ],

                // SOL10
                'Solbråveien 10 AS': ['urn:adsk.wipemea:dm.lineage:q8g1LE0vQ2WO5AHJ9Kd55A', //mep
                                      'urn:adsk.wipemea:dm.lineage:gs0PRB3eRUS6ANLK09vDYA', //archi
                                    //   'urn:adsk.wipemea:dm.lineage:q8g1LE0vQ2WO5AHJ9Kd55A' //mep
                                     ]
            };

            // Default geometry if no match is found
            const defaultGeometry = [
                //  DB8
                'urn:adsk.wipemea:dm.lineage:xdXReqV0T1azoWueEiSnzg', // archi
                'urn:adsk.wipemea:dm.lineage:cuy9_KQiSyadqUu2aI_Bsg', // mep
                // 'urn:adsk.wipemea:dm.lineage:xdXReqV0T1azoWueEiSnzg', // archi
                'urn:adsk.wipemea:dm.lineage:sRfOlKPITMG3zSgBoeF3Ww' // site
            ];

            // Attempt to find geometry based on recordId
            let geometry = geometryMapById[recordId];

            // Project and folder IDs based on recordId or property
            const projectMap = {
                // DB8
                '06eddd02-c366-ef11-bfe2-000d3ab1d1c2': { projectId: 'b.bf8f603c-7e37-4367-9900-69e279377191', folderId: 'urn:adsk.wipemea:fs.folder:co.fMNGzoIyQyiq5KhAEpvDHw', hardAsset: 'No Hard Asset', liveData: 'DB8' }, // liveData: 'DB8',
                '2e85182d-a8b7-ef11-b8e8-7c1e5275e0ca': { projectId: 'b.bf8f603c-7e37-4367-9900-69e279377191', folderId: 'urn:adsk.wipemea:fs.folder:co.fMNGzoIyQyiq5KhAEpvDHw', hardAsset: 'No Hard Asset', liveData: 'DB8' }, // liveData: 'DB8',
                // HG62
                '766fb31a-a8b7-ef11-b8e8-7c1e5275e0ca': { projectId: 'b.552de2d1-bc00-41a4-8d90-ec063d64a4c6', hardAsset: 'No Hard Asset' },
                '422be7c5-ef69-ef11-bfe2-000d3a6735d4': { projectId: 'b.552de2d1-bc00-41a4-8d90-ec063d64a4c6', hardAsset: 'No Hard Asset' },
                // SOL10
                'f8c64108-adb7-ef11-b8e8-7c1e5275e0ca': { projectId: 'b.e4cde0c5-7fd9-4974-9832-616f058478f9', hardAsset: 'No Hard Asset' },
                '10ff2730-d365-ef11-bfe3-6045bddd062a': { projectId: 'b.e4cde0c5-7fd9-4974-9832-616f058478f9', hardAsset: 'No Hard Asset' },
                // JV3
                '92e191ec-cb66-ef11-bfe2-000d3ab1d1c2': { projectId: 'b.bca6a4c5-fbd8-4dcb-a637-b3713a06cc8d', hardAsset: 'No Hard Asset' },
                // '10ff2730-d365-ef11-bfe3-6045bddd062a': { projectId: 'b.bca6a4c5-fbd8-4dcb-a637-b3713a06cc8d', hardAsset: 'No Hard Asset' },
            };

            const propertyMap = {
                'Drengsrudbekken 8 AS': 'b.bf8f603c-7e37-4367-9900-69e279377191',
                'Helgesensgate 62': 'b.552de2d1-bc00-41a4-8d90-ec063d64a4c6',
                'Solbråveien 10 AS': 'b.e4cde0c5-7fd9-4974-9832-616f058478f9'
            };

            let projectId = '';
            let folderId = '';
            let hardAsset = 'Hard Asset';
            let liveData = '';

            if (projectMap[recordId]) {
                ({ projectId, folderId = '', liveData = '', hardAsset } = projectMap[recordId]);
                localStorage.setItem('LiveData', liveData);
            } else if (propertyMap[property]) {
                projectId = propertyMap[property];
                localStorage.setItem('LiveData', liveData);
            }

            if (!geometry && property) {
                geometry = geometryMapByProperty[property];
                localStorage.setItem('ASSET', uniqueID);
                localStorage.setItem('LiveData', liveData);
            }

            if (!geometry) {
                geometry = defaultGeometry;
                projectId = 'b.bf8f603c-7e37-4367-9900-69e279377191';
                folderId = 'urn:adsk.wipemea:fs.folder:co.fMNGzoIyQyiq5KhAEpvDHw';
                liveData = 'DB8';
                hardAsset = 'No Hard Asset';
                localStorage.setItem('LiveData', liveData);
                localStorage.removeItem('ASSET');
            }

            // if(ServiceZone){
            //     hardAsset = 'No Hard Asset';
            // }
            // Final localStorage updates
            localStorage.setItem('HardAssetChecker', hardAsset);



            // Initialize the tree and handle model loading
            let hubId = 'b.7a656dca-000a-494b-9333-d9012c464554';  // Hub ID
            ServiceZone = ServiceZone || 'No Service Zone';
            FunctionalLocation = FunctionalLocation || 'No Functional Location';
            initTree('#tree', (id) => {
                // If no ID is provided, use the sample URN
                console.log(id);
                const urn = id !== 0 ? window.btoa(id).replace(/=/g, '') : geometry;
                loadModel(viewer, urn, hubId, projectId, folderId, ServiceZone, FunctionalLocation);
            });

        } else {
            login.style.visibility = 'hidden'; //test
            throw new Error('Failed to authenticate');
        }

        console.log(resp);
        login.style.visibility = 'hidden'; //test
        // login.style.visibility = 'visible';
    } catch (err) {
        alert('Could not initialize the application. See console for more details.');
        console.error(err);
    }
}

// Initialize the app
initApp();