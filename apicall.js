export const api_Call = () =>
new Promise((resolve, rejects) => {
  const url = "https://arghyam-be.tridz.in/api/search";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
        console.log('hoi houhyi')
      resolve(data)
    })
    .catch((error) =>{ console.log(error);rejects('api-call-failed')});
});