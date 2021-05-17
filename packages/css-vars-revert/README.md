# `css-vars-revert`

Stylis v4 plugin to revert any CSS var usages back to their inline values.  This plugin came about from a desire to use
charkra-ui with IE11, which does not support the CSS variables.  

Note 1: this plugin exists to remove an optimization for chakra-ui, with the understanding that supporting your IE11 user base is important.

### How it works

The solution put forth by this plugin assumes that the css variable declarations will be passed through the same stylis processor BEFORE
 any css that uses them.  The plugin tries its best to backwards apply variable definitions based on parent scope (but mileage will vary if
 making complex variable declarations).

## Usage

### Defaults:

By default, this plugin applies any time stylis is invoked.

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

Since this plugin is effectively undoing modern CSS for the sake of IE11, a few options are supplied to allow you to minimize the scope at which this plugin is applied or maximize its replacement stategy.

See \_\_tests__ for examples.

* applyWhen - If supplied this function will determine when to attempt to apply this plugin.

    Given the tricky nature of Server Side Rendering and determining if a browser supports css variables on server, this is left as an open-ended problem for the user to solve.

    __Note:__ In certain SSR frameworks, you may discover that your desire to evaluate only on the client-side will not work if the server side render is the only side responsible for the css render (see example application).

__Examples of applying this only on client-side__

__Raw Stylis V4__
```javascript
import { serialize, compile, middleware, stringify } from 'stylis';
import createRGBAHexToFuncMiddleware from 'rgba-hex-to-func';

// create a middleware and apply it to your middleware chain
serialize(compile('.SomeCssClass { color: #ffffffff; }'), middleware([createRGBAHexToFuncMiddleware({
    applyWhen: () => typeof window !== 'undefined' && !window?.CSS?.supports?.('color', 'var(--fake-var)'),
}), stringify]));
```

__EmotionJS__
```javascript
import createCache from '@emotion/cache';
import createRGBAHexToFuncMiddleware from 'rgba-hex-to-func';

export const myCache = createCache({
  key: 'my-prefix-key',
  stylisPlugins: [
    createRGBAHexToFuncMiddleware({
      applyWhen: () => typeof window !== 'undefined' && !window?.CSS?.supports?.('color', 'var(--fake-var)'),
    }),
  ]
});
```

* searchDocument - If set to true, this makes the plugin (when run on the clientside) search for style tags with variable definitions on first call of stylis.  While this might seem worthless, if you are using a render strategy that provides variable declarations in a separate and disjoint style tag from the main body of code running stylis, this will at least consume the separate css variables, process them, and then apply them back over variable calls.

Note: If you're doing this, try to rethink the css solution as this includes dom-searching and parsing before applying the rest of stylis runs.

__Examples of applying search document logic__

__Raw Stylis V4__
```javascript
import { serialize, compile, middleware, stringify } from 'stylis';
import createRGBAHexToFuncMiddleware from 'rgba-hex-to-func';

// create a middleware and apply it to your middleware chain
serialize(compile('.SomeCssClass { color: #ffffffff; }'), middleware([createRGBAHexToFuncMiddleware({
    searchDocument: true,
}), stringify]));
```

__EmotionJS__
```javascript
import createCache from '@emotion/cache'
import createRGBAHexToFuncMiddleware from 'rgba-hex-to-func';

export const myCache = createCache({
  key: 'my-prefix-key',
  stylisPlugins: [
    createRGBAHexToFuncMiddleware({
        searchDocument: true,
    }),
  ]
});
```