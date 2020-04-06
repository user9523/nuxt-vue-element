// 操作本地缓存
const storage = {
    setLocalStorage(key, value) {
      localStorage[key] = value
    },
    getLocalStorage(key) {
      return localStorage[key]
    },
    removeLocalStorageItem(key){
      localStorage.removeItem(key)
    },
    cleanLocalStorage() {
      localStorage.clear()
    },
  
    setSessionStorage(key, value) {
      sessionStorage[key] = value
    },
    getSessionStorage(key) {
      return sessionStorage[key]
    },
    removeSessionStorageItem(key){
      sessionStorage.removeItem(key)
    },
    cleanSessionStorage() {
      sessionStorage.clear()
    }
  }
  
  export default storage
  