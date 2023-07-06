import { useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

function App() {
  //NOWposinonが現在の変数Setnowposionが変更する式
  const [nowPosision, setNowPosision] = useState([0, 0]);

  return (
    <Stage width={1920} height={1080}>
      <Layer>
        <Rect fill="white" width={1920} height={1080} />
        <Rect
          fill="red"
          x={60 + 120 * nowPosision[0]}
          y={60 + 120 * nowPosision[0]}
          width={120}
          height={120}
        />
      </Layer>
    </Stage>
  );
}

export default App;
