let bcrypt = require('bcrypt');

salt = '$2b$10$qNuSSupDD53DkQfO8wqpf.'

exports.cryptPassword = (password) =>{
    let encryptedPassword = bcrypt.hashSync(password, salt)
    return encryptedPassword;
}

exports.comparePassword = (password, encryptedPasswordToCompareTo) => {
    let encryptedPassword = bcrypt.hashSync(password, salt);
    return encryptedPassword == encryptedPasswordToCompareTo;
}

