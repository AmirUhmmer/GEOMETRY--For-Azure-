export class GaussianSplatAlignmentUI {
  constructor(viewer, splatRenderer, modelName, folderUrn = null) {
    this.viewer = viewer;
    this.splatRenderer = splatRenderer;
    this.modelName = modelName;
    this.folderUrn = folderUrn; // ACC folder URN for LCC files
    this.storageKey = `splat-alignment-${modelName}`;
    this.panel = null;
    this.lccFiles = [];
    this.currentLccFile = null;

    this.alignment = {
      scale: 3.28084,
      posX: 0,
      posY: 0,
      posZ: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0
    };

    this.loadSettings();
  }

  createToolbarButton() {
    const toolbar = this.viewer.getToolbar();
    if (!toolbar) {
      console.warn('Toolbar not available');
      return;
    }

    const button = new window.Autodesk.Viewing.UI.Button('splat-alignment-button');
    button.setToolTip('Align Gaussian Splats');
    button.container.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHRleHQgeD0iNiIgeT0iMTgiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNmZmYiPkE8L3RleHQ+PC9zdmc+)';
    button.container.style.backgroundSize = '24px';
    button.container.style.backgroundRepeat = 'no-repeat';
    button.container.style.backgroundPosition = 'center';

    button.onClick = () => this.togglePanel();

    let subToolbar = toolbar.getControl('myAppToolbar');
    if (!subToolbar) {
      subToolbar = new window.Autodesk.Viewing.UI.ControlGroup('myAppToolbar');
      toolbar.addControl(subToolbar);
    }
    subToolbar.addControl(button);
  }

  togglePanel() {
    if (!this.panel) {
      this.createPanel();
    }
    this.panel.setVisible(!this.panel.isVisible());
  }

  async fetchLccFiles() {
    if (!this.folderUrn) {
      console.warn('No folder URN provided for LCC files');
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(
        `/api/acc/lcc-files?folderUrn=${encodeURIComponent(this.folderUrn)}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch LCC files:', response.statusText);
        return;
      }

      const data = await response.json();
      this.lccFiles = data.files || [];
      console.log(`Found ${this.lccFiles.length} LCC files:`, this.lccFiles);
    } catch (err) {
      console.error('Error fetching LCC files:', err);
    }
  }

  async loadLccFile(fileUrn) {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(
        `/api/acc/file-download-url?fileUrn=${encodeURIComponent(fileUrn)}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      if (!response.ok) {
        alert('Failed to get download URL');
        return;
      }

      const data = await response.json();
      console.log('Download URL obtained:', data.fileName);

      // Reload the LCC file with the new URL
      const { LCCLoader } = await import('./lcc-loader.mjs');
      const { GaussianSplatRenderer } = await import('./splat-renderer.mjs');

      const loader = new LCCLoader({ targetLOD: 4 });
      const lccData = await loader.load(data.downloadUrl);

      // Reinitialize the renderer with new data
      const newRenderer = new GaussianSplatRenderer();
      await newRenderer.init(lccData);

      // Copy alignment settings to new renderer
      newRenderer.mesh.scale.set(this.alignment.scale, this.alignment.scale, this.alignment.scale);
      newRenderer.mesh.position.set(this.alignment.posX, this.alignment.posY, this.alignment.posZ);
      newRenderer.mesh.rotation.set(this.alignment.rotX, this.alignment.rotY, this.alignment.rotZ);

      // Replace old renderer
      this.viewer.impl.removeOverlay('splats');
      this.splatRenderer = newRenderer;
      this.viewer.impl.createOverlayScene('splats');
      this.viewer.impl.addOverlay('splats', newRenderer.mesh);

      this.currentLccFile = data.fileName;
      console.log('LCC file loaded:', data.fileName);

    } catch (err) {
      console.error('Error loading LCC file:', err);
      alert('Failed to load LCC file: ' + err.message);
    }
  }

  createPanel() {
    class SplatAlignmentPanel extends window.Autodesk.Viewing.UI.DockingPanel {
      constructor(viewer, title, options) {
        super(viewer.container, title, options);
        this.container.style.width = '340px';
        this.container.style.height = 'auto';
        this.container.style.right = '10px';
        this.container.style.top = '10px';
        this.container.style.backgroundColor = '#333';
      }

      createScrollContainer() {
        this.scrollContainer = document.createElement('div');
        this.scrollContainer.style.overflow = 'auto';
        this.scrollContainer.style.padding = '1em';
        this.scrollContainer.style.height = 'auto';
        this.scrollContainer.style.maxHeight = '600px';
        this.container.appendChild(this.scrollContainer);
      }
    }

    this.panel = new SplatAlignmentPanel(this.viewer, 'Splat Alignment', {});
    this.panel.createScrollContainer();

    const container = this.panel.scrollContainer;

    // Load LCC files if folder URN is provided
    if (this.folderUrn && this.lccFiles.length === 0) {
      this.fetchLccFiles().then(() => {
        if (this.lccFiles.length > 0) {
          this.updateFileSelector(container);
        }
      });
    }

    // Scale
    container.appendChild(this.createSlider('Scale', 'scale', 0.1, 10, 0.1));

    // Position
    container.appendChild(this.createLabel('Position'));
    container.appendChild(this.createSlider('X', 'posX', -100, 100, 0.5));
    container.appendChild(this.createSlider('Y', 'posY', -100, 100, 0.5));
    container.appendChild(this.createSlider('Z', 'posZ', -100, 100, 0.5));

    // Rotation
    container.appendChild(this.createLabel('Rotation (radians)'));
    container.appendChild(this.createSlider('X', 'rotX', -Math.PI, Math.PI, 0.01));
    container.appendChild(this.createSlider('Y', 'rotY', -Math.PI, Math.PI, 0.01));
    container.appendChild(this.createSlider('Z', 'rotZ', -Math.PI, Math.PI, 0.01));

    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 10px;
      margin-top: 15px;
      padding: 10px;
      border-top: 1px solid #555;
    `;

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style.cssText = `
      flex: 1;
      padding: 8px;
      background: #555;
      border: 1px solid #666;
      color: #fff;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    `;
    resetBtn.addEventListener('click', () => this.resetSettings());

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.cssText = `
      flex: 1;
      padding: 8px;
      background: #4CAF50;
      border: 1px solid #45a049;
      color: #fff;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    `;
    saveBtn.addEventListener('click', () => this.saveSettings());

    const clearCacheBtn = document.createElement('button');
    clearCacheBtn.textContent = 'Clear Cache';
    clearCacheBtn.style.cssText = `
      flex: 1;
      padding: 8px;
      background: #ff6b6b;
      border: 1px solid #ff5252;
      color: #fff;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      margin-top: 8px;
    `;
    clearCacheBtn.addEventListener('click', async () => {
      try {
        // Import and call clearCache from GaussianSplatRenderer
        const { clearCache } = await import('./GaussianSplatRenderer.mjs');
        await clearCache();
        alert('Cache cleared! Reload the page to re-download.');
      } catch (err) {
        alert('Failed to clear cache: ' + err.message);
      }
    });

    buttonContainer.appendChild(resetBtn);
    buttonContainer.appendChild(saveBtn);
    container.appendChild(buttonContainer);
    container.appendChild(clearCacheBtn);
  }

  updateFileSelector(container) {
    // Remove old selector if exists
    const oldSelector = container.querySelector('#lcc-file-selector');
    if (oldSelector) {
      oldSelector.remove();
    }

    if (this.lccFiles.length === 0) return;

    const selectorDiv = document.createElement('div');
    selectorDiv.id = 'lcc-file-selector';
    selectorDiv.style.cssText = `
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #555;
    `;

    const label = document.createElement('label');
    label.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
      font-size: 12px;
      color: #aaa;
      text-transform: uppercase;
    `;
    label.textContent = 'LCC File';

    const select = document.createElement('select');
    select.style.cssText = `
      width: 100%;
      padding: 6px;
      background: #444;
      border: 1px solid #666;
      color: #fff;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    `;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select LCC File --';
    select.appendChild(defaultOption);

    this.lccFiles.forEach(file => {
      const option = document.createElement('option');
      option.value = file.urn;
      option.textContent = file.name;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      if (e.target.value) {
        this.loadLccFile(e.target.value);
      }
    });

    selectorDiv.appendChild(label);
    selectorDiv.appendChild(select);
    container.insertBefore(selectorDiv, container.firstChild);
  }

  createLabel(text) {
    const label = document.createElement('div');
    label.style.cssText = `
      margin-top: 12px;
      margin-bottom: 8px;
      font-weight: bold;
      font-size: 12px;
      color: #aaa;
      text-transform: uppercase;
    `;
    label.textContent = text;
    return label;
  }

  createSlider(label, key, min, max, step) {
    const container = document.createElement('div');
    container.style.cssText = `
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    `;

    const labelEl = document.createElement('label');
    labelEl.style.cssText = `
      width: 50px;
      font-size: 12px;
      color: #aaa;
    `;
    labelEl.textContent = label;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = this.alignment[key];
    slider.style.cssText = `
      flex: 1;
      cursor: pointer;
    `;

    const valueDisplay = document.createElement('span');
    valueDisplay.style.cssText = `
      width: 60px;
      text-align: right;
      font-size: 12px;
      color: #4CAF50;
      font-weight: bold;
      font-family: monospace;
    `;
    valueDisplay.textContent = this.formatValue(this.alignment[key]);

    slider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.alignment[key] = value;
      valueDisplay.textContent = this.formatValue(value);
      this.updateSplatMesh();
    });

    container.appendChild(labelEl);
    container.appendChild(slider);
    container.appendChild(valueDisplay);

    return container;
  }

  formatValue(value) {
    if (value > 100 || value < -100) {
      return value.toFixed(2);
    }
    return value.toFixed(2);
  }

  updateSplatMesh() {
    if (!this.splatRenderer || !this.splatRenderer.mesh) {
      return;
    }

    const mesh = this.splatRenderer.mesh;
    mesh.scale.set(this.alignment.scale, this.alignment.scale, this.alignment.scale);
    mesh.position.set(this.alignment.posX, this.alignment.posY, this.alignment.posZ);
    mesh.rotation.set(this.alignment.rotX, this.alignment.rotY, this.alignment.rotZ);

    console.log('Splat alignment updated:', this.alignment);
  }

  saveSettings() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.alignment));
      console.log(`Splat alignment saved for model: ${this.modelName}`);
      alert('Settings saved!');
    } catch (e) {
      console.error('Failed to save settings:', e);
      alert('Failed to save settings');
    }
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.alignment = JSON.parse(saved);
        console.log(`Splat alignment loaded for model: ${this.modelName}`, this.alignment);
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
  }

  resetSettings() {
    this.alignment = {
      scale: 3.28084,
      posX: 0,
      posY: 0,
      posZ: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0
    };
    this.updateSplatMesh();
    this.updatePanelValues();
    console.log('Splat alignment reset to defaults');
  }

  updatePanelValues() {
    // Panel recreates on open, so sliders are always in sync
  }

  dispose() {
    if (this.panel) {
      this.panel.uninitialize();
    }
  }
}
