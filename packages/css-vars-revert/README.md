# `css-vars-revert`

Stylis v4 plugin to convert revert and CSS var usages back to their inline values.  This plugin came about from a desire to use
charkra-ui with IE11, which does not support the CSS variables.  

Note 1: this plugin exists to remove an optimization for chakra-ui, with the understanding that supporting your IE11 user base is important.

### How it works

The solution put forth by this plugin, assumes that the css variable declarations will be passed through the same stylis processor BEFORE
 any css that uses them.  The plugin tries its best to backwards apply variable definitions based on parent scope (but mileage will vary if
 making complex variable declarations).

## Usage

### Defaults:

By default, this plugin only applies when a window is present and that window does not support css variables.  (See code to understand the test).

__Raw Stylis V4__
```javascript
import { serialize, compile, middleware, stringify } from 'stylis'
import createCssVarsRevert from('rgba-hex-to-func';

// create a middleware and apply it to your middleware chain
var css = serialize(compile(':root { --var1: "#ffffffff"; } .SomeCssClass { color: var(--var1); }'), middleware([createCssVarsRevert(), stringify]));

console.log(css);

// Should log:
// :root { --var1: "#ffffffff"; } .SomeCssClass { color: #ffffffff; }
```

__EmotionJS__
```javascript
import createCache from '@emotion/cache'

export const myCache = createCache({
  key: 'my-prefix-key',
  stylisPlugins: [
    createCssVarsRevert()
  ]
})
```

### Finer Control

Since this plugin is effectively undoing modern CSS for the sake of IE11, a few options are supplied to allow you to minimize the scope at which this plugin is applied.

See \_\_tests__ for examples.

* applyWhen - If supplied this function will determine when to attempt to apply this plugin.

    Given the tricky nature of Server Side Rendering and determining if a browser supports css variables on server, this is left as an open-ended problem for the user to solve.

    __Note:__ This means that this plugin will apply itself only on client-side by default - which should work fine in the emotion system, with only a delayed display of css attributes on these less-supported clients.

__Examples of applying this to every render__

__Raw Stylis V4__
```javascript
import { serialize, compile, middleware, stringify } from 'stylis'
import createRGBAHexToFuncMiddleware from('rgba-hex-to-func';

// create a middleware and apply it to your middleware chain
serialize(compile('.SomeCssClass { color: #ffffffff; }'), middleware([createRGBAHexToFuncMiddleware({
    applyWhen: () => true,
}), stringify]));
```

__EmotionJS__
```javascript
import createCache from '@emotion/cache'

export const myCache = createCache({
  key: 'my-prefix-key',
  stylisPlugins: [
    createRGBAHexToFuncMiddleware({
        applyWhen: () => true,
    }),
  ]
});
```