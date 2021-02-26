//   // step size range [0,1] (percent of total dist)
function stepToward(prevPos, actualPos, stepSize = 0.1) {
  let x, y;
  let [x1, y1] = [...prevPos];
  let [x2, y2] = [...actualPos];

  let d_x = x2 - x1;
  let d_y = y2 - y1;

  x = x1 + d_x * stepSize;
  y = y1 + d_y * stepSize;
  return [x, y];
}

function averageCoordinate(array) {
  let l = array.length;
  let c = array
    .reduce(
      (acc, curr) => {
        let [x, y, z] = acc;
        let [xc, yc, zc] = curr;
        return [x + xc, y + yc, z + zc];
      },
      [0, 0, 0]
    )
    .map((v) => v / l);
  return c;
}

function distanceCoordinates(c1, c2) {
  return Math.sqrt(
    (c2[0] - c1[0]) ** 2 + (c2[1] - c1[1]) ** 2 + (c2[2] - c1[2]) ** 2
  );
}

export { stepToward, averageCoordinate, distanceCoordinates };
