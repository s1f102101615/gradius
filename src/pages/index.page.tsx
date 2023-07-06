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
  // const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
  //   const key = e.code;

  //   if (key === 'ArrowUp') {
  //     console.log('u');
  //   }

  //   if (key === 'ArrowDown') {
  //     console.log('d');
  //   }

  //   if (key === 'ArrowLeft') {
  //     console.log('l');
  //   }

  //   if (key === 'ArrowRight') {
  //     console.log('r');
  //   }
  // };
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
  }, []);

  if (!user) return <Loading visible />;

  return <>{/* <App /> */}</>;
};

export default Home;
