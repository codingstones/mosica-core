class GigService {
  constructor(httpClient) {
    this._httpClient = httpClient;
    this._baseUrl = "http://www.mosica.es/api/1";
    this._gigs_by_day = [];
  }

  retrieveNextGigs(){
    return new Promise((resolve, reject) => {
      this._httpClient.get(this._baseUrl + '/gigs').then((response) => {
        this._gigs_by_day = response.body['response'];
        resolve(this._gigs_by_day);
      });
    });
  }

  retrieveAGig(id){
    return new Promise((resolve, reject) => {
      this._gigs_by_day.forEach((day) => {
        day.gigs.forEach((gig) => {
          if(gig.id == id){
            resolve(gig);
            return;
          }
        });
      });
      throw 'Gig not found';
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