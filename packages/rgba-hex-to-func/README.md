# `rgba-hex-to-func`

Small Stylis v4 plugin to convert any RGBA Hex values to the rgba() syntax.  This is plugin came about from a desire to use
charkra-ui with IE11, which does not support the Hex RGBA annotations.

## Usage

### Defaults:

By default, this plugin supports a set of all potential standard rgba valued properties.  It is not exhaustive though, so feel free to contribute missing components.

__Raw Stylis V4__
```javascript
import { serialize, compile, middleware, stringify } from 'stylis'
import createRGBAHexToFuncMiddleware from('rgba-hex-to-func';

// create a middleware and apply it to your middleware chain
serialize(compile('.SomeCssClass { color: #ffffffff; }'), middleware([createRGBAHexToFuncMiddleware(), stringify]));
```

__EmotionJS__
```javascript
import createCache from '@emotion/cache'

export const myCache = createCache({
  key: 'my-prefix-key',
  stylisPlugins: [
    createRGBAHexToFuncMiddleware()
  ]
})
```

### Finer Control

Since this plugin is effectively undoing modern CSS for the sake of IE11, a few options are supplied to allow you to minimize the scope at which this plugin in applied.

See \_\_tests__ for examples.

* cssPropertyMatch - Either a an array of css properties to only look for and transform Hex codes on OR 
  a function that allows you to determine if a property should be looked and an transformed

* applyWhen - If supplied this function will determine when to attempt to apply this plugin.

    Given the tricky nature of Server Side Rendering and determining if a browser is IE11, this is left as an open-ended problem for the user to solve.

    __Note:__ This means that this plugin will apply to ALL browsers by default - which may be undesired for your use case.

__Examples of basic IE11 detection on client-side__

__Raw Stylis V4__
```javascript
import { serialize, compile, middleware, stringify } from 'stylis'
import createRGBAHexToFuncMiddleware from('rgba-hex-to-func';

// create a middleware and apply it to your middleware chain
serialize(compile('.SomeCssClass { color: #ffffffff; }'), middleware([createRGBAHexToFuncMiddleware({
    applyWhen: () => window !== undefined && !!window.MSInputMethodContext && !!document.documentMode,
}), stringify]));
```

__EmotionJS__
```javascript
import createCache from '@emotion/cache'

export const myCache = createCache({
  key: 'my-prefix-key',
  stylisPlugins: [
    createRGBAHexToFuncMiddleware({
        applyWhen: () => window !== undefined && !!window.MSInputMethodContext && !!document.documentMode,
    }),
  ]
});
```