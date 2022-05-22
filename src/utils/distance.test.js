const distance = require('./distance');
//https://www.meridianoutpost.com/resources/etools/calculators/calculator-latitude-longitude-distance.php?
test('calculate distance between Paris(48.856614, 2.3522219) and Lyon(45.764043, 4.835659) to get 465,6 km', () => {
    expect(parseFloat(distance(48.856614, 2.3522219, 45.764043, 4.835659).toFixed(2))).toBe(391.47);
  });