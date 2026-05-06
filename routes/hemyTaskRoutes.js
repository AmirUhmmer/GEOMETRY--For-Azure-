const express = require('express');
// const sql = require('mssql');
// const sql = require('msnodesqlv8');
const { ClientSecretCredential } = require('@azure/identity');
const router = express.Router();   

const { TENANT_ID, CLIENT_ID, CLIENT_SECRET } = require('../config.js');

router.get('/hemytask/HA', async function (req, res, next) {
    const selectedHA = await getUserProfile(authToken);
    res.json({ selectedHA });
});

const credential = new ClientSecretCredential(
  TENANT_ID, //tenant ID
  CLIENT_ID, //client ID
  CLIENT_SECRET //client secret
);

const FABRIC_SCOPE = "https://analysis.windows.net/powerbi/api/.default";
const TOKEN_REFRESH_BUFFER_MS = 60 * 1000; // refresh 1 minute before expiry

let cachedFabricToken = null;
let cachedFabricTokenExpiresOn = 0;
let tokenRequestInFlight = null;

function getLatestDistinctByAssetId(items) {
  const latestByAssetId = new Map();

  for (const item of items) {
    if (!item || !item.assetId) {
      continue;
    }

    const existing = latestByAssetId.get(item.assetId);
    if (!existing) {
      latestByAssetId.set(item.assetId, item);
      continue;
    }

    const existingTime = Date.parse(existing.observationTime);
    const itemTime = Date.parse(item.observationTime);

    // Keep the row with the most recent observationTime
    if (!Number.isNaN(itemTime) && (Number.isNaN(existingTime) || itemTime > existingTime)) {
      latestByAssetId.set(item.assetId, item);
    }
  }

  return Array.from(latestByAssetId.values()).sort((a, b) => {
    const aTime = Date.parse(a.observationTime);
    const bTime = Date.parse(b.observationTime);
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  });
}

async function getFabricAccessToken() {
  const now = Date.now();
  if (cachedFabricToken && now < cachedFabricTokenExpiresOn - TOKEN_REFRESH_BUFFER_MS) {
    return cachedFabricToken;
  }

  if (!tokenRequestInFlight) {
    tokenRequestInFlight = credential.getToken(FABRIC_SCOPE).then((tokenResponse) => {
      if (!tokenResponse || !tokenResponse.token) {
        throw new Error("Failed to get Fabric access token.");
      }

      cachedFabricToken = tokenResponse.token;
      cachedFabricTokenExpiresOn = tokenResponse.expiresOnTimestamp || now + 5 * 60 * 1000;
      return cachedFabricToken;
    }).finally(() => {
      tokenRequestInFlight = null;
    });
  }

  return tokenRequestInFlight;
}

router.get('/hg62/live_data', async function (req, res) {
  try {
    // ✅ 1. Reuse token until near expiry
    const accessToken = await getFabricAccessToken();
    // ✅ 2. Call GraphQL endpoint
    const response = await fetch("https://0f49bb62683240a7825db730e9874a50.z0f.graphql.fabric.microsoft.com/v1/workspaces/0f49bb62-6832-40a7-825d-b730e9874a50/graphqlapis/4354d1aa-f378-4cde-9758-b74f462a4243/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `
          query {
            liveDatas(
              filter: 
                {sensorName:  {
                contains: "Room"
                }
                }
                orderBy:  {
                  observationTime: DESC
                }
            ) {
              items {
                value
                observationTime
                sensorName
                functionalLocation
                assetId
              }
            }
          }
        `
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText || "GraphQL request failed." });
    }

    const data = await response.json();
    const items = data?.data?.liveDatas?.items || [];
    const distinctLatestItems = getLatestDistinctByAssetId(items);
    const sanitizedResponse = {
      ...data,
      data: {
        ...data?.data,
        liveDatas: {
          ...data?.data?.liveDatas,
          items: distinctLatestItems
        }
      }
    };

    console.log("GraphQL Response:", JSON.stringify(data, null, 2)); // Log full response for debugging

    // ✅ 3. Return result
    res.json(sanitizedResponse);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;