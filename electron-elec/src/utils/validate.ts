/**
 * 判断url是否是http或https 
 * @param {string} path
 * @returns {Boolean}
 */
export function isHttp(url:any) {
    return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
  }
  
  /**
   * 判断path是否为外链
   * @param {string} path
   * @returns {Boolean}
   */
   export function isExternal(path:any) {
    return /^(https?:|mailto:|tel:)/.test(path)
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validUsername(str :any) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
  }
  
  /**
   * @param {string} url
   * @returns {Boolean}
   */
  export function validURL(url :any) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(url)
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validLowerCase(str :any) {
    const reg = /^[a-z]+$/
    return reg.test(str)
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validUpperCase(str :any) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validAlphabets(str :any) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
  }
  
  /**
   * @param {string} email
   * @returns {Boolean}
   */
  export function validEmail(email :any) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email)
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function isString(str :any) {
    if (typeof str === 'string' || str instanceof String) {
      return true
    }
    return false
  }
  
  /**
   * @param {Array} arg
   * @returns {Boolean}
   */
  export function isArray(arg  :any) {
    if (typeof Array.isArray === 'undefined') {
      return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return Array.isArray(arg)
  }
  

  /**
   * 判断是否是十进制
   */
  export function isDigit(str :any) {
    if(str === "") return false;
    const reg = /^[0-9]*$/;
    return reg.test(str);
  }

  /**
   * 判断是否是十六进制
   */
  export function isHex(str :any) {
    if(str === "") return false;
    const reg = /^[0-9a-fA-F]+$/;
    return reg.test(str);
  }