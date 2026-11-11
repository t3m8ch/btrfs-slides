import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const leaf = createRef<Node>();
  const rows = Array.from({length: 5}, () => createRef<Node>());
  const borders = Array.from({length: 5}, () => createRef<Rect>());
  const keyTexts = Array.from({length: 5}, () => createRef<Txt>());
  const payloadTexts = Array.from({length: 5}, () => createRef<Txt>());
  const tree = createRef<Node>();
  const branches = [createRef<Line>(), createRef<Line>()];
  const children = [createRef<Node>(), createRef<Node>()];
  const keys = [
    '(300, INODE_ITEM, 0)',
    '(300, DIR_ITEM, h("notes.txt"))',
    '(300, DIR_ITEM, h("aboba.md"))',
    '(301, INODE_ITEM, 0)',
    '(301, EXTENT_DATA, 0)',
  ];
  const payloads = [
    'каталог · rwxr-xr-x',
    'notes.txt → 302',
    'aboba.md → 301',
    '128 КиБ · rw-r--r--',
    'Начало: 256 МиБ\nдлина: 128 КиБ',
  ];

  view.add(<>
    <Frame title="Что хранится в листьях FS tree" number="17" />
    <Node ref={leaf}>
      <Rect y={20} width={1700} height={650} radius={18} stroke={colors.muted} lineWidth={4} />
      <Txt x={-790} y={-265} offsetX={-1} text="Лист FS tree" fontFamily={font} fontSize={35} fontWeight={600} fill={colors.foreground} />
      <Line points={[[-790, -226], [790, -226]]} stroke={colors.accent} lineWidth={2} />
      {keys.map((key, i) => <Node ref={rows[i]} y={-160 + i * 105} opacity={0}>
        <Rect ref={borders[i]} width={1580} height={86} radius={7} stroke={colors.accent} lineWidth={2} />
        <Line points={[[210, -42], [210, 42]]} stroke={colors.accent} lineWidth={2} />
        <Txt ref={keyTexts[i]} x={-750} offsetX={-1} text={key} fontFamily="Menlo" fontSize={32} fill={colors.foreground} />
        <Txt ref={payloadTexts[i]} x={500} text={payloads[i]} fontFamily={font} fontSize={i === 4 ? 30 : 34} lineHeight={i === 4 ? 36 : 44} fill={colors.foreground} />
      </Node>)}
    </Node>
    <Node ref={tree} opacity={0}>
      <Txt x={590} y={-265} text="Дерево каталогов" fontFamily={font} fontSize={35} fontWeight={600} fill={colors.foreground} />
      <Rect x={590} y={-100} width={300} height={115} radius={16} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
        <Txt y={-22} text="artem" fontFamily={font} fontSize={35} fontWeight={600} fill={colors.foreground} />
        <Txt y={24} text="300" fontFamily="Menlo" fontSize={28} fill={colors.muted} />
      </Rect>
      {[430, 750].map((x, i) => <Node>
        <Line ref={branches[i]} points={[[590 + (i === 0 ? -60 : 60), -42], [x, 100]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} end={0} />
        <Node ref={children[i]} x={x} y={165} opacity={0}>
          <Rect width={290} height={115} radius={16} stroke={colors.muted} lineWidth={3} />
          <Txt y={-22} text={i === 0 ? 'aboba.md' : 'notes.txt'} fontFamily={font} fontSize={32} fontWeight={600} fill={colors.foreground} />
          <Txt y={24} text={i === 0 ? '301' : '302'} fontFamily="Menlo" fontSize={28} fill={colors.muted} />
        </Node>
      </Node>)}
    </Node>
  </>);

  yield* all(rows[0]().opacity(1, 0.5), rows[3]().opacity(1, 0.5));
  yield* beginSlide('INODE_ITEM — свойства объекта');
  yield* all(rows[1]().opacity(1, 0.5), rows[2]().opacity(1, 0.5));
  yield* beginSlide('DIR_ITEM — имена и связи');
  yield* rows[4]().opacity(1, 0.5);
  yield* beginSlide('EXTENT_DATA — данные файла');

  yield* all(leaf().scale(0.66, 1), leaf().position([-300, 35], 1), tree().opacity(1, 0.8), ...keyTexts.map(ref => ref().fontSize(40, 1)), ...payloadTexts.map((ref, i) => ref().fontSize(i === 4 ? 34 : 40, 1)));
  yield* beginSlide('Из записей каталога строятся связи');
  for (let i = 0; i < 2; i++) {
    yield* all(borders[2 - i]().stroke(colors.foreground, 0.3), borders[2 - i]().lineWidth(5, 0.3));
    yield* all(branches[i]().end(1, 0.7), children[i]().opacity(1, 0.6));
    yield* beginSlide(i === 0 ? 'aboba.md → 301' : 'notes.txt → 302');
  }
});
