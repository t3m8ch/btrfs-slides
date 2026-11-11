import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

// CRC32C example: 4096 bytes 'A'; damaged copy has first byte 'B'.
// https://btrfs.readthedocs.io/en/latest/dev/dev-btrfs-design.html
// https://btrfs.readthedocs.io/en/latest/Auto-repair.html
export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const metadata = createRef<Node>();
  const data = createRef<Node>();
  const dataTitle = createRef<Txt>();
  const logicalBlock = createRef<Rect>();
  const logicalArrow = createRef<Line>();
  const copies = [createRef<Node>(), createRef<Node>()];
  const blocks = [createRef<Rect>(), createRef<Rect>()];
  const hashes = [createRef<Txt>(), createRef<Txt>()];
  const verdicts = [createRef<Txt>(), createRef<Txt>()];
  const damage = createRef<Rect>();
  const repair = createRef<Line>();
  const movingCopy = createRef<Rect>();
  const caption = createRef<Txt>();
  view.add(<>
    <Frame title="Как обнаружить повреждение" number="29" />
    <Node ref={metadata}>
      <Txt x={-490} y={-310} text="Блок дерева" fontFamily={font} fontSize={34} fill={colors.foreground} />
      <Rect x={-490} y={-120} width={620} height={280} radius={12} stroke={colors.muted} lineWidth={3}>
        <Rect y={-100} width={620} height={80} radius={[12, 12, 0, 0]} fill={'#E1E7CE'} />
        <Txt y={-100} text="Заголовок · csum" fontFamily={font} fontSize={33} fill={colors.foreground} />
        <Txt y={40} text="Записи и данные" fontFamily={font} fontSize={34} fill={colors.foreground} />
      </Rect>
      <Line points={[[-140, -220], [-100, -220], [-100, 20], [-140, 20]]} stroke={colors.foreground} lineWidth={4} />
      <Txt x={-450} y={85} text="Сумма содержимого блока" fontFamily={font} fontSize={29} fill={colors.muted} />
    </Node>
    <Node ref={data} opacity={0}>
      <Txt ref={dataTitle} x={440} y={-310} text="Данные файла" fontFamily={font} fontSize={34} fill={colors.foreground} />
      <Rect x={440} y={-195} width={660} height={150} radius={12} stroke={colors.muted} lineWidth={3}>
        <Txt y={-38} text="Checksum tree" fontFamily={font} fontSize={34} fontWeight={600} fill={colors.foreground} />
        <Txt y={30} text="256 МиБ → 057251E9" fontFamily="Menlo" fontSize={31} fill={colors.foreground} />
      </Rect>
      <Line ref={logicalArrow} points={[[440, -120], [440, -55]]} stroke={colors.muted} lineWidth={3} endArrow />
      <Rect ref={logicalBlock} x={440} y={0} width={660} height={100} radius={8} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
        <Txt text="256 МиБ · 4 КиБ" fontFamily={font} fontSize={33} fill={colors.foreground} />
      </Rect>
    </Node>
    {[-460, 460].map((x, i) => <Node ref={copies[i]} x={x} opacity={0}>
      <Rect y={135} width={760} height={350} radius={22} stroke={colors.muted} lineWidth={3} />
      <Txt y={5} text={`Устройство ${i + 1}`} fontFamily={font} fontSize={35} fontWeight={600} fill={colors.foreground} />
      <Rect ref={blocks[i]} y={115} width={600} height={100} radius={8} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
        <Txt text="Копия данных · 4 КиБ" fontFamily={font} fontSize={32} fill={colors.foreground} />
      </Rect>
      <Txt ref={hashes[i]} y={215} text="CRC32C: 057251E9" fontFamily="Menlo" fontSize={32} fill={colors.foreground} opacity={0} />
      <Txt ref={verdicts[i]} y={275} text="" fontFamily={font} fontSize={31} fontWeight={600} fill={colors.muted} />
    </Node>)}
    <Rect ref={damage} x={-655} y={115} width={45} height={100} fill={'#FFE0D3'} stroke={colors.highlight} lineWidth={4} opacity={0} />
    <Line ref={repair} points={[[760, 115], [800, 115], [800, -90], [-800, -90], [-800, 115], [-760, 115]]} radius={14} stroke={colors.foreground} lineWidth={5} endArrow arrowSize={18} end={0} />
    <Rect ref={movingCopy} x={460} y={115} width={600} height={100} radius={8} fill={'#E1E7CE'} stroke={colors.foreground} lineWidth={4} opacity={0} />
    <Txt ref={caption} y={385} text="" fontFamily={font} fontSize={33} fontWeight={600} fill={colors.foreground} />
  </>);
  yield* beginSlide('Контрольная сумма в заголовке блока дерева');
  yield* data().opacity(1, 0.6);
  yield* beginSlide('Суммы данных файла — в Checksum tree');
  // Remove the old diagram before introducing the device enclosures: no overlap
  // even when the animation is paused between presentation stops.
  yield* all(metadata().opacity(0, 0.4), dataTitle().opacity(0, 0.4), logicalArrow().opacity(0, 0.4), logicalBlock().opacity(0, 0.4));
  yield* data().position([-440, -15], 0.7);
  yield* all(copies[0]().opacity(1, 0.6), copies[1]().opacity(1, 0.6), caption().text('Две копии одного логического диапазона', 0.4));
  yield* beginSlide('Один диапазон — две физические копии');
  yield* all(damage().opacity(1, 0.4), blocks[0]().stroke(colors.highlight, 0.4), caption().text('При чтении вычисляем сумму заново', 0.4));
  yield* all(hashes[0]().text('CRC32C: 4770FDFA', 0), hashes[0]().opacity(1, 0.6), verdicts[0]().text('≠ ожидаемой', 0.4), verdicts[0]().fill(colors.highlight, 0.4));
  yield* beginSlide('Повреждённая копия — сумма не совпала');
  yield* all(hashes[1]().opacity(1, 0.6), verdicts[1]().text('Совпадает', 0.4), caption().text('Читаем и проверяем другую копию', 0.4));
  yield* beginSlide('Вторая копия прошла проверку');
  yield* repair().end(1, 0.8);
  yield* movingCopy().opacity(1, 0.2);
  yield* movingCopy().position.x(-460, 1.1);
  yield* all(movingCopy().opacity(0, 0.3), damage().opacity(0, 0.3), blocks[0]().stroke(colors.muted, 0.3), hashes[0]().text('CRC32C: 057251E9', 0.3), verdicts[0]().text('Совпадает', 0.3), verdicts[0]().fill(colors.muted, 0.3), caption().text('Исправную копию возвращаем приложению и восстанавливаем повреждённую', 0.4));
  yield* beginSlide('Восстановили данные из исправной копии');
  yield* all(repair().opacity(0, 0.4), copies[1]().opacity(0.2, 0.4), caption().text('Без исправной копии: обнаружим повреждение, но не восстановим данные', 0.4));
  yield* beginSlide('Контрольная сумма обнаруживает ошибку — копия позволяет исправить');
});
