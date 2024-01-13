module.exports = function validatePassword(password){
    const regexLetter = /^(?=.*[A-Za-z])/
    const regexUppercase = /^(?=.*[A-Z])/
    const regexNumber = /^(?=.*\d)/
    const regexMinimumCaracthers = /^.{8,}$/

    if (!regexLetter.test(password)) {
        return { status: 'error', message: 'Senha inválida. A senha deve conter pelo menos uma letra.' };
    } else if (!regexUppercase.test(password)) {
        return { status: 'error', message: 'Senha inválida. A senha deve conter pelo menos uma letra maiúscula.' };
    } else if (!regexNumber.test(password)) {
        return { status: 'error', message: 'Senha inválida. A senha deve conter pelo menos um número.' };
    } else if (!regexMinimumCaracthers.test(password)) {
        return { status: 'error', message: 'Senha inválida. A senha deve ter pelo menos 8 caracteres.' };
    } else {
        return { status: 'success', message: 'Senha válida.' };
    }
}