window.agreementFL = window.agreementFL || [];

window.addEventListener("message", (event) => {
  console.log("📨 Message received in iframe:", event.data);

  if (event.data?.type === "functionallocations") {
    console.log("✅ FL payload received:", event.data.payload);
    window.agreementFL.push(...event.data.payload);
    AgreementFunctionalLocationSearch(viewer, event.data.payload);
  }
});



//***************************** sidebar button to open the model browser panel **************************
// document.getElementById("model-browser").addEventListener("click", modelBrowserPanel);


// function modelBrowserPanel() {
//   const panel = document.getElementById("model-browser-panel");
//   const isVisible = panel.style.visibility === "visible";
//   panel.style.visibility = isVisible ? "hidden" : "visible";
//   document.getElementById("preview").style.width = isVisible ? "96%" : "71%";

//   setTimeout(() => {
//     window.viewerInstance.resize();
//     window.viewerInstance.fitToView();
//   }, 300);

//   const viewer = window.viewerInstance;
//   const models = viewer.impl.modelQueue().getModels();

//   const treeContainer = document.querySelector(".tree");
//   treeContainer.innerHTML = "";

//   models.forEach((model) => {
//     const instanceTree = model.getData().instanceTree;
//     const rootId = instanceTree.getRootId();
//     const modelName = model.myData?.name || `Model ${model.id}`;

//     const modelDiv = document.createElement("div");
//     modelDiv.className = "tree-item parent";
//     modelDiv.innerHTML = `
//       <span class="expand">▸</span>
//       <strong>${modelName}</strong>
//     `;
//     const modelChildrenDiv = document.createElement("div");
//     modelChildrenDiv.className = "children hidden";

//     modelDiv.querySelector(".expand").addEventListener("click", () => {
//       const isHidden = modelChildrenDiv.classList.contains("hidden");
//       modelChildrenDiv.classList.toggle("hidden", !isHidden);
//       modelChildrenDiv.classList.toggle("show", isHidden);
//       modelDiv.querySelector(".expand").textContent = isHidden ? "▾" : "▸";
//     });

//     treeContainer.appendChild(modelDiv);
//     treeContainer.appendChild(modelChildrenDiv);

//     // Dig deeper if needed
//     resolveMeaningfulRoots(instanceTree, rootId, (realRoots) => {
//       realRoots.forEach((childId) => {
//         buildTreeNode(childId, modelChildrenDiv, viewer, instanceTree);
//       });
//     });
//   });

//   function isWrapperName(name) {
//     return ["Model", "Unnamed", "Document", "Default", "RootElement"].includes(name);
//   }

//   function resolveMeaningfulRoots(instanceTree, nodeId, callback) {
//     viewer.getProperties(nodeId, (props) => {
//       const name = props.name || "Unnamed";
//       if (!isWrapperName(name)) {
//         callback([nodeId]);
//       } else {
//         const realChildren = [];
//         const pending = [];
//         instanceTree.enumNodeChildren(nodeId, (childId) => {
//           pending.push(childId);
//         });

//         let resolved = 0;
//         pending.forEach((id) => {
//           viewer.getProperties(id, (childProps) => {
//             const childName = childProps.name || "Unnamed";
//             if (!isWrapperName(childName)) {
//               realChildren.push(id);
//             } else {
//               // Go one more level deep
//               instanceTree.enumNodeChildren(id, (grandchildId) => {
//                 realChildren.push(grandchildId);
//               });
//             }

//             resolved++;
//             if (resolved === pending.length) {
//               callback(realChildren);
//             }
//           });
//         });
//       }
//     });
//   }

//   function buildTreeNode(dbId, container, viewer, instanceTree) {
//     viewer.getProperties(dbId, (props) => {
//       const nodeName = props.name || "Unnamed";

//       const nodeDiv = document.createElement("div");
//       nodeDiv.className = "tree-item parent";
//       nodeDiv.dataset.id = dbId;
//       nodeDiv.innerHTML = `
//         <span class="expand">▸</span>
//         <img class="eye" src="./images/visible.svg" data-dbId="${dbId}" />
//         ${nodeName} [${dbId}]
//       `;

//       const childrenDiv = document.createElement("div");
//       childrenDiv.className = "children hidden";
//       childrenDiv.dataset.parent = dbId;

//       nodeDiv.querySelector(".expand").addEventListener("click", () => {
//         const isHidden = childrenDiv.classList.contains("hidden");
//         childrenDiv.classList.toggle("hidden", !isHidden);
//         childrenDiv.classList.toggle("show", isHidden);
//         nodeDiv.querySelector(".expand").textContent = isHidden ? "▾" : "▸";
//       });

//       nodeDiv.querySelector(".eye").addEventListener("click", (e) => {
//         const targetDbId = parseInt(e.target.dataset.dbid);
//         const visible = viewer.isNodeVisible(targetDbId);
//         if (visible) {
//           viewer.hide(targetDbId);
//           e.target.src = "./images/hidden.svg";
//         } else {
//           viewer.show(targetDbId);
//           e.target.src = "./images/visible.svg";
//         }
//       });

//       container.appendChild(nodeDiv);
//       container.appendChild(childrenDiv);

//       instanceTree.enumNodeChildren(dbId, (childDbId) => {
//         buildTreeNode(childDbId, childrenDiv, viewer, instanceTree);
//       });
//     });
//   }
// }

