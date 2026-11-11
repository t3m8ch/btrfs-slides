import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeOutCubic} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const copy = createRef<Rect>();
  const copyChange = createRef<Rect>();
  const snapshot = createRef<Node>();
  const newFile = createRef<Txt>();
  const question = createRef<Txt>();
  const arrow = createRef<Line>();

  view.add(<>
    <Frame title="Что ещё мы хотим получить" number="03" />
    <Line points={[[0, -310], [0, 285]]} stroke={colors.accent} opacity={0.35} lineWidth={2} />
    <Txt x={-450} y={-285} text="Независимая копия файла" fontFamily={font} fontSize={40} fontWeight={500} fill={colors.muted} />
    <Txt x={450} y={-285} text="Снимок дерева файлов" fontFamily={font} fontSize={40} fontWeight={500} fill={colors.muted} />

    {[-660, -240].map((x, i) => <Rect ref={i === 1 ? copy : undefined} x={i === 1 ? -420 : x} y={-30} opacity={i === 1 ? 0 : 1} width={280} height={260} radius={8} stroke={colors.muted} lineWidth={3} fill={colors.background}>
      <Txt y={-85} text={i === 0 ? 'aboba.md' : 'copy.md'} fontFamily="Menlo" fontSize={25} fill={colors.foreground} />
      {[-20, 30, 80].map((y, row) => <Rect ref={i === 1 && row === 1 ? copyChange : undefined} y={y} width={210} height={30} radius={3} fill={colors.accent} />)}
    </Rect>)}
    <Line ref={arrow} end={0} points={[[-505, -30], [-395, -30]]} stroke={colors.muted} lineWidth={4} endArrow arrowSize={14} />
    <Txt x={-450} y={175} text={'Изменяем копию.\nИсходный файл остаётся прежним.'} textAlign="center" fontFamily={font} fontSize={29} lineHeight={41} fill={colors.foreground} />

    {[230, 660].map((x, i) => <Node ref={i === 1 ? snapshot : undefined} x={x} y={-30} opacity={i === 1 ? 0 : 1}>
      <Rect width={340} height={260} radius={8} stroke={i === 1 ? colors.highlight : colors.muted} lineWidth={3} fill={colors.background} />
      <Rect x={-105} y={-142} width={100} height={24} radius={4} fill={i === 1 ? colors.highlight : colors.muted} />
      <Txt y={-85} text={i === 0 ? 'Каталог' : 'Снимок'} fontFamily={font} fontSize={29} fontWeight={500} fill={colors.foreground} />
      <Txt x={-128} y={-22} offsetX={-1} text="aboba.md" fontFamily="Menlo" fontSize={24} fill={colors.muted} />
      <Txt x={-128} y={28} offsetX={-1} text="todo.txt" fontFamily="Menlo" fontSize={24} fill={colors.muted} />
      {i === 0 && <Txt ref={newFile} x={-128} y={78} offsetX={-1} opacity={0} text="new.md" fontFamily="Menlo" fontSize={24} fill={colors.highlight} />}
    </Node>)}
    <Txt x={450} y={175} text={'Меняем исходное дерево.\nСнимок сохраняет прежнее состояние.'} textAlign="center" fontFamily={font} fontSize={29} lineHeight={41} fill={colors.foreground} />
    <Txt ref={question} opacity={0} y={350} text="Нужно ли ради этого копировать все байты?" fontFamily={font} fontSize={44} fontWeight={500} fill={colors.foreground} />
  </>);

  yield* beginSlide('Независимая копия');
  yield* arrow().end(1, 0.3);
  yield* all(copy().opacity(1, 0.45), copy().x(-240, 0.6, easeOutCubic));
  yield* copyChange().fill(colors.highlight, 0.4);
  yield* beginSlide('Снимок дерева файлов');
  yield* snapshot().opacity(1, 0.5);
  yield* newFile().opacity(1, 0.4);
  yield* question().opacity(1, 0.5);
  yield* beginSlide('Дешёвые копии и снимки');
});
