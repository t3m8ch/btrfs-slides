import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const descriptor = createRef<Node>();
  const payload = createRef<Node>();
  const payloadLink = createRef<Line>();
  const data = createRef<Node>();
  const dataLink = createRef<Line>();
  const diskField = createRef<Rect>();
  const pointer = createRef<Line>();
  const request = createRef<Txt>();
  const address = createRef<Txt>();
  const inline = createRef<Node>();
  const main = createRef<Node>();
  view.add(<>
    <Frame title="От objectid к содержимому файла" number="19" />
    <Node ref={main}>
      <Txt x={-850} y={-325} offsetX={-1} text="aboba.md · objectid 301" fontFamily={font} fontSize={36} fontWeight={600} fill={colors.foreground} />
      <Txt ref={request} x={800} y={-325} offsetX={1} text="" fontFamily={font} fontSize={33} fill={colors.foreground} />
      <Rect x={-390} y={50} width={920} height={700} radius={16} stroke={colors.muted} lineWidth={4} />
      <Txt x={-790} y={-260} offsetX={-1} text="Лист FS tree" fontFamily={font} fontSize={32} fontWeight={600} fill={colors.foreground} />
      <Rect x={-390} y={-180} width={820} height={80} radius={7} stroke={colors.accent} lineWidth={2}>
        <Txt text="(301, INODE_ITEM, 0)" fontFamily="Menlo" fontSize={30} fill={colors.foreground} />
      </Rect>
      <Line points={[[-805, -180], [-825, -180], [-825, 315], [-805, 315]]} radius={7} stroke={colors.muted} lineWidth={3} endArrow arrowSize={12} />
      <Rect x={-390} y={315} width={820} height={70} radius={7} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={2}>
        <Txt text="128 КиБ · rw-r--r--" fontFamily={font} fontSize={32} fill={colors.foreground} />
      </Rect>
      <Rect x={-390} y={55} width={820} height={90} radius={7} stroke={colors.accent} lineDash={[12, 9]} lineWidth={2} />
      <Node ref={descriptor} opacity={0}>
        <Rect x={-390} y={-65} width={820} height={110} radius={7} stroke={colors.muted} lineWidth={3}>
          <Txt y={-22} text="(301, EXTENT_DATA, 0)" fontFamily="Menlo" fontSize={30} fill={colors.foreground} />
          <Txt y={26} text="offset · size" fontFamily="Menlo" fontSize={29} fill={colors.muted} />
        </Rect>
      </Node>
      <Line ref={payloadLink} points={[[25, -40], [50, -40], [50, 145], [25, 145]]} radius={9} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={13} end={0} />
      <Node ref={payload} opacity={0}>
        <Rect x={-390} y={190} width={820} height={150} radius={8} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3} />
        <Txt x={-390} y={145} text="DATA" fontFamily="Menlo" fontSize={28} fontWeight={600} fill={colors.muted} />
        <Rect ref={diskField} x={-390} y={193} width={720} height={46} radius={4} stroke={colors.foreground} lineWidth={0} />
        <Txt x={-390} y={193} text="disk_bytenr = 256 МиБ" fontFamily="Menlo" fontSize={29} fill={colors.foreground} />
        <Txt x={-390} y={238} text="num_bytes = 128 КиБ" fontFamily="Menlo" fontSize={29} fill={colors.foreground} />
      </Node>
      <Line ref={dataLink} points={[[-25, 193], [220, 193], [220, -180], [590, -180], [590, -150]]} radius={12} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} end={0} />
      <Node ref={data} opacity={0}>
        <Txt x={590} y={-270} text="Данные файла" fontFamily={font} fontSize={34} fill={colors.foreground} />
        <Txt x={590} y={-215} text="256 МиБ" fontFamily={font} fontSize={28} fill={colors.muted} />
        <Rect x={590} y={65} width={360} height={430} radius={5} stroke={colors.muted} lineWidth={3} fill={'#E1E7CE'} />
        <Txt x={590} y={325} text="+ 128 КиБ" fontFamily={font} fontSize={28} fill={colors.muted} />
        <Line ref={pointer} points={[[395, 65], [785, 65]]} stroke={colors.foreground} lineWidth={5} opacity={0} />
        <Txt ref={address} x={590} y={385} text="" fontFamily="Menlo" fontSize={29} fill={colors.foreground} />
      </Node>
    </Node>
    <Node ref={inline} opacity={0} y={90}>
      <Txt x={-850} y={-310} offsetX={-1} text="Маленький файл: inline" fontFamily={font} fontSize={38} fontWeight={600} fill={colors.foreground} />
      <Rect y={25} width={1100} height={570} radius={16} stroke={colors.muted} lineWidth={4} />
      <Txt x={-480} y={-210} offsetX={-1} text="Лист FS tree" fontFamily={font} fontSize={32} fill={colors.foreground} />
      <Rect y={-100} width={960} height={100} radius={8} stroke={colors.accent} lineWidth={3}>
        <Txt y={-20} text="(302, EXTENT_DATA, 0)" fontFamily="Menlo" fontSize={32} fill={colors.foreground} />
        <Txt y={25} text="offset · size" fontFamily="Menlo" fontSize={28} fill={colors.muted} />
      </Rect>
      <Rect y={30} width={960} height={100} radius={6} stroke={colors.accent} lineDash={[12, 9]} lineWidth={2} />
      <Rect y={180} width={960} height={120} radius={7} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
        <Txt text="Привет, Btrfs!" fontFamily={font} fontSize={36} fill={colors.foreground} />
      </Rect>
      <Line points={[[485, -75], [520, -75], [520, 180], [485, 180]]} radius={10} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={13} />
    </Node>
  </>);
  yield* beginSlide('Свойства файла 301');
  yield* descriptor().opacity(1, 0.5);
  yield* beginSlide('Описатель EXTENT_DATA в листе');
  yield* all(payloadLink().end(1, 0.8), payload().opacity(1, 0.6));
  yield* beginSlide('offset и size указывают на DATA');
  yield* all(diskField().lineWidth(3, 0.4), dataLink().end(1, 1), data().opacity(1, 0.6));
  yield* beginSlide('disk_bytenr указывает на данные файла');
  yield* all(pointer().opacity(1, 0.4), request().text('Читаем с 64 КиБ', 0.4), address().text('256 МиБ + 64 КиБ', 0.4));
  yield* beginSlide('Смещение внутри экстента');
  yield* all(main().opacity(0, 0.5), inline().opacity(1, 0.6), inline().position.y(0, 0.6));
  yield* beginSlide('Inline — данные прямо в листе');
});
