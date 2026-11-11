import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeInOutCubic} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';
import {Caption, TreeBlock} from '../components/tree';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const values = [10, 20, 30, 40, 50];
  const entries = values.map(() => createRef<Rect>());
  const left = createRef<Rect>();
  const right = createRef<Rect>();
  const root = createRef<Node>();
  const incoming = createRef<Rect>();
  const status = createRef<Txt>();
  view.add(<>
    <Frame title="Вставка: когда лист переполняется" number="10" />
    <Txt ref={status} x={-850} y={-305} offsetX={-1} text="Добавляем запись в свободное место листа" fontFamily={font} fontSize={35} fill={colors.muted} />
    <Node ref={root} opacity={0}>
      <Line points={[[-200, -95], [-420, 120]]} stroke={colors.muted} lineWidth={3} />
      <Line points={[[200, -95], [420, 120]]} stroke={colors.muted} lineWidth={3} />
      <TreeBlock y={-150} keys={['≥ 10', '≥ 30']} width={650} />
      <Txt x={620} y={-150} text="новый корень" fontFamily={font} fontSize={30} fill={colors.muted} />
    </Node>
    <Rect ref={left} y={40} width={760} height={140} stroke={colors.muted} lineWidth={3} radius={8} />
    <Rect ref={right} x={420} y={190} width={700} height={140} opacity={0} stroke={colors.muted} lineWidth={3} radius={8} />
    {values.map((key, i) => <Rect ref={entries[i]} x={-280 + i * 140} y={40} width={120} height={80} radius={4} stroke={colors.accent} lineWidth={2} fill={colors.background} opacity={i === 4 ? 0 : 1}>
      <Txt text={String(key)} fontFamily="Menlo" fontSize={34} fill={colors.foreground} />
    </Rect>)}
    <Rect ref={incoming} x={700} y={-175} width={120} height={80} radius={4} stroke={colors.highlight} lineWidth={3} fill={colors.background} opacity={0}>
      <Txt text="35" fontFamily="Menlo" fontSize={34} fill={colors.foreground} />
    </Rect>
    <Caption text="Прежний лист остаётся листом. Над листьями появляется новый корень." />
  </>);
  yield* beginSlide('Вставка в свободное место');
  yield* entries[4]().opacity(1, 0.4);
  yield* beginSlide('Лист заполнен');
  status().text('Приходит ключ 35. В нашем учебном листе больше нет места.');
  yield* incoming().opacity(1, 0.3);
  yield* beginSlide('Нужно разделить лист');
  yield* all(left().position([-420, 190], 0.7), left().width(700, 0.7), right().opacity(1, 0.5), ...entries.map((ref, i) => ref().position(i < 2 ? [-520 + i * 200, 190] : [i === 2 ? 180 : 500 + (i - 3) * 160, 190], 0.8, easeInOutCubic)), incoming().position([340, 190], 0.8, easeInOutCubic));
  // Sorted result: [10, 20] and [30, 35, 40, 50].
  yield* root().opacity(1, 0.5);
  status().text('Два листа, два диапазона. Новый корень направляет поиск.');
  yield* beginSlide('Рост дерева');
});
