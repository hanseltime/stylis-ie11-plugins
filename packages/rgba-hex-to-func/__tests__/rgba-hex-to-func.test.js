'use strict';

import createRGBAHexToFuncMiddleware from '../src';
import { serialize, compile, middleware, stringify } from 'stylis'
import prettier from 'prettier'

const formatCss = css => prettier.format(css, { parser: 'css' })

const colorWhiteHex = '#FFFFFFFF';
const colorWhiteHalfHex = '#FFFFFF7F';
const color2Hex = '#aa1bfc3e';
const color3Hex = '#22043311';

const colorWhiteRgba = 'rgba(255,255,255,255)';
const colorWhiteHalfRgba = 'rgba(255,255,255,127)';
const color2Rgba = 'rgba(170,27,252,62)';
const color3Rgba = 'rgba(34,4,51,17)';

const testHexCss = `
h1 {
    "background-color": ${colorWhiteHex};
    "background": ${colorWhiteHalfHex};
    "border": ${color2Hex};
}

div {
    "border-bottom-color": ${color3Hex};
    "border-color": ${colorWhiteHex};
    "border-left-color": ${colorWhiteHalfHex};
    "border-right-color": ${color2Hex};
    "border-top-color": ${color3Hex};
    "box-shadow": ${colorWhiteHex};
    "caret-color": ${colorWhiteHalfHex};
    "color": ${color2Hex};
    "column-rule": ${color3Hex};
    "column-rule-color": ${colorWhiteHex};
    "filter": ${colorWhiteHalfHex};
}

.aClass {
    "text-decoration": ${colorWhiteHalfHex};
    "text-decoration-color": ${color2Hex};
    "text-shadow": ${color3Hex};

    #nested {
        "color": ${color2Hex};
    }

}

#anId {
    "opacity": ${color2Hex};
    "outline-color": ${color3Hex};
    "outline": ${colorWhiteHex};
}
`;

test('Transform default inputs', () => {
    const value = serialize(compile(testHexCss), middleware([createRGBAHexToFuncMiddleware(), stringify]));

    const expectedCss = `
    h1 {
        "background-color": ${colorWhiteRgba};
        "background": ${colorWhiteHalfRgba};
        "border": ${color2Rgba};
    }
    div {
        "border-bottom-color": ${color3Rgba};
        "border-color": ${colorWhiteRgba};
        "border-left-color": ${colorWhiteHalfRgba};
        "border-right-color": ${color2Rgba};
        "border-top-color": ${color3Rgba};
        "box-shadow": ${colorWhiteRgba};
        "caret-color": ${colorWhiteHalfRgba};
        "color": ${color2Rgba};
        "column-rule": ${color3Rgba};
        "column-rule-color": ${colorWhiteRgba};
        "filter": ${colorWhiteHalfRgba};
    }
    .aClass {
        "text-decoration": ${colorWhiteHalfRgba};
        "text-decoration-color": ${color2Rgba};
        "text-shadow": ${color3Rgba};
    }
    .aClass #nested {
        "color": ${color2Rgba};
    }
    #anId {
        "opacity": ${color2Rgba};
        "outline-color": ${color3Rgba};
        "outline": ${colorWhiteRgba};
    }
    `;

    expect(formatCss(value)).toBe(formatCss(expectedCss));
  })

  test('Transforms String array matches', () => {
    const rgbaFuncMiddleware = createRGBAHexToFuncMiddleware({
        cssPropertyMatch: ["color", "border", "border-left-color", "text-shadow"],
    });
    const value = serialize(compile(testHexCss), middleware([rgbaFuncMiddleware, stringify]));

    const expectedCss = `
    h1 {
        "background-color": ${colorWhiteHex};
        "background": ${colorWhiteHalfHex};
        "border": ${color2Rgba};
    }
    div {
        "border-bottom-color": ${color3Hex};
        "border-color": ${colorWhiteHex};
        "border-left-color": ${colorWhiteHalfRgba};
        "border-right-color": ${color2Hex};
        "border-top-color": ${color3Hex};
        "box-shadow": ${colorWhiteHex};
        "caret-color": ${colorWhiteHalfHex};
        "color": ${color2Rgba};
        "column-rule": ${color3Hex};
        "column-rule-color": ${colorWhiteHex};
        "filter": ${colorWhiteHalfHex};
    }
    .aClass {
        "text-decoration": ${colorWhiteHalfHex};
        "text-decoration-color": ${color2Hex};
        "text-shadow": ${color3Rgba};
    }
    .aClass #nested {
        "color": ${color2Rgba};
    }
    #anId {
        "opacity": ${color2Hex};
        "outline-color": ${color3Hex};
        "outline": ${colorWhiteHex};
    }
    `;

    expect(formatCss(value)).toBe(formatCss(expectedCss));
  });

test('Transforms Function matches', () => {
    const rgbaFuncMiddleware = createRGBAHexToFuncMiddleware({
        cssPropertyMatch: (cssProperty) => cssProperty.startsWith('border'),
    });
    const value = serialize(compile(testHexCss), middleware([rgbaFuncMiddleware, stringify]));

    const expectedCss = `
    h1 {
        "background-color": ${colorWhiteHex};
        "background": ${colorWhiteHalfHex};
        "border": ${color2Rgba};
    }
    div {
        "border-bottom-color": ${color3Rgba};
        "border-color": ${colorWhiteRgba};
        "border-left-color": ${colorWhiteHalfRgba};
        "border-right-color": ${color2Rgba};
        "border-top-color": ${color3Rgba};
        "box-shadow": ${colorWhiteHex};
        "caret-color": ${colorWhiteHalfHex};
        "color": ${color2Hex};
        "column-rule": ${color3Hex};
        "column-rule-color": ${colorWhiteHex};
        "filter": ${colorWhiteHalfHex};
    }
    .aClass {
        "text-decoration": ${colorWhiteHalfHex};
        "text-decoration-color": ${color2Hex};
        "text-shadow": ${color3Hex};
    }
    .aClass #nested {
        "color": ${color2Hex};
    }
    #anId {
        "opacity": ${color2Hex};
        "outline-color": ${color3Hex};
        "outline": ${colorWhiteHex};
    }
    `;

    expect(formatCss(value)).toBe(formatCss(expectedCss));
  });

  test('Transforms only when applyWhen is true', () => {
    let idx = 0;
    const applyWhen = () => idx > 0;

    const value1 = serialize(compile(testHexCss), middleware([createRGBAHexToFuncMiddleware({ applyWhen }), stringify]));
    const expectedCss1 = `
    h1 {
        "background-color": ${colorWhiteHex};
        "background": ${colorWhiteHalfHex};
        "border": ${color2Hex};
    }
    div {
        "border-bottom-color": ${color3Hex};
        "border-color": ${colorWhiteHex};
        "border-left-color": ${colorWhiteHalfHex};
        "border-right-color": ${color2Hex};
        "border-top-color": ${color3Hex};
        "box-shadow": ${colorWhiteHex};
        "caret-color": ${colorWhiteHalfHex};
        "color": ${color2Hex};
        "column-rule": ${color3Hex};
        "column-rule-color": ${colorWhiteHex};
        "filter": ${colorWhiteHalfHex};
    }
    .aClass {
        "text-decoration": ${colorWhiteHalfHex};
        "text-decoration-color": ${color2Hex};
        "text-shadow": ${color3Hex};
    }
    .aClass #nested {
        "color": ${color2Hex};
    }
    #anId {
        "opacity": ${color2Hex};
        "outline-color": ${color3Hex};
        "outline": ${colorWhiteHex};
    }
    `;
    expect(formatCss(value1)).toBe(formatCss(expectedCss1));

    idx = 1;
    const value2 = serialize(compile(testHexCss), middleware([createRGBAHexToFuncMiddleware({ applyWhen }), stringify]));

    const expectedCss2 = `
    h1 {
        "background-color": ${colorWhiteRgba};
        "background": ${colorWhiteHalfRgba};
        "border": ${color2Rgba};
    }
    div {
        "border-bottom-color": ${color3Rgba};
        "border-color": ${colorWhiteRgba};
        "border-left-color": ${colorWhiteHalfRgba};
        "border-right-color": ${color2Rgba};
        "border-top-color": ${color3Rgba};
        "box-shadow": ${colorWhiteRgba};
        "caret-color": ${colorWhiteHalfRgba};
        "color": ${color2Rgba};
        "column-rule": ${color3Rgba};
        "column-rule-color": ${colorWhiteRgba};
        "filter": ${colorWhiteHalfRgba};
    }
    .aClass {
        "text-decoration": ${colorWhiteHalfRgba};
        "text-decoration-color": ${color2Rgba};
        "text-shadow": ${color3Rgba};
    }
    .aClass #nested {
        "color": ${color2Rgba};
    }
    #anId {
        "opacity": ${color2Rgba};
        "outline-color": ${color3Rgba};
        "outline": ${colorWhiteRgba};
    }
    `;

    expect(formatCss(value2)).toBe(formatCss(expectedCss2));
  });