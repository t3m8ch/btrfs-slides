import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeOutCubic, sequence} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

// The diagram shows cached VFS objects for a single mount. Arrows between
// dentries represent d_parent, so they point towards the root. Each positive
// dentry refers to an inode; these are not on-disk Btrfs structures.
// Reference: https://docs.kernel.org/filesystems/vfs.html
export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const names = ['/', 'home', 'artem', 'aboba.md'];
  const xs = [-660, -220, 220, 660];
  const dentries = names.map(() => createRef<Node>());
  const inodes = names.map(() => createRef<Node>());
  const parents = Array.from({length: 3}, () => createRef<Line>());
  const inodeLinks = names.map(() => createRef<Line>());
  const inodeLabel = createRef<Txt>();
  const conclusion = createRef<Node>();

  view.add(<>
    <Frame title="Имя файла и сам файл" number="06" />
    <Txt x={-850} y={-315} offsetX={-1} text="/home/artem/aboba.md" fontFamily="Menlo" fontSize={43} fill={colors.foreground} />
    <Txt x={850} y={-315} offsetX={1} text="Объекты VFS в ОЗУ" fontFamily={font} fontSize={28} fill={colors.muted} />

    <Txt x={-850} y={-215} offsetX={-1} text="dentry — имя и связь с родителем" fontFamily={font} fontSize={30} fill={colors.muted} />
    {parents.map((ref, i) => <Line ref={ref} end={0} points={[[xs[i + 1] - 175, -110], [xs[i] + 175, -110]]} stroke={colors.muted} lineWidth={4} endArrow arrowSize={14} />)}
    {names.map((name, i) => <Node ref={dentries[i]} x={xs[i]} y={-110} opacity={0}>
      <Rect width={350} height={112} radius={8} stroke={i === 3 ? colors.highlight : colors.muted} lineWidth={3} fill={colors.background} />
      <Txt text={name} fontFamily="Menlo" fontSize={36} fill={colors.foreground} />
    </Node>)}
    <Txt x={850} y={-215} offsetX={1} text="Стрелки ведут к родителю" fontFamily={font} fontSize={24} fill={colors.muted} />

    <Txt ref={inodeLabel} opacity={0} x={-850} y={320} offsetX={-1} text="inode — объект и его свойства" fontFamily={font} fontSize={28} fill={colors.muted} />
    {inodeLinks.map((ref, i) => <Line ref={ref} end={0} points={[[xs[i], -53], [xs[i], 110]]} stroke={i === 3 ? colors.highlight : colors.accent} lineWidth={3} endArrow arrowSize={12} />)}
    {names.map((_, i) => <Node ref={inodes[i]} x={xs[i]} y={200} opacity={0}>
      <Rect width={350} height={180} radius={8} stroke={i === 3 ? colors.highlight : colors.accent} lineWidth={3} fill={colors.background} />
      <Txt y={-53} text="inode" fontFamily="Menlo" fontSize={31} fontWeight={600} fill={colors.foreground} />
      <Txt y={3} text={i === 3 ? 'файл · 128 КиБ' : 'каталог'} fontFamily={font} fontSize={29} fill={colors.muted} />
      <Txt y={52} text="права · владелец" fontFamily={font} fontSize={24} fill={colors.muted} />
    </Node>)}

    <Node ref={conclusion} opacity={0}>
      <Rect x={-830} y={385} width={10} height={40} fill={colors.highlight} />
      <Txt x={-800} y={385} offsetX={-1} text="Имя хранится в dentry. Свойства объекта — в inode." fontFamily={font} fontSize={36} fontWeight={500} fill={colors.foreground} />
    </Node>
  </>);

  yield* dentries[0]().opacity(1, 0.3);
  yield* beginSlide('Путь состоит из имён');
  for (let i = 1; i < names.length; i++) {
    yield* dentries[i]().opacity(1, 0.3, easeOutCubic);
    yield* parents[i - 1]().end(1, 0.3, easeOutCubic);
  }
  yield* beginSlide('Цепочка dentry');
  yield* inodeLabel().opacity(1, 0.3);
  yield* sequence(0.15, ...inodes.map((ref, i) => all(
    inodeLinks[i]().end(1, 0.4),
    ref().opacity(1, 0.5),
  )));
  yield* conclusion().opacity(1, 0.4);
  yield* beginSlide('Имя и объект в памяти');
});
