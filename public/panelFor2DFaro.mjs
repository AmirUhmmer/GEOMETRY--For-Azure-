import { PanelContent } from './Faro2DPanelContent.mjs';

export function ToolbarButton2DFaro(viewer, modelAbbreviation) {
  const toolbar = viewer.getToolbar();
     if (!toolbar) {
         console.error("Toolbar not found");
         return;
     }
 
     // Create a new toolbar button
     const showFaro2DPanelButton = new Autodesk.Viewing.UI.Button('showFaro2DPanelButton');
 
     // Apply icon styling directly to the button's container
     const buttonContainer = showFaro2DPanelButton.container;
     buttonContainer.style.backgroundImage = 'url(./images/faro.svg)';  // Set your icon image source here
     buttonContainer.style.backgroundColor = 'transparent';  // Make background transparent
     buttonContainer.style.backgroundSize = '32px';  // Adjust size of the background image
     buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
     buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button
 
     showFaro2DPanelButton.setToolTip('Different Views');  // Set the tooltip for the button
 
     // Define the action when the button is clicked
     showFaro2DPanelButton.onClick = function() {
         if (viewer.Faro2DPanel) {
             viewer.Faro2DPanel.setVisible(!viewer.Faro2DPanel.isVisible());
         } else {
             showFaro2DPanel(viewer, modelAbbreviation);  // Show panel even if no service tasks exist yet
         }
     };
 
     // Add the button to a new toolbar group
     let subToolbar = viewer.toolbar.getControl('myAppToolbar');
     if (!subToolbar) {
         subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppToolbar');
         toolbar.addControl(subToolbar);
     }
     subToolbar.addControl(showFaro2DPanelButton);
 
     // Call this function once the viewer is fully initialized
     viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, function() {
         createToolbarRepeatingTaskButton(viewer);
     });
 }
 
 // Function to create and display a docking panel
 export function showFaro2DPanel(viewer, modelAbbreviation) {
  class Faro2DPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(viewer, title, options) {
      super(viewer.container, title, options);

      // Set the panel styles
      this.container.style.top = "10px";
      this.container.style.left = "10px";
      this.container.style.width = "230px";
      this.container.style.height = "500px";
      this.container.style.resize = "auto";
      this.container.style.backgroundColor = '#333';
      this.container.style.title = 'Tasks';

      // Create and configure the scroll container
      this.createScrollContainer();
    }

    createScrollContainer() {
      // Create the scroll container
      this.scrollContainer = document.createElement('div');
      
      // Apply scroll container styles and class
      this.scrollContainer.classList.add('scrollContainer'); // Add a class for styling
      
      this.scrollContainer.style.overflowY = 'auto'; // Enable vertical scrolling
      this.scrollContainer.style.padding = '1em';
      this.scrollContainer.style.height = 'calc(100% - 2em)';
    
      // Append the scroll container to the panel
      this.container.appendChild(this.scrollContainer);
    
      // Create and append elements to the scroll container
      this.createPanelContent();
    }
    
    

    createPanelContent() {
      // Get content by calling PanelContent function
      const content = PanelContent(viewer, modelAbbreviation); // content retrieved here

      // Loop through content and create collapsible elements
      content.forEach(item => {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        if (item.isParent) {
          // Create a collapsible parent label
          const label = document.createElement('button');
          label.id = item.id;
          label.textContent = item.label;
          label.style.fontWeight = 'bold';
          label.style.cursor = 'pointer';
          label.style.color = '#fff';
          label.style.backgroundColor = '#333';
          label.style.border = 'none';
          label.style.padding = '10px 15px';
          label.style.fontSize = '15px';
          label.style.display = 'flex';
          label.style.alignItems = 'center';

          // Add a down arrow icon
          const arrowIcon = document.createElement('span');
          arrowIcon.textContent = '▲'; // Unicode character for the arrow
          arrowIcon.style.marginLeft = 'auto'; // Aligns the arrow to the right
          arrowIcon.style.transform = 'rotate(0deg)'; // Initial position

          label.appendChild(arrowIcon);

          // Toggle visibility of child links and rotate arrow
          label.addEventListener('click', () => {
            const childLinks = document.querySelectorAll(`[data-parent='${item.id}']`);
            childLinks.forEach(link => {
              link.style.display = link.style.display === 'none' ? 'block' : 'none';
            });
            // Rotate the arrow when clicked
            arrowIcon.style.transform = arrowIcon.style.transform === 'rotate(0deg)' ? 'rotate(180deg)' : 'rotate(0deg)';
          });

          container.appendChild(label);
        } else if (item.url) {
          // Create child links
          const link = document.createElement('a');
          link.href = item.url;
          link.id = item.id;
          link.textContent = item.value;
          link.target = '_blank';
          link.style.color = '#3399FF';
          link.style.display = 'none'; // Hide by default
          link.style.paddingLeft = '20px'; // Indent child links
          link.style.fontSize = '15px';
          link.dataset.parent = item.parentId; // Associate with parent

          container.appendChild(link);
        }

        // Append each container (parent or child) to the scroll container
        this.scrollContainer.appendChild(container);
      });
    }
  }

  // Check if a panel already exists and remove it
  if (viewer.Faro2DPanel) {
    viewer.Faro2DPanel.setVisible(false);
    viewer.Faro2DPanel.uninitialize();
  }

  // Create a new panel with the title 'Different Views'
  viewer.Faro2DPanel = new Faro2DPanel(viewer, "Different Views", "Different Views");

  // Show the panel by setting it to visible
  viewer.Faro2DPanel.setVisible(true);
}
 












// // Assuming you're using Autodesk.Viewing as `viewer`
// export function ToolbarButton2DFaro(viewer, modelAbbreviation) {
//   const toolbar = viewer.getToolbar();
//   if (!toolbar) {
//       console.error("Toolbar not found");
//       return;
//   }

//   // Create a new toolbar button
//   const showFaro2DPanelButton = new Autodesk.Viewing.UI.Button('showFaro2DPanelButton');

//   // Apply icon styling directly to the button's container
//   const buttonContainer = showFaro2DPanelButton.container;
//   buttonContainer.style.backgroundImage = 'url(./images/faro.svg)';  // Set your icon image source here
//   buttonContainer.style.backgroundColor = 'transparent';  // Make background transparent
//   buttonContainer.style.backgroundSize = '32px';  // Adjust size of the background image
//   buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
//   buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button
//   buttonContainer.classList.add('custom-toolbar-button');
//   showFaro2DPanelButton.setToolTip('Different Views');  // Set the tooltip for the button

//   // Define the action when the button is clicked
//   let all2DFiles = [];  // Array to store all found 2D files across models

//   // Function to process all models and find 2D files
//   function gatherAll2DFiles(models) {
//       return new Promise((resolve) => {
//           let promises = [];
          
//           models.forEach((model) => {
//               const docRoot = model.getDocumentNode();
//               //console.log('docRoot:', docRoot); // Log the document root for debugging

//               let promise = new Promise((resolveInner) => {
//                   setTimeout(() => {
//                       // console.log("Retrying traversal after delay...");
//                       const twoDFiles = find2DFilesDeep(docRoot);
//                       // console.log("2D Files Found:", twoDFiles);
//                       // Merge the 2D files into all2DFiles
//                       all2DFiles = [...all2DFiles, ...twoDFiles];

//                       // Log after merging to verify
//                       console.log("Consolidated 2D Files Across Models:", all2DFiles);

//                       resolveInner(); // Resolve the inner promise once files are processed
//                   }, 2000);  // Adjust delay if necessary
//               });

//               promises.push(promise);
//           });

//           // Wait for all model promises to complete
//           Promise.all(promises).then(() => {
//               resolve(all2DFiles); // Resolve the main promise with the consolidated 2D files
//           });
//       });
//   }

//   // Create a new ControlGroup (subToolbar)
//   let subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppLeftToolbar');
//   toolbar.addControl(subToolbar);

//   // Add the custom button to the subToolbar
//   subToolbar.addControl(showFaro2DPanelButton);

//   // Now, we move the subToolbar to the left side
//   const subToolbarContainer = subToolbar.container;
//   subToolbarContainer.style.position = 'absolute';  // Make it absolute positioned
//   subToolbarContainer.style.top = '-50vh';           // Adjust the top position as needed
//   subToolbarContainer.style.left = '20px';          // Move it to the left side of the viewer
//   subToolbarContainer.style.zIndex = '1000';        // Ensure it is on top of the viewer elements

//   // Get models from the viewer
//   let models = viewer.impl.modelQueue().getModels();

  
//   // Call the function to gather all 2D files
//   gatherAll2DFiles(models).then((all2DFiles) => {
//       // Now you can use the all2DFiles array in the button click handler
//       showFaro2DPanelButton.onClick = function() {
//           if (viewer.Faro2DPanel) {
//               viewer.Faro2DPanel.setVisible(!viewer.Faro2DPanel.isVisible());
//           } else {
//               showFaro2DPanel(viewer, all2DFiles);  // Pass the all2DFiles array to your custom function
//           }
//       };
//   });



//   function find2DFilesDeep(node, results = new Set(), visited = new Set()) {
//     if (!node || !node.data || visited.has(node.id)) return results; // Prevent loops
    

//     visited.add(node.id); // Mark node as visited

//     //console.log(`Checking node: ${node.data.name || "Unnamed"} (${node.data.type || "No Type"} - ${node.data.role || "No Role"})`);

//     // Check if it's a 2D file
//     if (node.data.type === "geometry" && node.data.role === "2d") {
//         results.add(node.data);
//     }

//     // Search children (if any)
//     if (Array.isArray(node.children)) {
//         node.children.forEach(child => find2DFilesDeep(child, results, visited));
//     }

//     // Go up the hierarchy, but **avoid infinite loops**
//     if (node.parent && !visited.has(node.parent.id)) {
//         find2DFilesDeep(node.parent, results, visited);
//     }

//     return [...results]; // Convert Set to array for unique results
//   }



// }




















//  // Function to create and display a docking panel
//  export async function showFaro2DPanel(viewer, all2DFiles) {
//   class Faro2DPanel extends Autodesk.Viewing.UI.DockingPanel {
//     constructor(viewer, title, options) {
//       super(viewer.container, title, options);

//       // Set the panel styles
//       this.container.style.top = "10px";
//       this.container.style.left = "10px";
//       this.container.style.width = "230px";
//       this.container.style.height = "500px";
//       this.container.style.resize = "auto";
//       this.container.style.backgroundColor = '#333';
//       this.container.style.title = 'Tasks';

//       // Create and configure the scroll container
//       this.createScrollContainer();
//     }
    
    

//     // Create the content of the panel
//     createScrollContainer() {
//       // Create the scroll container
//       this.scrollContainer = document.createElement('div');
//       this.scrollContainer.style.overflow = 'auto';
//       this.scrollContainer.style.padding = '1em';  // Add padding to the scroll container
//       this.scrollContainer.style.height = '100%';  // Ensure it takes full panel height
//       this.container.appendChild(this.scrollContainer);  // Append the scroll container to the panel

//       // Create and append elements to the scroll container
//       this.createPanelContent();
//     }

//     // Create the content inside the scroll container
//     createPanelContent() {
//       // Initial content
//       const content = [];
  
//       // Loop through the all2DFiles array and add each 2D file name to the content
//       all2DFiles.forEach((file, index) => {
//           content.push({
//               id: `faroFile-${index}`,       // Unique ID for each file
//               //label: `2D File ${index + 1}:`, // Label for each file
//               value: file.name || 'Unnamed',  // Assuming the 2D file has a `name` property
//               viewableID: file.guid,   // Store the viewableID for later use
//               urn: file.children[0].urn, // Assuming the 2D file has a `child` property with `urn`

//           });
//       });
  
//       // Loop through content array and create elements
//       content.forEach(item => {
//           const container = document.createElement('div');
//           container.style.marginBottom = '10px';  // Add space between elements
  
//                   // Create clickable link for 2D files
//           if (item.viewableID) {
//             const clickableItem = document.createElement('a');
//             clickableItem.href = '#';
//             clickableItem.style.color = '#3399FF';
//             clickableItem.textContent = item.value;




//             //---------------ON ClICK FUNCTION------------------
//             clickableItem.onclick = () => {
//               console.log(`Loading 2D View - URN: ${item.urn}, Viewable ID: ${item.viewableID}`);
//               const modelUrn = btoa('urn:adsk.wipemea:fs.file:vf.xdXReqV0T1azoWueEiSnzg?version=55')
//               const access_token = localStorage.getItem('authToken');
//               console.log('URN:', modelUrn); // Log the access token for debugging
//               const viewableID = item.viewableID;
//               // Load the model
//               Autodesk.Viewing.Document.load(
//                 'urn:' + modelUrn,
//                 (doc) => onDocumentLoadSuccess(doc, viewableID),
//                 onDocumentLoadFailure,
//                 { accessToken: access_token } // Ensure access token is passed correctly
//               );

//               // Success handler
//               async function onDocumentLoadSuccess(doc, item) {
//                 const loadOptions = {
//                   keepCurrentModels: true, // Keep existing models in the viewer
//                   globalOffset: { x: 0, y: 0, z: 0 }, // Force all models to origin
//                   applyRefPoint: true // Use reference point from model
//                 };

//                 try {
//                   //const viewable = doc.getRoot().getDefaultGeometry();
//                   const geometryItems = doc.getRoot().search({ type: 'geometry' });
//                   console.log("Geometry Items:", geometryItems); // Log the geometry items for debugging
//                   const viewable = item;
//                   const viewableNode = geometryItems.find(node => node.data.viewableID === viewable);

//                   if (!viewableNode) {
//                     console.error("Viewable not found for ID:", viewable);
//                     return;
//                   }

//                   // If you have multiple models, loop through them:
//                   viewer.getVisibleModels().forEach(model => {
//                     viewer.unloadModel(model);
//                   });
//                   const model = await viewer.loadDocumentNode(doc, viewableNode, loadOptions);
//                   console.log("Model loaded successfully:", model);
//                 } catch (error) {
//                   console.error("Error loading model:", error);
//                 }
//               }

//               // Failure handler
//               function onDocumentLoadFailure(code, message) {
//                 console.error("Failed to load model:", message);
//                 alert("Could not load model. See console for details.");
//               }

              
//             };
//           //---------------ON ClICK FUNCTION------------------
          
          
//               container.appendChild(clickableItem);



//           }
  
//           this.scrollContainer.appendChild(container);
//       });
//     }
  
//   }

//   // Check if a panel already exists and remove it
//   if (viewer.Faro2DPanel) {
//     viewer.Faro2DPanel.setVisible(false);
//     viewer.Faro2DPanel.uninitialize();
//   }

//   // Create a new panel with the title 'Different Views'
//   viewer.Faro2DPanel = new Faro2DPanel(viewer, "2D", "2D");

//   // Show the panel by setting it to visible
//   viewer.Faro2DPanel.setVisible(true);
// }
