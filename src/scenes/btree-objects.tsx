import {Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {beginSlide, createRef, sequence} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';
import {Caption, TreeBlock} from '../components/tree';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const items = Array.from({length: 9}, () => createRef<Rect>());
  const objects = [300, 300, 301, 301, 301, 301, 301, 302, 302];
  const types = ['A', 'B', 'A', 'B', 'C', 'D', 'E', 'A', 'B'];
  const color = (object: number) => object === 301 ? colors.highlight : object === 300 ? colors.muted : colors.accent;
  view.add(<>
    <Frame title="Одно дерево — много объектов" number="11" />
    <Txt x={-850} y={-305} offsetX={-1} text="Записи упорядочены по ключу, а не разложены по одному объекту на лист" fontFamily={font} fontSize={31} fill={colors.muted} />
    {[-560, 0, 560].map(x => <Line points={[[x * 0.55, -110], [x, 45]]} stroke={colors.accent} lineWidth={3} />)}
    <TreeBlock y={-165} keys={['(300, A, 0)', '(301, B, 0)', '(301, E, 0)']} width={1200} />
    {[-560, 0, 560].map((x, i) => <Rect x={x} y={130} width={490} height={170} radius={8} stroke={colors.muted} lineWidth={3}>
      <Txt y={-60} text={`лист ${i + 1}`} fontFamily={font} fontSize={24} fill={colors.muted} />
    </Rect>)}
    {objects.map((object, i) => <Rect ref={items[i]} x={-560 + Math.floor(i / 3) * 560 + (i % 3 - 1) * 150} y={150} width={135} height={90} radius={4} stroke={colors.accent} lineWidth={2}>
      <Txt text={`${object}\nтип ${types[i]}`} fontFamily="Menlo" fontSize={25} lineHeight={35} fill={colors.foreground} />
    </Rect>)}
    <Txt x={-560} y={280} text="Разные объекты в одном листе" fontFamily={font} fontSize={27} fill={colors.muted} />
    <Txt x={350} y={280} text="Объект 301 занимает несколько листьев" fontFamily={font} fontSize={27} fill={colors.muted} />
    <Caption text="Лист — блок хранения записей, а не отдельный файл или каталог." />
  </>);
  yield* beginSlide('Записи разных объектов');
  yield* sequence(0.08, ...items.map((ref, i) => ref().stroke(color(objects[i]), 0.3)));
  yield* beginSlide('Границы листьев и объектов');
});
