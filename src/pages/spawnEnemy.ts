const spawnEnemy = (
  prevEnemy: { x: number; y: number; speedX: number; monster: number; status: number }[],
  enemyType: string
) => {
  const ballspawn = () => {
    const newEnemies = [];
    const randomy = Math.floor(Math.random() * 481);
    for (let i = 0; i < 5; i++) {
      const enemyspwan = {
        x: 640 + i * 50,
        y: randomy,
        speedX: -120,
        monster: 0,
        status: -0.5 * i,
      };
      newEnemies.push(enemyspwan);
    }
    return [...prevEnemy, ...newEnemies];
  };

  switch (enemyType) {
    case '0':
      return ballspawn();
    default:
      return prevEnemy;
  }
};

export default spawnEnemy;

//スポーンする敵の種類ごとに出る数出る場所を決める
//0はボール
