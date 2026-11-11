import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeOutCubic} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const stages = Array.from({length: 4}, () => createRef<Node>());
  const arrows = Array.from({length: 3}, () => createRef<Line>());
  const calls = createRef<Node>();
  const conclusion = createRef<Node>();
  const xs = [-660, -220, 220, 660];
  const labels = ['Приложение', 'VFS', 'Btrfs', 'Устройство'];
  const notes = ['Работает с файлами', 'Общие операции\nдля разных ФС', 'Определяет, как\nхранить файлы', 'Читает и записывает\nсекторы'];

  view.add(<>
    <Frame title="Как Linux видит файловую систему" number="04" />
    <Node ref={calls} opacity={0}>
      <Txt x={-850} y={-285} offsetX={-1} text="Приложение вызывает" fontFamily={font} fontSize={32} fill={colors.muted} />
      {['open', 'read', 'write', 'stat'].map((text, i) => <Rect x={-315 + i * 270} y={-285} width={220} height={70} radius={5} stroke={colors.accent} lineWidth={2}>
        <Txt text={text} fontFamily="Menlo" fontSize={30} fill={colors.muted} />
      </Rect>)}
    </Node>
    {arrows.map((ref, i) => <Line ref={ref} end={0} points={[[xs[i] + 175, -40], [xs[i + 1] - 175, -40]]} stroke={colors.muted} lineWidth={4} endArrow arrowSize={14} />)}
    {stages.map((ref, i) => <Node ref={ref} x={xs[i]} opacity={i === 0 ? 1 : 0}>
      <Rect y={-40} width={350} height={180} radius={8} fill={i === 2 ? colors.highlight : colors.background} stroke={i === 2 ? colors.highlight : colors.muted} lineWidth={3}>
        <Txt text={labels[i]} fontFamily={font} fontSize={i === 0 ? 38 : 46} fontWeight={600} fill={i === 2 ? colors.background : colors.foreground} />
      </Rect>
      <Txt y={130} text={notes[i]} textAlign="center" fontFamily={font} fontSize={28} lineHeight={40} fill={colors.muted} />
    </Node>)}
    <Node ref={conclusion} opacity={0}>
      <Rect x={-830} y={350} width={10} height={44} fill={colors.highlight} />
      <Txt x={-800} y={350} offsetX={-1} text="VFS задаёт интерфейс. Btrfs реализует хранение." fontFamily={font} fontSize={40} fontWeight={500} fill={colors.foreground} />
    </Node>
  </>);

  yield* beginSlide('Приложение и файлы');
  yield* calls().opacity(1, 0.4);
  for (let i = 0; i < 3; i++) {
    yield* arrows[i]().end(1, 0.35, easeOutCubic);
    yield* all(stages[i + 1]().opacity(1, 0.4), stages[i + 1]().y(0, 0.4));
    if (i === 0) yield* beginSlide('Общий слой VFS');
  }
  yield* conclusion().opacity(1, 0.45);
  yield* beginSlide('VFS и Btrfs');
});
