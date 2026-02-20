const express = require('express');
const Axios = require('axios');
const cors = require('cors'); // Import CORS
const router = express.Router();   

// const bodyParser = require('body-parser');
const { getAuthorizationUrl, authCallbackMiddleware, authRefreshMiddleware, getUserProfile } = require('../services/aps.js');
const { APS_CLIENT_ID, APS_CLIENT_SECRET } = require('../config.js');

var scopes = 'data:read data:write';
const querystring = require('querystring');

const sql = require('mssql');

//
// Azure SQL configuration
const config = {
    user: 'sqlserverdb8_admin',
    password: 'jCz91%z%FlS7',
    server: 'sqlserverdb8.database.windows.net',
    database: 'SQLDB_DB8',
    options: {
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true, // Change to false in production for a secure setup
    },
    pool: {
        max: 10, // Maximum number of connections in the pool
        min: 0,  // Minimum number of connections in the pool
        idleTimeoutMillis: 30000 // Close idle connections after 30 seconds
    },
    requestTimeout: 60000,  // Increase request timeout to 60 seconds
    connectionTimeout: 30000  // Increase connection timeout to 30 seconds
};

//let router = express.Router();

// Enable CORS with specific origin (your Dynamics URL)
router.use(cors());


router.get('/api/auth/login', function (req, res) {
    res.redirect(getAuthorizationUrl());
});

router.get('/api/auth/logout', function (req, res) {
    req.session = null;
    res.redirect('/');
});


router.get('/api/auth/callback', authCallbackMiddleware, (req, res) => {
    const publicToken = req.session.public_token;
    const refreshToken = req.session.refresh_token;
    const expires_at = req.session.expires_at;
    const internal_token = req.session.internal_token;

     // window.opener.postMessage({ token: '${publicToken}' }, window.location.origin);

    res.send(`
        <script>
            if (window.opener) {
                // Send the token back to the parent window
               
                window.opener.postMessage({ token: '${publicToken}', refreshToken: '${refreshToken}', expires_at: '${expires_at}', internal_token: '${internal_token}' }, window.location.origin);

                window.close();  // Close the popup
            }
        </script>
    `);
});


// router.get('/api/auth/token', authRefreshMiddleware, function (req, res) {
//     res.json(req.publicOAuthToken);
// });


// 'Authorization': `Basic SERuVXlvcDFCcjZoS2dGa1BGTWZka3JOY1k4MTFpTTc1OUJFQ2hwWWtmZVVaM3JyOkJoRzdNaG1FMjdka1RuY3ZiRjFGOFlMd09wRllxT3I0aTN2ak9zUWpwVVplUGkzdnBhMW1VcTNHNlgwdjdLUHA=`,

// ENABLE TOP CODE TO VIEW THE SIDEBAR MAIN.MJS, AUTH/TOKEN, AUTH/PROFILE

router.get('/api/auth/token', async (req, res) => {
    try {
        const response = await Axios({
            method: 'POST',
            url: 'https://developer.api.autodesk.com/authentication/v2/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                // 'Accept': 'application/json',
                'x-user-id': '3a15881a-370e-4d72-80f7-8701c4b1806c'
            },
            data: querystring.stringify({
                client_id: APS_CLIENT_ID,
                client_secret: APS_CLIENT_SECRET,
                grant_type: 'client_credentials',
                scope: 'data:read data:write account:read viewables:read',
            })
        });

        if (response.status === 200 && response.data.access_token) {
            res.json({
                access_token: response.data.access_token,
                refresh_token: response.data.access_token,
                expires_in: response.data.expires_in,
                internal_token: response.data.access_token
            });
        } else {
            console.error('Authentication failed, invalid response:', response.data);
            res.status(400).json({ error: 'Failed to authenticate: Invalid response from API' });
        }

    } catch (error) {
        // Log detailed error for debugging
        console.error('Error during authentication:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to authenticate', details: error.response?.data || error.message });
    }
});


// router.get('/api/auth/profile', async function (req, res, next) {
//     try {
//         const authToken = req.headers.authorization?.split(' ')[1]; // Extract token from headers
//         const profile = await getUserProfile(authToken);
//         res.json({ name: `${profile.name}` });
//     } catch (err) {
//         next('ERROR: ' + err);
//     }
// });


// ENABLE TOP CODE TO VIEW THE SIDEBAR MAIN.MJS, AUTH/TOKEN, AUTH/PROFILE

router.get('/api/auth/profile', async function (req, res, next) {
    try {
        const authToken = req.headers.authorization?.split(' ')[1]; // Extract token from headers
        // const profile = await getUserProfile(authToken);
        // res.json({ name: `${profile.name}` });
        res.json({ name: authToken });
    } catch (err) {
        next('ERROR: ' + err);
    }
});


// Create a connection pool (this will be reused for all requests)
let poolPromise;

async function getPool() {
    if (!poolPromise) {
        // Create the pool only once on the first request
        poolPromise = sql.connect(config);
    }
    return poolPromise;
}




// --------------------------------------------------------------------------- LIVE DATA ---------------------------------------------------------------------------
//* TEMP SENSOR
//#region TEMP SENSOR
// Route to retrieve sensor value
router.get('/api/sensor/:location', async (req, res) => {
    const location = req.params.location;
    try {
        // Get the connection pool
        const pool = await getPool();

        // Query the database
        const result = await pool.request()
            .input('location', sql.VarChar, location)
            .query('SELECT TOP (1) [value], [observationTime] FROM [dbo].[LiveData] WHERE sensorId = @location ORDER BY observationTime DESC');

        if (result.recordset.length > 0) {
            res.json({ value: result.recordset[0].value });
        } else {
            res.status(404).send('Sensor not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving sensor value');
    }
});
// #endregion

//! TEMPERATURE SENSOR V2 [HG62]
// #region TEMPERATURE SENSOR V2 [HG62]
router.get('/api/sensorv2/:location', async (req, res) => {
    const location = req.params.location;
    try {
        // Get the connection pool
        const pool = await getPool();

        // Query the database
        const result = await pool.request()
            .input('location', sql.VarChar, location)
            .query('SELECT TOP (1) [value], [observationTime] FROM [dbo].[LiveData] WHERE deviceId = @location ORDER BY observationTime DESC');

        if (result.recordset.length > 0) {
            res.json({ value: result.recordset[0].value });
        } else {
            res.status(404).send('Sensor not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving sensor value');
    }
});
// #endregion

//* LIGHT SENSOR
//#region LIGHT SENSOR
router.get('/api/LightSensor/:location', async (req, res) => {
    const location = req.params.location;
    try {
        // Get the connection pool
        const pool = await getPool();

        // Query the database
        const result = await pool.request()
            .input('location', sql.VarChar, location)
            .query('SELECT TOP (1) [value], [observationTime] FROM [dbo].[LiveData] WHERE sensorId = @location ORDER BY observationTime DESC');

        if (result.recordset.length > 0) {
            res.json({ value: result.recordset[0].value });
        } else {
            res.status(404).send('Sensor not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving sensor value');
    }
});
// #endregion


//! fetch graph data
//#region fetch graph data
router.get('/api/graphdata/:location', async (req, res) => {
    const location = req.params.location;
    try {
        // Get the connection pool
        const pool = await getPool();

        // Query the database
        const result = await pool.request()
            .input('location', sql.VarChar, location)
            .query(`
                SELECT TOP (1)
                FORMAT(ld.observationTime, 'HH:mm - dd MMM') AS observationTime,
                    ld.value
                FROM
                    [dbo].[LiveData] ld
                WHERE
                    ld.sensorId = @location
                ORDER BY
                    ld.observationTime DESC
            `);

        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).send('No data found for the specified location');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving graph data');
    }
});
//#endregion



//! TEMP SETPOINT HG62
// #region TEMP SETPOINT HG62
router.get('/api/TempSetpoint/:location', async (req, res) => {
    const location = req.params.location;
    try {
        // Get the connection pool
        const pool = await getPool();

        // Query the database
        const result = await pool.request()
            .input('location', sql.VarChar, location)
            .query(`
                WITH RankedData AS (
                    SELECT 
                        [deviceId], 
                        [value], 
                        [observationTime], 
                        [quantityKind], 
                        ROW_NUMBER() OVER (PARTITION BY [quantityKind] ORDER BY [observationTime] DESC) AS rn 
                    FROM 
                        [dbo].[LiveData] 
                    WHERE 
                        deviceId = @location 
                        AND (quantityKind LIKE '%HG62_Sensor%' OR quantityKind LIKE '%HG62_Setpoint%')
                )
                SELECT 
                    [deviceId], 
                    [value], 
                    [observationTime], 
                    [quantityKind]
                FROM 
                    RankedData
                WHERE 
                    rn = 1;
            `);

        if (result.recordset.length > 0) {
            // Assuming you want to respond with both value and setpoint based on quantityKind
            const sensorData = result.recordset.reduce((acc, record) => {
                if (record.quantityKind.includes('Sensor')) {
                    acc.value = record.value;
                }
                if (record.quantityKind.includes('Setpoint')) {
                    acc.setpoint = record.value;
                }
                acc.observationTime = record.observationTime; // Format the date
                return acc;
            }, {});

            res.json(sensorData);
        } else {
            res.status(404).send('Sensor not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving sensor value');
    }
});
// #endregion



// --------------------------------------------------------------------------- LIVE DATA ---------------------------------------------------------------------------










const sessionDataStore = {};  // Store data per session

// Endpoint to receive data from Power Apps
router.post('/api/data', (req, res) => {
    const powerAppsData = req.body;
    console.log('Received Data:', powerAppsData);
  
    // Respond back to Power Apps
    res.status(200).send('Data received successfully');
});



 
//*ASSET AUTOMATION
//#region ASSET AUTOMATION
router.get("/api/acc/getElementsByCategory", async (req, res) => {
  const authToken = req.headers.authtoken;
  const EXCHANGE_ID = req.headers["exchangeid"];
  const category = req.headers["category"];


  if (!authToken || !EXCHANGE_ID || !category) {
    return res.status(400).json({ error: "Missing required headers (authtoken, exchangeid, category)" });
  }

  const query = `
    query GetElements($exchangeId: ID!, $elementFilter: ElementFilterInput, $elementPagination: PaginationInput) {
      exchange(exchangeId: $exchangeId) {
        elements(filter: $elementFilter, pagination: $elementPagination) {
          pagination {
            cursor
            pageSize
          }
          results {
            id
            name
            alternativeIdentifiers {
                externalElementId
            }
            properties {
              results {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  try {
    let allResults = [];
    let cursor = "";
    let hasMore = true;

    while (hasMore) {
      const gqlResponse = await fetch(
        "https://developer.api.autodesk.com/dataexchange/2023-05/graphql",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            Region: "EMEA"
          },
          body: JSON.stringify({
            query,
            variables: {
              exchangeId: EXCHANGE_ID,
              elementFilter: { query: `property.name.category=="${category}"` },
              elementPagination: { limit: 100, cursor }
            },
            operationName: "GetElements"
          })
        }
      );

      const data = await gqlResponse.json();

      if (!data?.data?.exchange?.elements) {
        throw new Error("Invalid GraphQL response");
      }

      const elements = data.data.exchange.elements;
      allResults.push(...elements.results);

      if (elements.pagination.cursor) {
        cursor = elements.pagination.cursor;
      } else {
        hasMore = false;
      }
    }

    // 🔑 Clean properties into key/value pairs
    const cleanedResults = allResults.map(el => {
    const props = {};
    el.properties.results.forEach(p => {
        props[p.name] = p.value;
    });
    return {
        id: el.id,
        name: el.name,
        revitGuid: el.alternativeIdentifiers?.externalElementId || null,
        elementId: el.alternativeIdentifiers?.originalSystemId || null,
        ...props
    };
    });

    res.status(200).json({ count: cleanedResults.length, results: cleanedResults });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});
// #endregion






//get all objects without category [DB8]

// router.get("/api/acc/getWalls", async (req, res) => {
//   const EXCHANGE_ID = "ZXhjfm5YNXNGbDB0bmRqeXBYTzhOV2VqQktfTDJDfmRjMWUxNDE4LTJjYTAtMzlhNS1hZTc3LTkyZGQzNDU3MTg2Mw";
//   const authToken = req.headers["authtoken"];

//   if (!authToken) {
//     return res.status(400).json({ error: "Missing Authorization token" });
//   }

//   try {
//     const query = `
//       query GetAllElements($exchangeId: ID!, $elementPagination: PaginationInput) {
//         exchange(exchangeId: $exchangeId) {
//           elements(pagination: $elementPagination) {
//             pagination {
//               cursor
//               pageSize
//             }
//             results {
//               id
//               name
//               properties {
//                 results {
//                   name
//                   value
//                 }
//               }
//             }
//           }
//         }
//       }
//     `;

//     let allResults = [];
//     let cursor = "";
//     let hasMore = true;

//     while (hasMore) {
//       const gqlResponse = await fetch(
//         "https://developer.api.autodesk.com/dataexchange/2023-05/graphql",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             "Content-Type": "application/json",
//             "Region": "EMEA"
//           },
//           body: JSON.stringify({
//             query,
//             variables: {
//               exchangeId: EXCHANGE_ID,
//               elementPagination: { limit: 100, cursor }
//             },
//             operationName: "GetAllElements"
//           })
//         }
//       );

//       const data = await gqlResponse.json();

//       const elements = data.data.exchange.elements;
//       allResults.push(...elements.results);

//       if (elements.pagination.cursor) {
//         cursor = elements.pagination.cursor;
//       } else {
//         hasMore = false;
//       }
//     }

//     // 🔑 Flatten properties into key/value
//     const cleanedResults = allResults.map(el => {
//       const props = {};
//       el.properties.results.forEach(p => {
//         props[p.name] = p.value;
//       });
//       return {
//         id: el.id,
//         name: el.name,
//         ...props
//       };
//     });

//     res.status(200).json({ count: cleanedResults.length, results: cleanedResults });

//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Unexpected error", details: err.message });
//   }
// });





//app.use(require("./routes/auth.js"));
router.use(cors());
router.use(express.json());
//app.use(require('./routes/auth.js'));
// -----------------------------
// Get 2-legged APS token
// -----------------------------

async function getAccessToken() {
  const response = await fetch(
    "https://developer.api.autodesk.com/authentication/v2/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.APS_CLIENT_ID,
        client_secret: process.env.APS_CLIENT_SECRET,
        scope: "data:read"
      })
    }
  );

  const text = await response.text();

  try {
    return JSON.parse(text).access_token;
  } catch (err) {
    console.error("❌ Token response not JSON:", text);
    throw err;
  }
}


function findPdfDerivative(manifest, sheetName) {

  function search(nodes) {
    if (!nodes) return null;

    for (const node of nodes) {

      // If this node is the sheet geometry
      if (node.role === "2d" && node.name === sheetName && node.children) {
        for (const child of node.children) {
          if (child.role === "pdf-page") {
            return child;
          }
        }
      }

      if (node.children) {
        const found = search(node.children);
        if (found) return found;
      }
    }

    return null;
  }

  return search(manifest.derivatives);
}



// -----------------------------
// Export PDF Route
// -----------------------------
router.post("/export-pdf", async (req, res) => {
  try {
    console.log("🚀 EXPORT ROUTE HIT");

    const { urn, sheetName } = req.body;
    const authToken = req.headers.authorization?.split(" ")[1];

    if (!authToken) return res.status(401).send("Missing auth token");
    if (!urn) return res.status(400).send("URN missing");
    if (!sheetName) return res.status(400).send("Sheet name missing");

    const encodedUrn = urn; // already base64 from frontend

    // =====================================================
    // 1️⃣ ENSURE MODEL TRANSLATION EXISTS (SVF)
    // =====================================================

    await fetch(
      "https://developer.api.autodesk.com/modelderivative/v2/designdata/job",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: { urn: encodedUrn },
          output: {
            formats: [
              {
                type: "svf",
                views: ["2d", "3d"]
              }
            ]
          }
        })
      }
    );

    const manifestUrl =
      `https://developer.api.autodesk.com/modelderivative/v2/designdata/${encodedUrn}/manifest`;

    let manifest = null;

    // =====================================================
    // 2️⃣ WAIT UNTIL MODEL TRANSLATION SUCCESS
    // =====================================================

    for (let i = 0; i < 40; i++) {
      const manifestRes = await fetch(manifestUrl, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      console.log("Manifest status:", manifestRes.status);

      if (manifestRes.status === 200) {
        manifest = await manifestRes.json();
        console.log("Manifest state:", manifest.status);

        if (manifest.status === "success") break;
      }

      await new Promise(r => setTimeout(r, 3000));
    }

    if (!manifest || manifest.status !== "success") {
      return res.status(202).json({ status: "Model still translating" });
    }

    // =====================================================
    // 3️⃣ GET METADATA (NOW SAFE)
    // =====================================================

    const metadataRes = await fetch(
      `https://developer.api.autodesk.com/modelderivative/v2/designdata/${encodedUrn}/metadata`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );

    if (!metadataRes.ok) {
      const err = await metadataRes.text();
      console.log("Metadata error:", err);
      return res.status(500).send("Failed to get metadata");
    }

    const metadataJson = await metadataRes.json();

    let sheetGuid = null;

    for (const item of metadataJson.data.metadata) {
      if (item.name === sheetName && item.role === "2d") {
        sheetGuid = item.guid;
        break;
      }
    }

    if (!sheetGuid) {
      return res.status(404).send("Sheet not found");
    }

    console.log("✅ sheetGuid:", sheetGuid);

    // =====================================================
    // 4️⃣ SUBMIT PDF JOB (NOW sheetGuid EXISTS)
    // =====================================================

    await fetch(
      "https://developer.api.autodesk.com/modelderivative/v2/designdata/job",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: { urn: encodedUrn },
          output: {
            formats: [
              {
                type: "pdf",
                views: ["2d"],   // 🔴 IMPORTANT
                advanced: {
                  sheetGuid: sheetGuid,
                  includeAnnotations: true
                }
              }
            ]
          }
        })
      }
    );

    let pdfDerivative = null;

    // =====================================================
    // 5️⃣ WAIT UNTIL PDF READY
    // =====================================================

    for (let i = 0; i < 80; i++) {
      const pollRes = await fetch(manifestUrl, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      const pollManifest = await pollRes.json();

      pdfDerivative = findPdfDerivative(pollManifest, sheetName);

      console.log("Checking derivatives...");
      console.log(JSON.stringify(pollManifest, null, 2));

      console.log("PDF status:", pdfDerivative?.status);

      if (pdfDerivative && pdfDerivative.status === "success") break;

      if (pdfDerivative && pdfDerivative.status === "failed") {
        return res.status(500).send("PDF translation failed");
      }

      await new Promise(r => setTimeout(r, 3000));
    }

    if (!pdfDerivative || pdfDerivative.status !== "success") {
      return res.status(202).json({ status: "PDF still processing" });
    }

    // =====================================================
    // 6️⃣ DOWNLOAD REAL PDF
    // =====================================================

   const downloadUrl =
  `https://developer.api.autodesk.com/modelderivative/v2/designdata/${encodedUrn}/manifest/${encodeURIComponent(pdfDerivative.urn)}`;


    const fileRes = await fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (!fileRes.ok) {
      const err = await fileRes.text();
      console.log("Download failed:", err);
      return res.status(500).send("Failed to download PDF");
    }

    const buffer = await fileRes.arrayBuffer();

    console.log("📄 PDF size:", buffer.byteLength);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${sheetName}.pdf"`
    );

    return res.send(Buffer.from(buffer));

  } catch (err) {
    console.error("❌ Export failed:", err);
    return res.status(500).send("Export failed");
  }
});





module.exports = router;




    

//  const manifestRes = await fetch(
//   `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`,
//   {
//     headers: { Authorization: `Bearer ${authToken}` }
//   }
// );

// const rawText = await manifestRes.text();

// console.log("Manifest Status:", manifestRes.status);
// console.log("Manifest Response:", rawText);

// if (!manifestRes.ok) {
//   return res.status(manifestRes.status).send(rawText);
// }

// //const manifest = JSON.parse(rawText);
// // 🔄 Request PDF translation (if not already created)
// await fetch(
//   "https://developer.api.autodesk.com/modelderivative/v2/designdata/job",
//   {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${authToken}`,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       input: { urn },
//       output: {
//         formats: [
//           {
//             type: "pdf",
//             views: ["2d"]
//           }
//         ]
//       }
//     })
//   }
// );



// if (!tokenRes.ok) {
//   return res.status(tokenRes.status).send(tokenRaw);
// }

// const tokenData = JSON.parse(tokenRaw);







// if (!manifestRes.ok) {
//   return res.status(manifestRes.status).send(rawText);
// }

// const manifest = JSON.parse(rawText);
    
    

//     if (!manifest.derivatives) {
//       return res.status(400).send("No derivatives found. Was PDF generated?");
//     }

//     // 2️⃣ Find PDF derivative
//     const pdfDerivative = findPdfDerivative(manifest);

//     if (!pdfDerivative) {
//       return res.status(400).send("No PDF derivative found. Re-translate model with PDF output.");
//     }

//     // 3️⃣ Download PDF
//     const fileRes = await fetch(
//       `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest/${pdfDerivative.urn}`,
//       {
//         headers: { Authorization: `Bearer ${authToken}` }
//       }
//     );

//     const buffer = await fileRes.arrayBuffer();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${sheetName || "sheet"}.pdf"`
//     );

//     res.send(Buffer.from(buffer));

//   } catch (err) {
//     console.error("❌ Export failed:", err);
//     res.status(500).send("Export failed");
//   }
// });

// // -----------------------------
// // Helper: Find PDF in manifest
// // -----------------------------
// function findPdfDerivative(manifest) {
//   for (const derivative of manifest.derivatives) {
//     if (derivative.outputType === "pdf") {
//       return derivative;
//     }
//   }
//   return null;
// }

