import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

// A SINGLE chunk: [256, 512) MiB logical maps to device 1 starting at 1 GiB.
export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const physical = createRef<Node>();
  const mapping = createRef<Node>();
  const selected = createRef<Node>();
  const caption = createRef<Txt>();
  view.add(<>
    <Frame title="Chunk — отображение диапазона" number="14" />
    <Txt ref={caption} y={-335} text="Большой диапазон логических адресов" fontFamily={font} fontSize={35} fontWeight={600} fill={colors.foreground} />
    <Rect y={-150} width={1700} height={200} radius={22} stroke={colors.muted} lineWidth={3} />
    <Txt x={-800} y={-215} offsetX={-1} text="Btrfs" fontFamily={font} fontSize={33} fill={colors.foreground} />
    <Rect y={-130} width={1540} height={80} radius={5} stroke={colors.accent} lineWidth={2} />
    <Rect x={-340} y={-130} width={680} height={80} radius={5} fill={'#E1E7CE'} stroke={colors.foreground} lineWidth={4}>
      <Txt text="Chunk · 256 МиБ" fontFamily={font} fontSize={34} fontWeight={600} fill={colors.foreground} />
    </Rect>
    <Txt x={-680} y={-72} offsetX={1} text="256 МиБ" fontFamily={font} fontSize={27} fill={colors.muted} />
    <Txt x={0} y={-72} offsetX={1} text="512 МиБ" fontFamily={font} fontSize={27} fill={colors.muted} />
    <Node ref={physical} opacity={0}>
      <Rect y={190} width={1700} height={200} radius={22} stroke={colors.muted} lineWidth={3} />
      <Txt x={-800} y={125} offsetX={-1} text="Устройство 1" fontFamily={font} fontSize={33} fill={colors.foreground} />
      <Rect y={210} width={1540} height={80} radius={5} stroke={colors.accent} lineWidth={2} />
      <Rect x={160} y={210} width={680} height={80} radius={5} fill={'#E1E7CE'} stroke={colors.foreground} lineWidth={4} />
      <Txt x={-180} y={315} offsetX={-1} text="1 ГиБ" fontFamily={font} fontSize={27} fill={colors.muted} />
      <Txt x={500} y={315} offsetX={1} text="+ 256 МиБ" fontFamily={font} fontSize={27} fill={colors.muted} />
    </Node>
    <Node ref={mapping} opacity={0}>
      <Line points={[[-680, -90], [-180, 165]]} stroke={colors.muted} lineWidth={3} endArrow arrowSize={13} />
      <Line points={[[0, -90], [500, 165]]} stroke={colors.muted} lineWidth={3} endArrow arrowSize={13} />
    </Node>
    <Node ref={selected} opacity={0}>
      <Txt x={-510} y={-285} text="320 МиБ" fontFamily="Menlo" fontSize={32} fill={colors.foreground} />
      <Line points={[[-510, -265], [-510, -90]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={13} />
      <Line points={[[-510, -85], [-10, 165]]} stroke={colors.foreground} lineWidth={5} endArrow arrowSize={15} />
      <Line points={[[-10, 165], [-10, 255]]} stroke={colors.foreground} lineWidth={5} />
      <Txt x={-10} y={365} text="1 ГиБ + 64 МиБ" fontFamily="Menlo" fontSize={32} fill={colors.foreground} />
    </Node>
  </>);
  yield* beginSlide('Chunk — диапазон логических адресов');
  yield* all(physical().opacity(1, 0.6), mapping().opacity(1, 0.8), caption().text('Диапазон отображается на участок устройства', 0.4));
  yield* beginSlide('Отображение chunk на устройство');
  yield* all(selected().opacity(1, 0.8), caption().text('Смещение внутри chunk сохраняется', 0.4));
  yield* beginSlide('Переводим адрес внутри диапазона');
  yield* caption().text('Chunk tree хранит такие отображения диапазонов', 0.4);
  yield* beginSlide('Зачем нужно Chunk tree');
});
