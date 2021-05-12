'use strict';

import createCssVarsRevert from '../src';
import { serialize, compile, middleware, stringify } from 'stylis'
import prettier from 'prettier'

function formatCss(css: string) : string {
    return prettier.format(css, { parser: 'css' });
}

const var1Name = '--var1';
const var2Name = '--my-special-var';
const var3Name = '--another-var3';
const var4Name = '--text-fam';

const var1 = '77px';
const var2 = '12px 33px 22px 1em';
const var3 = 'green';
const var4 = '"Arial", "times new roman"';

const testVarCss =`
:root {
    ${var1Name}: ${var1};
    ${var2Name}: ${var2};
}

.aClass, div {
    ${var3Name}  : ${var3};
}

.aClass {
    #nested {
        ${var4Name} : ${var4};
    }
}

h1 {
    background-color: 'white';
    border: solid black 1px;
    margin: var(${var2Name});
    height: var( ${var1Name} );
}

div {
    font-family: var( ${var3Name});
    color: 'blue';
}

.aClass {
    "background-color":var(${var3Name});
    padding: '20px';

    #nested {
        "width":var( ${var1Name});
        "font-family": var( ${var4Name});
    }
}
`;

test('Transform default inputs', () => {
    const value = serialize(compile(testVarCss), middleware([createCssVarsRevert(), stringify]));

    const expectedCss = `
    :root {
        ${var1Name}: ${var1};
        ${var2Name}: ${var2};
    }
    .aClass, div {
        ${var3Name}  : ${var3};
    }
    .aClass #nested {
        ${var4Name} : ${var4};
    }
    h1 {
        background-color: 'white';
        border: solid black 1px;
        margin: ${var2};
        height: ${var1};
    }
    div {
        font-family: ${var3};
        color: 'blue';
    }
    .aClass {
        "background-color":${var3};
        padding: '20px';
    }
    .aClass #nested {
        "width": ${var1}; 
        "font-family": ${var4};
    }
    `;

    expect(formatCss(value)).toBe(formatCss(expectedCss));
  });

  test('Transforms only when applyWhen is true', () => {
    let idx = 0;
    const applyWhen = () => idx > 0;
    const value = serialize(compile(testVarCss), middleware([createCssVarsRevert({ applyWhen }), stringify]));
    const expectedCss1 = `
    :root {
        ${var1Name}: ${var1};
        ${var2Name}: ${var2};
    }
    .aClass, div {
        ${var3Name}  : ${var3};
    }
    .aClass #nested {
        ${var4Name} : ${var4};
    }
    h1 {
        background-color: 'white';
        border: solid black 1px;
        margin: var(${var2Name});
        height: var( ${var1Name} );
    }
    div {
        font-family: var( ${var3Name});
        color: 'blue';
    }
    .aClass {
        "background-color":var(${var3Name});
        padding: '20px';
    }
    .aClass #nested {
        "width": var( ${var1Name}); 
        "font-family": var( ${var4Name});
    }
    `;
    expect(formatCss(value)).toBe(formatCss(expectedCss1));

    idx += 1
    const value2 = serialize(compile(testVarCss), middleware([createCssVarsRevert({ applyWhen }), stringify]));

    const expectedCss2 = `
    :root {
        ${var1Name}: ${var1};
        ${var2Name}: ${var2};
    }
    .aClass, div {
        ${var3Name}  : ${var3};
    }
    .aClass #nested {
        ${var4Name} : ${var4};
    }
    h1 {
        background-color: 'white';
        border: solid black 1px;
        margin: ${var2};
        height: ${var1};
    }
    div {
        font-family: ${var3};
        color: 'blue';
    }
    .aClass {
        "background-color":${var3};
        padding: '20px';
    }
    .aClass #nested {
        "width": ${var1}; 
        "font-family": ${var4};
    }
    `;

    expect(formatCss(value2)).toBe(formatCss(expectedCss2));
  });