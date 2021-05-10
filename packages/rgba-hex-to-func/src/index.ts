import { Middleware, Element, DECLARATION } from 'stylis';

type CssPropertyMatchFcn = (propertyName: string) => boolean;
type ApplyWhenFcn = () => boolean

export interface PluginOptions {
    // An array of string properties
    cssPropertyMatch?: string[] | CssPropertyMatchFcn;
    applyWhen?: ApplyWhenFcn;
}

interface PseudoHashSet {
    [key: string]: boolean
}

const defaultMatchStringMap : PseudoHashSet = {
    "background-color": true,
    "background": true,
    "border": true,
    "border-bottom-color": true,
    "border-color": true,
    "border-left-color": true,
    "border-right-color": true,
    "border-top-color": true,
    "box-shadow": true,
    "caret-color": true,
    "color": true,
    "column-rule": true,
    "column-rule-color": true,
    "filter": true,
    "opacity": true,
    "outline-color": true,
    "outline": true,
    "text-decoration": true,
    "text-decoration-color": true,
    "text-shadow": true,
};

const defaultMatchFcn : CssPropertyMatchFcn = (cssProperty: string) => !!defaultMatchStringMap[cssProperty];

function makeMatchFcnFromArray(cssPropertyMatches: string[]) : CssPropertyMatchFcn {
    const lookupMap = {} as PseudoHashSet;
    cssPropertyMatches.forEach((cssPropertyMatch) => {
        lookupMap[cssPropertyMatch] = true;
    });
    return (cssProperty: string) => {
        return !!lookupMap[cssProperty];
    };
}

const rgbaHexRegex = /#[a-fA-F0-9]{8}/g
const hexSegmentRegex = /[a-fA-F0-9]{1,2}/g

export function rgbaHexToFunc(rgbaHex: string) {
    const hexes = rgbaHex.match(hexSegmentRegex) as string[];
    const rgbaValues = [
        parseInt(hexes[0], 16),
        parseInt(hexes[1], 16),
        parseInt(hexes[2], 16),
        parseInt(hexes[3], 16),
    ];
    return `rgba(${rgbaValues.join(',')})`;
}

function stripQuotes(quoteStr: string) {
    let startIdx = 0;
    let endIdx = quoteStr.length;
    if(quoteStr.startsWith('"') || quoteStr.startsWith("'")) startIdx = 1;
    if (quoteStr.endsWith('"') || quoteStr.endsWith("'")) endIdx -= 1;

    return quoteStr.substring(startIdx, endIdx);
}

/**
 * Creates a stylis plugin that will watch particular css property values
 * for rgba hex value notations and will change them to rgba() function notation
 * 
 */
export default function createRGBAHexToFuncPlugin(options: PluginOptions) : Middleware {

    let cssPropertiesMatchFcn : CssPropertyMatchFcn = defaultMatchFcn;
    if (options?.cssPropertyMatch) {
        if (Array.isArray(options.cssPropertyMatch)) {
            cssPropertiesMatchFcn = makeMatchFcnFromArray(options.cssPropertyMatch);
        } else {
            cssPropertiesMatchFcn = options.cssPropertyMatch;
        }
    }

    if (options?.applyWhen) {

    }

    return (element: Element) : void => {
        if (element.type === DECLARATION) {
            if (options.applyWhen && !options.applyWhen()) return;
            if (element.props && cssPropertiesMatchFcn(stripQuotes(element.props as string))) {
                if (typeof element.children === 'string') {
                    const rgbaHexes = element.children.match(rgbaHexRegex);
                    rgbaHexes?.forEach((rgbaHex) => {
                        const funcValue =  rgbaHexToFunc(rgbaHex);
                        element.value = element.value.replace(rgbaHex, funcValue);
                        element.children = funcValue;
                    })
                }

            }
        }
    };
}
