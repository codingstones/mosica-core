class GigService {
  constructor(httpClient) {
    this._httpClient = httpClient;
    this._baseUrl = "http://www.mosica.es/api/1"
  }

  retrieveNextGigs(){
    return new Promise((resolve, reject) => {
      this._httpClient.get(this._baseUrl + '/gigs').then((response) => {
        resolve(response.body['response']);
      });
    });
  }
}

var requests = require('superagent');

class HttpClient {
  get(url) {
    return new Promise((resolve, reject) => {
      requests.get(url).end((err, response) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(response);
        }
      });
    });
  }
}

module.exports = {
  HttpClient: HttpClient,
  GigService: GigService
}