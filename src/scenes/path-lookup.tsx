import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const query = createRef<Txt>();
  const result = createRef<Txt>();
  const cursor = createRef<Line>();
  const paths = Array.from({length: 6}, () => createRef<Line>());
  const records = Array.from({length: 3}, () => createRef<Rect>());
  const steps = Array.from({length: 4}, () => createRef<Rect>());
  const leafX = [-650, -220, 220, 650];
  const pathNames = ['/', 'home', 'artem', 'aboba.md'];
  // One subvolume, no mount points or subvolume boundaries in this example.
  // Keep artem=300 and aboba.md=301 consistent with slide 14.
  const ids = [256, 270, 300, 301];
  const names = ['home', 'artem', 'aboba.md'];
  view.add(<>
    <Frame title="Ищем /home/artem/aboba.md" number="18" />
    {pathNames.map((name, i) => <Node>
      {i > 0 && <Line points={[[-650 + (i - 1) * 420 + 150, -320], [-650 + i * 420 - 150, -320]]} stroke={colors.accent} lineWidth={3} endArrow />}
      <Rect ref={steps[i]} x={-650 + i * 420} y={-320} width={300} height={72} radius={10} stroke={colors.muted} lineWidth={i === 0 ? 5 : 2}>
        <Txt text={name} fontFamily={font} fontSize={34} fill={colors.foreground} />
      </Rect>
    </Node>)}
    <Txt ref={query} y={-223} text={'(256, DIR_ITEM, h("home"))'} fontFamily="Menlo" fontSize={34} fill={colors.foreground} />
    <Rect y={-120} width={950} height={80} radius={8} stroke={colors.muted} lineWidth={3}>
      <Txt x={-230} text="≥ (256, INODE_ITEM, 0)" fontFamily="Menlo" fontSize={27} fill={colors.foreground} />
      <Txt x={230} text="≥ (300, INODE_ITEM, 0)" fontFamily="Menlo" fontSize={27} fill={colors.foreground} />
    </Rect>
    {[-440, 440].map((x, i) => <Node>
      <Line ref={paths[i]} points={[[i === 0 ? -230 : 230, -80], [x, -10]]} stroke={colors.accent} lineWidth={3} />
      <Rect x={x} y={30} width={810} height={80} radius={8} stroke={colors.muted} lineWidth={3}>
        <Txt x={-200} text={`≥ (${i === 0 ? 256 : 300}, INODE_ITEM, 0)`} fontFamily="Menlo" fontSize={25} fill={colors.foreground} />
        <Txt x={200} text={`≥ (${i === 0 ? 270 : 320}, INODE_ITEM, 0)`} fontFamily="Menlo" fontSize={25} fill={colors.foreground} />
      </Rect>
    </Node>)}
    {leafX.map((x, i) => <Node>
      <Line ref={paths[i + 2]} points={[[i < 2 ? -640 + i * 400 : 240 + (i - 2) * 400, 70], [x, 145]]} stroke={colors.accent} lineWidth={3} />
      <Rect x={x} y={220} width={400} height={150} radius={9} stroke={colors.muted} lineWidth={3}>
        <Txt y={-43} text={i === 3 ? '(320, INODE_ITEM, 0)' : `(${ids[i]}, DIR_ITEM, h)`} fontFamily="Menlo" fontSize={24} fill={colors.foreground} />
        {i < 3 ? <Rect ref={records[i]} y={22} width={370} height={66} radius={5} stroke={colors.accent} lineWidth={2}>
          <Txt text={`${names[i]} → ${ids[i + 1]}`} fontFamily={font} fontSize={29} fill={colors.foreground} />
        </Rect> : <Txt y={22} text="…" fontFamily={font} fontSize={35} fill={colors.muted} />}
      </Rect>
    </Node>)}
    <Line ref={cursor} points={[[0, -44], [0, 0]]} x={-230} y={-166} stroke={colors.foreground} lineWidth={5} endArrow arrowSize={14} opacity={0} />
    <Txt ref={result} y={365} text="" fontFamily={font} fontSize={36} fontWeight={600} fill={colors.foreground} />
  </>);
  yield* beginSlide('Путь и одно FS tree');
  for (let i = 0; i < 3; i++) {
    if (i > 0) {
      yield* all(...paths.map(p => all(p().stroke(colors.accent, 0.2), p().lineWidth(3, 0.2))), records[i - 1]().lineWidth(2, 0.2), result().opacity(0, 0.2));
      yield* all(query().text(`(${ids[i]}, DIR_ITEM, h("${names[i]}"))`, 0.4), cursor().position([i < 2 ? -230 : 230, -166], 0.6));
    }
    yield* cursor().opacity(1, 0.2);
    yield* beginSlide(`Ищем ${names[i]} — от корня`);
    const parent = i < 2 ? 0 : 1;
    yield* all(paths[parent]().stroke(colors.foreground, 0.4), paths[parent]().lineWidth(5, 0.4), cursor().position([parent === 0 ? -440 : 440, -16], 0.6));
    yield* all(paths[i + 2]().stroke(colors.foreground, 0.4), paths[i + 2]().lineWidth(5, 0.4), cursor().position([leafX[i], 140], 0.6));
    yield* all(records[i]().lineWidth(5, 0.3), records[i]().stroke(colors.foreground, 0.3), result().text(`${names[i]} → objectid ${ids[i + 1]}`, 0.3), result().opacity(1, 0.3), steps[i + 1]().lineWidth(5, 0.3));
    yield* beginSlide(`${names[i]} найден`);
  }
});
