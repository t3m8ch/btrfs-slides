import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const title = createRef<Txt>();
  const fileBox = createRef<Rect>();
  const fileData = createRef<Rect>();
  const fileName = createRef<Txt>();
  const fileSubtitle = createRef<Txt>();
  const numbers = createRef<Node>();
  const logical = createRef<Node>();
  const physical = createRef<Node>();
  const boxes = [createRef<Rect>(), createRef<Rect>()];
  const tracks = [createRef<Rect>(), createRef<Rect>()];
  const names = [createRef<Txt>(), createRef<Txt>()];
  const subtitles = [createRef<Txt>(), createRef<Txt>()];
  const data = [createRef<Rect>(), createRef<Rect>()];
  const marks = [createRef<Node>(), createRef<Node>()];
  const firstCaptions = [createRef<Txt>(), createRef<Txt>()];
  const arrows = [createRef<Line>(), createRef<Line>()];
  const starts = [-560, -80, 80, 560];
  const logicalX = [-600, -160, 160, 600];
  const diskX = [-650, -290, 290, 650];
  const widths = [220, 160, 160, 220];
  const captions = ['Файл 1', '2 · 1/2', '2 · 2/2', 'Файл 3'];
  const strokes = [colors.muted, colors.highlight, colors.highlight, colors.accent];
  const fills = ['#D9E1C3', '#FFE0D3', '#FFE0D3', '#E1E7CE'];

  view.add(<>
    <Frame title="" number="13" />
    <Txt ref={title} x={-800} y={-425} offsetX={-1} text="Три адреса одного байта" fontFamily={font} fontSize={64} fontWeight={600} letterSpacing={-2} fill={colors.foreground} />
    <Rect ref={fileBox} x={-420} y={-235} width={860} height={210} radius={32} stroke={colors.muted} lineWidth={3} />
    <Txt ref={fileName} x={-800} y={-259} offsetX={-1} text="В файле" fontFamily={font} fontSize={35} fontWeight={600} fill={colors.foreground} />
    <Txt ref={fileSubtitle} x={-800} y={-211} offsetX={-1} text="Смещение от начала" fontFamily={font} fontSize={25} fill={colors.muted} />
    <Rect ref={fileData} x={-230} y={-221} width={360} height={62} radius={5} fill={'#E1E7CE'} stroke={colors.accent} lineWidth={3} />
    <Node ref={numbers}>
      <Line points={[[-230, -257], [-230, -184]]} stroke={colors.foreground} lineWidth={4} />
      <Txt x={-230} y={-294} text="64 КиБ" fontFamily="Menlo" fontSize={30} fill={colors.foreground} />
      <Txt x={-410} y={-165} offsetX={-1} text="0" fontFamily={font} fontSize={23} fill={colors.muted} />
      <Txt x={-50} y={-165} offsetX={1} text="128 КиБ" fontFamily={font} fontSize={23} fill={colors.muted} />
    </Node>
    {[25, 285].map((y, i) => <Node ref={i === 0 ? logical : physical} opacity={0}>
      <Rect ref={boxes[i]} y={y} width={1700} height={210} radius={32} stroke={colors.muted} lineWidth={3} />
      <Txt ref={names[i]} x={-800} y={y - 24} offsetX={-1} text={i === 0 ? 'В Btrfs' : 'На устройстве'} fontFamily={font} fontSize={35} fontWeight={600} fill={colors.foreground} />
      <Txt ref={subtitles[i]} x={-800} y={y + 24} offsetX={-1} text={i === 0 ? 'Логический адрес' : 'Физический адрес'} fontFamily={font} fontSize={25} fill={colors.muted} />
      <Rect ref={tracks[i]} x={180} y={y + 14} width={1180} height={62} radius={5} stroke={colors.accent} lineWidth={2} />
      <Rect ref={data[i]} x={i === 0 ? -70 : 330} y={y + 14} width={180} height={62} fill={'#E1E7CE'} stroke={colors.accent} lineWidth={3} radius={3}>
        <Txt ref={firstCaptions[i]} text="Файл 1" fontFamily={font} fontSize={26} fontWeight={600} fill={colors.foreground} opacity={0} />
      </Rect>
      <Node ref={marks[i]}>
        <Line points={[[i === 0 ? -70 : 330, y - 22], [i === 0 ? -70 : 330, y + 51]]} stroke={colors.foreground} lineWidth={4} />
        <Txt x={i === 0 ? -70 : 330} y={y - 59} text={i === 0 ? '256 МиБ + 64 КиБ' : '1 ГиБ + 64 КиБ'} fontFamily="Menlo" fontSize={30} fill={colors.foreground} />
      </Node>
    </Node>)}
    <Line ref={arrows[0]} points={[[-230, -130], [-230, -112], [-70, -112], [-70, -80]]} radius={12} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={13} end={0} />
    <Line ref={arrows[1]} points={[[-70, 130], [-70, 150], [330, 150], [330, 180]]} radius={12} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={13} end={0} />
  </>);

  yield* beginSlide('Смещение внутри файла');
  yield* all(logical().opacity(1, 0.6), arrows[0]().end(1, 0.8));
  yield* beginSlide('От файла к логическому адресу');
  yield* all(physical().opacity(1, 0.6), arrows[1]().end(1, 0.8));
  yield* beginSlide('Получаем адрес на устройстве');

  const newFiles = [createRef<Node>(), createRef<Node>()];
  const newDevice = createRef<Node>();
  const links = Array.from({length: 6}, () => createRef<Line>());
  const logicalPieces = Array.from({length: 3}, () => createRef<Rect>());
  const diskPieces = Array.from({length: 3}, () => createRef<Rect>());
  view.add(<>
    {[0, 560].map((x, i) => <Node ref={newFiles[i]} x={x} y={-265} scale={0}>
      <Rect width={450} height={150} radius={24} stroke={colors.muted} lineWidth={3} />
      <Txt y={-39} text={`Файл ${i + 2}`} fontFamily={font} fontSize={32} fontWeight={600} fill={colors.foreground} />
      <Rect y={20} width={320} height={58} radius={5} stroke={strokes[i === 0 ? 1 : 3]} lineWidth={3} fill={fills[i === 0 ? 1 : 3]} />
      {i === 0 && <Node>
        <Line points={[[0, -9], [0, 49]]} stroke={colors.foreground} lineWidth={3} />
        <Txt x={-80} y={20} text="1/2" fontFamily="Menlo" fontSize={25} fill={colors.foreground} />
        <Txt x={80} y={20} text="2/2" fontFamily="Menlo" fontSize={25} fill={colors.foreground} />
      </Node>}
    </Node>)}
    <Node ref={newDevice} x={850} y={290} scale={0}>
      <Rect width={820} height={210} radius={30} stroke={colors.muted} lineWidth={3} />
      <Txt x={-360} y={-60} offsetX={-1} text="Устройство 2" fontFamily={font} fontSize={32} fontWeight={600} fill={colors.foreground} />
      <Rect y={15} width={720} height={64} radius={5} stroke={colors.accent} lineWidth={2} />
    </Node>
    {[1, 2, 3].map((i, j) => <Node>
      <Line ref={links[j]} points={[[starts[i], -190], [starts[i], -150], [logicalX[i], -150], [logicalX[i], -90]]} radius={12} stroke={strokes[i]} lineWidth={4} endArrow arrowSize={13} end={0} />
      <Line ref={links[j + 3]} points={[[logicalX[i], 90], [logicalX[i], 135], [diskX[i], 135], [diskX[i], 185]]} radius={12} stroke={strokes[i]} lineWidth={4} endArrow arrowSize={13} end={0} />
      <Rect ref={logicalPieces[j]} x={starts[i]} y={-245} width={widths[i]} height={58} radius={4} fill={fills[i]} stroke={strokes[i]} lineWidth={3} opacity={0}>
        <Txt text={captions[i]} fontFamily={font} fontSize={26} fontWeight={600} fill={colors.foreground} />
      </Rect>
      <Rect ref={diskPieces[j]} x={logicalX[i]} y={23} width={widths[i]} height={58} radius={4} fill={fills[i]} stroke={strokes[i]} lineWidth={3} opacity={0}>
        <Txt text={captions[i]} fontFamily={font} fontSize={26} fontWeight={600} fill={colors.foreground} />
      </Rect>
    </Node>)}
  </>);

  // Preserve the actual outlines, tracks, ranges and arrows from the first diagram.
  // Only address annotations disappear; every existing rectangle moves/resizes.
  yield* all(numbers().opacity(0, 0.35), fileSubtitle().opacity(0, 0.35),
    ...marks.map(ref => ref().opacity(0, 0.35)), ...subtitles.map(ref => ref().opacity(0, 0.35)));
  yield* all(
    fileBox().position([-560, -265], 1.4), fileBox().size([450, 150], 1.4), fileBox().radius(24, 1.4),
    fileName().position([-560, -304], 1.4), fileName().offset.x(0, 1.4), fileName().fontSize(32, 1.4), fileName().text('Файл 1', 0.5),
    fileData().position([-560, -245], 1.4), fileData().size([320, 58], 1.4), fileData().fill(fills[0], 1.4), fileData().stroke(strokes[0], 1.4),
    boxes[0]().position([0, 0], 1.4), boxes[0]().height(180, 1.4),
    tracks[0]().position([0, 23], 1.4), tracks[0]().size([1540, 64], 1.4),
    names[0]().position([-800, -55], 1.4), names[0]().text('Btrfs', 0.5), names[0]().fontSize(32, 1.4),
    boxes[1]().position([-440, 290], 1.4), boxes[1]().width(820, 1.4),
    tracks[1]().position([-440, 305], 1.4), tracks[1]().size([720, 64], 1.4),
    names[1]().position([-800, 230], 1.4), names[1]().text('Устройство 1', 0.5), names[1]().fontSize(32, 1.4),
    ...data.map((ref, i) => all(ref().position([i === 0 ? -600 : -650, i === 0 ? 23 : 305], 1.4), ref().size([220, 58], 1.4), ref().fill(fills[0], 1.4), ref().stroke(strokes[0], 1.4))),
    ...firstCaptions.map(ref => ref().opacity(1, 1.4)),
    arrows[0]().points([[-560, -190], [-560, -150], [-600, -150], [-600, -90]], 1.4),
    arrows[1]().points([[-600, 90], [-600, 135], [-650, 135], [-650, 185]], 1.4),
    ...arrows.map(ref => ref().stroke(strokes[0], 1.4)),
    title().text('Одна файловая система — два устройства', 0.7),
  );
  yield* all(newFiles[0]().scale(1, 0.7), newFiles[1]().scale(1, 0.9),
    newDevice().scale(1, 0.9), newDevice().position.x(440, 0.9));
  yield* beginSlide('Первый файл на первом устройстве');

  for (const group of [[0, 1], [2]]) {
    yield* all(...group.map(j => all(links[j]().end(1, 0.65), logicalPieces[j]().opacity(1, 0.25), logicalPieces[j]().position([logicalX[j + 1], 23], 0.8))));
    yield* all(...group.map(j => all(links[j + 3]().end(1, 0.65), diskPieces[j]().opacity(1, 0.25), diskPieces[j]().position([diskX[j + 1], 305], 0.8))));
    yield* beginSlide(group[0] === 0 ? 'Второй файл на двух устройствах' : 'Третий файл на втором устройстве');
  }
});
