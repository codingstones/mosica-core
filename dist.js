'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Gig = function Gig(args) {
  _classCallCheck(this, Gig);

  Object.assign(this, args);
};

var GigService = function () {
  function GigService(httpClient, matcher) {
    _classCallCheck(this, GigService);

    this._httpClient = httpClient;
    this._baseUrl = "http://www.mosica.es/api/1";
    this._gigs = [];
    this._matcher = matcher;
  }

  _createClass(GigService, [{
    key: 'retrieveNextGigs',
    value: function retrieveNextGigs() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this._httpClient.get(_this._baseUrl + '/gigs').then(function (response) {
          var gigs_by_day = response.body['response'];

          gigs_by_day.forEach(function (day) {
            var gigs = day.gigs.map(function (gig) {
              return new Gig(gig);
            });

            _this._gigs = _this._gigs.concat(gigs);
          });

          resolve(gigs_by_day);
        });
      });
    }
  }, {
    key: 'retrieveAGig',
    value: function retrieveAGig(id) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var gig = _this2._gigs.find(function (gig) {
          return gig.id == id;
        });

        if (gig) {
          resolve(gig);
        } else {
          throw 'Gig not found';
        }
      });
    }
  }, {
    key: 'searchGigs',
    value: function searchGigs(term) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var matches = [];
        _this3._gigs.forEach(function (gig) {
          if (_this3._matcher.hasTheTerm(gig.title, term) || _this3._matcher.hasTheTerm(gig.place, term)) {
            matches.push(gig);
          }
        });
        resolve(matches);
      });
    }
  }]);

  return GigService;
}();

var requests = require('superagent');

var HttpClient = function () {
  function HttpClient() {
    _classCallCheck(this, HttpClient);
  }

  _createClass(HttpClient, [{
    key: 'get',
    value: function get(url) {
      return new Promise(function (resolve, reject) {
        requests.get(url).end(function (err, response) {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        });
      });
    }
  }]);

  return HttpClient;
}();

var Matcher = function () {
  function Matcher() {
    _classCallCheck(this, Matcher);

    this.FROM = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ";
    this.TO = "AAAAAEEEEIIIIOOOOUUUU";
  }

  _createClass(Matcher, [{
    key: 'hasTheTerm',
    value: function hasTheTerm(text, term) {
      if (text) {
        text = this.normalize(text.toUpperCase());
        term = this.normalize(term.toUpperCase());
        return text.indexOf(term) > -1;
      }
    }
  }, {
    key: 'normalize',
    value: function normalize(a_string) {
      var _this4 = this;

      this.FROM.split("").forEach(function (change_from, index) {
        var change_to = _this4.TO[index];
        a_string = a_string.replace(change_from, change_to);
      });
      return a_string;
    }
  }]);

  return Matcher;
}();

module.exports = {
  HttpClient: HttpClient,
  Matcher: Matcher,
  GigService: GigService
};
