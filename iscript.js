
window.onload = async () => {
  var rows = null;
  const apiCall = () =>
    new Promise((resolve, rejects) => {
      const url = "https://arghyam-be.tridz.in/api/search";
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          rows = data.rows;
          resolve(rows);
        })
        .catch((error) => {
          console.log(error);
          rejects("api-call-failed");
        });
    });
  apiCall();

  //detail page script start
  if (window.location.pathname == "/details.html") {
    console.log(window.location.pathname);
    const url = new URL(window.location.href);
    console.log(url);
    const params1 = new URLSearchParams(url.search);
    console.log("params1.get('id')-->", await params1);
    console.log(params1.get("id"));
    apiCall()
      .then((e) => {
        console.log("data", rows);
        let value = rows.filter((e) => e.uuid == params1.get("id"));
        console.log("value is ", value);
        if (value) {
          document.querySelector("#title-single-blog").textContent =
            value[0].title;
          document.querySelector("#body-single-blog").innerHTML = value[0].body;
        }
      })
      .catch((e) => {
        console.error("api call failed");
      });
  } else {
    apiCall().then((e) => {
      const container = document.querySelector(".container");

      rows.forEach((row) => {
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
        container.appendChild(card);

        // Add event listener to the card element
        card.addEventListener("click", () => {
          window.location.href = `details.html?id=${row.uuid}`;
        });
      });
    });
  }
  //detail page script end

  const searchInput = document.querySelector(".form-control");
  const suggestionsList = document.querySelector("#suggestions-list");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    const url = `https://arghyam-be.tridz.in/api/search?title=${searchTerm}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        suggestionsList.innerHTML = "";
        data.rows.forEach((row) => {
          if (row.title.toLowerCase().startsWith(searchTerm.toLowerCase())) {
            const suggestion = document.createElement("li");
            suggestion.classList.add("mb-2", "list-unstyled");
            suggestion.textContent = row.title;
            suggestion.addEventListener("click", () => {
              searchInput.value = row.title;
              // suggestionsList.innerHTML = "";
          });
            suggestionsList.appendChild(suggestion);
          }
        });
      })
      .catch((error) => console.log(error));
  });

    const sBtn = document.querySelector("#searchBtn");
    sBtn.addEventListener("click", async () => {
      const searchTerm = searchInput.value.trim();
      const url = `https://arghyam-be.tridz.in/api/search?title=${searchTerm}`;
    
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const suggestion = data.rows.find(
            (row) => row.title.toLowerCase() === searchTerm.toLowerCase()
          );
          if (suggestion) {
            window.location.href = `details.html?id=${suggestion.uuid}`;
          }
        })
        .catch((error) => console.log(error));
    });
  
  
  
}

