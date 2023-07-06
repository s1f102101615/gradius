import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { userAtom } from '../atoms/user';

const Home = () => {
  const [user] = useAtom(userAtom);

  const handleKeyDown = (event: KeyboardEvent) => {
    // Escapeキーの場合処理を行う
    if (event.key === 'ArrowUp') {
      console.log('上');
    }
    if (event.key === 'ArrowDown') {
      console.log('下');
    }
    if (event.key === 'ArrowLeft') {
      console.log('左');
    }
    if (event.key === 'ArrowRight') {
      console.log('右');
    }
  };
 
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
  }, []);

  if (!user) return <Loading visible />;

  return <>{/* <App /> */}</>;
 
  const createNum = async () => {
    const a = await apiClient.control.post({ body: { x: 12, y: 11, a: 1 } });
    console.log(a.body.x, a.body.y);
    setNowkey([Number(a.body.x), Number(a.body.y)]);
  };
  if (!tasks || !user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      
      <input onClick={createNum} />

      <p>{nowkey}</p>
      )
  
};

export default Home;
