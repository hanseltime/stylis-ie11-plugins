import { DECLARATION, RULESET, Element, compile, middleware, serialize, stringify, Middleware } from 'stylis';

declare type ApplyWhenFcn = () => boolean;
declare type VarValueMap = Map<string, string>;

const cssVarRegex = /--[a-zA-Z0-9_-]+/;
const cssVarDeclRegex = /--[a-zA-Z0-9_-]+\s*:/;
const cssVarFncRegex = /var\(\s*(--[a-zA-Z0-9_-]+)\s*\)\s*/;

const isBrowser = typeof window !== 'undefined';

export interface PluginOptions {
    // An array of string properties
    applyWhen?: ApplyWhenFcn;
    // If true, this will search for css variables in the document at the time of calling this middleware
    searchDocument?: boolean;
}

function defaultApplyWhen() : boolean {
    return typeof window !== 'undefined' && !window?.CSS?.supports?.('color', 'var(--fake-var)');
}

export default function createCssVarsRevert(options?: PluginOptions) : Middleware {
    const applyWhen = options?.applyWhen ?? defaultApplyWhen;

    // Variable tracking maps
    const chakraVarsDeclMap = new Map<string, VarValueMap>();
    const chakraVarsScopes = new Set<string>();

    function getParentSelectors(parent: Element | null | undefined) : string[] {
        const selectors = [];
        if (parent && parent.type === RULESET) {
            chakraVarsScopes.forEach((scope) => {
                const parentValues : string[] = parent.props as string[];
                parentValues.forEach((parentValue) => {
                    // Perhaps not comprehensive - if starts with scope, then assume it applies
                    if (parentValue.startsWith(scope)) {
                        selectors.push(scope);
                    }
                });
            });
        }
        selectors.push(':root');
        return selectors;
    }
    
    function tryCssVarSubstitute(element: Element) {
        const varFnc = element.value.match(cssVarFncRegex);
        if (varFnc) {
            const parentSelectors = getParentSelectors(element.parent);
            let found = false;
            // We assume the selectors were most-specifc first (doesn't work for complex cases)
            for (let i = 0; i < parentSelectors.length; i += 1) {
                const specificScope = chakraVarsDeclMap.get(parentSelectors[i]);
                if (specificScope) {
                    const varValue = specificScope.get(varFnc[1]);
                    if (varValue) {
                        element.value = element.value.replace(varFnc[0], varValue);
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                // TODO: lazy load missing values
                console.error(`Undeclared css var: ${varFnc[1]} with parents: ${element.parent?.value}`);
            }
        }
    }

    let innerPlugin = (element: Element, index: number, children: Array<Element | string>, callback: Middleware) : void => {
        if (element.type === DECLARATION) {
            if (!applyWhen()) return;
            if (element.props) {
                if ((element.props as string).match(cssVarRegex)) {
                    // Store css variable declarations
                    const parentScopes = element.parent?.value?.split(',') ?? [':root'];
                    parentScopes.forEach((scope) => {
                        let scopedVars = chakraVarsDeclMap.get(scope);
                        if (!scopedVars) {
                            scopedVars = new Map();
                            chakraVarsDeclMap.set(scope, scopedVars);
                            chakraVarsScopes.add(scope);
                        }
                        scopedVars.set((element.props as string).trim(), element.children as string)
                    });
                } else if (element.value) {
                    tryCssVarSubstitute(element);
                }
            }
        } else if (element.type === RULESET) {
            // Note: this is necessary to do nested drilling - see stylis strigify plugin
            serialize(element.children as any, callback);
        }
    };

    const shouldSearchDocForVars = options?.searchDocument ?? true;
    let firstPass = true;
    function tryGetOptionsFromDocument() {
        if (firstPass) {
            if (isBrowser && shouldSearchDocForVars && firstPass) {
                // Since the browser doesn't re-apply the css vars, we parse the innerHTML of style tags
                Array.prototype.forEach.call(document.getElementsByTagName('style'), function(styleEl) {
                    if (styleEl.innerHTML.match(cssVarDeclRegex)) {
                    serialize(compile(styleEl.innerHTML), middleware([innerPlugin]));
                    }
                });
            }
        }
        firstPass = false;
    }

    return (element: Element, index: number, children: Array<Element | string>, callback: Middleware ) : void => {
        tryGetOptionsFromDocument();
        innerPlugin(element, index, children, callback);
    };
}
