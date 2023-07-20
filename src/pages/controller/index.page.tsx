import { useAtom } from 'jotai';
import { Loading } from 'src/components/Loading/Loading';
import { userAtom } from '../../atoms/user';

const Controller = () => {
  const [user] = useAtom(userAtom);

  if (!user) return <Loading visible />;
  return (
    <div>
      <p>gradius controller</p>
    </div>
  );
};

export default Controller;
