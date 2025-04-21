// Assuming you're using Autodesk.Viewing as `viewer`
export function button3D(viewer, urns) {
  const toolbar = viewer.getToolbar();
  if (!toolbar) {
      console.error("Toolbar not found");
      return;
  }

  // Create a new toolbar button
  const show3DButton = new Autodesk.Viewing.UI.Button('show3DButton');

  // Apply icon styling directly to the button's container
  const buttonContainer = show3DButton.container;
  buttonContainer.style.backgroundImage = 'url(./images/3d.svg)';  // Set your icon image source here
  buttonContainer.style.backgroundColor = 'transparent';  // Make background transparent
  buttonContainer.style.backgroundSize = '32px';  // Adjust size of the background image
  buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
  buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button
  buttonContainer.classList.add('custom-toolbar-button');
  show3DButton.setToolTip('3D View');  // Set the tooltip for the button


  // Create a new ControlGroup (subToolbar)
  // let subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppLeftToolbar');
  // toolbar.addControl(subToolbar);

  // // Add the custom button to the subToolbar
  // subToolbar.addControl(showFaro2DPanelButton);

  let subToolbar = viewer.toolbar.getControl('myAppLeftToolbar');
    if (!subToolbar) {
      subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppLeftToolbar');
      toolbar.addControl(subToolbar);
    }
  subToolbar.addControl(show3DButton);

  // Now, we move the subToolbar to the left side
  const subToolbarContainer = subToolbar.container;
  subToolbarContainer.style.position = 'absolute';  // Make it absolute positioned
  subToolbarContainer.style.top = '-50vh';           // Adjust the top position as needed
  subToolbarContainer.style.left = '20px';          // Move it to the left side of the viewer
  subToolbarContainer.style.zIndex = '1000';        // Ensure it is on top of the viewer elements

  subToolbarContainer.style.display = 'flex';
  subToolbarContainer.style.flexDirection = 'column';
  subToolbarContainer.style.alignItems = 'flex-start'; // Optional: left-align the buttons


  show3DButton.onClick = async function () {

    // Optional: unload current models before loading new ones
    viewer.getVisibleModels().forEach(model => {
      viewer.unloadModel(model);
    });
    const access_token = localStorage.getItem('authToken');
  
    async function loadModels() {
      try {
        // Load each model sequentially
        for (let modelUrn of urns) {
  
          await new Promise((resolve, reject) => {
            Autodesk.Viewing.Document.load(
              'urn:' + modelUrn,
              async (doc) => {
                try {
                  await onDocumentLoadSuccess(doc);
                  resolve();
                } catch (err) {
                  reject(err);
                }
              },
              onDocumentLoadFailure,
              { accessToken: access_token }
            );
          });
        }
      } catch (error) {
        console.error("Unexpected error in loadModels:", error);
      }
    }
  
    async function onDocumentLoadSuccess(doc) {
      const loadOptions = {
        keepCurrentModels: true,
        globalOffset: { x: 0, y: 0, z: 0 },
        applyRefPoint: true
      };
  
      const defaultGeometry = doc.getRoot().getDefaultGeometry();
      const model = await viewer.loadDocumentNode(doc, defaultGeometry, loadOptions);
    }
  
    function onDocumentLoadFailure(code, message) {
      console.error("Failed to load model:", message);
      alert("Could not load model. See console for details.");
    }
  
    await loadModels();
  };
  
}