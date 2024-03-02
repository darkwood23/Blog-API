const bcrypt = require("bcryptjs")

const genPassword = (password) => {
    return bcrypt.hashSync(password, 10)
}

const checkPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

module.exports.checkPassword = checkPassword
module.exports.genPassword = genPassword