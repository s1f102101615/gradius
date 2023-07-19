/* eslint-disable complexity */
const updateEnemy = (
  enemies: { x: number; y: number; speedX: number; monster: number; status: number }[],
  roomStatus: string | undefined,
  timeDiff: number
) => {
  return enemies
    .map((enemy) => ({
      ...enemy,
      status: roomStatus === 'paused' ? enemy.status : enemy.status + timeDiff,
      x:
        enemy.x +
        (roomStatus === 'paused'
          ? 0
          : (enemy.status + timeDiff >= 3 && enemy.status + timeDiff <= 3.7) ||
            (enemy.status + timeDiff >= 5 && enemy.status + timeDiff <= 7) ||
            enemy.status + timeDiff >= 7
          ? -enemy.speedX * timeDiff
          : enemy.speedX * timeDiff), // pause中はspeedXを0にする
      y:
        enemy.y +
        (roomStatus === 'paused'
          ? 0
          : (enemy.status + timeDiff >= 3 && enemy.status + timeDiff <= 3.7) ||
            (enemy.status + timeDiff >= 5 && enemy.status + timeDiff <= 7)
          ? -60 * timeDiff
          : 0),
    }))
    .filter((enemy) => enemy.x > 0); // 画面の左端に到達していない敵のみをフィルタリング
};

export default updateEnemy;

//また敵0にしか対応していない今後追加予定(0もまだミラーにできてない*上から出たら下の方に曲がる)
