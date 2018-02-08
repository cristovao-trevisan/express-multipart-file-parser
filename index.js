const Busboy = require('busboy')
const getRawBody = require('raw-body')
const contentType = require('content-type')

module.exports = [(req, res, next) => {
  if (req.rawBody === undefined && req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
    getRawBody(req, {
      length: req.headers['content-length'],
      limit: '10mb',
      encoding: contentType.parse(req).parameters.charset,
    }, (err, rawBody) => {
      if (err) next(err)
      else {
        req.rawBody = rawBody
        next()
      }
    })
  } else {
    next()
  }
}, (req, res, next) => { // eslint-disable-line consistent-return
  if (req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
    let busboy = null
    try {
      busboy = new Busboy({ headers: req.headers })
    } catch (err) {
      return next()
    }
    req.files = []

    busboy.on('field', (fieldname, value) => { req.body[fieldname] = value })

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      let fileBuffer = Buffer.from('')
      file.on('data', (data) => { fileBuffer = Buffer.concat([fileBuffer, data]) })
      file.on('end', () => req.files.push({
        fieldname,
        originalname: filename,
        encoding,
        mimetype,
        buffer: fileBuffer,
      }))
    })

    busboy.on('finish', () => {
      next()
    })

    busboy.end(req.rawBody)
  } else {
    next()
  }
}]
