export function scoreForPrediction(pred, match, config = {points_correct_score:3, points_correct_winner:1}) {
  const pa = Number(pred.pred_a)
  const pb = Number(pred.pred_b)
  const ma = match.score_a
  const mb = match.score_b
  if (ma === null || mb === null || ma === undefined) return 0
  let points = 0
  if (pa === ma && pb === mb) {
    points += Number(config.points_correct_score ?? 3)
  } else {
    const predDiff = pa - pb
    const matchDiff = ma - mb
    if (Math.sign(predDiff) === Math.sign(matchDiff) && Math.sign(predDiff) !== 0) {
      points += Number(config.points_correct_winner ?? 1)
    }
  }
  return points
}
