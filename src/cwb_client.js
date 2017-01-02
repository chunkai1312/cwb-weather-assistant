import { parseString } from 'xml2js'

class CWBClient {

  static locations = {
    TAIPEI_CITY: 'F-C0032-009',       // 台北市
    NEW_TAIPEI_CITY: 'F-C0032-010',   // 新北市
    KEELUNG_CITY: 'F-C0032-011',      // 基隆市
    HUALIEN_COUNTY: 'F-C0032-012',    // 花蓮縣
    YILAN_COUNTY: 'F-C0032-013',      // 宜蘭縣
    KINMEN_COUNTY: 'F-C0032-014',     // 金門縣
    PENGHU_COUNTY: 'F-C0032-015',     // 澎湖縣
    TAINAN_CITY: 'F-C0032-016',       // 台南市
    KAOHSIUNG_CITY: 'F-C0032-017',    // 高雄市
    CHIAYI_COUNTY: 'F-C0032-018',     // 嘉義縣
    CHIAYI_CITY: 'F-C0032-019',       // 嘉義市
    MIAOLI_COUNTY: 'F-C0032-020',     // 苗栗縣
    TAICHUNG_CITY: 'F-C0032-021',     // 台中市
    TAOYUAN_CITY: 'F-C0032-022',      // 桃園市
    HSINCHU_COUNTY: 'F-C0032-023',    // 新竹縣
    HSINCHU_CITY: 'F-C0032-024',      // 新竹市
    PINGTUNG_COUNTY: 'F-C0032-025',   // 屏東縣
    NANTOU_COUNTY: 'F-C0032-026',     // 南投縣
    TAITUNG_COUNTY: 'F-C0032-027',    // 台東縣
    CHANGHUA_COUNTY: 'F-C0032-028',   // 彰化線
    YUNLIN_COUNTY: 'F-C0032-029',     // 雲林縣
    LIENCHIANG_COUNTY: 'F-C0032-030'  // 連江縣
  }

  /**
   * Creates an instance of CWBClient.
   *
   * @param {string} apiKey - The api key.
   */
  constructor (apiKey) {
    this.apiKey = apiKey
  }

  fetch (options = {}) {
    if (options.hasOwnProperty('location')) {
      if (CWBClient.locations.hasOwnProperty(options.location)) {
        return this.getWeatherAssistant(CWBClient.locations[options.location])
      } else {
        throw new Error('Invalid location.')
      }
    }

    const promises = Object.keys(CWBClient.locations)
      .map(location => this.getWeatherAssistant(CWBClient.locations[location]))

    return Promise.all(promises)
  }

  /**
   * Get weather assistant by data id of the location.
   *
   * @param {string} dataid - The data id.
   */
  getWeatherAssistant (dataid) {
    return fetch(`http://opendata.cwb.gov.tw/opendataapi?dataid=${dataid}&authorizationkey=${this.apiKey}`)
      .then(response => response.text())
      .then(text => this.parseXml(text))
      .then(data => this.parseData(data))
  }

  /**
   * Parse XML string by using xml2js
   *
   * @param {string} xmlString - The XML string.
   * @return {object} result
   */
  parseXml (xmlString) {
    return new Promise((resolve, reject) => {
      parseString(xmlString, { trim: true, explicitArray: false }, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  /**
   * Parse data from the result of xml2js.parsingString()
   *
   * @param {object} data - The result of xml2js.parsingString().
   * @return {object} result
   */
  parseData (data) {
    const { dataid, dataset } = data.cwbopendata
    const { datasetInfo, location, parameterSet } = dataset

    const message = parameterSet.parameter.reduce((prev, current, index) => {
      return (index !== parameterSet.parameter.length - 1)
        ? `${prev}${current.parameterValue}\n\n`
        : `${prev}${current.parameterValue}`
    }, '')

    return {
      dataid,
      location,
      message,
      updatedAt: datasetInfo.issueTime
    }
  }

}

export default CWBClient
