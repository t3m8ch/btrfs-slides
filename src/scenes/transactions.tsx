import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

// Simplified full transaction commit; tree-log replay is introduced separately.
// https://btrfs.readthedocs.io/en/latest/dev/dev-btrfs-design.html#copy-on-write-logging
export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const versions = [createRef<Node>(), createRef<Node>()];
  const newBlocks = Array.from({length: 3}, () => createRef<Rect>());
  const newLinks = Array.from({length: 2}, () => createRef<Line>());
  const oldBlocks = Array.from({length: 3}, () => createRef<Rect>());
  const oldLinks = Array.from({length: 2}, () => createRef<Line>());
  const labels = [createRef<Txt>(), createRef<Txt>()];
  const superblock = createRef<Rect>();
  const blackout = createRef<Rect>();
  const oldPointer = createRef<Line>();
  const newPointer = createRef<Line>();
  const rootField = createRef<Txt>();
  const caption = createRef<Txt>();
  const phase = createRef<Txt>();
  const crash = createRef<Txt>();
  view.add(<>
    <Frame title="Как изменения становятся сохранёнными" number="26" />
    <Txt ref={phase} y={-330} text="Транзакция — изменения деревьев, сохраняемые вместе" fontFamily={font} fontSize={34} fill={colors.muted} />
    <Rect ref={superblock} y={-230} width={480} height={115} radius={12} stroke={colors.foreground} lineWidth={4}>
      <Txt y={-25} text="Суперблок" fontFamily={font} fontSize={32} fontWeight={600} fill={colors.foreground} />
      <Txt ref={rootField} y={25} text="root = старый Root tree" fontFamily="Menlo" fontSize={25} fill={colors.foreground} />
    </Rect>
    <Line ref={oldPointer} points={[[-180, -172], [-470, -140], [-470, -115]]} radius={10} stroke={colors.foreground} lineWidth={5} endArrow arrowSize={16} />
    <Line ref={newPointer} points={[[180, -172], [470, -140], [470, -115]]} radius={10} stroke={colors.foreground} lineWidth={5} endArrow arrowSize={16} end={0} />
    {[-470, 470].map((x, version) => <Node ref={versions[version]} x={x}>
      {[[[0, -25], [0, 40]], [[0, 130], [0, 230]]].map((points, i) => <Line ref={version ? newLinks[i] : oldLinks[i]} points={points as [number, number][]} stroke={colors.muted} lineWidth={3} end={version ? 0 : 1} />)}
      {[[0, -70], [0, 85], [0, 275]].map(([bx, by], i) => <Rect ref={version ? newBlocks[i] : oldBlocks[i]} x={bx} y={by} width={i === 0 ? 380 : 310} height={90} radius={10} stroke={colors.muted} lineWidth={3} fill={version ? colors.background : '#E1E7CE'} opacity={version ? 0 : 1}>
        <Txt text={['Root tree', 'FS tree', version ? 'Новые 4 КиБ' : 'Прежние данные'][i]} fontFamily={font} fontSize={32} fill={colors.foreground} />
      </Rect>)}
      <Txt ref={labels[version]} x={0} y={345} text={version ? 'Новое состояние' : 'Сохранённое состояние'} fontFamily={font} fontSize={29} fill={colors.muted} />
    </Node>)}
    <Txt ref={crash} x={540} y={-210} text="Сбой" fontFamily={font} fontWeight={600} fontSize={47} fill={colors.highlight} opacity={0} />
    <Txt ref={caption} y={385} text="" fontFamily={font} fontSize={33} fontWeight={600} fill={colors.foreground} />
    <Rect ref={blackout} width={1920} height={1080} fill={colors.foreground} opacity={0}>
      <Txt text="Питание отключено" fontFamily={font} fontSize={54} fill={colors.background} />
    </Rect>
  </>);
  function* restart(version: number) {
    const blocks = version ? newBlocks : oldBlocks;
    const links = version ? newLinks : oldLinks;
    const pointer = version ? newPointer : oldPointer;
    const when = version ? 'после фиксации' : 'до фиксации';
    yield* all(crash().opacity(1, 0.25), phase().text(version ? 'После фиксации' : 'До фиксации', 0.3), caption().text('Пропало питание', 0.3));
    yield* blackout().opacity(1, 0.65);
    yield* beginSlide(`Питание отключено ${when}`);
    crash().opacity(0);
    superblock().opacity(0);
    oldPointer().end(0);
    newPointer().end(0);
    for (const group of [oldBlocks, newBlocks]) for (const block of group) block().opacity(0.16);
    for (const group of [oldLinks, newLinks]) for (const link of group) link().end(0);
    versions[0]().opacity(1);
    versions[1]().opacity(1);
    labels.forEach(label => label().opacity(0.16));
    phase().text('Повторный запуск · читаем суперблок');
    caption().text('На устройстве сохранился адрес корня');
    yield* blackout().opacity(0, 0.6);
    yield* all(superblock().opacity(1, 0.65), superblock().stroke(colors.highlight, 0.65));
    yield* beginSlide(`После запуска читаем суперблок — ${when}`);
    yield* all(superblock().stroke(colors.foreground, 0.4), pointer().end(1, 0.85), blocks[0]().opacity(1, 0.85), phase().text('По адресу из суперблока читаем Root tree', 0.4));
    yield* beginSlide(`Из суперблока в Root tree — ${when}`);
    yield* all(links[0]().end(1, 0.7), blocks[1]().opacity(1, 0.7), phase().text('Из Root tree открываем FS tree', 0.4));
    yield* all(links[1]().end(1, 0.7), blocks[2]().opacity(1, 0.7), labels[version]().opacity(1, 0.7), phase().text('Файловая система снова открыта', 0.4), caption().text(version ? 'Фиксация завершилась до сбоя — изменения сохранились' : 'Фиксации не было — открыли прежнее согласованное состояние', 0.4));
  }
  versions[1]().opacity(0);
  yield* beginSlide('Транзакция — согласованное изменение деревьев');
  yield* all(versions[1]().opacity(1, 0.6), phase().text('Сначала записываем новые данные', 0.4), newBlocks[2]().opacity(1, 0.7), newBlocks[2]().fill('#E1E7CE', 0.7));
  yield* beginSlide('Новые данные записаны');
  yield* all(phase().text('Затем — новые блоки деревьев', 0.4), ...[1].map(i => newBlocks[i]().opacity(1, 0.7)), ...[1].map(i => newBlocks[i]().fill('#E1E7CE', 0.7)), newLinks[1]().end(1, 0.7));
  yield* all(newBlocks[0]().opacity(1, 0.7), newBlocks[0]().fill('#E1E7CE', 0.7), newLinks[0]().end(1, 0.7), caption().text('Новые блоки уже на устройстве. Суперблок всё ещё указывает на старый корень', 0.4));
  yield* beginSlide('Деревья записаны — транзакция ещё не зафиксирована');
  yield* restart(0);
  yield* beginSlide('Сбой до фиксации — остаётся старое состояние');
  yield* all(...newBlocks.map(block => block().opacity(1, 0.5)), ...newLinks.map(link => link().end(1, 0.5)), labels[1]().opacity(1, 0.5), phase().text('Другой сценарий: успели зафиксировать транзакцию', 0.4), caption().text('Новые данные и деревья записаны — обновляем суперблок', 0.4));
  yield* all(oldPointer().end(0, 0.8), newPointer().end(1, 0.8), rootField().text('root = новый Root tree', 0.8));
  yield* all(versions[0]().opacity(0.25, 0.5), caption().text('Новый корень стал точкой входа в согласованное состояние', 0.4));
  yield* beginSlide('Суперблок сохранён — транзакция зафиксирована');
  yield* restart(1);
  yield* beginSlide('Сбой после фиксации — доступно новое состояние');
  yield* all(crash().opacity(0, 0.3), phase().text('CoW сохраняет старое состояние до фиксации нового', 0.4), caption().text('Освобождённое в этой транзакции место теперь можно использовать снова', 0.4));
  yield* beginSlide('После фиксации можно повторно использовать освобождённое место');
});
