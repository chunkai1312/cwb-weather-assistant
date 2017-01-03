# cwb-weather-assistant

> Simple CWB client to fetch weather assistant for JavaScript

## Install

```sh
$ npm install --save fqb
```

### Browser

Add a `<script>` to your `index.html`:

```html
<script src="/node_modules/cwb-weather-assistant/dist/cwb-weather-assistant.min.js"></script>
```

### Node.js / Webpack

Import the module to your `*.js` file:

```js
const CWBClient = require('cwb-weather-assistant')
```

## Usage

```js
const cwb = new CWBClient(API_KEY)
```

### Fetch all weather assistants of locations

```js
cwb.fetch()
  .then(res => {
    console.log(res)  // result of the request
  })
  .catch(err => {
    console.log(err)
  })
```

### Fetch a weather assistant of the location

```js
cwb.fetch({ location: LOCATION })
  .then(res => {
    console.log(res)  // result of the request
  })
  .catch(err => {
    console.log(err)
  })

```

### Get available LOCATION list

```js
cwb.locations()  // an array for list of locations
```

| Location           | Name  |
| ------------------ |:-----:|
| TAIPEI_CITY        | 台北市 |
| NEW_TAIPEI_CITY    | 新北市 |
| KEELUNG_CITY       | 基隆市 |
| HUALIEN_COUNTY     | 花蓮縣 |
| YILAN_COUNTY       | 宜蘭縣 |
| KINMEN_COUNTY      | 金門縣 |
| PENGHU_COUNTY      | 澎湖縣 |
| TAINAN_CITY        | 台南市 |
| KAOHSIUNG_CITY     | 高雄市 |
| CHIAYI_COUNTY      | 嘉義縣 |
| CHIAYI_CITY        | 嘉義市 |
| MIAOLI_COUNTY      | 苗栗縣 |
| TAICHUNG_CITY      | 台中市 |
| TAOYUAN_CITY       | 桃園市 |
| HSINCHU_COUNTY     | 新竹縣 |
| HSINCHU_CITY       | 新竹市 |
| PINGTUNG_COUNTY    | 屏東縣 |
| NANTOU_COUNTY      | 南投縣 |
| TAITUNG_COUNTY     | 台東縣 |
| CHANGHUA_COUNTY    | 彰化線 |
| YUNLIN_COUNTY      | 雲林縣 |
| LIENCHIANG_COUNTY  | 連江縣 |

## Reference

[交通部中央氣象局-開放資料平臺](http://opendata.cwb.gov.tw)

## License

MIT © [Chun-Kai Wang](https://github.com/chunkai1312)
