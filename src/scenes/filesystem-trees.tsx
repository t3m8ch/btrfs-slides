import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const root = createRef<Node>();
  const chunk = createRef<Node>();
  const branches = Array.from({length: 4}, () => createRef<Line>());
  const cards = Array.from({length: 4}, () => createRef<Rect>());
  const fsTitle = createRef<Txt>();
  const fsPurpose = createRef<Txt>();
  const firstTree = createRef<Node>();
  const secondTree = createRef<Node>();
  const secondBranch = createRef<Line>();
  const caption = createRef<Txt>();
  const miniTree = () => <Node>
    <Line points={[[0, 35], [-120, 100]]} stroke={colors.muted} lineWidth={3} />
    <Line points={[[0, 35], [120, 100]]} stroke={colors.muted} lineWidth={3} />
    {[[0, 35], [-120, 100], [120, 100]].map(([x, y]) => <Rect x={x} y={y} width={95} height={40} radius={5} stroke={colors.muted} lineWidth={3} fill={colors.background} />)}
  </Node>;
  const xs = [-650, -200, 250, 700];
  view.add(<>
    <Frame title="Одна ФС — несколько деревьев" number="16" />
    <Txt ref={caption} y={-335} text="" fontFamily={font} fontSize={33} fontWeight={600} fill={colors.foreground} />
    <Rect y={-270} width={450} height={85} radius={10} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
      <Txt text="Суперблок" fontFamily={font} fontSize={36} fontWeight={600} fill={colors.foreground} />
    </Rect>
    <Node ref={root} opacity={0}>
      <Line points={[[-100, -227], [-260, -150]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={13} />
      <Rect x={-260} y={-100} width={450} height={95} radius={10} stroke={colors.muted} lineWidth={3}>
        <Txt text="Root tree" fontFamily={font} fontSize={37} fontWeight={600} fill={colors.foreground} />
      </Rect>
    </Node>
    <Node ref={chunk} opacity={0}>
      <Line points={[[100, -227], [600, -150]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={13} />
      <Rect x={600} y={-100} width={450} height={95} radius={10} stroke={colors.muted} lineWidth={3}>
        <Txt text="Chunk tree" fontFamily={font} fontSize={37} fontWeight={600} fill={colors.foreground} />
      </Rect>
      <Txt x={600} y={-10} text="Адреса → устройства" fontFamily={font} fontSize={29} fill={colors.foreground} />
    </Node>
    {xs.map((x, i) => <Node>
      <Line ref={branches[i]} points={[[-260, -50], [x, 100]]} stroke={colors.muted} lineWidth={3} end={0} />
      <Rect ref={cards[i]} x={x} y={160} width={380} height={120} radius={10} stroke={colors.muted} lineWidth={3} opacity={0}>
        {i === 0 ? <Node>
          <Txt ref={fsTitle} y={-22} text="FS tree" fontFamily={font} fontSize={34} fontWeight={600} fill={colors.foreground} />
          <Txt ref={fsPurpose} y={28} text="Файлы и каталоги" fontFamily={font} fontSize={28} fill={colors.foreground} />
          <Node ref={firstTree} opacity={0}>{miniTree()}</Node>
        </Node> : <Node>
          <Txt y={-22} text={['', 'Extent tree', 'Checksum tree', 'Free space tree'][i]} fontFamily={font} fontSize={32} fontWeight={600} fill={colors.foreground} />
          <Txt y={28} text={['', 'Экстенты и ссылки', 'Суммы данных', 'Свободные участки'][i]} fontFamily={font} fontSize={27} fill={colors.foreground} />
        </Node>}
      </Rect>
    </Node>)}
    <Line ref={secondBranch} points={[[-260, -50], [450, 70]]} stroke={colors.muted} lineWidth={3} end={0} />
    <Node ref={secondTree} x={-450} y={200} opacity={0}>
      <Rect width={650} height={260} radius={14} stroke={colors.muted} lineWidth={3} />
      <Txt y={-80} text="FS tree" fontFamily={font} fontSize={38} fontWeight={600} fill={colors.foreground} />
      <Txt y={-25} text="Подтом B" fontFamily={font} fontSize={32} fill={colors.foreground} />
      {miniTree()}
    </Node>
  </>);
  yield* all(root().opacity(1, 0.6), chunk().opacity(1, 0.6));
  yield* beginSlide('Root tree и Chunk tree');
  for (let i = 0; i < 4; i++) {
    yield* all(branches[i]().end(1, 0.6), cards[i]().opacity(1, 0.6));
    yield* beginSlide(['FS tree — файлы и каталоги', 'Extent tree — экстенты и ссылки', 'Checksum tree — суммы данных', 'Free space tree — свободное место'][i]);
  }
  yield* all(...[1, 2, 3].map(i => all(cards[i]().opacity(0, 0.5), branches[i]().end(0, 0.5))), chunk().opacity(0.25, 0.5), cards[0]().position([-450, 200], 1), cards[0]().size([650, 260], 1), fsTitle().position.y(-80, 1), fsTitle().fontSize(38, 1), fsPurpose().text('Подтом A', 0.5), fsPurpose().position.y(-25, 1), fsPurpose().fontSize(32, 1), firstTree().opacity(1, 1), branches[0]().points([[-260, -50], [-450, 70]], 1), caption().text('Каждому подтому — своё FS tree', 0.5));
  yield* all(secondTree().opacity(1, 0.4), secondTree().position.x(450, 0.9), secondBranch().end(1, 0.9));
  yield* beginSlide('У каждого подтома отдельное FS tree');
  yield* all(cards[0]().lineWidth(5, 0.4), secondTree().opacity(0.4, 0.5));
  yield* beginSlide('Рассмотрим одно FS tree');
});
