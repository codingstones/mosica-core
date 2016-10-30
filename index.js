class GigService {
  constructor(httpClient) {
    this._httpClient = httpClient;
    this._baseUrl = "http://www.mosica.es/api/1"
  }

  retrieveNextGigs(){
    return new Promise((resolve, reject) => {
      this._httpClient.get(this._baseUrl + '/gigs').then((response) => {
        resolve(response.body);
      });
    });
  }
}

class HttpClient {
  get(url){

  }
}

module.exports = {
  HttpClient: HttpClient,
  GigService: GigService
}