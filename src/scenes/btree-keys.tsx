import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeInOutCubic} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

type Key = {objectid: number; type: number; offset: number};
const format = (key: Key) => `(${key.objectid}, ${key.type}, ${key.offset})`;
const compare = (a: Key, b: Key) => a.objectid - b.objectid || a.type - b.type || a.offset - b.offset;

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  // The unsorted state is an educational construction, never a valid Btrfs leaf.
  const keys: Key[] = [
    {objectid: 302, type: 12, offset: 64}, {objectid: 300, type: 12, offset: 64},
    {objectid: 303, type: 1, offset: 0}, {objectid: 301, type: 12, offset: 64},
    {objectid: 300, type: 1, offset: 0}, {objectid: 302, type: 1, offset: 0},
    {objectid: 301, type: 12, offset: 0}, {objectid: 303, type: 12, offset: 64},
    {objectid: 302, type: 12, offset: 0}, {objectid: 300, type: 12, offset: 0},
    {objectid: 303, type: 12, offset: 0}, {objectid: 301, type: 1, offset: 0},
  ];
  const items = keys.map(() => createRef<Rect>());
  const texts = keys.map(() => createRef<Txt>());
  const block = createRef<Rect>();
  const blockLabel = createRef<Txt>();
  const legend = createRef<Node>();
  const objectGroups = createRef<Node>();
  const typeGroups = createRef<Node>();
  const tree = createRef<Node>();
  const query = createRef<Txt>();
  const status = createRef<Txt>();
  const pointer = createRef<Line>();
  const rootPath = createRef<Line>();
  const leafPath = createRef<Line>();
  const leafXs = [-645, -215, 215, 645];
  const slot = (i: number): [number, number] => [-540 + (i % 3) * 540, -75 + Math.floor(i / 3) * 110];
  const sorted = keys.map((_, i) => i).sort((a, b) => compare(keys[a], keys[b]));
  const target = keys.findIndex(k => k.objectid === 302 && k.type === 12 && k.offset === 64);

  view.add(<>
    <Frame title="От ключа к поиску записи" number="09" />
    <Node ref={legend}>
      {['objectid', 'type', 'offset'].map((label, i) => <Node x={-540 + i * 540}>
        <Txt y={-320} text={label} fontFamily="Menlo" fontSize={38} fill={colors.foreground} />
        <Txt y={-265} text={['Номер файла или каталога', 'Вид записи', 'Значение зависит от типа'][i]} fontFamily={font} fontSize={27} fill={colors.muted} />
      </Node>)}
    </Node>
    <Rect ref={block} y={60} width={1690} height={530} radius={9} stroke={colors.muted} lineWidth={4} />
    <Txt ref={blockLabel} y={-165} text="Учебный пример: пока расположим записи вразнобой" fontFamily={font} fontSize={26} fill={colors.muted} />
    <Node ref={objectGroups} opacity={0}>
      {[0, 1, 2, 3].map(i => <Rect y={-75 + i * 110} width={1600} height={94} radius={7} stroke={colors.foreground} lineWidth={3} lineDash={[13, 9]} />)}
    </Node>
    <Node ref={typeGroups} opacity={0}>
      {[0, 1, 2, 3].map(i => <Rect x={270} y={-75 + i * 110} width={1030} height={94} radius={7} stroke={colors.foreground} lineWidth={5} />)}
    </Node>
    <Node ref={tree} opacity={0}>
      {[-1, 1].map(side => <Line points={[[side * 210, -160], [side * 430, -85]]} stroke={colors.accent} lineWidth={3} />)}
      {leafXs.map((x, i) => <Line points={[[i < 2 ? -630 + i * 400 : 230 + (i - 2) * 400, 15], [x, 108]]} stroke={colors.accent} lineWidth={3} />)}
      <Rect y={-205} width={900} height={90} radius={8} stroke={colors.muted} lineWidth={4} fill={colors.background}>
        <Txt x={-220} text="≥ (300, 1, 0)" fontFamily="Menlo" fontSize={27} fill={colors.foreground} />
        <Txt x={220} text="≥ (302, 1, 0)" fontFamily="Menlo" fontSize={27} fill={colors.foreground} />
      </Rect>
      <Txt x={-610} y={-205} text="корень" fontFamily={font} fontSize={27} fill={colors.muted} />
      {[-430, 430].map((x, i) => <Rect x={x} y={-35} width={810} height={100} radius={8} stroke={colors.muted} lineWidth={4} fill={colors.background}>
        <Txt x={-200} text={`≥ (${300 + i * 2}, 1, 0)`} fontFamily="Menlo" fontSize={26} fill={colors.foreground} />
        <Txt x={200} text={`≥ (${301 + i * 2}, 1, 0)`} fontFamily="Menlo" fontSize={26} fill={colors.foreground} />
      </Rect>)}
      {leafXs.map((x, i) => <Node x={x}>
        <Rect y={195} width={405} height={175} radius={7} stroke={colors.muted} lineWidth={3} fill={colors.background} />
        <Txt y={310} text={`лист · объект ${300 + i}`} fontFamily={font} fontSize={25} fill={colors.muted} />
      </Node>)}
    </Node>
    <Line ref={rootPath} end={0} points={[[210, -160], [430, -85]]} stroke={colors.foreground} lineWidth={7} endArrow arrowSize={16} />
    <Line ref={leafPath} end={0} points={[[230, 15], [215, 108]]} stroke={colors.foreground} lineWidth={7} endArrow arrowSize={16} />
    {keys.map((key, i) => <Rect ref={items[i]} position={slot(i)} width={460} height={78} radius={5} stroke={colors.accent} lineWidth={2} fill={colors.background}>
      <Txt ref={texts[i]} text={format(key)} fontFamily="Menlo" fontSize={32} fill={colors.foreground} />
    </Rect>)}
    <Txt ref={query} y={-320} opacity={0} text="Ищем запись (302, 12, 64)" fontFamily={font} fontSize={39} fontWeight={500} fill={colors.foreground} />
    <Line ref={pointer} opacity={0} points={[[0, -60], [0, 0]]} stroke={colors.foreground} lineWidth={7} endArrow arrowSize={19} />
    <Txt ref={status} y={385} text="Одна запись — один ключ из трёх числовых полей." fontFamily={font} fontSize={32} fill={colors.foreground} />
  </>);

  function* arrange(order: number[]) {
    yield* all(...order.map((index, rank) => items[index]().position(slot(rank), 0.9, easeInOutCubic)));
  }
  yield* beginSlide('Блок с кортежами');
  status().text('Сначала сравниваем objectid: собираем записи одного объекта.');
  yield* arrange(keys.map((_, i) => i).sort((a, b) => keys[a].objectid - keys[b].objectid));
  yield* objectGroups().opacity(1, 0.3);
  blockLabel().text('Каждая строка — записи одного объекта');
  yield* beginSlide('Сортируем по objectid');
  status().text('При равных objectid сравниваем type: одинаковые типы идут рядом.');
  yield* arrange(keys.map((_, i) => i).sort((a, b) => keys[a].objectid - keys[b].objectid || keys[a].type - keys[b].type));
  yield* typeGroups().opacity(1, 0.3);
  yield* beginSlide('Внутри объекта сортируем по type');
  status().text('При равных objectid и type сравниваем offset: 0 перед 64.');
  yield* arrange(sorted);
  blockLabel().text('Теперь описатели упорядочены, как в настоящем листе Btrfs');
  yield* beginSlide('Завершаем сортировку по offset');

  yield* all(block().opacity(0, 0.3), blockLabel().opacity(0, 0.3), legend().opacity(0, 0.3), objectGroups().opacity(0, 0.3), typeGroups().opacity(0, 0.3));
  yield* all(tree().opacity(1, 0.6), query().opacity(1, 0.6), ...sorted.map((index, rank) => all(
    items[index]().position([leafXs[Math.floor(rank / 3)], 150 + (rank % 3) * 45], 1, easeInOutCubic),
    items[index]().size([365, 40], 1), texts[index]().fontSize(24, 1),
  )));
  status().text('Те же записи в листьях. Внутренние узлы хранят границы и ссылки.');
  yield* beginSlide('Дерево с составными ключами');
  pointer().position([220, -255]);
  yield* pointer().opacity(1, 0.25);
  status().text('(302, 12, 64) ≥ (302, 1, 0): выбираем правую ветвь корня.');
  yield* beginSlide('Выбираем ветвь корня');
  yield* rootPath().end(1, 0.5);
  yield* pointer().position([230, -95], 0.45);
  status().text('(302, 1, 0) ≤ ключ < (303, 1, 0): идём в лист объекта 302.');
  yield* beginSlide('Выбираем ветвь промежуточного узла');
  yield* leafPath().end(1, 0.5);
  // Binary search in the selected three-item leaf: middle item, then last item.
  yield* pointer().position([400, 195], 0.5);
  pointer().points([[0, -30], [0, 0]]);
  yield* pointer().rotation(90, 0.3);
  status().text('В листе: (302, 12, 0) меньше искомого ключа. Ищем правее.');
  yield* beginSlide('Поиск внутри листа');
  yield* pointer().y(240, 0.4);
  yield* all(items[target]().lineWidth(5, 0.3), items[target]().stroke(colors.foreground, 0.3));
  status().text('Нашли (302, 12, 64): корень → промежуточный узел → лист.');
  yield* beginSlide('Запись найдена');
});
