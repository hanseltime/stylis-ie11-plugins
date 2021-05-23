const withPlugins = require('next-compose-plugins');
const withTranspileModules = require('next-transpile-modules')([
    '@chakra-ui/react',
    '@chakra-ui/color-mode',
    '@chakra-ui/accordion',
    '@chakra-ui/alert',
    '@chakra-ui/avatar',
    '@chakra-ui/breadcrumb',
    '@chakra-ui/button',
    '@chakra-ui/checkbox',
    '@chakra-ui/clickable',
    '@chakra-ui/close-button',
    '@chakra-ui/color-mode',
    '@chakra-ui/control-box',
    '@chakra-ui/counter',
    '@chakra-ui/css-reset',
    '@chakra-ui/descendant',
    '@chakra-ui/editable',
    '@chakra-ui/focus-lock',
    '@chakra-ui/form-control',
    '@chakra-ui/hooks',
    '@chakra-ui/icon',
    '@chakra-ui/image',
    '@chakra-ui/input',
    '@chakra-ui/layout',
    '@chakra-ui/live-region',
    '@chakra-ui/media-query',
    '@chakra-ui/menu',
    '@chakra-ui/modal',
    '@chakra-ui/number-input',
    '@chakra-ui/pin-input',
    '@chakra-ui/popover',
    '@chakra-ui/popper',
    '@chakra-ui/portal',
    '@chakra-ui/progress',
    '@chakra-ui/radio',
    '@chakra-ui/react',
    '@chakra-ui/react-env',
    '@chakra-ui/react-utils',
    '@chakra-ui/select',
    '@chakra-ui/skeleton',
    '@chakra-ui/slider',
    '@chakra-ui/spinner',
    '@chakra-ui/stat',
    '@chakra-ui/styled-system',
    '@chakra-ui/switch',
    '@chakra-ui/system',
    '@chakra-ui/table',
    '@chakra-ui/tabs',
    '@chakra-ui/tag',
    '@chakra-ui/textarea',
    '@chakra-ui/theme',
    '@chakra-ui/theme-tools',
    '@chakra-ui/toast',
    '@chakra-ui/tooltip',
    '@chakra-ui/transition',
    '@chakra-ui/utils',
    '@chakra-ui/visually-hidden',
    'proxy-polyfill',
]);
const webpack = require('webpack');
const path = require('path');

const nextConfig = {
    webpack: (config, options) => {
        const originalEntry = config.entry;
        config.entry = async () => {
            const entries = await originalEntry();
            if (entries['main.js'] && !entries['main.js'].includes('./client/polyfills.js')) {
                entries['main.js'].unshift('./client/polyfills.js');
            }
            return entries;
        }

        config.plugins.push(new webpack.NormalModuleReplacementPlugin(
            /^framer-motion$/, path.resolve(__dirname, 'client/framer-motion-wrapper.js'),
          ));

        return config;
    }
}

module.exports = withPlugins([withTranspileModules], nextConfig);
