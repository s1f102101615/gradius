import { Layer, Rect, Stage } from 'react-konva';

function App() {
  return (
    <Stage width={1920} height={1080}>
      <Layer>
        <Rect fill="black" width={1920} height={1080} />
        <Rect fill="red" width={120} height={120} />
      </Layer>
    </Stage>
  );
}

export default App;
