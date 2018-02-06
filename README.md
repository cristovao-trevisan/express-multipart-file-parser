# Express Multipart File Parser

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