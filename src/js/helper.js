const Helper = (function() {
  function allIsCollected(starts, whiteIsPlaying) {
    return (whiteIsPlaying && starts[starts.length - 1] < 7) ||
           (!whiteIsPlaying && starts[0] > 18);
  }

  function getStartPoints(points, whiteIsPlaying, hasHits) {
    const token = whiteIsPlaying ? 'w' : 'b',
          array = [];

    if(hasHits){
      return whiteIsPlaying ? [0] : [25];
    }

    for(let key in points) {
      if(points.hasOwnProperty(key)){
        let point = points[key];
        if(point.indexOf(token) < 0) { continue; }

        array.push(Number(key));
      }
    }

    return array.sort(function(a, b) { return a-b; });
  }

  function acceptableEnd(end, endPoint, whiteIsPlaying, allCollected) {
    const opntToken = (whiteIsPlaying ? 'b' : 'w');

    if(!allCollected && (end < 1 || end > 24)) { return false; }

    if(endPoint.length > 1 && endPoint.indexOf(opntToken) === 0) {
      return false;
    }

    return true;
  }

  function getPossibleMovesForPoint(point, points, _dice, _end, moves, whiteIsPlaying, allCollected) {
    if(_dice.length < 1) { return true; }

    const op = (whiteIsPlaying ? '+' : '-'),
          dice = _dice.slice(),
          die = dice.pop(),
          end = eval(_end + op + die);

    if(acceptableEnd(end, points[end], whiteIsPlaying, allCollected)) {
      moves.push([point, end]);

      getPossibleMovesForPoint(
        point, points, dice, end, moves, whiteIsPlaying, allCollected
      );
    }
  }

  function getPossibleMoves(points, dice, whiteIsPlaying, hitCheckers) {
    const token = (whiteIsPlaying ? 'w' : 'b'),
          hasHits = (hitCheckers.indexOf(token) > -1),
          starts = getStartPoints(points, whiteIsPlaying, hasHits),
          moves = [];

    if(starts.length === 0) { return []; }

    const allCollected = allIsCollected(starts, whiteIsPlaying);

    for(let j = 0; j < starts.length; j++) {
      let start = starts[j];

      getPossibleMovesForPoint(
        start, points, dice,
        start, moves, whiteIsPlaying, allCollected
      );
      getPossibleMovesForPoint(
        start, points, dice.reverse(),
        start, moves, whiteIsPlaying, allCollected
      );
    }

    return moves;
  }

  function diff(array1, array2) {
    return array1.filter(function(i) {
      if(array2.indexOf(i) < 0) {
        return true
      } else {
        array2 = array2.slice(i, i+1);
        return false;
      }
    });
  }

  function getNewDice(dice, moved) {
    if(dice.length === 1) {
      return [];
    }

    if(dice.length > 1) {
      if(dice.indexOf(moved) > -1) {
        return diff(dice, [moved]);
      }

      if(dice[0] === dice[1]) {
        return dice.slice(moved / dice[0], dice.length);
      } else {
        return [];
      }
    }
  }

  function initPoints() {
    const points = {};

    for(let i = 1; i < 25; i++) {
      points[i] = [];
    }

    points[1] = ['w', 'w'];
    points[6] = ['b', 'b', 'b', 'b', 'b','b', 'b', 'b', 'b', 'b'];
    points[8] = ['b', 'b', 'b'];
    points[12] = ['w', 'w', 'w', 'w', 'w'];
    points[13] = ['b', 'b', 'b', 'b', 'b'];
    points[17] = ['w', 'w', 'w'];
    points[19] = ['w', 'w', 'w', 'w', 'w'];
    points[24] = ['b', 'b'];

    return points;
  }

  function rand() {
    return Math.floor(Math.random() * 6) + 1;
  }

  return {
    initPoints: initPoints,
    getNewDice: getNewDice,
    getPossibleMoves: getPossibleMoves,
    rand: rand
  };
}());

export default Helper;
