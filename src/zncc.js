const pack = require('ndarray-pack');
const moments = require('ndarray-moments');

let momentsCache = {};

function zncc(template, reference, {referenceX = 0, referenceY = 0} = {}) {
  let referencePatch = reference
    .lo(referenceY, referenceX)
    .hi(template.shape[0], template.shape[1]);
  return zeroMeanCrossCorrelation(template, referencePatch) / (variance(template) * variance(referencePatch));
}

function zeroMeanCrossCorrelation(matrix1, matrix2) {
  let correlation = 0;
  for (let i = 0; i < matrix1.shape[0]; i++) {
    for (let j = 0; j < matrix1.shape[1]; j++) {
      correlation += (matrix1.get(i, j) - mean(matrix1)) * (matrix2.get(i,j) - mean(matrix2));
    }
  }
  return correlation;
}

function mean(matrix) {
  return getMoments(matrix)[0];
}

function variance(matrix) {
  let moments = getMoments(matrix);
  return Math.sqrt(moments[1] - moments[0] * moments[0]) * Math.sqrt(matrix.shape[0] * matrix.shape[1])
}

function getMoments(matrix) {
  let moms;
  matrix._id = matrix._id || uuidv4();
  if (momentsCache[matrix._id]) {
    moms = momentsCache[matrix._id];
  } else {
    moms = moments(2, matrix);
    momentsCache[matrix._id] = moms;
  }
  return moms;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = zncc;
