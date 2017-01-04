import fs from 'fs'
import path from 'path'
import { expect } from 'chai'
import nock from 'nock'
import CWBClient from '../src/cwb_client'
import * as locations from '../src/locations'

const mockResponse = fs.readFileSync(path.resolve(__dirname, 'mock.xml'), 'utf-8')

describe('CWBClient', () => {
  describe('#constructor()', () => {
    it('should be instantiated', () => {
      const cwb = new CWBClient('api-key')
      expect(cwb).to.be.an.instanceof(CWBClient)
    })

    it('should throw error if missing apiKey', () => {
      expect(() => new CWBClient()).to.throw(Error)
    })

    it('should throw error if apiKey not a string', () => {
      expect(() => new CWBClient(123)).to.throw(Error)
    })
  })

  describe('#fetch()', () => {
    beforeEach(() => {
      Object.keys(locations).forEach(location => {
        nock('http://opendata.cwb.gov.tw')
          .defaultReplyHeaders({
            'Content-Type': 'application/xml'
          })
          .get(`/opendataapi?dataid=${locations[location]}&authorizationkey=api-key`)
          .reply(200, mockResponse)
      })
    })

    it('should fetch all weather assistants of locations', () => {
      const cwb = new CWBClient('api-key')
      return cwb.fetch().then(res => {
        expect(res).to.be.an('array')
      })
    })

    it('should fetch a weather assistant of the location', () => {
      const cwb = new CWBClient('api-key')
      return cwb.fetch({ location: 'TAIPEI_CITY' }).then(res => {
        expect(res).to.be.an('object')
      })
    })

    it('should throw error if location unavailable', () => {
      const cwb = new CWBClient('api-key')
      expect(() => cwb.fetch({ location: 'UNKNOWN' })).to.throw(Error)
    })

    it('should throw error if no response xml file', () => {
      nock.cleanAll()
      nock('http://opendata.cwb.gov.tw')
        .get(`/opendataapi?dataid=${locations['TAIPEI_CITY']}&authorizationkey=api-key`)
        .reply(200, {})

      const cwb = new CWBClient('api-key')
      return cwb.fetch({ location: 'TAIPEI_CITY' })
        .catch(err => {
          expect(err).to.be.an('error')
        })
    })

    it('should throw error if response invalid xml file', () => {
      nock.cleanAll()
      nock('http://opendata.cwb.gov.tw')
        .defaultReplyHeaders({
          'Content-Type': 'application/xml'
        })
        .get(`/opendataapi?dataid=${locations['TAIPEI_CITY']}&authorizationkey=api-key`)
        .reply(200, {})

      const cwb = new CWBClient('api-key')
      return cwb.fetch({ location: 'TAIPEI_CITY' })
        .catch(err => {
          expect(err).to.be.an('error')
        })
    })
  })

  describe('#locations()', () => {
    it('should return an array', () => {
      const cwb = new CWBClient('api-key')
      expect(cwb.locations()).to.be.an('array')
    })

    it('should return array of locations', () => {
      const cwb = new CWBClient('api-key')
      expect(cwb.locations()).to.eql(Object.keys(locations))
    })
  })
})
