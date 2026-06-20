const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const Module = require('node:module');

const originalLoad = Module._load;
Module._load = function load(request, parent, isMain) {
  if (request === 'react-native') {
    return {
      Text: 'Text',
      View: 'View',
    };
  }

  return originalLoad.call(this, request, parent, isMain);
};

const babelRegister = require('@babel/register');

(babelRegister.default || babelRegister)({
  extensions: ['.js'],
  ignore: [/node_modules/],
});

const { Dot, RenderDots } = require('../components/Dots');

const styles = {
  dotStyle: { width: 13, height: 13 },
  activeDotStyle: { borderRadius: 7 },
};

describe('RenderDots', () => {
  it('returns one dot for each page and marks the active page', () => {
    const dots = RenderDots(1, 3, {
      styles,
      dotColor: 'gray',
      activeDotColor: 'white',
    });

    assert.equal(dots.length, 3);
    assert.deepEqual(dots.map((dot) => dot.type), [Dot, Dot, Dot]);
    assert.deepEqual(dots.map((dot) => dot.props.active), [false, true, false]);
    assert.deepEqual(dots.map((dot) => dot.key), ['0', '1', '2']);
  });
});

describe('Dot', () => {
  it('uses the active color and active style when active', () => {
    const dot = Dot({
      styles,
      dotColor: 'gray',
      activeDotColor: 'white',
      active: true,
    });

    assert.equal(dot.type, 'View');
    assert.ok(dot.props.style.includes(styles.dotStyle));
    assert.ok(dot.props.style.includes(styles.activeDotStyle));
    assert.deepEqual(dot.props.style[2], { backgroundColor: 'white' });
  });

  it('uses the default dot color when inactive', () => {
    const dot = Dot({
      styles,
      dotColor: 'gray',
      activeDotColor: 'white',
      active: false,
    });

    assert.equal(dot.type, 'View');
    assert.ok(dot.props.style.includes(styles.dotStyle));
    assert.ok(!dot.props.style.includes(styles.activeDotStyle));
    assert.deepEqual(dot.props.style[1], { backgroundColor: 'gray' });
  });
});
