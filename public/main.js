let dataTable;

document.addEventListener("DOMContentLoaded", () => {
  const stateSelect = document.getElementById("stateSelect");
  const citySelect = document.getElementById("citySelect");
  const bankSelect = document.getElementById("bankSelect");
  const form = document.getElementById("lookupForm");
  const resultsBody = document.getElementById("resultsBody");

  const fetchOptions = async (url) => {
    const res = await fetch(url);
    return await res.json();
  };


  fetchOptions("/api/states").then(states => {
    states.forEach(state => {
      stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
    });
  });

  stateSelect.addEventListener("change", () => {
    fetchOptions(`/api/cities?state=${stateSelect.value}`).then(cities => {
      citySelect.innerHTML = `<option value="">Select City</option>`;
      cities.forEach(city => {
        citySelect.innerHTML += `<option value="${city}">${city}</option>`;
      });
    });
  });

  citySelect.addEventListener("change", () => {
    fetchOptions(`/api/banks?state=${stateSelect.value}&city=${citySelect.value}`).then(banks => {
      bankSelect.innerHTML = `<option value="">Select Bank</option>`;
      banks.forEach(bank => {
        bankSelect.innerHTML += `<option value="${bank}">${bank}</option>`;
      });
    });
  });
	
	form.addEventListener("submit", async (e) => {
		e.preventDefault();

    if (dataTable) {
      dataTable.destroy();
    }

		const state = stateSelect.value;
		const city = citySelect.value;
		const bank = bankSelect.value;
	
		let url = `/api/routings?`;
		if (state) url += `state=${state}&`;
		if (city) url += `city=${city}&`;
		if (bank) url += `bank=${bank}&`;
	
		const res = await fetch(url);
		const data = await res.json();
	
		resultsBody.innerHTML = "";
		data.forEach(row => {
			resultsBody.innerHTML += `
				<tr>
					<td>${row.State}</td>
					<td>${row.City}</td>
					<td>${row.Bank}</td>
					<td>${row.RoutingNumber}</td>
				</tr>
			`;
		});
    dataTable = $('#resultsTable').DataTable();
	});	
});

$(document).ready(() => {
  dataTable = $('#resultsTable').DataTable();
});