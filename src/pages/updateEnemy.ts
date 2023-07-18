const updateEnemy = (
  enemies: { x: number; y: number; speedX: number; monster: number; status: number }[],
  roomStatus: string | undefined,
  timeDiff: number
) => {
  return enemies
    .map((enemy) => ({
      ...enemy,
      x: enemy.x + (roomStatus === 'paused' ? 0 : enemy.speedX) * timeDiff, // pause中はspeedXを0にする
    }))
    .filter((enemy) => enemy.x > 0); // 画面の左端に到達していない敵のみをフィルタリング
};

export default updateEnemy;
