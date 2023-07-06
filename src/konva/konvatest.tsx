import { Layer, Rect, Stage } from 'react-konva';

function App() {
  return (
    <Stage width={3000} height={3000}>
      <Layer>
        <Rect fill="black" width={1920} height={1080} />
      </Layer>
    </Stage>
  );
}

export default App;
