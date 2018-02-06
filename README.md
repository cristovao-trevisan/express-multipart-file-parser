# Express Multipart File Parser
[![npm version](https://badge.fury.io/js/express-multipart-file-parser.svg)](https://badge.fury.io/js/express-multipart-file-parser)
[![Code style: airbnb](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square)](https://github.com/airbnb/javascript)

Parser for express that allows file upload with *multipart/form-data*

## Usage

```js
const fileMiddleware = require('express-multipart-file-parser')

...
app.use(fileMiddleware)
...

app.post('/file', (req, res) => {
  const {
    fieldname,
    filename,
    encoding,
    mimetype,
    buffer,
  } = req.files[0]
  ...
})
```
