import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const snapshot = createRef<Node>();
  const snapshotLink = createRef<Line>();
  const liveLink = createRef<Line>();
  const copies = Array.from({length: 3}, () => createRef<Rect>());
  const edges = Array.from({length: 4}, () => createRef<Line>());
  const snapshotRoot = createRef<Rect>();
  const originalRoot = createRef<Rect>();
  const originalEdges = [createRef<Line>(), createRef<Line>()];
  const snapshotEdges = [createRef<Line>(), createRef<Line>()];
  const caption = createRef<Txt>();
  view.add(<>
    <Frame title="Снимок подтома: общие блоки" number="22" />
    <Rect x={-500} y={-320} width={480} height={85} radius={12} stroke={colors.muted} lineWidth={3}>
      <Txt text="Подтом" fontFamily={font} fontSize={36} fontWeight={600} fill={colors.foreground} />
    </Rect>
    <Node ref={snapshot} x={-500} y={-320} opacity={0}>
      <Rect width={480} height={85} radius={12} stroke={colors.muted} lineWidth={3} />
      <Txt text="Снимок" fontFamily={font} fontSize={36} fontWeight={600} fill={colors.foreground} />
    </Node>
    <Line ref={liveLink} points={[[-500, -277], [0, -195]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={13} />
    <Line ref={snapshotLink} points={[[500, -277], [500, -195]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={13} end={0} />
    <Line ref={originalEdges[0]} points={[[0, -105], [-300, -10]]} stroke={colors.muted} lineWidth={3} />
    <Line ref={originalEdges[1]} points={[[0, -105], [300, -10]]} stroke={colors.muted} lineWidth={3} />
    {[-500, -100, 300, 700].map((x, i) => <Node>
      <Line points={[[i < 2 ? -300 : 300, 70], [x, 180]]} stroke={colors.muted} lineWidth={3} />
      <Rect x={x} y={220} width={200} height={80} radius={8} stroke={colors.muted} lineWidth={3}>
        <Txt text={i === 0 ? 'Лист' : '…'} fontFamily={font} fontSize={31} fill={colors.foreground} />
      </Rect>
    </Node>)}
    <Rect ref={originalRoot} y={-150} width={240} height={90} radius={9} stroke={colors.muted} lineWidth={3}>
      <Txt text="Корень" fontFamily={font} fontSize={33} fill={colors.foreground} />
    </Rect>
    <Line ref={snapshotEdges[0]} points={[[500, -105], [-300, -10]]} stroke={colors.muted} lineWidth={3} end={0} />
    <Line ref={snapshotEdges[1]} points={[[500, -105], [300, -10]]} stroke={colors.muted} lineWidth={3} end={0} />
    <Rect ref={snapshotRoot} y={-150} width={240} height={90} radius={9} stroke={colors.muted} lineWidth={3} fill={colors.background} opacity={0}>
      <Txt text="Корень" fontFamily={font} fontSize={33} fill={colors.foreground} />
    </Rect>
    {[-300, 300].map(x => <Rect x={x} y={30} width={220} height={80} radius={8} stroke={colors.muted} lineWidth={3}>
      <Txt text={x < 0 ? 'Узел' : '…'} fontFamily={font} fontSize={32} fill={colors.foreground} />
    </Rect>)}
    {[
      [[-550, -105], [-650, -10]], [[-550, -105], [300, -10]],
      [[-650, 70], [-750, 180]], [[-650, 70], [-100, 180]],
    ].map((points, i) => <Line ref={edges[i]} points={points as [number, number][]} stroke={colors.foreground} lineWidth={4} end={0} />)}
    {[[0, -150], [-300, 30], [-500, 220]].map(([x, y], i) => <Rect ref={copies[i]} x={x} y={y} width={i === 0 ? 240 : 220} height={i === 0 ? 90 : 80} radius={9} fill={'#E1E7CE'} stroke={colors.foreground} lineWidth={4} opacity={0}>
      <Txt text={['Корень′', 'Узел′', 'Лист′'][i]} fontFamily={font} fontSize={32} fill={colors.foreground} />
    </Rect>)}
    <Txt ref={caption} y={365} text="" fontFamily={font} fontSize={35} fontWeight={600} fill={colors.foreground} />
  </>);
  yield* beginSlide('Подтом — отдельное FS tree');
  yield* all(snapshot().opacity(1, 0.3), snapshot().position.x(500, 1), snapshotLink().end(1, 1), caption().text('Копируем корневой блок', 0.4), snapshotRoot().opacity(1, 0.3), snapshotRoot().position.x(500, 1), ...snapshotEdges.map(ref => ref().end(1, 1)));
  yield* beginSlide('Снимок — отдельный корень и общие блоки');
  yield* caption().text('Меняем файл в исходном подтоме', 0.4);
  yield* all(copies[2]().opacity(1, 0.3), copies[2]().position.x(-750, 0.8));
  yield* all(copies[1]().opacity(1, 0.3), copies[1]().position.x(-650, 0.8), edges[2]().end(1, 0.8), edges[3]().end(1, 0.8));
  yield* all(copies[0]().opacity(1, 0.3), copies[0]().position.x(-550, 0.8), edges[0]().end(1, 0.8), edges[1]().end(1, 0.8));
  yield* all(liveLink().points([[-500, -277], [-550, -195]], 0.7), originalRoot().opacity(0, 0.7), ...originalEdges.map(ref => ref().opacity(0, 0.7)));
  yield* caption().text('Снимок сохраняет прежнее дерево', 0.4);
  yield* beginSlide('После записи меняется только путь подтома');
});
