import { GeoData } from '../../../types';

const api_host = `https://vast-escarpment-79117.herokuapp.com/?ip=`;

export default class {
  fetchGeoData(ip: string): Promise<GeoData> {
    return new Promise<GeoData>(((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.open('GET', `${api_host}${ip}`, true);
      xhr.send();

      xhr.onreadystatechange = function() {
        if (this.readyState !== 4) return;

        resolve(this.response);
      };

      xhr.onerror = function(e) {
        reject(e);
      }
    }));
  }
}