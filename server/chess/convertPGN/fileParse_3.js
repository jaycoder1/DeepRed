const { encodePGN, saveToDB } = require('./parsePGN');
const { gamesData } = require('./seedGames_3');

const testStr = gamesData.replace(/[\n\r]+/g, ' ');

const parseFile = (str) => {
  const games = [];
  let buffer = '';
  let shouldSave = false;
  for (let i = 0; i < str.length; i += 1) {
    if (shouldSave) {
      buffer += str[i];
    }
    if (str.slice(i, i + 3) === ' 1.') {
      buffer += str.slice(i, i + 3);
      // buffer = '';
      shouldSave = true;
      i += 2;
    }
    if (str.slice(i, i + 5) === '  1-0' || str.slice(i, i + 5) === '  0-1') {
      buffer += str.slice(i, i + 5);
      games.push(buffer);
      buffer = '';
      shouldSave = false;
      i += 4;
    }
    if (str.slice(i, i + 9) === '  1/2-1/2') {
      buffer += str.slice(i, i + 9);
      games.push(buffer);
      buffer = '';
      shouldSave = false;
      i += 8;
    }
  }
  return games;
};
const gamesArr = parseFile(testStr);
let goodCount = 0;
let badCount = 0;
const encodeResults = [];
let count = 0;
gamesArr.forEach((str) => {
  if (count % 3 === 0) {
    try {
      encodeResults.push(encodePGN(str));
      goodCount += 1;
      console.log('GOOD COUNT: ', goodCount, badCount);
    } catch (e) {
      console.log(e);
      badCount += 1;
      console.log('BAD COUNT: ', goodCount, badCount);
    }
  }
  count += 1;
});
for (let i = 0; i < encodeResults.length; i += 1) {
  setTimeout(() => saveToDB(encodeResults[i]), i * 3000);
}
