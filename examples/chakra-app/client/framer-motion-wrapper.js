import { motion as origMotion, createDomMotionComponent } from '../node_modules/framer-motion';
import { proxyDefined } from './clientState';

// fragile copied from internal framer-motion supported-elements.ts
import { htmlElements, svgElements } from './framer-motion-supported-elements';

// Adapted from https://github.com/framer/motion/commit/b4319c78fb4bde28ce0d2a8008df48d7e3fd1c8b
const createNonProxyMotion = () => {
    function customMotionComp(component) {
        return createDomMotionComponent(component);
    }
    // Create a function with callable methods to mirror normal "motion" object
    let motionProxy = customMotionComp;
    motionProxy.custom = (component) => {
            return createDomMotionComponent(component);
        };
    motionProxy = htmlElements.reduce((acc, key) => {
    acc[key] = createDomMotionComponent(key);
    return acc;
    }, motionProxy);
    motionProxy = svgElements.reduce((acc, key) => {
    acc[key] = createDomMotionComponent(key);
    return acc;
    }, motionProxy);
    return motionProxy;
};

export const motion = proxyDefined ? origMotion : createNonProxyMotion();

export * from '../node_modules/framer-motion';