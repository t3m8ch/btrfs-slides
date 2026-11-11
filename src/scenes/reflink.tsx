import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const copy = createRef<Node>();
  const oldCopyLink = createRef<Line>();
  const sharedLinks = createRef<Node>();
  const patch = createRef<Node>();
  const newLink = createRef<Line>();
  const changed = createRef<Rect>();
  const caption = createRef<Txt>();
  view.add(<>
    <Frame title="Дешёвая копия файла: reflink" number="21" />
    <Rect x={-500} y={-180} width={630} height={220} radius={18} stroke={colors.muted} lineWidth={3}>
      <Txt y={-55} text="aboba.md · 301" fontFamily={font} fontSize={36} fontWeight={600} fill={colors.foreground} />
      <Rect y={30} width={500} height={66} radius={5} fill={'#E1E7CE'} stroke={colors.accent} lineWidth={3} />
    </Rect>
    <Node ref={copy} x={-500} y={-180} opacity={0}>
      <Rect width={630} height={220} radius={18} stroke={colors.muted} lineWidth={3} />
      <Txt y={-55} text="copy.md · 303" fontFamily={font} fontSize={36} fontWeight={600} fill={colors.foreground} />
      <Rect y={30} width={500} height={66} radius={5} fill={'#E1E7CE'} stroke={colors.accent} lineWidth={3} />
      <Rect ref={changed} x={8} y={30} width={16} height={66} fill={'#FFE0D3'} stroke={colors.highlight} lineWidth={4} opacity={0} />
    </Node>
    <Line points={[[-500, -70], [-500, 180]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} />
    <Line ref={oldCopyLink} points={[[500, -70], [500, 70], [-200, 180]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} end={0} />
    <Rect x={-300} y={230} width={1050} height={90} radius={7} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3} />
    <Txt x={-300} y={325} text="Общие данные · 128 КиБ" fontFamily={font} fontSize={34} fill={colors.foreground} />
    <Node ref={patch} opacity={0}>
      <Rect x={650} y={230} width={260} height={90} radius={7} fill={'#FFE0D3'} stroke={colors.highlight} lineWidth={4} />
      <Txt x={650} y={325} text="Новые 4 КиБ" fontFamily={font} fontSize={34} fill={colors.foreground} />
    </Node>
    <Line ref={newLink} points={[[508, -70], [650, 180]]} stroke={colors.highlight} lineWidth={4} endArrow arrowSize={14} end={0} />
    <Node ref={sharedLinks} opacity={0}>
      <Line points={[[370, -70], [-580, 180]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} />
      <Line points={[[680, -70], [100, 180]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} />
    </Node>
    <Txt ref={caption} y={-335} text="" fontFamily={font} fontSize={34} fill={colors.foreground} />
  </>);
  yield* beginSlide('Исходный файл и его данные');
  yield* all(copy().opacity(1, 0.4), copy().position.x(500, 1), oldCopyLink().end(1, 1), caption().text('Новый файл — те же экстенты', 0.5));
  yield* beginSlide('Reflink — общие экстенты');
  yield* all(changed().opacity(1, 0.4), caption().text('Меняем [64, 68) КиБ только в copy.md', 0.4));
  yield* beginSlide('Изменяем копию файла');
  yield* all(patch().opacity(1, 0.5), oldCopyLink().end(0, 0.4), newLink().end(1, 0.8), sharedLinks().opacity(1, 0.8));
  yield* beginSlide('Остальные данные остаются общими');
});
