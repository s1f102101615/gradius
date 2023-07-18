const spawnEnemy = (
  prevEnemy: { x: number; y: number; speedX: number; monster: number; status: number }[]
) => {
  const enemyspwan = {
    x: 640,
    y: Math.floor(Math.random() * 481),
    speedX: -100,
    monster: 0,
    status: 0,
  };
  return [...prevEnemy, enemyspwan];
};

export default spawnEnemy;
