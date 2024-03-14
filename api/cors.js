module.exports = async (ctx, next) => {
  const { req, res } = ctx
  const origin = req.get('Origin') || '*'
  res.set('Access-Control-Allow-Origin', origin)
  res.set('Access-Control-Allow-Credentials', 'true')

  if (req.method !== 'OPTIONS') return await next()

  res.set('Access-Control-Allow-Headers', 'Authorization,Content-Type')
  res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
  res.set('Access-Control-Max-Age', '3600')
  res.set('Vary', 'Origin')
  res.status(204).send('')
}
