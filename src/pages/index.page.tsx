/* eslint-disable max-depth */
/* eslint-disable max-nested-callbacks */
/* eslint-disable react-hooks/exhaustive-deps */
import type { RoomModel } from '$/commonTypesWithClient/models';
import { useAtom } from 'jotai';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Circle, Layer, Rect, Stage } from 'react-konva';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { userAtom } from '../atoms/user';

const Home = () => {
  const [user] = useAtom(userAtom);
  const [nowkey, setNowkey] = useState([0, 0]);
  const [enemy, setEnemy] = useState<{ x: number; y: number; speedX: number }[]>([]);
  const [room, setRoom] = useState<RoomModel>();
  const [nowtime, setNowtime] = useState([0, 0]);
  const [gradius_bullet, setGradius_bullet] = useState<{ x: number; y: number; speedX: number }[]>(
    []
  );
  const animationRef = useRef<Konva.Animation | null>(null);

  // Zで弾発射 Spaceで敵生成
  const keyDownHandler = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'KeyZ') {
      const bullet = { x: nowkey[1] + 54, y: nowkey[0] + 20, speedX: 1000 };
      setGradius_bullet((prevGradius_bullet) => [...prevGradius_bullet, bullet]);
    } else if (e.code === 'Space') {
      const enemyspwan = { x: 640, y: Math.floor(Math.random() * 481), speedX: -100 };
      setEnemy((prevEnemy) => [...prevEnemy, enemyspwan]);
    }
    const a = await apiClient.control.post({
      body: { x: nowkey[0], y: nowkey[1], KeyEvent: e.code },
    });
    setNowkey([a.body.x, a.body.y]);
  };

  //敵と球が接触しているか確かめる関数
  function checkCollision(
    bullet: { x: number; y: number; speedX: number },
    enemy: { x: number; y: number; speedX: number }
  ) {
    const bullet_radius = 10;
    const enemy_radius = 45;
    const dx = bullet.x - enemy.x;
    const dy = bullet.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const collisionDistance = bullet_radius + enemy_radius;
    return distance <= collisionDistance;
  }
  // 弾と敵が接触していたら消滅
  const checkCollisions = () => {
    setEnemy((prevEnemies) => {
      return prevEnemies.filter((enemy) => {
        const collision = gradius_bullet.some((bullet) => checkCollision(bullet, enemy));
        if (collision) {
          // 接触した敵は除外する
          setGradius_bullet((prevBullets) =>
            prevBullets.filter((bullet) => !checkCollision(bullet, enemy))
          );
          return false;
        }
        return true;
      });
    });
  };

  const fetchRooms = async () => {
    const box = await apiClient.rooms.get();
    setRoom(box.body);
    setNowtime(box.body.nowtime);
  };

  //room読み込み作成
  useEffect(() => {
    fetchRooms();
  }, []);

  //シナリオ制御
  useEffect(() => {
    let time = nowtime[0];
    const now = nowtime[1];
    const interval = setInterval(() => {
      if (room?.status === 'started') {
        setNowtime([time + 1, now]);
        console.log(time);
        if (room.scenario && Number(room.scenario[now]) === time) {
          console.log(room.scenario[now + 1]);
          const enemyspwan = { x: 640, y: Math.floor(Math.random() * 481), speedX: -100 };
          setEnemy((prevEnemy) => [...prevEnemy, enemyspwan]);
          time = 0;
          setNowtime([time, now + 2]);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval); // コンポーネントがアンマウントされたときにインターバルをクリアしてメモリリークを防止します。
    };
  }, [room, nowtime]);

  useEffect(() => {
    const anim = new Konva.Animation((frame) => {
      if (frame) {
        const timeDiff = frame.timeDiff / 1000; // ミリ秒を秒に変換
        // ボールの位置や状態を更新する処理
        setGradius_bullet(
          (prev) =>
            prev
              .map((bullet) => ({
                ...bullet,
                x: bullet.x + bullet.speedX * timeDiff,
              }))
              .filter((bullet) => bullet.x < 640) // 画面の右端に到達していない弾のみをフィルタリング
        );
        // 敵の動き
        setEnemy((prev) =>
          prev.map((enemy) => ({
            ...enemy,
            x: enemy.x + enemy.speedX * timeDiff,
          }))
        );
        setEnemy((prev) =>
          prev
            .map((enemy) => ({
              ...enemy,
              x: enemy.x + enemy.speedX * timeDiff,
            }))
            .filter((enemy) => enemy.x > 0)
        );
        // 弾と敵が当たっているか
        checkCollisions();
      }
    });
    anim.start();

    animationRef.current = anim;

    return () => {
      anim.stop();
    };
  }, [gradius_bullet, enemy]);

  const pause = async () => {
    await apiClient.rooms.post({ body: { status: 'paused', nowtime } });
    fetchRooms();
    console.log('pause');
  };

  const start = async () => {
    // 次の行のnowtime赤線が出るから一応書いておいた
    await apiClient.rooms.post({ body: { status: 'started', nowtime } });
    fetchRooms();
    console.log('start');
  };

  if (!user) return <Loading visible />;
  return (
    <>
      <p>gradius{nowkey}</p>
      <div
        tabIndex={0}
        onKeyDown={keyDownHandler}
        style={{ display: 'inline-block', border: 'solid' }}
      >
        <Stage width={640} height={480}>
          <Layer>
            <Rect x={nowkey[1]} y={nowkey[0]} width={50} height={40} fill="blue" />
            {enemy.map((state, index) => (
              <Circle key={index} x={state.x} y={state.y} radius={35} fill="red" />
            ))}
            {gradius_bullet.map((bullet, index) => (
              <Circle key={index} x={bullet.x} y={bullet.y} radius={10} fill="green" />
            ))}
          </Layer>
        </Stage>
      </div>
      <div onClick={pause}>pause</div>
      <div onClick={start}>start</div>
    </>
  );
};

export default Home;
