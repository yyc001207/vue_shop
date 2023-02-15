const Tokenkey = 'vue_shop_token'

export function getToken() {
    return window.sessionStorage.getItem(Tokenkey)
}
export function setToken(token) {
    window.sessionStorage.setItem(Tokenkey, token)
}
export function removeToken() {
    window.sessionStorage.removeItem(Tokenkey)
}
export function clearSessionStorage() {
    window.sessionStorage.clear()
}