const chai = require('chai');
const {expect} = require('chai');
const zncc = require('../src/zncc');
const pack = require('ndarray-pack');
const chaiStats = require('chai-stats');
const getPixels = require('get-pixels')

chai.use(chaiStats);

describe('zncc', function() {

  it('correlates template with reference', function() {
    let result = zncc(
      pack([
        [0, 0, 0],
        [120, 120, 120],
        [0, 0, 0]
      ]),
      pack([
        [0, 0, 0],
        [120, 120, 120],
        [0, 0, 180]
      ])
    );

    expect(result).to.equal(0.6123724356957945);
  });

  it('correlates template with reference at (0, 0) offset', function() {
    let result = zncc(
      pack([
        [0, 0, 0],
        [120, 120, 120],
        [0, 0, 0]
      ]),
      pack([
        [0, 0, 0, 100],
        [120, 120, 120, 100],
        [0, 0, 180, 100],
        [100, 100, 100, 100]
      ])
    );

    expect(result).to.equal(0.6123724356957945);
  });

  it('correlates template with reference at (x, 0) offset', function() {
    let result = zncc(
      pack([
        [0, 0, 0],
        [120, 120, 120],
        [0, 0, 0]
      ]),
      pack([
        [0, 0, 0, 0],
        [0, 120, 120, 120],
        [0, 0, 0, 180],
        [0, 0, 0, 0],
      ]),
      {referenceX: 1}
    );

    expect(result).to.equal(0.6123724356957945);
  });

  it('correlates template with reference at (0, x) offset', function() {
    let result = zncc(
      pack([
        [0, 0, 0],
        [120, 120, 120],
        [0, 0, 0]
      ]),
      pack([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [120, 120, 120, 0],
        [0, 0, 180, 0]
      ]),
      {referenceY: 1}
    );

    expect(result).to.equal(0.6123724356957945);
  });

  it('correlates template with reference at (x, y) offset', function() {
    let result = zncc(
      pack([
        [0, 0, 0],
        [120, 120, 120],
        [0, 0, 0]
      ]),
      pack([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 120, 120, 120, 0],
        [0, 0, 0, 180, 0],
        [0, 0, 0, 180, 0]
      ]),
      {referenceX: 1, referenceY: 1}
    );

    expect(result).to.equal(0.6123724356957945);
  });

  it('correlates template with itself', function() {
    let result = zncc(
      pack([
        [0, 0, 0],
        [120, 120, 120],
        [0, 0, 0]
      ]),
      pack([
        [0, 0, 0],
        [120, 120, 120],
        [0, 0, 0]
      ])
    );

    expect(result).to.almost.equal(1);
  });

  it('correlates lenas eye with lenas portrait', function() {
    return Promise.all([getNdarray('images/lena.png'), getNdarray('images/lenas-eye.png')])
      .then(results => {
        let lenaArray = results[0].pick(null, null, 0);
        let lenasEyeArray = results[1].pick(null, null, 1);
        let result = zncc(lenasEyeArray, lenaArray, {referenceX: 263, referenceY: 259});
        expect(result).to.almost.equal(1);
      });
  });

});

function getNdarray(path) {
  return new Promise((resolve, reject) => {
    getPixels(path, (err, pixels) => {
      if (err) {
        reject(err);
      } else {
        resolve(pixels);
      }
    })
  });
}
