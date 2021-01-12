'use strict'
/**
 * 多次调用，响应一次，可开缓存
 * 
 * @param {Function} fn 一个返回Promise的函数
 * @param {Boolean} cache 是否开启缓存
 * @param {*} context 上下文
 * @returns {Function} return Promise的闭包
 */
function oneHandle (fn, cache, context) {
  let cachedPromiseInstance = null;
  
  return function (...argvs) {
    const ctx = context || this;
    
    return cachedPromiseInstance || (
      cachedPromiseInstance = fn.call(context, ...argvs)
        .then(
          res => {
            if (!cache)
              cachedPromiseInstance = null;
            
            return res
          },
          reason => {
            if (!cache)
              cachedPromiseInstance = null;
            
            throw reason
          }
        )
    )
  }
}
if ('undefined' !== typeof module) {
  module.exports = oneHandle
}
