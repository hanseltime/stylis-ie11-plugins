# NextJS + Chakra-UI IE11 example project

This is a simple NextJS app with Chakra-UI to demonstrate the usage of these ie11 stylis plugins.  (Note: in the future, this may be its own repo).

## Important points:

1. You may use the next.config.js, as a good jumping off point for starting your own ie11 supported nextjs app.

    * Chakra-ui has un-transpiled es6 code in its modules, you will want to add it's modules to be transpiled on build (I've just added all of them, since it's just build cost).
    * Chakra-ui uses Object.fromEach, a polyfill file is included in the client/ folder.
        * In the past, framer-motion also requires a workaround which is outside the scope of this example project: https://github.com/chakra-ui/chakra-ui/issues/2498

2. Due to the render options of nextJS, the ie11 stylis plugins are being applied on server-side and client-side - there may be an optimization if you can guarantee client-side never redefines its css.

    * Feel free to play with the options in the app on IE11 to see why it won't work, or find something I totally missed.

## Running the app for test

Note: webpack dev server does not work with IE11 (at least, I don't have the fix), do not attempt to use "yarn dev" and verify your IE11 behavior

Build:

```bash
yarn build
```

Run:

```bash
yarn start
```

Or Run a static file server (see [NextJS export](https://nextjs.org/docs/advanced-features/static-html-export)):

```bash
yarn build
yarn export
yarn static-serve
```
