import {Code, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';
import fileOperations from '../snippets/file-operations.c?raw';

// Linux v6.12, include/linux/fs.h:2062–2105. Only the selected fields are
// reproduced; comments mark omissions and long declarations are wrapped.
export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const explanation = createRef<Node>();

  view.add(<>
    <Frame title="Интерфейс VFS в исходниках Linux" number="05" />
    <Txt x={-850} y={-325} offsetX={-1} text="file_operations — операции с открытым файлом" fontFamily={font} fontSize={34} fill={colors.muted} />

    <Rect x={-850} y={-235} offset={-1} width={1260} height={500} radius={8} stroke={colors.accent} lineWidth={2} />
    <Code x={-810} y={-210} offset={-1} code={fileOperations.trimEnd()} highlighter={null} fontFamily="Menlo" fontSize={30} lineHeight={40} fill={colors.foreground} />
    {[
      {label: 'Чтение', y: -110},
      {label: 'Запись', y: 10},
      {label: 'Открытие', y: 130},
    ].map(({label, y}) => <Node y={y}>
      <Line points={[[440, 0], [495, 0]]} stroke={colors.highlight} lineWidth={4} />
      <Txt x={520} offsetX={-1} text={label} fontFamily={font} fontSize={34} fontWeight={500} fill={colors.muted} />
    </Node>)}

    <Node ref={explanation} opacity={0}>
      <Txt x={-850} y={315} offsetX={-1} text="Указатели на функции: файловая система задаёт обработчики." fontFamily={font} fontSize={32} fill={colors.foreground} />
    </Node>
    <Txt x={-850} y={373} offsetX={-1} text="Linux v6.12 · include/linux/fs.h · фрагмент, остальные поля опущены" fontFamily={font} fontSize={23} fill={colors.muted} />
    <Txt x={-850} y={409} offsetX={-1} text="github.com/torvalds/linux/blob/v6.12/include/linux/fs.h#L2062-L2105" fontFamily="Menlo" fontSize={21} fill={colors.muted} />
  </>);

  yield* beginSlide('Основные методы file_operations');
  yield* explanation().opacity(1, 0.4);
  yield* beginSlide('Файловая система задаёт обработчики');
});
