async function loadServices() {
    const response = await fetch("/services");
    const services = await response.json();
  
    const servicesContainer = document.getElementById("services");
    const incidentServiceSelect = document.getElementById("incident-service");
  
    servicesContainer.innerHTML = "";
    incidentServiceSelect.innerHTML = "";
  
    for (const service of services) {
      const serviceElement = document.createElement("div");
  
      serviceElement.innerHTML = `
        <strong>${service.name}</strong>
        <span> — ${service.status}</span>
  
        <select data-service-id="${service.id}">
          <option value="operational">Operational</option>
          <option value="degraded">Degraded</option>
          <option value="outage">Outage</option>
        </select>
      `;
  
      const statusSelect = serviceElement.querySelector("select");
      statusSelect.value = service.status;
  
      statusSelect.addEventListener("change", async () => {
        await fetch(`/services/${service.id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: statusSelect.value
          })
        });
  
        await loadServices();
      });
  
      servicesContainer.appendChild(serviceElement);
  
      const option = document.createElement("option");
      option.value = service.id;
      option.textContent = service.name;
  
      incidentServiceSelect.appendChild(option);
    }
  }
  
  async function loadIncidents() {
    const response = await fetch("/incidents");
    const incidents = await response.json();
  
    const incidentsContainer = document.getElementById("incidents");
  
    incidentsContainer.innerHTML = "";
  
    for (const incident of incidents) {
      const incidentElement = document.createElement("div");
  
      incidentElement.innerHTML = `
        <strong>${incident.service_name}</strong>
        <span> — ${incident.message}</span>
        <small>${incident.created_at}</small>
      `;
  
      incidentsContainer.appendChild(incidentElement);
    }
  }
  
  document
    .getElementById("service-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const nameInput = document.getElementById("service-name");
  
      await fetch("/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: nameInput.value
        })
      });
  
      nameInput.value = "";
  
      await loadServices();
    });
  
  document
    .getElementById("incident-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const serviceSelect = document.getElementById("incident-service");
      const messageInput = document.getElementById("incident-message");
  
      await fetch("/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          serviceId: Number(serviceSelect.value),
          message: messageInput.value
        })
      });
  
      messageInput.value = "";
  
      await loadIncidents();
    });
  
  loadServices();
  loadIncidents();