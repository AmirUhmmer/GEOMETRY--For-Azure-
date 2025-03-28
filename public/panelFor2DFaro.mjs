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
//   showFaro2DPanelButton.onClick = function() {
//       if (viewer.Faro2DPanel) {
//           viewer.Faro2DPanel.setVisible(!viewer.Faro2DPanel.isVisible());
//       } else {
//           showFaro2DPanel(viewer);  // Replace this with your custom function
//       }
//   };

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

//   let models = viewer.impl.modelQueue().getModels();

// //   // Loop through each model and log the 2D views
// //   models.forEach((model) => {
// //     const docRoot = model.getDocumentNode();
// //     if (docRoot) {
// //         // Recursively search for 2D viewables in the bubble tree
// //         const viewables = find2DViewables(docRoot);
// //         if (viewables.length > 0) {
// //             console.log('2D Floor Plans found:', viewables);
// //         } else {
// //             console.log('No 2D viewables found in the model.');
// //         }
// //     } else {
// //         console.log('No document node found for this model.');
// //     }
// // });
// }

// function find2DViewables(node) {
// //   let results = [];
// //   if (node.isLeaf()) {
// //       const data = node.data;
// //       if (data && data.role === '2d' && data.type === 'geometry') {
// //           results.push(data);  // Push the viewable data if it matches 2D geometry
// //       }
// //   } else if (node.children && node.children.length > 0) {
// //       // Recursively search child nodes
// //       node.children.forEach((childNode) => {
// //           results = results.concat(find2DViewables(childNode));
// //       });
// //   }
// //   return results;
// }

