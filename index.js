const Busboy = require('busboy')
const getRawBody = require('raw-body')
const contentType = require('content-type')

const allowedMethods = ['POST', 'PUT']
const fileParser = ({ rawBodyOptions, busboyOptions } = {}) => [(req, res, next) => {
  const type = req.headers['content-type']
  if (req.rawBody === undefined && allowedMethods.includes(req.method) && type && type.startsWith('multipart/form-data')) {
    getRawBody(req, Object.assign({
      length: req.headers['content-length'],
      limit: '10mb',
      encoding: contentType.parse(req).parameters.charset,
    }, rawBodyOptions), (err, rawBody) => {
      if (err) next(err)
      else {
        req.rawBody = rawBody
        next()
      }
    })
  } else {
    next()
  }
}, (req, res, next) => {
  const type = req.headers['content-type']
  if (allowedMethods.includes(req.method) && type && type.startsWith('multipart/form-data')) {
    let busboy = null
    try {
      busboy = new Busboy(Object.assign({ headers: req.headers }, busboyOptions))
    } catch (err) {
      next()
      return
    }
    req.files = []

    busboy.on('field', (fieldname, value) => {
      if (!req.body) req.body = {}
      req.body[fieldname] = value
    })

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

module.exports = fileParser()
module.exports.fileParser = fileParser
