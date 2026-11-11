import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeOutCubic, sequence} from '@motion-canvas/core';
import {colors} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const blocks = Array.from({length: 6}, () => createRef<Rect>());
  const branches = Array.from({length: 5}, () => createRef<Line>());

  // All coordinates use the project's 1920 × 1080 presentation frame.
  view.add(
    <>
      <Txt x={-850} y={-235} offsetX={-1} text="Как устроен" fontFamily="Helvetica Neue" fontWeight={500} fontSize={108} letterSpacing={-4} fill={colors.foreground} />
      <Txt x={-850} y={-65} offsetX={-1} text="BTRFS" fontFamily="Helvetica Neue" fontWeight={700} fontSize={176} letterSpacing={-7} fill={colors.muted} />
      <Rect x={-800} y={95} width={100} height={10} fill={colors.highlight} />

      {/* A quiet tree motif introduces the visual language of later diagrams. */}
      <Line ref={branches[0]} end={0} points={[[550, -200], [550, -95], [365, -95], [365, 15]]} stroke={colors.border} lineWidth={3} />
      <Line ref={branches[1]} end={0} points={[[550, -200], [550, -95], [735, -95], [735, 15]]} stroke={colors.border} lineWidth={3} />
      <Line ref={branches[2]} end={0} points={[[365, 80], [365, 180], [270, 180], [270, 255]]} stroke={colors.border} lineWidth={3} />
      <Line ref={branches[3]} end={0} points={[[365, 80], [365, 180], [460, 180], [460, 255]]} stroke={colors.border} lineWidth={3} />
      <Line ref={branches[4]} end={0} points={[[735, 80], [735, 255]]} stroke={colors.border} lineWidth={3} />
      {[[550, -240], [365, 45], [735, 45], [270, 285], [460, 285], [735, 285]].map(([x, y], index) => (
        <Rect ref={blocks[index]} opacity={0} scale={0.85} x={x} y={y} width={index === 0 ? 230 : 150} height={index === 0 ? 85 : 64} radius={7} fill={index === 0 ? colors.highlight : colors.accent} stroke={index === 0 ? colors.highlight : colors.border} lineWidth={2}>
          {[-35, 0, 35].map(mark => <Rect x={mark} width={18} height={index === 0 ? 30 : 23} radius={2} fill={colors.background} />)}
        </Rect>
      ))}

      <Line points={[[-850, 340], [850, 340]]} stroke={colors.border} lineWidth={2} />
      <Txt x={-850} y={410} offsetX={-1} text="Артём Кудяков" fontFamily="Helvetica Neue" fontWeight={500} fontSize={40} fill={colors.foreground} />
      <Txt x={-850} y={467} offsetX={-1} text="4 курс ПИ · сотрудник Arenadata" fontFamily="Helvetica Neue" fontSize={28} fill={colors.muted} />
      <Txt x={850} y={462} offsetX={1} text="01" fontFamily="Menlo" fontSize={24} fill={colors.muted} />
    </>,
  );

  function* revealBlock(index: number) {
    yield* all(
      blocks[index]().opacity(1, 0.35, easeOutCubic),
      blocks[index]().scale(1, 0.45, easeOutCubic),
    );
  }

  function* revealChild(branch: number, block: number) {
    yield* branches[branch]().end(1, 0.45, easeOutCubic);
    yield* revealBlock(block);
  }

  yield* revealBlock(0);
  yield* sequence(0.15, revealChild(0, 1), revealChild(1, 2));
  yield* sequence(0.12, revealChild(2, 3), revealChild(3, 4), revealChild(4, 5));
  yield* beginSlide('Приветствие');
});
