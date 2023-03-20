
document.addEventListener("DOMContentLoaded", () => {
  const apiCall = async () => {
    try {
      const response = await fetch("https://arghyam-be.tridz.in/api/search");
      const data = await response.json();
      return data.rows;
    } catch (error) {
      console.error(error);
      throw new Error("api-call-failed");
    }
  };

  const renderCard = (row) => {
    const card = document.createElement("div");
    card.classList.add("card", "mb-3");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = row.title;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.innerHTML = row.body;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    card.appendChild(cardBody);

    card.addEventListener("click", () => {
      window.location.href = `details.html?id=${row.uuid}`;
    });

    return card;
  };

  const renderDetailsPage = async (params) => {
    const data = await apiCall();
    const value = data.find((e) => e.uuid === params.get("id"));
    if (value) {
      document.querySelector("#title-single-blog").textContent = value.title;
      document.querySelector("#body-single-blog").innerHTML = value.body;
    }
  };

  const renderHomePage = async () => {
    const data = await apiCall();
    const container = document.querySelector(".container");
    data.forEach((row) => {
      const card = renderCard(row);
      container.appendChild(card);
    });
  };

  const renderSuggestions = (data, searchTerm) => {
    const suggestionsList = document.querySelector("#suggestions-list");
    suggestionsList.innerHTML = "";
    data.forEach((row) => {
      if (row.title.toLowerCase().startsWith(searchTerm.toLowerCase())) {
        const suggestion = document.createElement("li");
        suggestion.classList.add("mb-2", "list-unstyled");
        suggestion.textContent = row.title;
        suggestion.addEventListener("click", () => {
          searchInput.value = row.title;
          suggestionsList.innerHTML = "";
        });
        suggestionsList.appendChild(suggestion);
      }
    });
  };

  const renderSearchResult = async (searchTerm) => {
    const data = await apiCall();
    const suggestion = data.find(
      (row) => row.title.toLowerCase() === searchTerm.toLowerCase()
    );
    if (suggestion) {
      window.location.href = `details.html?id=${suggestion.uuid}`;
    }
  };

  if (window.location.pathname === "/details.html") {
    const params = new URLSearchParams(window.location.search);
    renderDetailsPage(params).catch((error) => console.error(error));
  } else {
    renderHomePage().catch((error) => console.error(error));
  }

  const searchInput = document.querySelector("#inputBox");
  if (searchInput) {
    searchInput.addEventListener("input", async () => {
      const searchTerm = searchInput.value.trim();
      const data = await apiCall();
      renderSuggestions(data, searchTerm);
    });
  }

  const searchBtn = document.querySelector("#searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
      const searchTerm = searchInput.value.trim();
      await renderSearchResult(searchTerm);
    });
  }
});

