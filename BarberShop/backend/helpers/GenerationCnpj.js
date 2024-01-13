function generateRandomDigit() {
    return String(Math.floor(Math.random() * 10));
}

function calculateCnpjDigit(cnpjArray) {
    const weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = cnpjArray.reduce((acc, digit, index) => acc + digit * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
}

function generateRandomCnpj() {
    const cnpjArray = Array.from({ length: 14 }, () => generateRandomDigit());
    return cnpjArray.join('')
}

module.exports = generateRandomCnpj