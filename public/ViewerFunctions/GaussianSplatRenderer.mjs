import { LCCLoader } from './lcc-loader.mjs';
import { GaussianSplatRenderer } from './splat-renderer.mjs';
import { GaussianSplatAlignmentUI } from './GaussianSplatAlignmentUI.mjs';

// Load JSZip from CDN
const JSZip = window.JSZip || await loadJSZip();

const CACHE_DB_NAME = 'LCC-Files-Cache';
const CACHE_STORE_NAME = 'files';

async function loadJSZip() {
    if (window.JSZip) return window.JSZip;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.head.appendChild(script);
    return new Promise(resolve => {
        script.onload = () => resolve(window.JSZip);
    });
}

// IndexedDB Caching
async function getIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(CACHE_DB_NAME, 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
                db.createObjectStore(CACHE_STORE_NAME);
            }
        };
    });
}

async function getCachedFiles(cacheKey) {
    try {
        const db = await getIndexedDB();
        return new Promise((resolve, reject) => {
            const request = db.transaction(CACHE_STORE_NAME).objectStore(CACHE_STORE_NAME).get(cacheKey);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    } catch (err) {
        console.warn('Could not access cache:', err);
        return null;
    }
}

async function cacheFiles(cacheKey, files) {
    try {
        const db = await getIndexedDB();
        return new Promise((resolve, reject) => {
            const request = db.transaction(CACHE_STORE_NAME, 'readwrite')
                .objectStore(CACHE_STORE_NAME)
                .put(files, cacheKey);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                console.log('Files cached successfully');
                resolve();
            };
        });
    } catch (err) {
        console.warn('Could not cache files:', err);
    }
}

export async function clearCache() {
    try {
        const db = await getIndexedDB();
        return new Promise((resolve, reject) => {
            const request = db.transaction(CACHE_STORE_NAME, 'readwrite')
                .objectStore(CACHE_STORE_NAME)
                .clear();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                console.log('Cache cleared');
                resolve();
            };
        });
    } catch (err) {
        console.warn('Could not clear cache:', err);
    }
}

async function downloadAndDecompressZip(zipUrl) {
    try {
        console.log('Downloading ZIP from:', zipUrl);

        // Route through backend to stream file and avoid memory issues
        const response = await fetch('/api/download-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ url: zipUrl })
        });

        if (!response.ok) {
            throw new Error(`Failed to download ZIP: ${response.statusText}`);
        }

        const zipBlob = await response.blob();
        console.log('ZIP downloaded, size:', zipBlob.size, 'bytes');

        // Ensure JSZip is loaded
        let zip = window.JSZip;
        if (!zip) {
            zip = await loadJSZip();
        }

        console.log('Decompressing ZIP...');
        const zipFile = await zip.loadAsync(zipBlob);

        // Find all files in the ZIP
        const files = {};
        for (const [filename, file] of Object.entries(zipFile.files)) {
            if (!file.dir) {
                const blob = await file.async('blob');
                files[filename] = blob;
                console.log('Extracted:', filename);
            }
        }

        console.log(`Decompression complete. Found ${Object.keys(files).length} files`);
        return files;

    } catch (err) {
        console.error('Error decompressing ZIP:', err);
        throw err;
    }
}

async function loadLccFromFiles(files) {
    try {
        console.log('Loading LCC from extracted files...');

        // Find the main LCC file (usually a .json or metadata file)
        const mainFile = Object.keys(files).find(name =>
            name.endsWith('.json') || name.includes('metadata') || name.includes('index')
        );

        if (!mainFile) {
            throw new Error('No LCC metadata file found in ZIP');
        }

        console.log('Using main file:', mainFile);

        // Create a custom loader that uses the extracted files
        const loader = new LCCLoader({ targetLOD: 4 });

        // Override the loader's fetch to use our extracted files
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            console.log('Loader requesting:', url);

            // Extract filename from URL
            const filename = url.split('/').pop();

            if (files[filename]) {
                console.log('Serving from decompressed files:', filename);
                return Promise.resolve(new Response(files[filename]));
            }

            // Fall back to original fetch
            return originalFetch.call(this, url, options);
        };

        // Load the LCC data using the relative path
        const mainFileName = Object.keys(files)[0];
        const data = await loader.load(mainFileName);

        // Restore original fetch
        window.fetch = originalFetch;

        return data;

    } catch (err) {
        console.error('Error loading LCC from files:', err);
        throw err;
    }
}

export async function initGaussianSplatRenderer(viewer, modelName = 'default', zipUrl = null) {
    console.log('=== Initializing Gaussian Splat Renderer ===');

    let splatRenderer = null;
    let data = null;
    let extractedFiles = null;

    try {
        if (!zipUrl) {
            console.warn('No ZIP URL provided for LCC file');
            return { splatRenderer: null, alignmentUI: null };
        }

        const cacheKey = `lcc-files-${btoa(zipUrl)}`; // Create unique cache key from URL

        // Check if files are cached
        console.log('Checking cache...');
        extractedFiles = await getCachedFiles(cacheKey);

        if (extractedFiles) {
            console.log('✅ Loading from cache (instant!)');
        } else {
            console.log('📥 Not in cache, downloading ZIP:', zipUrl);
            // Download and decompress the ZIP
            extractedFiles = await downloadAndDecompressZip(zipUrl);
            // Cache for next time
            await cacheFiles(cacheKey, extractedFiles);
        }

        // Load LCC from the decompressed files
        data = await loadLccFromFiles(extractedFiles);

        splatRenderer = new GaussianSplatRenderer();
        await splatRenderer.init(data);
        splatRenderer.mesh.scale.set(3.28084, 3.28084, 3.28084);

        viewer.impl.createOverlayScene('splats');
        viewer.impl.addOverlay('splats', splatRenderer.mesh);

        console.log('LCC file loaded successfully from ZIP');

        // Create alignment UI
        const alignmentUI = new GaussianSplatAlignmentUI(viewer, splatRenderer, modelName);
        alignmentUI.createToolbarButton();
        alignmentUI.updateSplatMesh();

        viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, () => {
            splatRenderer.update(viewer.impl.camera);
            viewer.impl.invalidate(false, false, true);
        });

        viewer.addEventListener(Autodesk.Viewing.CUTPLANES_CHANGE_EVENT, () => {
            splatRenderer.setCutPlanes(viewer.getCutPlanes() || []);
            viewer.impl.invalidate(false, false, true);
        });

        return { splatRenderer, alignmentUI };

    } catch (err) {
        console.error('Error initializing Gaussian Splat Renderer:', err);
        alert('Failed to load Gaussian Splats: ' + err.message);
        return { splatRenderer: null, alignmentUI: null };
    }
}

async function fetchLccFileUrl(fileEntityId) {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            throw new Error('No auth token available');
        }

        console.log('Fetching signed URL for entity:', fileEntityId);

        // Query to get signed download URL for the file
        const query = `
            query GetFileDownloadUrl($entityId: String!) {
                document(urn: $entityId) {
                    id
                    displayName
                    ... on Document {
                        tip {
                            id
                            signedUrl
                        }
                    }
                }
            }
        `;

        const response = await fetch(
            'https://developer.api.autodesk.com/hubs/v1/graphql',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    'x-ads-region': 'EMEA'
                },
                body: JSON.stringify({
                    query,
                    variables: { entityId: fileEntityId },
                    operationName: 'GetFileDownloadUrl'
                })
            }
        );

        const data = await response.json();

        console.log('GraphQL Response:', JSON.stringify(data, null, 2));

        if (data.errors) {
            throw new Error(`GraphQL Error: ${JSON.stringify(data.errors)}`);
        }

        const downloadUrl = data.data?.document?.tip?.signedUrl;
        const fileName = data.data?.document?.displayName;

        if (!downloadUrl) {
            throw new Error('No download URL available for this file');
        }

        console.log('Got signed URL for:', fileName);
        return downloadUrl;

    } catch (err) {
        console.error('Error fetching LCC file URL:', err);
        throw err;
    }
}