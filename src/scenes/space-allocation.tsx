import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

// Schematic SINGLE layout with separate DATA and METADATA block groups.
export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const dataGroup = createRef<Rect>();
  const metaGroup = createRef<Rect>();
  const newGroup = createRef<Rect>();
  const physical = createRef<Rect>();
  const physicalName = createRef<Txt>();
  const dataMapping = createRef<Line>();
  const metaMapping = createRef<Line>();
  const newMapping = createRef<Line>();
  const caption = createRef<Txt>();
  const dataRequest = createRef<Rect>();
  const dataRequestText = createRef<Txt>();
  const metaRequest = createRef<Rect>();
  const metaRequestText = createRef<Txt>();
  const search = createRef<Line>();
  view.add(<>
    <Frame title="Откуда берётся свободное место" number="28" />
    <Txt ref={caption} x={-850} y={-335} offsetX={-1} text="Нужны новые данные" fontFamily={font} fontSize={34} fontWeight={600} fill={colors.foreground} />
    <Rect y={-140} width={1700} height={300} radius={24} stroke={colors.muted} lineWidth={3} />
    <Txt x={-800} y={-250} offsetX={-1} text="Btrfs · логическое пространство" fontFamily={font} fontSize={32} fill={colors.foreground} />
    <Rect ref={dataGroup} x={-480} y={-110} width={650} height={170} radius={12} stroke={colors.muted} lineWidth={3}>
      <Txt y={-50} text="Block group · DATA" fontFamily={font} fontSize={29} fontWeight={600} fill={colors.foreground} />
      <Rect y={25} width={() => dataGroup().width() - 40} height={60} radius={5} fill={colors.muted}>
        <Txt text="Занято" fontFamily={font} fontSize={28} fill={colors.background} />
      </Rect>
    </Rect>
    <Rect ref={metaGroup} x={420} y={-110} width={650} height={170} radius={12} stroke={colors.muted} lineWidth={3}>
      <Txt y={-50} text="Block group · METADATA" fontFamily={font} fontSize={28} fontWeight={600} fill={colors.foreground} />
      <Rect x={() => -metaGroup().width() / 4} y={25} width={() => metaGroup().width() / 2 - 40} height={60} radius={5} fill={colors.muted}>
        <Txt text="Занято" fontFamily={font} fontSize={26} fill={colors.background} />
      </Rect>
      <Rect x={() => metaGroup().width() / 4} y={25} width={() => metaGroup().width() / 2 - 40} height={60} radius={5} stroke={colors.accent} lineWidth={2} lineDash={[10, 8]}>
        <Txt text="Свободно" fontFamily={font} fontSize={26} fill={colors.muted} />
      </Rect>
    </Rect>
    <Line ref={dataMapping} points={[[-480, -25], [-520, 265]]} stroke={colors.accent} lineWidth={3} />
    <Line ref={metaMapping} points={[[420, -25], [-40, 265]]} stroke={colors.accent} lineWidth={3} />
    <Rect y={285} width={1700} height={190} radius={24} stroke={colors.muted} lineWidth={3} />
    <Txt x={-800} y={225} offsetX={-1} text="Устройство" fontFamily={font} fontSize={32} fill={colors.foreground} />
    <Rect x={-520} y={310} width={500} height={90} radius={8} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
      <Txt text="Chunk · DATA" fontFamily={font} fontSize={30} fill={colors.foreground} />
    </Rect>
    <Rect x={-40} y={310} width={360} height={90} radius={8} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
      <Txt text="Chunk · METADATA" fontFamily={font} fontSize={28} fill={colors.foreground} />
    </Rect>
    <Rect ref={physical} x={540} y={310} width={550} height={90} radius={8} stroke={colors.muted} lineWidth={3} lineDash={[12, 9]}>
      <Txt ref={physicalName} text="Не распределено" fontFamily={font} fontSize={30} fill={colors.foreground} />
    </Rect>
    <Line ref={newMapping} points={[[550, -25], [540, 265]]} stroke={colors.foreground} lineWidth={4} end={0} />
    <Rect ref={newGroup} x={540} y={310} width={550} height={90} radius={12} stroke={colors.foreground} lineWidth={3} fill={colors.background} opacity={0}>
      <Txt y={-50} text="Block group · DATA" fontFamily={font} fontSize={29} fontWeight={600} fill={colors.foreground} />
      <Rect y={25} width={() => newGroup().width() - 40} height={60} radius={5} stroke={colors.accent} lineWidth={2} lineDash={[10, 8]}>
        <Txt x={85} text="Свободно" fontFamily={font} fontSize={27} fill={colors.muted} />
      </Rect>
    </Rect>
    <Line ref={search} points={[[-480, -300], [-480, -200]]} stroke={colors.foreground} lineWidth={5} endArrow arrowSize={15} end={0} />
    <Rect ref={dataRequest} x={660} y={-335} width={300} height={65} radius={6} stroke={colors.highlight} lineWidth={4} fill={'#FFE0D3'}>
      <Txt ref={dataRequestText} text="4 КиБ · DATA" fontFamily={font} fontSize={28} fill={colors.foreground} />
    </Rect>
    <Rect ref={metaRequest} x={660} y={-335} width={300} height={65} radius={6} stroke={colors.foreground} lineWidth={3} fill={'#E1E7CE'} opacity={0}>
      <Txt ref={metaRequestText} text="Лист · METADATA" fontFamily={font} fontSize={27} fill={colors.foreground} />
    </Rect>
  </>);
  yield* beginSlide('Группы данных и метаданных');
  yield* all(search().end(1, 0.6), caption().text('В DATA нет подходящего свободного участка', 0.4));
  yield* beginSlide('Ищем свободное место в DATA');
  yield* all(search().end(0, 0.4), physical().lineDash([], 0.5), physical().fill('#E1E7CE', 0.5), physicalName().text('Chunk · DATA', 0.5), caption().text('Выделяем новый chunk на устройстве', 0.4));
  yield* beginSlide('Из нераспределённого места выделяем chunk');
  yield* all(dataGroup().position.x(-570, 1), dataGroup().width(440, 1), metaGroup().position.x(0, 1), metaGroup().width(440, 1), dataMapping().points([[-570, -25], [-520, 265]], 1), metaMapping().points([[0, -25], [-40, 265]], 1), newGroup().opacity(1, 0.4), newGroup().position([550, -110], 1), newGroup().size([440, 170], 1), newMapping().end(1, 1), caption().text('В логическом пространстве появляется block group', 0.4));
  yield* beginSlide('Новая block group для DATA');
  yield* all(dataRequest().position([435, -85], 0.9), dataRequest().size([100, 60], 0.9), dataRequestText().text('4 КиБ', 0.4), caption().text('Внутри группы выделяем свободный диапазон', 0.4));
  yield* beginSlide('Выделили экстент для новых 4 КиБ');
  yield* all(metaRequest().opacity(1, 0.5), caption().text('Для нового листа выбираем METADATA', 0.4));
  yield* beginSlide('Нужен новый блок дерева');
  yield* all(metaRequest().position([110, -85], 0.9), metaRequest().size([180, 60], 0.9), metaRequestText().text('Лист', 0.4));
  yield* beginSlide('Данные и метаданные выделены в своих группах');
});
