import type { TaskModel } from '$/commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import App from 'src/konva/konvatest';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import { userAtom } from '../atoms/user';

const Home = () => {
  const [user] = useAtom(userAtom);
  const [tasks, setTasks] = useState<TaskModel[]>();

  const [nowkey, setNow] = useState([0, 0]);

  const fetchTasks = async () => {
    const tasks = await apiClient.tasks.$get().catch(returnNull);

    if (tasks !== null) setTasks(tasks);
  };
  // const createTask = async () => {
  //   const aa = await apiClient.control.post({
  //     body: { x: 1 },
  //   });
  //   setNowkey(Number(aa));
  // };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createNum = async () => {
    const a = await apiClient.control.post({ body: { x: 12, y: 11, a: 1 } });
    console.log(a.body.x, a.body.y);
    setNow([Number(a.body.x), Number(a.body.y)]);
  };
  if (!tasks || !user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />

      <button onClick={createNum} />
      <p>{nowkey}</p>
      <button onClick={createNum} />

      <App />
    </>
  );
};

export default Home;
