// Assuming you're using Autodesk.Viewing as `viewer`
export function rightToolbar(viewer, modelAbbreviation) {
  const toolbar = viewer.getToolbar();
  if (!toolbar) {
      console.error("Toolbar not found");
      return;
  }

  const settingsTools = viewer.toolbar.getControl('settingsTools');
  settingsTools.removeControl('toolbar-modelStructureTool');

  const modelTools = viewer.toolbar.getControl('modelTools');
  const documentModels = modelTools.getControl('toolbar-documentModels');  

  // Create a new ControlGroup (subToolbar)
  let subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppRightToolbar');
  toolbar.addControl(subToolbar);

  // Now, we move the subToolbar to the left side
  const subToolbarContainer = subToolbar.container;
  subToolbarContainer.style.position = 'absolute';  // Make it absolute positioned
  subToolbarContainer.style.top = '-50vh';           // Adjust the top position as needed
  subToolbarContainer.style.right = '20px';          // Move it to the left side of the viewer
  subToolbarContainer.style.zIndex = '1000';        // Ensure it is on top of the viewer elements

  modelBrowser(viewer).then((modelBrowserButton) => {
    subToolbar.addControl(modelBrowserButton);
  });
}


async function modelBrowser(viewer) {
  // Create a new toolbar button
  const modelBrowser = new Autodesk.Viewing.UI.Button('modelBrowser');

  // Apply icon styling directly to the button's container
  const buttonContainer = modelBrowser.container;
  buttonContainer.style.backgroundImage = 'url(./images/model-browser.svg)';  // Set your icon image source here
  buttonContainer.style.backgroundColor = 'transparent';  // Make background transparent
  buttonContainer.style.backgroundSize = '32px';  // Adjust size of the background image
  buttonContainer.style.backgroundRepeat = 'no-repeat';  // Ensure no repeat of the image
  buttonContainer.style.backgroundPosition = 'center';  // Center the image inside the button
  buttonContainer.classList.add('right-custom-toolbar-button');
  modelBrowser.setToolTip('Model Browser');  // Set the tooltip for the button

  return modelBrowser;
}