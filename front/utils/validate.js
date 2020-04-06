/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
  }
  
  // 表单验证  验证手机号
  export function isPhone(rule, value, callback) {
    if (!value) {
      return callback(new Error('手机号不能为空'))
    } else {
      const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      console.log(reg.test(value))
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的手机号'))
      }
    }
  }
  