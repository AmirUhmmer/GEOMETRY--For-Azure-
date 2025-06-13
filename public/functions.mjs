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
    //AgreementFunctionalLocationSearch(viewer, event.data.payload);
  }
});