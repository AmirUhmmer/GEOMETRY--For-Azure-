const express = require('express');
const Axios = require('axios');
const cors = require('cors'); // Import CORS
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

let router = express.Router();

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

// TEMPERATURE SENSOR
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

// TEMPERATURE SENSOR V2 [HG62]
//Room Thermostat-1.92.HG62_Setpoint
//Panel Heater-1.89.HG62_Status
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

// Route to fetch graph data
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



// --------------------------------------------------------------------------- LIVE DATA ---------------------------------------------------------------------------












const sessionDataStore = {};  // Store data per session

// Endpoint to receive data from Power Apps
router.post('/api/data', (req, res) => {
    const powerAppsData = req.body;
    console.log('Received Data:', powerAppsData);
  
    // Respond back to Power Apps
    res.status(200).send('Data received successfully');
});








//const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IlZiakZvUzhQU3lYODQyMV95dndvRUdRdFJEa19SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiYWNjb3VudDpyZWFkIiwidmlld2FibGVzOnJlYWQiXSwiY2xpZW50X2lkIjoiSERuVXlvcDFCcjZoS2dGa1BGTWZka3JOY1k4MTFpTTc1OUJFQ2hwWWtmZVVaM3JyIiwiaXNzIjoiaHR0cHM6Ly9kZXZlbG9wZXIuYXBpLmF1dG9kZXNrLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tIiwianRpIjoiSElTQmJyUlVxYmdSS0MxMjZXUVkyZzlROWlKaUZIQTdYazBxMWM2MUZ3MlZoU3FJSG5LcHlHNTNEYU42YmVLeSIsImV4cCI6MTc1NTg1NTcwOX0.dENGUQWHEnbmIUcRxmz22rFe7xV0guYVL-Mo7_VqIi7tngI8fNZxHOUAmWsSBMdiLvQX_ySW0sjJMZzAtgYQ1oBzTTX9l9G9RgxoiVvGBgaswIGmumOC84F1YiN5O4RnHSoXohAiHgOx03hA_3PWNxLvwrnE4s0zzPrx5_ouGYAPd_aawz8vyFiBDi3Yj1tNNsGY5Q_11eAJ4yxsGkM7V4sAOZAfUkWgFYEDrGb2PJ-JW9tx8It4srV_SDbsIW_ZeZnRfLM3x_oQgH7b9IMxba8u8t15f8c56NrNhLvIXjRUuI2sEWCke2yS03SuF73kNJbJIesg_mqbhGVc5puHdg";


// ASSET AUTOMATION CALLS
router.get("/api/acc/getElementsByCategory", async (req, res) => {
  try {
    const category = req.headers["category"];
    const token = req.headers.authtoken;
    const exchangeId = req.headers["exchangeId"];
    
    const query = `
      query GetElementsByCategory(
        $exchangeId: ID!, 
        $elementFilter: ElementFilterInput, 
        $elementPagination: PaginationInput
      ) {
        exchange(exchangeId: $exchangeId) {
          elements(filter: $elementFilter, pagination: $elementPagination) {
            pagination {
              pageSize
              cursor
            }
            results {
              id
              name
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

    let allResults = [];
    let cursor = null;

    do {
      const variables = {
        exchangeId,
        elementFilter: { category },
        elementPagination: { pageSize: 200, cursor }
      };

      const response = await fetch("https://developer.api.autodesk.com/data/v1/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables }),
      });

      const data = await response.json();
      const elements = data?.data?.exchange?.elements;

      if (elements?.results) {
        allResults = allResults.concat(elements.results);
      }

      cursor = elements?.pagination?.cursor || null; // next page
    } while (cursor);

    res.json(allResults);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching elements");
  }
});






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






module.exports = router;