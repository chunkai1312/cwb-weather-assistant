'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xml2js = require('xml2js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CWBClient = function () {

  /**
   * Creates an instance of CWBClient.
   *
   * @param {string} apiKey - The api key.
   */
  function CWBClient(apiKey) {
    _classCallCheck(this, CWBClient);

    this.apiKey = apiKey;
  }

  _createClass(CWBClient, [{
    key: 'fetch',
    value: function fetch() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (options.hasOwnProperty('location')) {
        if (CWBClient.locations.hasOwnProperty(options.location)) {
          return this.getWeatherAssistant(CWBClient.locations[options.location]);
        } else {
          throw new Error('Invalid location.');
        }
      }

      var promises = Object.keys(CWBClient.locations).map(function (location) {
        return _this.getWeatherAssistant(CWBClient.locations[location]);
      });

      return Promise.all(promises);
    }

    /**
     * Get weather assistant by data id of the location.
     *
     * @param {string} dataid - The data id.
     */

  }, {
    key: 'getWeatherAssistant',
    value: function getWeatherAssistant(dataid) {
      var _this2 = this;

      return fetch('http://opendata.cwb.gov.tw/opendataapi?dataid=' + dataid + '&authorizationkey=' + this.apiKey).then(function (response) {
        return response.text();
      }).then(function (text) {
        return _this2.parseXml(text);
      }).then(function (data) {
        return _this2.parseData(data);
      });
    }

    /**
     * Parse XML string by using xml2js
     *
     * @param {string} xmlString - The XML string.
     * @return {object} result
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
     * Parse data from the result of xml2js.parsingString()
     *
     * @param {object} data - The result of xml2js.parsingString().
     * @return {object} result
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

CWBClient.locations = {
  TAIPEI_CITY: 'F-C0032-009', // 台北市
  NEW_TAIPEI_CITY: 'F-C0032-010', // 新北市
  KEELUNG_CITY: 'F-C0032-011', // 基隆市
  HUALIEN_COUNTY: 'F-C0032-012', // 花蓮縣
  YILAN_COUNTY: 'F-C0032-013', // 宜蘭縣
  KINMEN_COUNTY: 'F-C0032-014', // 金門縣
  PENGHU_COUNTY: 'F-C0032-015', // 澎湖縣
  TAINAN_CITY: 'F-C0032-016', // 台南市
  KAOHSIUNG_CITY: 'F-C0032-017', // 高雄市
  CHIAYI_COUNTY: 'F-C0032-018', // 嘉義縣
  CHIAYI_CITY: 'F-C0032-019', // 嘉義市
  MIAOLI_COUNTY: 'F-C0032-020', // 苗栗縣
  TAICHUNG_CITY: 'F-C0032-021', // 台中市
  TAOYUAN_CITY: 'F-C0032-022', // 桃園市
  HSINCHU_COUNTY: 'F-C0032-023', // 新竹縣
  HSINCHU_CITY: 'F-C0032-024', // 新竹市
  PINGTUNG_COUNTY: 'F-C0032-025', // 屏東縣
  NANTOU_COUNTY: 'F-C0032-026', // 南投縣
  TAITUNG_COUNTY: 'F-C0032-027', // 台東縣
  CHANGHUA_COUNTY: 'F-C0032-028', // 彰化線
  YUNLIN_COUNTY: 'F-C0032-029', // 雲林縣
  LIENCHIANG_COUNTY: 'F-C0032-030' // 連江縣
};
exports.default = CWBClient;