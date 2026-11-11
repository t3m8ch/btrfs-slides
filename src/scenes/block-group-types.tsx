import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const contents = Array.from({length: 3}, () => createRef<Node>());
  const extentLeaf = createRef<Rect>();
  const extentType = createRef<Txt>();
  const dataLink = createRef<Line>();
  const inline = createRef<Rect>();
  const caption = createRef<Txt>();
  view.add(<>
    <Frame title="Что хранится в группах блоков" number="27" />
    {[-600, 0, 600].map((x, i) => <Rect x={x} y={35} width={i === 1 ? 580 : 500} height={650} radius={22} stroke={colors.muted} lineWidth={3}>
      <Txt y={-270} text={['DATA', 'METADATA', 'SYSTEM'][i]} fontFamily="Menlo" fontSize={40} fontWeight={600} fill={colors.foreground} />
      <Txt y={-210} text={['Байты файлов', 'Блоки деревьев', 'Блоки Chunk tree'][i]} fontFamily={font} fontSize={31} fill={colors.foreground} />
    </Rect>)}
    <Node ref={contents[0]} opacity={0}>
      {[-100, 40, 180].map((y, i) => <Rect x={-600} y={y} width={390} height={90} radius={7} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
        <Txt text={['aboba.md · 128 КиБ', 'photo.jpg', '…'][i]} fontFamily={font} fontSize={31} fill={colors.foreground} />
      </Rect>)}
    </Node>
    <Node ref={contents[1]} opacity={0}>
      <Line points={[[0, -70], [-135, -40]]} stroke={colors.muted} lineWidth={3} />
      <Line points={[[0, -70], [135, -40]]} stroke={colors.muted} lineWidth={3} />
      <Rect y={-105} width={200} height={70} radius={7} stroke={colors.muted} lineWidth={3}>
        <Txt text="FS tree" fontFamily={font} fontSize={32} fill={colors.foreground} />
      </Rect>
      <Rect x={-135} width={230} height={80} radius={7} stroke={colors.muted} lineWidth={3}>
        <Txt text="INODE_ITEM" fontFamily="Menlo" fontSize={25} fill={colors.foreground} />
      </Rect>
      <Rect ref={extentLeaf} x={135} width={230} height={80} radius={7} stroke={colors.muted} lineWidth={3}>
        <Txt ref={extentType} text="EXTENT_DATA" fontFamily="Menlo" fontSize={25} fill={colors.foreground} />
        <Rect ref={inline} y={35} width={190} height={50} radius={5} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={2} opacity={0}>
          <Txt text="inline-байты" fontFamily={font} fontSize={25} fill={colors.foreground} />
        </Rect>
      </Rect>
      <Rect y={190} width={260} height={65} radius={7} stroke={colors.muted} lineWidth={3}>
        <Txt text="Checksum tree" fontFamily={font} fontSize={29} fill={colors.foreground} />
      </Rect>
      {[-120, 120].map(x => <Node>
        <Line points={[[0, 223], [x, 257]]} stroke={colors.muted} lineWidth={3} />
        <Rect x={x} y={285} width={190} height={55} radius={6} stroke={colors.muted} lineWidth={3}>
          <Txt text="csum" fontFamily="Menlo" fontSize={27} fill={colors.foreground} />
        </Rect>
      </Node>)}
    </Node>
    <Node ref={contents[2]} opacity={0}>
      <Rect x={600} y={-100} width={280} height={80} radius={8} stroke={colors.muted} lineWidth={3}>
        <Txt text="Chunk tree" fontFamily={font} fontSize={33} fill={colors.foreground} />
      </Rect>
      {[480, 720].map(x => <Node>
        <Line points={[[600, -60], [x, 30]]} stroke={colors.muted} lineWidth={3} />
        <Rect x={x} y={70} width={190} height={80} radius={7} stroke={colors.muted} lineWidth={3}>
          <Txt text="…" fontFamily={font} fontSize={36} fill={colors.foreground} />
        </Rect>
      </Node>)}
    </Node>
    <Line ref={dataLink} points={[[135, 45], [135, 85], [-320, 85], [-320, -100], [-400, -100]]} radius={10} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} end={0} />
    <Txt ref={caption} y={395} text="" fontFamily={font} fontSize={31} fontWeight={600} fill={colors.foreground} />
  </>);
  yield* contents[0]().opacity(1, 0.6);
  yield* beginSlide('DATA — содержимое файлов');
  yield* contents[1]().opacity(1, 0.6);
  yield* beginSlide('METADATA — деревья и их записи');
  yield* all(dataLink().end(1, 0.9), extentLeaf().lineWidth(5, 0.4), caption().text('EXTENT_DATA описывает данные, а сами байты лежат в DATA', 0.4));
  yield* beginSlide('Описание экстента и байты файла — в разных группах');
  yield* all(contents[2]().opacity(1, 0.6), caption().text('Chunk tree хранится в SYSTEM', 0.4));
  yield* beginSlide('SYSTEM — отдельная группа для Chunk tree');
  yield* all(dataLink().end(0, 0.5), extentLeaf().height(150, 0.7), extentLeaf().position.y(35, 0.7), extentType().position.y(-30, 0.7), inline().opacity(1, 0.7), caption().text('Маленький inline-файл: байты прямо в листе, в METADATA', 0.4));
  yield* beginSlide('Inline-данные тоже находятся в METADATA');
});
