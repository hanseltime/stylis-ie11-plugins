import * as React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis';

import { extendTheme } from "@chakra-ui/react"
// Theme values optimize to css variables normally
const colors = {
  hexRGBAColor: "#ff2525aa",
  varColor: "#ffffff",
}
const theme = extendTheme({ colors })

// Create a custom cache with plugins
const ie11StyleAwareCache = createCache({
  key: 'my-prefix-key',
  stylisPlugins: [
  ],
})

function App({ Component }) {
  return (
    <CacheProvider value={ie11StyleAwareCache}>
      <ChakraProvider theme={theme}>
        <Component />
      </ChakraProvider>
    </CacheProvider>
  )
}

export default App;
