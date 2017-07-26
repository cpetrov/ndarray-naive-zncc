const ndarray = require('ndarray');
const savePixels = require('save-pixels');
const fs = require('fs-extra');
const getPixels = require('get-pixels')
const zncc = require('./src/zncc');
const zeros = require('zeros');
const progress = require('cli-progress');

const CORRELATION_THRESHOLD = 0.91;

let progressBar = new progress.Bar({
 clearOnComplete: true
}, progress.Presets.shades_classic);

Promise.all([getNdarray('images/lena.png'), getNdarray('images/lenas-eye.png')])
  .then(results => {
    let lenaArray = results[0].pick(null, null, 0);
    let lenasEyeArray = results[1].pick(null, null, 1);
    progressBar.start(lenaArray.shape[0]);
    let filterResult = zeros([lenaArray.shape[0], lenaArray.shape[1]]);
    let thresholdResult = zeros([lenaArray.shape[0], lenaArray.shape[1]]);
    for (let i = 0; i < lenaArray.shape[0]; i++) {
      progressBar.increment();
      for (let j = 0; j < lenaArray.shape[1]; j++) {
        let correlation = zncc(lenasEyeArray, lenaArray, {referenceX: i, referenceY: j});
        filterResult.set(j, i, correlation > 0 ? correlation * 255 : 0);
        thresholdResult.set(j, i, correlation >= CORRELATION_THRESHOLD ? 255 : 0);
      }
    }
    progressBar.stop();
    console.log('Storing results in build/example-filter.png and build/example-threshold.png...');
    fs.mkdirsSync('./build');
    savePixels(filterResult, 'png').pipe(fs.createWriteStream('./build/example-filter.png'))
    savePixels(thresholdResult, 'png').pipe(fs.createWriteStream('./build/example-threshold.png'))
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
