var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

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

describe('Gig service', () => {
  let httpClient, gigService, httpClientStub;

  const someGigs = [
    {id: 1, title: "dead broncos"},
    {id: 2, title: "celtas cortos"},
  ];

  beforeEach(()=> {
    httpClient = new HttpClient();
    gigService = new GigService(httpClient);

    httpClientStub = sinon.stub(httpClient, 'get').returns({
      then: function(resp){
        return resp({body: someGigs});
      }
    });
  });

  it('returns the next gigs', () => {
    return gigService.retrieveNextGigs().then((gigs) => {
      expect(gigs.length).to.be.equal(2);

      expect(gigs[0].title).to.be.equal('dead broncos');

      expect(gigs[1].title).to.be.equal('celtas cortos');
    });
  });


  it('calls to the external http API', () => {
    gigService.retrieveNextGigs();

    expect(httpClientStub).calledWith('http://www.mosica.es/api/1/gigs');
  });
});