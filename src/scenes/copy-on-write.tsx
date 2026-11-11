import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const file = createRef<Node>();
  const patch = createRef<Node>();
  const extentRecords = createRef<Node>();
  const oldTree = createRef<Node>();
  const newNodes = Array.from({length: 3}, () => createRef<Rect>());
  const newEdges = Array.from({length: 5}, () => createRef<Line>());
  const oldPath = Array.from({length: 3}, () => createRef<Rect>());
  const copiedDataEdges = createRef<Node>();
  const note = createRef<Txt>();
  view.add(<>
    <Frame title="Меняем 4 КиБ: Copy-on-Write" number="20" />
    <Node ref={file}>
      <Txt x={-850} y={-330} offsetX={-1} text="aboba.md · 128 КиБ" fontFamily={font} fontSize={35} fill={colors.foreground} />
      <Rect y={-230} width={1500} height={72} radius={5} stroke={colors.muted} lineWidth={3} />
      <Rect x={23.5} y={-230} width={47} height={72} fill={'#FFE0D3'} stroke={colors.highlight} lineWidth={4} />
      <Txt y={-140} text="[64, 68) КиБ" fontFamily="Menlo" fontSize={34} fill={colors.foreground} />
    </Node>
    <Rect x={-300} y={315} width={1000} height={75} radius={6} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3} />
    <Txt x={-300} y={385} text="Прежние данные · 128 КиБ" fontFamily={font} fontSize={29} fill={colors.foreground} />
    <Node ref={patch} opacity={0}>
      <Rect x={700} y={315} width={180} height={75} radius={6} fill={'#FFE0D3'} stroke={colors.highlight} lineWidth={4} />
      <Txt x={700} y={385} text="Новые 4 КиБ" fontFamily={font} fontSize={29} fill={colors.foreground} />
    </Node>
    <Node ref={extentRecords} opacity={0}>
      {[-550, 0, 550].map((x, i) => <Rect x={x} y={32} width={500} height={180} radius={10} stroke={i === 1 ? colors.highlight : colors.muted} lineWidth={3}>
        <Txt y={-50} text={`(301, EXTENT_DATA, ${[0, 65536, 69632][i]})`} fontFamily="Menlo" fontSize={28} fill={colors.foreground} />
        <Txt y={0} text={['0–64 КиБ', '64–68 КиБ', '68–128 КиБ'][i]} fontFamily="Menlo" fontSize={31} fill={colors.foreground} />
        <Txt y={50} text={i === 1 ? 'новые данные' : 'прежние данные'} fontFamily={font} fontSize={30} fill={colors.foreground} />
      </Rect>)}
      <Line points={[[-550, 123], [-550, 275]]} stroke={colors.muted} lineWidth={3} endArrow />
      <Line points={[[0, 123], [0, 210], [700, 210], [700, 275]]} radius={10} stroke={colors.highlight} lineWidth={4} endArrow />
      <Line points={[[550, 123], [550, 170], [0, 170], [0, 275]]} radius={10} stroke={colors.muted} lineWidth={3} endArrow />
    </Node>
    <Node ref={oldTree} opacity={0}>
      <Line points={[[-520, -195], [-650, -100]]} stroke={colors.muted} lineWidth={3} />
      <Line points={[[-520, -195], [0, -100]]} stroke={colors.muted} lineWidth={3} />
      <Line points={[[-650, -20], [-650, 70]]} stroke={colors.muted} lineWidth={3} />
      <Line points={[[-650, -20], [-250, 70]]} stroke={colors.muted} lineWidth={3} />
      <Line points={[[0, -20], [0, 70]]} stroke={colors.muted} lineWidth={3} />
      <Line points={[[-650, 150], [-650, 275]]} stroke={colors.muted} lineWidth={3} endArrow />
      {[[0, -60], [-250, 110], [0, 110]].map(([x, y]) => <Rect x={x} y={y} width={180} height={80} radius={8} stroke={colors.muted} lineWidth={3}>
        <Txt text="…" fontFamily={font} fontSize={35} fill={colors.foreground} />
      </Rect>)}
      {[[-520, -235], [-650, -60], [-650, 110]].map(([x, y], i) => <Rect ref={oldPath[i]} x={x} y={y} width={220} height={80} radius={8} stroke={colors.muted} lineWidth={3}>
        <Txt text={['Корень', 'Узел', 'Лист'][i]} fontFamily={font} fontSize={32} fill={colors.foreground} />
      </Rect>)}
      {[
        [[520, -195], [520, -100]], [[520, -195], [0, -100]],
        [[520, -20], [520, 70]], [[520, -20], [-250, 70]],
        [[520, 150], [700, 275]],
      ].map((points, i) => <Line ref={newEdges[i]} points={points as [number, number][]} stroke={colors.foreground} lineWidth={4} end={0} />)}
      {[-235, -60, 110].map((y, i) => <Rect ref={newNodes[i]} x={i === 0 ? -520 : -650} y={y} width={220} height={80} radius={8} fill={'#E1E7CE'} stroke={colors.foreground} lineWidth={4} opacity={0}>
        <Txt text={['Корень′', 'Узел′', 'Лист′'][i]} fontFamily={font} fontSize={32} fill={colors.foreground} />
      </Rect>)}
      <Node ref={copiedDataEdges} opacity={0}>
        <Line points={[[470, 150], [-580, 275]]} stroke={colors.foreground} lineWidth={3} endArrow />
        <Line points={[[500, 150], [30, 275]]} stroke={colors.foreground} lineWidth={3} endArrow />
      </Node>
    </Node>
    <Txt ref={note} y={-335} text="" fontFamily={font} fontSize={34} fontWeight={600} fill={colors.foreground} />
  </>);
  yield* beginSlide('Меняем диапазон 64–68 КиБ');
  yield* patch().opacity(1, 0.6);
  yield* beginSlide('Записываем новые 4 КиБ отдельно');
  yield* extentRecords().opacity(1, 0.6);
  yield* beginSlide('Три описания экстентов вместо одного');
  yield* all(file().opacity(0, 0.5), extentRecords().opacity(0, 0.5), oldTree().opacity(1, 0.6), note().text('Копируем путь от листа до корня', 0.4));
  yield* beginSlide('Теперь обновим метаданные');
  yield* all(newNodes[2]().opacity(1, 0.3), newNodes[2]().position.x(520, 1), copiedDataEdges().opacity(1, 1), newEdges[4]().end(1, 1));
  yield* beginSlide('Копия листа с новыми EXTENT_DATA');
  yield* all(newNodes[1]().opacity(1, 0.3), newNodes[1]().position.x(520, 1), newEdges[2]().end(1, 1), newEdges[3]().end(1, 1));
  yield* beginSlide('Копия внутреннего узла');
  yield* all(newNodes[0]().opacity(1, 0.3), newNodes[0]().position.x(520, 1), newEdges[0]().end(1, 1), newEdges[1]().end(1, 1));
  yield* beginSlide('Новый корень');
});
