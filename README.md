[![npm version](https://badge.fury.io/js/express-multipart-file-parser.svg)](https://badge.fury.io/js/express-multipart-file-parser)
[![Code style: airbnb](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square)](https://github.com/airbnb/javascript)

# Express Multipart File Parser

Parser for express that allows file upload with *multipart/form-data*

**Works with Google Cloud Functions**

## Usage

```js
// default parser without destructuring
const fileParser = require('express-multipart-file-parser')

...
app.use(fileParser)
...

app.post('/file', (req, res) => {
  const {
    fieldname,
    originalname,
    encoding,
    mimetype,
    buffer,
  } = req.files[0]
  ...
})
```

### Usage with Options


```js
// must use destructuring for options
const { fileParser } = require('express-multipart-file-parser')

...
app.use(fileParser({
  rawBodyOptions: {
    limit: '15mb',
  },
  busboyOptions: {
    limits: {
      fields: 2
    }
  },
}))
```

## Options

- rawBodyOptions: see [raw-body](https://github.com/stream-utils/raw-body#api)
- busboyOptions: see [busboy](https://github.com/mscdex/busboy#busboy-methods)
