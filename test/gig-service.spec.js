var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var mosica = require('../index.js');

describe('Gig service', () => {
  let httpClient, gigService, httpClientStub;

  const someGigs = [
    {id: 1, title: "dead broncos"},
    {id: 2, title: "celtas cortos"},
  ];

  beforeEach(()=> {
    httpClient = new mosica.HttpClient();
    gigService = new mosica.GigService(httpClient);

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