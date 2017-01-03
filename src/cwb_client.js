import 'isomorphic-fetch'
import { parseString } from 'xml2js'
import * as locations from './locations'

class CWBClient {

  /**
   * Create a new CWBClient.
   *
   * @public
   * @param {string} apiKey - The api key.
   */
  constructor (apiKey) {
    if (typeof apiKey === 'undefined') {
      throw new Error('Missing apiKey.')
    }

    if (typeof apiKey !== 'string') {
      throw new Error('Expected apiKey to be a string.')
    }

    this.apiKey = apiKey
  }

  /**
   * Fetch weather assistant from CWB Open Data API.
   *
   * @public
   * @param  {object} options
   * @param  {string} options.location - The available location.
   * @return {Promise} The result of the fetch.
   */
  fetch (options = {}) {
    if (options.hasOwnProperty('location')) {
      if (locations.hasOwnProperty(options.location)) {
        return this.getWeatherAssistant(locations[options.location])
      } else {
        throw new Error('Invalid location.')
      }
    }

    const promises = Object.keys(locations)
      .map(location => this.getWeatherAssistant(locations[location]))

    return Promise.all(promises)
  }

  /**
   * List available locations.
   *
   * @return {Array} The available location list.
   */
  locations () {
    return Object.keys(locations)
  }

  /**
   * Get weather assistant by data id of the location.
   *
   * @private
   * @param  {string} dataid - The data id.
   * @return {Promise} The result of the request.
   */
  getWeatherAssistant (dataid) {
    return fetch(`http://opendata.cwb.gov.tw/opendataapi?dataid=${dataid}&authorizationkey=${this.apiKey}`)
      .then(this.parseResponse)
      .then(this.parseXml)
      .then(this.parseData)
  }

  /**
   * Parse the fetch response.
   *
   * @private
   * @param  {object} response - The fetch response.
   * @return {string} The response text.
   */
  parseResponse (response) {
    if (response.headers.get('content-type') !== 'application/xml') {
      throw new Error('Temporary Network Error. Please try again later.')
    }

    return response.text()
  }

  /**
   * Parse XML string by using xml2js.
   *
   * @private
   * @param  {string} xmlString - The XML string.
   * @return {object} - The result of parse.
   */
  parseXml (xmlString) {
    return new Promise((resolve, reject) => {
      parseString(xmlString, { trim: true, explicitArray: false }, (err, result) => {
        if (err) reject(new Error('Temporary Network Error. Please try again later.'))
        resolve(result)
      })
    })
  }

  /**
   * Parse data from the result of xml2js.parsingString().
   *
   * @private
   * @param  {object} data - The result of xml2js.parsingString().
   * @return {object} The result of parse.
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
