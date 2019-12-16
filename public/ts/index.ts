import geoAPI from './sdk';

document.getElementById('form').addEventListener('submit', (event) => {
  event.preventDefault();

  const input = document.getElementById('ip-field') as HTMLInputElement;
  const responseField = document.getElementById('response') as HTMLParagraphElement;

  let ip = input.value;

  geoAPI.fetchGeoData(ip)
    .then(result => responseField.innerText = result.toString())
    .catch(error => responseField.innerText = error.toString())
});