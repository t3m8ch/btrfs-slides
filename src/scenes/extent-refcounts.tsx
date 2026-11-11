import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const original = createRef<Node>();
  const copy = createRef<Node>();
  const firstLink = createRef<Line>();
  const secondLink = createRef<Line>();
  const count = createRef<Txt>();
  const record = createRef<Node>();
  const block = createRef<Rect>();
  const blockText = createRef<Txt>();
  const caption = createRef<Txt>();
  const recordLink = createRef<Line>();
  view.add(<>
    <Frame title="Когда можно освободить экстент" number="23" />
    <Node ref={original}>
      <Rect x={-500} y={-220} width={650} height={150} radius={14} stroke={colors.muted} lineWidth={3} />
      <Txt x={-500} y={-255} text="aboba.md · 301" fontFamily={font} fontSize={35} fontWeight={600} fill={colors.foreground} />
      <Txt x={-500} y={-190} text="(301, EXTENT_DATA, 0)" fontFamily="Menlo" fontSize={28} fill={colors.foreground} />
    </Node>
    <Node ref={copy} opacity={0}>
      <Rect x={-500} y={20} width={650} height={150} radius={14} stroke={colors.muted} lineWidth={3} />
      <Txt x={-500} y={-15} text="copy.md · 303" fontFamily={font} fontSize={35} fontWeight={600} fill={colors.foreground} />
      <Txt x={-500} y={50} text="(303, EXTENT_DATA, 0)" fontFamily="Menlo" fontSize={28} fill={colors.foreground} />
    </Node>
    <Line ref={firstLink} points={[[-600, -145], [-600, -95], [-850, -95], [-850, 180], [-650, 180], [-650, 225]]} radius={12} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} />
    <Line ref={secondLink} points={[[-400, 95], [-400, 225]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} end={0} />
    <Rect ref={block} x={-500} y={290} width={650} height={120} radius={9} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
      <Txt ref={blockText} text="Данные · 128 КиБ" fontFamily={font} fontSize={35} fill={colors.foreground} />
    </Rect>
    <Txt x={-500} y={390} text="256 МиБ" fontFamily="Menlo" fontSize={29} fill={colors.muted} />
    <Line ref={recordLink} points={[[-170, 290], [0, 290], [0, 50], [35, 50]]} radius={12} stroke={colors.accent} lineWidth={3} lineDash={[10, 8]} endArrow arrowSize={12} />
    <Node ref={record}>
      <Txt x={430} y={-220} text="Extent tree" fontFamily={font} fontSize={37} fontWeight={600} fill={colors.foreground} />
      <Rect x={430} y={20} width={780} height={350} radius={14} stroke={colors.muted} lineWidth={3} />
      <Txt x={430} y={-85} text="(268435456, EXTENT_ITEM, 131072)" fontFamily="Menlo" fontSize={27} fill={colors.foreground} />
      <Line points={[[80, -30], [780, -30]]} stroke={colors.accent} lineWidth={2} />
      <Txt ref={count} x={430} y={60} text="refs = 1" fontFamily="Menlo" fontSize={64} fill={colors.foreground} />
    </Node>
    <Txt ref={caption} y={-335} text="" fontFamily={font} fontSize={34} fontWeight={600} fill={colors.foreground} />
  </>);
  yield* beginSlide('Одна ссылка на экстент');
  yield* all(copy().opacity(1, 0.5), secondLink().end(1, 0.7), count().text('refs = 2', 0.4), caption().text('Создаём reflink-копию', 0.4));
  yield* beginSlide('Reflink добавляет ссылку');
  yield* all(original().opacity(0, 0.6), firstLink().end(0, 0.6), count().text('refs = 1', 0.4), caption().text('Удаляем aboba.md — copy.md продолжает читать данные', 0.4));
  yield* beginSlide('Одна ссылка ещё остаётся');
  yield* all(copy().opacity(0, 0.6), secondLink().end(0, 0.6), count().text('refs = 0', 0.4), caption().text('refs = 0 — экстент можно освободить', 0.4), blockText().text('К освобождению', 0.4), block().lineDash([12, 9], 0.4));
  yield* beginSlide('Последняя ссылка удалена — экстент можно освободить');
});
