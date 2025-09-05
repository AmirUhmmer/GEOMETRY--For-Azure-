// import { AgreementFunctionalLocationSearch } from "./functions/agreementFunctionalLocationSearch.mjs";
window.agreementFL = window.agreementFL || [];

window.addEventListener("message", (event) => {
  console.log("📨 Message received in iframe:", event.data);

  if (event.data?.type === "functionallocations") {
    console.log("✅ FL payload received:", event.data.payload);
    window.agreementFL.push(...event.data.payload);
    //AgreementFunctionalLocationSearch(viewer, event.data.payload);
  }
});


window.addEventListener("message", (event) => {
  console.log("📨 Message received in iframe:", event.data);

  if (event.data?.type === "quoteFunctionalLocations") {
    console.log("✅ FL payload received:", event.data.payload);
    window.agreementFL.push(...event.data.payload);
    // AgreementFunctionalLocationSearch(viewer, event.data.payload);
  }
});


window.addEventListener("message", function (event) {
  if (event.data?.type === "ready-for-data") {
    // Send confirmation back to the CRM form
    window.parent.postMessage({ type: "ready" }, "*");
  }

  if (event.data?.type === "QBSfunctionallocations") {
    const payload = event.data.payload;
    console.log("Got functional locations data:", payload);
    // Do something with it
  }
});
