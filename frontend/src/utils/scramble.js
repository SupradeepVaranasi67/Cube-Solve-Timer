export function generateScramble(type = "3x3") {
  switch (type) {
    case "2x2":
      return genScramble(9, ["R", "U", "F"]);
    case "3x3":
      return genScramble(20, ["R", "L", "U", "D", "F", "B"]);
    case "4x4":
      return genScramble(40, ["R", "L", "U", "D", "F", "B", "Fw", "Rw", "Uw"]);
    case "Pyraminx":
      return genScramble(11, ["U", "L", "R", "B", "u", "r", "l", "b"]);
    default:
      return genScramble(20, ["R", "L", "U", "D", "F", "B"]);
  }
}

function genScramble(length, moves) {
  const suffixes = ["", "'", "2"];
  let scramble = [];
  let lastMove = "";

  for (let i = 0; i < length; i++) {
    let move;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (move === lastMove);
    lastMove = move;
    scramble.push(move + suffixes[Math.floor(Math.random() * suffixes.length)]);
  }

  return scramble.join(" ");
}
