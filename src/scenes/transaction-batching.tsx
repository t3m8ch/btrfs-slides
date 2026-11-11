import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

// Simplified example: repeated edits to still-writable, private CoW blocks.
export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const working = createRef<Node>();
  const saved = createRef<Node>();
  const nodes = Array.from({length: 4}, () => createRef<Rect>());
  const links = Array.from({length: 3}, () => createRef<Line>());
  const sizes = [createRef<Txt>(), createRef<Txt>()];
  const oldPointer = createRef<Line>();
  const newPointer = createRef<Line>();
  const transaction = createRef<Rect>();
  const workingLabel = createRef<Txt>();
  const caption = createRef<Txt>();
  const operation = createRef<Txt>();
  const field = createRef<Txt>();
  const pointer = createRef<Line>();
  const sharedLeaf = createRef<Line>();
  view.add(<>
    <Frame title="Несколько изменений — одна транзакция" number="25" />
    <Rect y={-300} width={440} height={95} radius={10} stroke={colors.foreground} lineWidth={3}>
      <Txt y={-20} text="Суперблок" fontFamily={font} fontSize={31} fontWeight={600} fill={colors.foreground} />
      <Txt ref={field} y={22} text="root = старый Root tree" fontFamily="Menlo" fontSize={24} fill={colors.foreground} />
    </Rect>
    <Line ref={oldPointer} points={[[-180, -252], [-180, -150], [-460, -150], [-460, -125]]} radius={12} stroke={colors.foreground} lineWidth={5} endArrow arrowSize={16} />
    <Line ref={newPointer} points={[[180, -252], [180, -150], [460, -150], [460, -125]]} radius={12} stroke={colors.foreground} lineWidth={5} endArrow arrowSize={16} end={0} />
    <Rect ref={transaction} x={460} y={85} width={820} height={530} radius={20} stroke={colors.muted} lineWidth={3} lineDash={[12, 9]} opacity={0} />
    <Line ref={sharedLeaf} points={[[460, 115], [-280, 190]]} stroke={colors.muted} lineWidth={3} end={0} />
    {[-460, 460].map((x, version) => <Node ref={version ? working : saved} x={x}>
      <Txt ref={version ? workingLabel : undefined} y={-220} text={version ? 'Рабочая версия' : 'Сохранённое состояние'} fontFamily={font} fontSize={32} fontWeight={600} fill={colors.muted} opacity={version ? 0 : 1} />
      {[[[0, -35], [0, 25]], [[0, 115], [-180, 190]], [[0, 115], [180, 190]]].map((points, i) => <Line ref={version ? links[i] : undefined} points={points as [number, number][]} stroke={colors.muted} lineWidth={3} end={version ? 0 : 1} />)}
      {[[0, -80], [0, 70], [-180, 245], [180, 245]].map(([bx, by], i) => <Rect ref={version ? nodes[i] : undefined} x={bx} y={by} width={i < 2 ? 300 : 330} height={i < 2 ? 90 : 110} radius={10} stroke={colors.muted} lineWidth={3} fill={version ? '#E1E7CE' : colors.background} opacity={version ? 0 : 1}>
        {i < 2 ? <Txt text={i === 0 ? 'Root tree' : 'FS tree'} fontFamily={font} fontSize={32} fill={colors.foreground} /> : <Node>
          <Txt y={-24} text={i === 2 ? 'aboba.md' : 'copy.md'} fontFamily={font} fontSize={30} fill={colors.foreground} />
          <Txt ref={version ? sizes[i - 2] : undefined} y={25} text="128 КиБ" fontFamily="Menlo" fontSize={29} fill={colors.foreground} />
        </Node>}
      </Rect>)}
    </Node>)}
    <Txt ref={operation} x={460} y={345} text="" fontFamily={font} fontSize={31} fill={colors.foreground} />
    <Line ref={pointer} points={[[280, 135], [280, 185]]} stroke={colors.foreground} lineWidth={6} endArrow arrowSize={18} opacity={0} />
    <Txt ref={caption} y={395} text="" fontFamily={font} fontSize={32} fontWeight={600} fill={colors.foreground} />
  </>);
  yield* beginSlide('До изменений — сохранённое дерево');
  yield* all(workingLabel().opacity(1, 0.5), operation().text('1 · дописали в aboba.md', 0.4), caption().text('При первом изменении создаём рабочие копии блоков', 0.4));
  // The copies move out of the original tree once, then stay in place for later edits.
  nodes.forEach(node => node().position.x(node().position.x() - 920));
  for (const i of [2, 1, 0]) {
    yield* all(nodes[i]().opacity(1, 0.3), nodes[i]().position.x(i < 2 ? 0 : i === 2 ? -180 : 180, 0.55));
  }
  yield* all(links[0]().end(1, 0.5), links[1]().end(1, 0.5), sharedLeaf().end(1, 0.5), sizes[0]().text('132 КиБ', 0.4), pointer().opacity(1, 0.4));
  yield* beginSlide('Первое изменение — рабочие копии через CoW');
  yield* all(operation().text('2 · ещё дописали в aboba.md', 0.4), sizes[0]().text('136 КиБ', 0.6), nodes[2]().lineWidth(5, 0.4), caption().text('Продолжаем менять те же рабочие блоки', 0.4));
  yield* beginSlide('Второе изменение — используем ту же рабочую версию');
  yield* all(pointer().position.x(360, 0.6), nodes[2]().lineWidth(3, 0.4), nodes[3]().opacity(1, 0.3), nodes[3]().position.x(180, 0.7), sharedLeaf().end(0, 0.7), links[2]().end(1, 0.7), sizes[1]().text('132 КиБ', 0.6), operation().text('3 · дописали в copy.md', 0.4));
  yield* beginSlide('Третье изменение — общий предок остаётся тем же');
  yield* all(pointer().opacity(0, 0.4), operation().opacity(0, 0.4), nodes[3]().lineWidth(3, 0.4), transaction().opacity(1, 0.6), workingLabel().text('Текущая транзакция', 0.4), caption().text('Эти изменения фиксируем вместе', 0.4));
  yield* beginSlide('Несколько изменений объединены в транзакцию');
  yield* all(...nodes.map(node => node().stroke(colors.foreground, 0.6)), caption().text('Записываем результат, затем фиксируем новый корень', 0.4));
  yield* beginSlide('Подготовили новое согласованное состояние');
  yield* all(oldPointer().end(0, 0.8), newPointer().end(1, 0.8), field().text('root = новый Root tree', 0.8), saved().opacity(0.2, 0.8));
  yield* all(workingLabel().text('Новое сохранённое состояние', 0.4), transaction().lineDash([], 0.4), caption().text('Много изменений — одна фиксация согласованного состояния', 0.4));
  yield* beginSlide('Одна фиксация для нескольких изменений');
});
