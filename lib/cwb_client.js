'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('isomorphic-fetch');

var _xml2js = require('xml2js');

var _locations2 = require('./locations');

var _locations = _interopRequireWildcard(_locations2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CWBClient = function () {

  /**
   * Create a new CWBClient.
   *
   * @public
   * @param {string} apiKey - The api key.
   */
  function CWBClient(apiKey) {
    _classCallCheck(this, CWBClient);

    if (typeof apiKey === 'undefined') {
      throw new Error('Missing apiKey.');
    }

    if (typeof apiKey !== 'string') {
      throw new Error('Expected apiKey to be a string.');
    }

    this.apiKey = apiKey;
  }

  /**
   * Fetch weather assistant from CWB Open Data API.
   *
   * @public
   * @param  {object} options
   * @param  {string} options.location - The available location.
   * @return {Promise} The result of the fetch.
   */


  _createClass(CWBClient, [{
    key: 'fetch',
    value: function fetch() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (options.hasOwnProperty('location')) {
        if (_locations.hasOwnProperty(options.location)) {
          return this.getWeatherAssistant(_locations[options.location]);
        } else {
          throw new Error('Invalid location.');
        }
      }

      var promises = Object.keys(_locations).map(function (location) {
        return _this.getWeatherAssistant(_locations[location]);
      });

      return Promise.all(promises);
    }

    /**
     * List available locations.
     *
     * @return {Array} The available location list.
     */

  }, {
    key: 'locations',
    value: function locations() {
      return Object.keys(_locations);
    }

    /**
     * Get weather assistant by data id of the location.
     *
     * @private
     * @param  {string} dataid - The data id.
     * @return {Promise} The result of the request.
     */

  }, {
    key: 'getWeatherAssistant',
    value: function getWeatherAssistant(dataid) {
      return fetch('http://opendata.cwb.gov.tw/opendataapi?dataid=' + dataid + '&authorizationkey=' + this.apiKey).then(this.parseResponse).then(this.parseXml).then(this.parseData);
    }

    /**
     * Parse the fetch response.
     *
     * @private
     * @param  {object} response - The fetch response.
     * @return {string} The response text.
     */

  }, {
    key: 'parseResponse',
    value: function parseResponse(response) {
      if (response.headers.get('content-type') !== 'application/xml') {
        throw new Error('Temporary Network Error. Please try again later.');
      }

      return response.text();
    }

    /**
     * Parse XML string by using xml2js.
     *
     * @private
     * @param  {string} xmlString - The XML string.
     * @return {object} - The result of parse.
     */

  }, {
    key: 'parseXml',
    value: function parseXml(xmlString) {
      return new Promise(function (resolve, reject) {
        (0, _xml2js.parseString)(xmlString, { trim: true, explicitArray: false }, function (err, result) {
          if (err) reject(err);
          resolve(result);
        });
      });
    }

    /**
     * Parse data from the result of xml2js.parsingString().
     *
     * @private
     * @param  {object} data - The result of xml2js.parsingString().
     * @return {object} The result of parse.
     */

  }, {
    key: 'parseData',
    value: function parseData(data) {
      var _data$cwbopendata = data.cwbopendata,
          dataid = _data$cwbopendata.dataid,
          dataset = _data$cwbopendata.dataset;
      var datasetInfo = dataset.datasetInfo,
          location = dataset.location,
          parameterSet = dataset.parameterSet;


      var message = parameterSet.parameter.reduce(function (prev, current, index) {
        return index !== parameterSet.parameter.length - 1 ? '' + prev + current.parameterValue + '\n\n' : '' + prev + current.parameterValue;
      }, '');

      return {
        dataid: dataid,
        location: location,
        message: message,
        updatedAt: datasetInfo.issueTime
      };
    }
  }]);

  return CWBClient;
}();

exports.default = CWBClient;
module.exports = exports['default'];