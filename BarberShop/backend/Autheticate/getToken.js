async function getUserToken(req, res){
    const authorizationHeader = req.headers['authorization']
    if(!authorizationHeader) {
        res.status(401).json({ message: 'Token de autorização ausente' })
        return
    }
    const token = authorizationHeader.split(' ')[1]
    if(!token) {
        res.status(401).json({ message: 'Formato de token inválido' })
        return
    }
    return token
}
module.exports = getUserToken