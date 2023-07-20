/* eslint-disable complexity */
/* eslint-disable max-lines */
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
import spawnEnemy from './spawnEnemy';
import updateEnemy from './updateEnemy';

const Home = () => {
  const [user] = useAtom(userAtom);
  const [nowkey, setNowkey] = useState([0, 0]);
  const [enemy, setEnemy] = useState<
    { x: number; y: number; speedX: number; monster: number; status: number }[]
  >([]);
  const [room, setRoom] = useState<RoomModel>();
  const [nowtime, setNowtime] = useState([0, 0]);
  const [gradius_bullet, setGradius_bullet] = useState<{ x: number; y: number; speedX: number }[]>(
    []
  );
  const [up, setUp] = useState(false);
  const [down, setDown] = useState(false);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [bullet, setBullet] = useState(false);
  const [shottimer, setShottimer] = useState(0);
  const animationRef = useRef<Konva.Animation | null>(null);

  //キーを押したときに実行される関数
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowUp':
        setUp(true);
        break;
      case 'ArrowDown':
        setDown(true);
        break;
      case 'ArrowLeft':
        setLeft(true);
        break;
      case 'ArrowRight':
        setRight(true);
        break;
      case 'KeyZ':
        setBullet(true);
        break;
    }
  };

  // キーを離したときに実行される関数
  const handleKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowUp':
        setUp(false);
        break;
      case 'ArrowDown':
        setDown(false);
        break;
      case 'ArrowLeft':
        setLeft(false);
        break;
      case 'ArrowRight':
        setRight(false);
        break;
      case 'KeyZ':
        setBullet(false);
        break;
    }
  };

  //敵と球が接触しているか確かめる関数
  function checkCollision(
    bullet: { x: number; y: number; speedX: number },
    enemy: { x: number; y: number; speedX: number }
  ) {
    const bullet_radius = 10;
    const enemy_radius = 22.5;
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

  //再描画
  const fetchRooms = async () => {
    const box = await apiClient.rooms.get();
    setRoom(box.body);
    setNowtime(box.body.nowtime);
    setGradius_bullet(JSON.parse(box.body.bullet));
    setEnemy(JSON.parse(box.body.enemy));
    setNowkey(box.body.myposition);
    //start後加速している 敵と球が一種類だから可能(多分後で変える)
    setGradius_bullet((prev) =>
      prev.map((bullet) => ({
        ...bullet,
        speedX: 1000, // speedXを元の値に戻す
      }))
    );
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
          setEnemy((prevEnemy) => spawnEnemy(prevEnemy, room.scenario[now + 1]));
          time = 0;
          setNowtime([time, now + 2]);
        }
      }
    }, 1000);
    const autosave = setInterval(async () => {
      await apiClient.rooms.post({
        body: {
          status: 'paused',
          nowtime,
          myposition: nowkey,
          bullet: JSON.stringify(gradius_bullet),
          enemy: JSON.stringify(enemy),
        },
      });
    }, 1000);

    return () => {
      clearInterval(autosave);
      clearInterval(interval); // コンポーネントがアンマウントされたときにインターバルをクリアしてメモリリークを防止します。
    };
  }, [room, nowtime]);

  //高速で実行される(Animation)
  useEffect(() => {
    const anim = new Konva.Animation((frame) => {
      if (frame) {
        const timeDiff = frame.timeDiff / 1000; // ミリ秒を秒に変換
        if (room?.status === 'started') {
          //自機移動
          const nowstate = nowkey;
          nowstate[0] = nowkey[0] + (up ? -3 : 0) + (down ? 3 : 0);
          nowstate[1] = nowkey[1] + (left ? -3 : 0) + (right ? 3 : 0);
          setNowkey(nowstate);
          //弾発射
          setShottimer(shottimer + timeDiff);
          if (bullet) {
            if (shottimer > 0.3) {
              setGradius_bullet((prevGradius_bullet) => [
                ...prevGradius_bullet,
                { x: nowkey[1] + 54, y: nowkey[0] + 20, speedX: 1000 },
              ]);
              setShottimer(0);
            }
          }
        }

        // ボールの位置や状態を更新する処理
        setGradius_bullet(
          (prev) =>
            prev
              .map((bullet) => ({
                ...bullet,
                x: bullet.x + bullet.speedX * timeDiff,
                speedX: room?.status === 'paused' ? 0 : bullet.speedX, // pause中はspeedXを0にする
              }))
              .filter((bullet) => bullet.x < 640) // 画面の右端に到達していない弾のみをフィルタリング
        );
        // 敵の動き
        setEnemy((prev) => updateEnemy(prev, room?.status, timeDiff, nowkey));
        // 弾と敵が当たっているか
        checkCollisions();
      }
    });
    anim.start();

    animationRef.current = anim;

    return () => {
      anim.stop();
    };
  }, [gradius_bullet, enemy, up, down, left, right, nowkey]);

  //キー入力検知
  useEffect(() => {
    // コンポーネントがマウントされたときにイベントリスナーを追加
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // コンポーネントがアンマウントされるときにイベントリスナーを削除
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  //ポーズと再開の処理ポーズ   ブラウザバックとリロード時にも起動するように今後する。
  const pause = async () => {
    await apiClient.rooms.post({
      body: {
        status: 'paused',
        nowtime,
        myposition: nowkey,
        bullet: JSON.stringify(gradius_bullet),
        enemy: JSON.stringify(enemy),
      },
    });
    fetchRooms();
    console.log('pause');
  };

  const start = async () => {
    // 次の行のnowtime赤線が出るから一応書いておいた
    await apiClient.rooms.post({
      body: {
        status: 'started',
        nowtime,
        myposition: nowkey,
        bullet: JSON.stringify(gradius_bullet),
        enemy: JSON.stringify(enemy),
      },
    });
    fetchRooms();
    console.log('start');
  };

  if (!user) return <Loading visible />;
  return (
    <>
      <p>gradius{nowkey}</p>
      <div tabIndex={0} style={{ display: 'inline-block', border: 'solid' }}>
        <Stage width={640} height={480}>
          <Layer>
            <Rect x={nowkey[1]} y={nowkey[0]} width={50} height={40} fill="blue" />
            {enemy.map((state, index) => (
              <Circle
                key={index}
                x={state.x}
                y={state.y}
                radius={20}
                fill={state.monster === 1 ? 'pink' : 'red'}
              />
            ))}
            {gradius_bullet.map((bullet, index) => (
              <Circle key={index} x={bullet.x} y={bullet.y} radius={10} fill="green" />
            ))}
          </Layer>
        </Stage>
      </div>
      <div onClick={pause}>pause</div>
      <div onClick={start}>start</div>
      <div>
        {nowtime[0]}秒{nowtime[1] / 2}wave
      </div>
    </>
  );
};

export default Home;
