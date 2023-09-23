const { responses } = require('../translations/responses')

exports.gl = (req, key) => {
  return responses[key][req.headers.language || process.env.DEFAULT_LANGUAGE]
}
