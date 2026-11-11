import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeInOutCubic} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';
import {Caption, TreeBlock} from '../components/tree';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const values = [10, 15, 20, 30, 35, 40, 50, 55, 60];
  const entries = values.map(() => createRef<Rect>());
  const structure = createRef<Node>();
  const chosen = createRef<Line>();
  const status = createRef<Txt>();
  const pointer = createRef<Line>();
  view.add(<>
    <Frame title="Зачем нам B-дерево" number="07" />
    <Txt ref={status} x={-850} y={-305} offsetX={-1} text="Ищем ключ 35. Проверять все записи подряд дорого." fontFamily={font} fontSize={35} fill={colors.muted} />
    <Node ref={structure} opacity={0}>
      {[-560, 0, 560].map(x => <Line points={[[x * 0.65, -95], [x, 125]]} stroke={colors.accent} lineWidth={3} />)}
      <TreeBlock y={-150} keys={['≥ 10', '≥ 30', '≥ 50']} width={780} />
      {[-560, 0, 560].map(x => <Rect x={x} y={180} width={470} height={120} radius={8} stroke={colors.muted} lineWidth={3} fill={colors.background} />)}
      <Txt x={-560} y={280} text="10 ≤ ключ < 30" fontFamily="Menlo" fontSize={25} fill={colors.muted} />
      <Txt y={280} text="30 ≤ ключ < 50" fontFamily="Menlo" fontSize={25} fill={colors.muted} />
      <Txt x={560} y={280} text="ключ ≥ 50" fontFamily="Menlo" fontSize={25} fill={colors.muted} />
    </Node>
    <Line ref={chosen} end={0} points={[[0, -95], [0, 75]]} stroke={colors.foreground} lineWidth={7} />
    {values.map((value, i) => <Rect ref={entries[i]} x={-720 + i * 180} width={140} height={72} radius={5} stroke={colors.accent} lineWidth={2} fill={colors.background}>
      <Txt text={String(value)} fontFamily="Menlo" fontSize={32} fill={colors.foreground} />
    </Rect>)}
    <Line ref={pointer} x={-720} y={-65} points={[[0, -65], [0, 0]]} stroke={colors.foreground} lineWidth={7} endArrow arrowSize={20} />
    <Caption text="Один узел выбирает ветвь. В листьях находим запись." />
  </>);
  yield* beginSlide('Последовательный поиск');
  for (let i = 1; i <= 4; i++) yield* pointer().x(-720 + i * 180, 0.35);
  yield* beginSlide('Собираем дерево');
  yield* all(pointer().opacity(0, 0.2), structure().opacity(1, 0.5), ...entries.map((ref, i) => ref().position([-560 + Math.floor(i / 3) * 560 + (i % 3 - 1) * 150, 180], 0.9, easeInOutCubic)));
  status().text('В одном узле — много ключей. Выбираем диапазон для 35.');
  yield* beginSlide('Выбираем ветвь');
  yield* chosen().end(1, 0.5);
  pointer().position([0, 140]);
  yield* pointer().opacity(1, 0.3);
  status().text('30 ≤ 35 < 50 → средний лист → запись 35');
  yield* beginSlide('Ключ найден');
});
