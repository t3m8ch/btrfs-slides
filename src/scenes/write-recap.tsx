import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const cards = Array.from({length: 6}, () => createRef<Rect>());
  const contents = Array.from({length: 6}, () => createRef<Node>());
  const arrows = Array.from({length: 5}, () => createRef<Line>());
  const caption = createRef<Txt>();
  const oldRoot = createRef<Line>();
  const newRoot = createRef<Line>();
  const positions: [number, number][] = [[-565, -100], [0, -100], [565, -100], [565, 190], [0, 190], [-565, 190]];
  const titles = ['1 · Поиск', '2 · Место', '3 · Copy-on-Write', '4 · Ссылки', '5 · Контрольные суммы', '6 · Фиксация'];
  view.add(<>
    <Frame title="Меняем 4 КиБ: весь путь" number="30" />
    <Txt y={-330} text="aboba.md · 128 КиБ · меняем [64, 68) КиБ" fontFamily={font} fontSize={35} fill={colors.foreground} />
    {[
      [[-310, -100], [-255, -100]], [[255, -100], [310, -100]],
      [[565, 20], [565, 70]], [[310, 190], [255, 190]], [[-255, 190], [-310, 190]],
    ].map((points, i) => <Line ref={arrows[i]} points={points as [number, number][]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} end={0} />)}
    {positions.map(([x, y], i) => <Rect ref={cards[i]} x={x} y={y} width={510} height={240} radius={14} stroke={colors.muted} lineWidth={3} opacity={0}>
      <Txt y={-80} text={titles[i]} fontFamily={font} fontSize={32} fontWeight={600} fill={colors.foreground} />
    </Rect>)}
    <Node ref={contents[0]} x={-565} y={-100} opacity={0}>
      <Line points={[[0, -18], [-120, 30]]} stroke={colors.muted} lineWidth={3} />
      <Line points={[[0, -18], [120, 30]]} stroke={colors.foreground} lineWidth={4} endArrow />
      <Rect y={-35} width={180} height={40} radius={5} stroke={colors.muted} lineWidth={2}>
        <Txt text="FS tree" fontFamily={font} fontSize={25} fill={colors.foreground} />
      </Rect>
      <Rect x={-120} y={58} width={170} height={55} radius={6} stroke={colors.muted} lineWidth={2}><Txt text="…" fontSize={30} fill={colors.muted} /></Rect>
      <Rect x={120} y={58} width={230} height={55} radius={6} stroke={colors.foreground} lineWidth={3}><Txt text="EXTENT_DATA" fontFamily="Menlo" fontSize={24} fill={colors.foreground} /></Rect>
    </Node>
    <Node ref={contents[1]} y={-100} opacity={0}>
      {[-20, 62].map((y, i) => <Node>
        <Txt x={-220} y={y} offsetX={-1} text={i === 0 ? 'DATA' : 'META'} fontFamily="Menlo" fontSize={26} fill={colors.foreground} />
        <Rect x={70} y={y} width={270} height={52} radius={5} stroke={colors.muted} lineWidth={2} />
        <Rect x={-5} y={y} width={120} height={52} fill={'#E1E7CE'} />
        <Rect x={90} y={y} width={70} height={52} fill={i === 0 ? '#FFE0D3' : '#E1E7CE'} stroke={i === 0 ? colors.highlight : colors.foreground} lineWidth={3} />
      </Node>)}
    </Node>
    <Node ref={contents[2]} x={565} y={-100} opacity={0}>
      <Txt y={-25} text="EXTENT_DATA" fontFamily="Menlo" fontSize={25} fill={colors.foreground} />
      {[-150, 0, 150].map((x, i) => <Rect x={x} y={50} width={140} height={65} radius={6} fill={i === 1 ? '#FFE0D3' : '#E1E7CE'} stroke={i === 1 ? colors.highlight : colors.muted} lineWidth={3}>
        <Txt text={['0–64', '64–68', '68–128'][i]} fontFamily="Menlo" fontSize={25} fill={colors.foreground} />
      </Rect>)}
    </Node>
    <Node ref={contents[3]} x={565} y={190} opacity={0}>
      <Rect x={-130} y={20} width={170} height={70} radius={6} stroke={colors.muted} lineWidth={3}><Txt text="FS tree" fontFamily={font} fontSize={28} fill={colors.foreground} /></Rect>
      <Rect x={130} y={20} width={170} height={70} radius={6} stroke={colors.muted} lineWidth={3}><Txt text="Экстенты" fontFamily={font} fontSize={28} fill={colors.foreground} /></Rect>
      <Line points={[[-45, 5], [45, 5]]} stroke={colors.foreground} lineWidth={3} endArrow />
      <Line points={[[45, 35], [-45, 35]]} stroke={colors.muted} lineWidth={3} lineDash={[7, 5]} endArrow />
      <Txt y={85} text="refs · backrefs" fontFamily="Menlo" fontSize={25} fill={colors.muted} />
    </Node>
    <Node ref={contents[4]} y={190} opacity={0}>
      <Rect x={-140} y={10} width={145} height={70} radius={6} fill={'#FFE0D3'} stroke={colors.highlight} lineWidth={3}><Txt text="4 КиБ" fontFamily={font} fontSize={29} fill={colors.foreground} /></Rect>
      <Line points={[[-60, 10], [0, 10]]} stroke={colors.foreground} lineWidth={3} endArrow />
      <Rect x={110} y={10} width={210} height={70} radius={6} stroke={colors.muted} lineWidth={3}><Txt text="Checksum tree" fontFamily={font} fontSize={25} fill={colors.foreground} /></Rect>
      <Txt y={85} text="csum блоков деревьев" fontFamily={font} fontSize={27} fill={colors.muted} />
    </Node>
    <Node ref={contents[5]} x={-565} y={190} opacity={0}>
      <Rect y={-20} width={240} height={55} radius={6} stroke={colors.foreground} lineWidth={3}><Txt text="Суперблок" fontFamily={font} fontSize={28} fill={colors.foreground} /></Rect>
      <Line ref={oldRoot} points={[[-60, 8], [-130, 50]]} stroke={colors.muted} lineWidth={3} endArrow />
      <Line ref={newRoot} points={[[60, 8], [130, 50]]} stroke={colors.foreground} lineWidth={4} endArrow end={0} />
      {[-130, 130].map((x, i) => <Rect x={x} y={78} width={190} height={52} radius={6} stroke={colors.muted} lineWidth={2} fill={i ? '#E1E7CE' : colors.background}><Txt text={i ? 'Новый корень' : 'Старый корень'} fontFamily={font} fontSize={24} fill={colors.foreground} /></Rect>)}
    </Node>
    <Txt ref={caption} y={390} text="" fontFamily={font} fontSize={32} fontWeight={600} fill={colors.foreground} />
  </>);
  const notes = [
    'Находим файл и запись EXTENT_DATA для нужного смещения',
    'Выделяем место для новых данных и блоков деревьев',
    'Пишем новые 4 КиБ отдельно, обновляем записи и путь к корню',
    'Обновляем учёт экстентов и обратные ссылки',
    'Считаем суммы новых данных и изменённых блоков деревьев',
    'Сохраняем данные и деревья, затем фиксируем новый корень',
  ];
  for (let i = 0; i < cards.length; i++) {
    if (i > 0) yield* all(arrows[i - 1]().end(1, 0.5), cards[i - 1]().lineWidth(3, 0.3));
    yield* all(cards[i]().opacity(1, 0.5), contents[i]().opacity(1, 0.5), cards[i]().lineWidth(5, 0.5), caption().text(notes[i], 0.4));
    if (i === 5) yield* all(oldRoot().end(0, 0.6), newRoot().end(1, 0.6));
    yield* beginSlide(titles[i]);
  }
  yield* all(cards[5]().lineWidth(3, 0.4), caption().text('Изменили 4 КиБ — сохранили новое согласованное состояние', 0.4));
  yield* beginSlide('Все механизмы работают вместе');
});
