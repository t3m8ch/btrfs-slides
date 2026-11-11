import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeInOutCubic, sequence} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

// Schematic redraw of the two layouts in Valerie Aurora's LWN article:
// https://lwn.net/Articles/342892/ (2009). Grid geometry and the two access
// paths follow the illustrations; sizes are illustrative, not measurements.
export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const shade = {super: '#5B6E2C', bitmap: '#DCE4B6', inode: '#7D8D39', dir: '#C8D68A', pointers: '#FFB38F', data: '#DFE5E0'};
  const cells = [
    {label: 'superblock', color: shade.super, from: [0, 0], to: [0, 0], width: 1},
    {label: 'bitmaps', color: shade.bitmap, from: [1, 0], to: [1, 0], width: 0.85},
    {label: 'inodes', color: shade.inode, from: [2, 0], to: [2, 0], width: 0.5},
    {label: 'dir entries', color: shade.dir, from: [1, 2], to: [2.5, 0], width: 0.6},
    {label: 'inodes', color: shade.inode, from: [3, 2], to: [3.1, 0], width: 0.5},
    {label: 'block pointers', color: shade.pointers, from: [2, 6], to: [3.6, 0], width: 0.75},
    {label: 'file data', color: shade.data, from: [0, 4], to: [4.35, 0], width: 0.6},
    {label: 'file data', color: shade.data, from: [4, 3], to: [2.15, 2], width: 0.45},
    {label: '', color: shade.inode, from: [2.75, 0], to: [2, 2], width: 0.05},
    {label: '', color: shade.dir, from: [1.9, 2], to: [2.05, 2], width: 0.1},
  ];
  const refs = cells.map(() => createRef<Rect>());
  const oldWaste = createRef<Node>();
  const newWaste = createRef<Node>();
  const oldArrows = Array.from({length: 4}, () => createRef<Line>());
  const newArrow = createRef<Line>();
  const title = createRef<Txt>();
  const point = (x: number, y: number): [number, number] => [-800 + x * 320, -240 + y * 75];
  const waste = (x: number, y: number, width: number) => <Rect position={point(x, y)} offset={-1} width={width * 320} height={75} fill={colors.highlight} />;
  view.add(<>
    <Frame title="Что даёт такая упаковка" number="12" />
    <Txt ref={title} x={-850} y={-325} offsetX={-1} text="Раздельное размещение: разные типы — в разных блоках" fontFamily={font} fontSize={33} fill={colors.muted} />
    <Node ref={oldWaste}>
      {waste(1.85, 0, 0.15)}{waste(2.5, 0, 0.25)}{waste(2.8, 0, 0.2)}
      {waste(1.6, 2, 0.3)}{waste(3.5, 2, 0.5)}{waste(4.45, 3, 0.55)}
      {waste(0.6, 4, 0.4)}{waste(2.75, 6, 0.25)}
    </Node>
    <Node ref={newWaste} opacity={0}>
      {waste(1.85, 0, 0.15)}{waste(4.95, 0, 0.05)}{waste(2.6, 2, 0.4)}
    </Node>
    {cells.map((cell, i) => <Rect ref={refs[i]} position={point(cell.from[0], cell.from[1])} offset={-1} width={cell.width * 320} height={75} fill={cell.color}>
      <Txt text={cell.label} fontFamily={font} fontSize={cell.width < 0.55 ? 22 : 24} fill={cell.color === shade.super || cell.color === shade.inode ? colors.background : colors.foreground} />
    </Rect>)}
    {Array.from({length: 6}, (_, i) => <Line points={[point(i, 0), point(i, 8)]} stroke={colors.foreground} lineWidth={1.5} />)}
    {Array.from({length: 9}, (_, i) => <Line points={[point(0, i), point(5, i)]} stroke={colors.foreground} lineWidth={1.5} />)}
    {[
      [point(2.25, 1.1), point(1.3, 1.9)],
      [point(1.3, 3.1), point(2.2, 3.8), point(3.25, 3.1)],
      [point(3.25, 3.1), point(2.4, 5.9)],
      [point(1.9, 6.8), point(0.4, 5.1)],
    ].map((points, i) => <Line ref={oldArrows[i]} points={points} end={0} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} radius={70} />)}
    <Line ref={newArrow} points={[point(4.8, 1.1), point(2.05, 1.9)]} end={0} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} />
    <Rect x={-836} y={400} width={22} height={22} fill={colors.highlight} />
    <Txt x={-810} y={400} offsetX={-1} text="неиспользованные хвосты" fontFamily={font} fontSize={22} fill={colors.foreground} />
    <Txt x={850} y={400} offsetX={1} text="Схема по LWN · lwn.net/Articles/342892/" fontFamily={font} fontSize={22} fill={colors.muted} />
  </>);
  yield* beginSlide('Раздельные блоки по типам');
  yield* sequence(0.3, ...oldArrows.map(ref => ref().end(1, 0.5)));
  yield* beginSlide('Переходы между разнесёнными областями');
  yield* all(...oldArrows.map(ref => ref().opacity(0, 0.3)), oldWaste().opacity(0, 0.4));
  yield* all(...refs.map((ref, i) => ref().position(point(cells[i].to[0], cells[i].to[1]), 1.4, easeInOutCubic)), newWaste().opacity(1, 1.4));
  title().text('Btrfs: плотная упаковка связанных записей разных типов');
  yield* newArrow().end(1, 0.6);
  yield* beginSlide('Плотность и близость записей');
});
