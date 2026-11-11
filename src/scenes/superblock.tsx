import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const bootstrap = createRef<Node>();
  const cycle = createRef<Node>();
  const caption = createRef<Txt>();
  const chunkPurpose = createRef<Txt>();
  const device = createRef<Node>();
  const box = createRef<Rect>();
  const fields = createRef<Node>();
  const chunk = createRef<Node>();
  const root = createRef<Node>();
  const mapLink = createRef<Line>();
  const chunkLink = createRef<Line>();
  const rootLink = createRef<Line>();
  view.add(<>
    <Frame title="Суперблок — точка входа" number="15" />
    <Txt ref={caption} y={-335} text="" fontFamily={font} fontSize={33} fontWeight={600} fill={colors.foreground} />
    <Node ref={device}>
      <Txt x={-800} y={-320} offsetX={-1} text="Устройство" fontFamily={font} fontSize={35} fill={colors.foreground} />
      <Rect y={-200} width={1600} height={90} radius={12} stroke={colors.muted} lineWidth={3} />
      <Txt x={-650} y={-285} text="64 КиБ" fontFamily="Menlo" fontSize={32} fill={colors.foreground} />
      <Txt x={-650} y={-90} text="Суперблок" fontFamily={font} fontSize={35} fontWeight={600} fill={colors.foreground} />
    </Node>
    <Rect ref={box} x={-650} y={-200} width={100} height={90} radius={10} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
      <Node ref={fields} opacity={0}>
        <Txt y={-190} text="Суперблок" fontFamily={font} fontSize={38} fontWeight={600} fill={colors.foreground} />
        <Rect y={-95} width={630} height={85} radius={6} stroke={colors.accent} lineWidth={2} fill={colors.background}>
          <Txt text="root" fontFamily="Menlo" fontSize={34} fill={colors.foreground} />
        </Rect>
        <Rect y={20} width={630} height={85} radius={6} stroke={colors.accent} lineWidth={2} fill={colors.background}>
          <Txt y={-18} text="chunk_root = L" fontFamily="Menlo" fontSize={31} fill={colors.foreground} />
          <Txt y={25} text="Логический адрес" fontFamily={font} fontSize={26} fill={colors.foreground} />
        </Rect>
        <Node ref={bootstrap} opacity={0}>
          <Rect y={135} width={630} height={85} radius={6} stroke={colors.accent} lineWidth={2} fill={colors.background}>
            <Txt y={-18} text="sys_chunk_array" fontFamily="Menlo" fontSize={30} fill={colors.foreground} />
            <Txt y={24} text="L… → устройство 1: P…" fontFamily={font} fontSize={25} fill={colors.foreground} />
          </Rect>
          <Txt y={215} text="Карта chunks самого Chunk tree" fontFamily={font} fontSize={28} fill={colors.foreground} />
        </Node>
      </Node>
    </Rect>
    <Line ref={mapLink} points={[[-130, 165], [-20, 165], [-20, 290], [500, 290], [500, 245]]} radius={12} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} lineDash={[12, 8]} end={0} />
    <Line ref={chunkLink} points={[[-130, 50], [80, 50], [80, 180], [205, 180]]} radius={12} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} end={0} />
    <Line ref={rootLink} points={[[-130, -65], [205, -80]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} end={0} />
    <Node ref={root} opacity={0}>
      <Rect x={500} y={-80} width={580} height={120} radius={12} stroke={colors.muted} lineWidth={3} />
      <Txt x={500} y={-95} text="Root tree" fontFamily={font} fontSize={40} fontWeight={600} fill={colors.foreground} />
      <Txt x={500} y={-45} text="Корни остальных деревьев" fontFamily={font} fontSize={29} fill={colors.foreground} />
    </Node>
    <Node ref={chunk} opacity={0}>
      <Rect x={500} y={180} width={580} height={120} radius={12} stroke={colors.muted} lineWidth={3} />
      <Txt x={500} y={165} text="Chunk tree" fontFamily={font} fontSize={40} fontWeight={600} fill={colors.foreground} />
      <Txt ref={chunkPurpose} x={500} y={215} text="Ещё не прочитано" fontFamily={font} fontSize={29} fill={colors.foreground} />
    </Node>
    <Node ref={cycle} opacity={0}>
      <Rect x={500} y={-140} width={580} height={130} radius={12} stroke={colors.foreground} lineWidth={3}>
        <Txt text={"Нужен физический\nадрес"} fontFamily={font} fontSize={34} lineHeight={42} fill={colors.foreground} />
      </Rect>
      <Line points={[[205, 180], [120, 180], [120, -140], [205, -140]]} radius={14} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} />
      <Line points={[[795, -140], [860, -140], [860, 180], [795, 180]]} radius={14} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} />
    </Node>
  </>);
  yield* beginSlide('Суперблок в известном месте устройства');
  yield* all(device().opacity(0, 0.5), box().position([-450, 30], 1), box().size([700, 490], 1));
  yield* fields().opacity(1, 0.5);
  yield* beginSlide('Раскрываем поля суперблока');
  yield* all(chunkLink().end(0.8, 0.8), chunk().opacity(1, 0.7), caption().text('Адрес логический. Как прочитать Chunk tree?', 0.4));
  yield* beginSlide('Чтобы прочитать Chunk tree нужен физический адрес');
  yield* all(chunkLink().opacity(0, 0.4), cycle().opacity(1, 0.6), caption().text('Для перевода адреса уже нужно прочитать Chunk tree', 0.4));
  yield* beginSlide('Замкнутый круг при запуске');
  yield* all(cycle().opacity(0, 0.5), bootstrap().opacity(1, 0.6), caption().text('В суперблоке есть начальная карта chunks', 0.4));
  yield* beginSlide('Раскрываем sys_chunk_array');
  yield* all(mapLink().end(1, 0.9), chunkLink().opacity(1, 0.5), chunkLink().end(1, 0.9), chunkPurpose().text('Логический → физический', 0.5), caption().text('Начальной карты хватает, чтобы прочитать Chunk tree', 0.4));
  yield* beginSlide('Начальная карта позволяет прочитать Chunk tree');
  yield* all(rootLink().end(1, 0.8), root().opacity(1, 0.6), caption().text('Теперь читаем Root tree и остальные деревья', 0.4));
  yield* beginSlide('Из суперблока получаем корень Root tree');
});
