const hasProxy = (scope) => !!scope.Proxy;

// Using the same Proxy polyfill checks as proxy-polyfill
export const proxyDefined = hasProxy((typeof process !== 'undefined'
&& {}.toString.call(process) === '[object process]')
|| (typeof navigator !== 'undefined' && navigator.product === 'ReactNative')
  ? global
  : self);