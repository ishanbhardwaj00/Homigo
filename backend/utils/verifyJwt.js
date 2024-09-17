import jwt from 'jsonwebtoken'

export const verifyJwt = async (req, res, next) => {
  const { accessToken } = req.cookies
  if (!accessToken) {
    return res.send('<h1>You are not authorized to see this</h1>')
  }

  try {
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    req.decodedToken = decodedToken
    next()
  } catch (error) {
    return res.send('<h1>You are not authorized to see this</h1>')
  }
}
