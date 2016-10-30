class Gig {
  constructor(args){
    Object.assign(this, args);
  }
}

class GigService {
  constructor(httpClient) {
    this._httpClient = httpClient;
    this._baseUrl = "http://www.mosica.es/api/1";
    this._gigs = [];
  }

  retrieveNextGigs(){
    return new Promise((resolve, reject) => {
      this._httpClient.get(this._baseUrl + '/gigs').then((response) => {
        let gigs_by_day = response.body['response'];

        gigs_by_day.forEach((day) => {
          let gigs = day.gigs.map((gig) => {
            return new Gig(gig);
          });

          this._gigs = this._gigs.concat(gigs);
        });
        
        resolve(gigs_by_day);
      });
    });
  }

  retrieveAGig(id){
    return new Promise((resolve, reject) => {
      let gig = this._gigs.find((gig) => { return (gig.id == id) });

      if(gig) {
        resolve(gig);
      } else {
        throw 'Gig not found';
      }
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