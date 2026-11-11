import {Line, Node, Rect, Txt, View2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font} from '../theme';

export function* snapshotDeletion(view: View2D) {
  const diagram = createRef<Node>();
  const snapshot = createRef<Rect>();
  const sharedLink = createRef<Line>();
  const uniqueLink = createRef<Line>();
  const shared = createRef<Rect>();
  const sharedCount = createRef<Txt>();
  const descendants = createRef<Node>();
  const skipped = createRef<Node>();
  const unique = Array.from({length: 4}, () => createRef<Rect>());
  const counts = Array.from({length: 4}, () => createRef<Txt>());
  const edges = [createRef<Line>(), createRef<Line>(), createRef<Line>()];
  const caption = createRef<Txt>();
  view.add(<Node ref={diagram} opacity={0}>
    <Txt ref={caption} y={-335} text="Удаляем снимок" fontFamily={font} fontSize={36} fontWeight={600} fill={colors.foreground} />
    <Rect x={-500} y={-235} width={370} height={85} radius={12} stroke={colors.muted} lineWidth={3}>
      <Txt text="Подтом" fontFamily={font} fontSize={35} fill={colors.foreground} />
    </Rect>
    <Rect ref={snapshot} x={500} y={-235} width={370} height={85} radius={12} stroke={colors.muted} lineWidth={3}>
      <Txt text="Снимок" fontFamily={font} fontSize={35} fill={colors.foreground} />
    </Rect>
    <Line points={[[-500, -192], [-380, -115]]} stroke={colors.muted} lineWidth={3} />
    <Line ref={sharedLink} points={[[430, -192], [-380, -115]]} stroke={colors.foreground} lineWidth={4} />
    <Line ref={uniqueLink} points={[[550, -192], [650, -105]]} stroke={colors.foreground} lineWidth={4} />
    <Rect ref={shared} x={-380} y={-70} width={300} height={90} radius={9} stroke={colors.muted} lineWidth={3}>
      <Txt y={-20} text="Общий узел" fontFamily={font} fontSize={31} fill={colors.foreground} />
      <Txt ref={sharedCount} y={23} text="refs = 2" fontFamily="Menlo" fontSize={28} fill={colors.foreground} />
    </Rect>
    <Node ref={descendants}>
      {[-650, -140].map(x => <Node>
        <Line points={[[-380, -25], [x, 75]]} stroke={colors.muted} lineWidth={3} />
        <Rect x={x} y={110} width={240} height={70} radius={8} stroke={colors.muted} lineWidth={3}>
          <Txt text={'Узел\nrefs = 1'} fontFamily={font} fontSize={25} lineHeight={30} fill={colors.foreground} />
        </Rect>
      </Node>)}
      {[-760, -510, -250, 0].map((x, i) => <Node>
        <Line points={[[i < 2 ? -650 : -140, 145], [x, 195]]} stroke={colors.muted} lineWidth={3} />
        <Rect x={x} y={230} width={175} height={70} radius={7} stroke={colors.muted} lineWidth={2}>
          <Txt text={'Лист\nrefs = 1'} fontFamily={font} fontSize={25} lineHeight={30} fill={colors.foreground} />
        </Rect>
        <Line points={[[x, 265], [x, 295]]} stroke={colors.muted} lineWidth={3} />
        <Rect x={x} y={330} width={175} height={70} radius={7} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={2}>
          <Txt text={'Данные\nrefs = 1'} fontFamily={font} fontSize={25} lineHeight={30} fill={colors.foreground} />
        </Rect>
      </Node>)}
    </Node>
    <Node ref={skipped} opacity={0}>
      <Rect x={-380} y={220} width={1000} height={325} radius={20} stroke={colors.foreground} lineWidth={3} lineDash={[14, 10]} />
      <Line points={[[-490, 12], [-270, 12]]} stroke={colors.foreground} lineWidth={7} />
      <Txt x={-380} y={405} text="Не обходим" fontFamily={font} fontSize={32} fontWeight={600} fill={colors.foreground} />
    </Node>
    <Line ref={edges[0]} points={[[650, -15], [650, 35]]} stroke={colors.foreground} lineWidth={4} />
    <Line ref={edges[1]} points={[[650, 115], [650, 170]]} stroke={colors.foreground} lineWidth={4} />
    <Line ref={edges[2]} points={[[650, 250], [650, 300]]} stroke={colors.foreground} lineWidth={4} />
    {[-60, 75, 210, 335].map((y, i) => <Rect ref={unique[i]} x={650} y={y} width={280} height={i === 0 ? 90 : i === 3 ? 70 : 80} radius={9} fill={i === 3 ? '#E1E7CE' : colors.background} stroke={colors.foreground} lineWidth={3}>
      <Txt y={-20} text={['Уникальный узел', 'Узел', 'Уникальный лист', 'Данные'][i]} fontFamily={font} fontSize={28} fill={colors.foreground} />
      <Txt ref={counts[i]} y={23} text="refs = 1" fontFamily="Menlo" fontSize={28} fill={colors.foreground} />
    </Rect>)}
  </Node>);
  yield* diagram().opacity(1, 0.6);
  yield* beginSlide('Удаление снимка — большая общая ветвь');
  yield* all(snapshot().opacity(0, 0.6), sharedLink().end(0, 0.6), uniqueLink().end(0, 0.6), sharedCount().text('refs = 1', 0.4), shared().lineWidth(5, 0.4), skipped().opacity(1, 0.6), descendants().opacity(0.55, 0.6), caption().text('Общий узел: refs 2 → 1. Всё поддерево пропускаем', 0.4));
  yield* beginSlide('Остановились на верхнем общем узле');
  yield* all(counts[0]().text('refs = 0', 0.4), caption().text('Уникальная ветвь: спускаемся и снимаем ссылки', 0.4));
  yield* beginSlide('Уникальный узел больше не нужен');
  yield* all(unique[0]().opacity(0, 0.5), edges[0]().end(0, 0.5), counts[1]().text('refs = 0', 0.4));
  yield* beginSlide('Следующий уникальный узел больше не нужен');
  yield* all(unique[1]().opacity(0, 0.5), edges[1]().end(0, 0.5), counts[2]().text('refs = 0', 0.4));
  yield* beginSlide('Уникальный лист больше не нужен');
  yield* all(unique[2]().opacity(0, 0.5), edges[2]().end(0, 0.5), counts[3]().text('refs = 0', 0.4));
  yield* beginSlide('Данные уникальной ветви больше не нужны');
  yield* all(unique[3]().opacity(0, 0.5), caption().text('В общем поддереве счётчики потомков не трогали', 0.4));
  yield* beginSlide('Удаление завершено — общее поддерево осталось');
}
