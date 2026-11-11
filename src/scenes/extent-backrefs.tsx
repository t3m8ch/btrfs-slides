import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';
import {snapshotDeletion} from '../components/snapshot-deletion';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const backrefDiagram = createRef<Node>();
  const ownerNames = [createRef<Txt>(), createRef<Txt>()];
  const ownerKeys = [createRef<Txt>(), createRef<Txt>()];
  const owners = [createRef<Rect>(), createRef<Rect>()];
  const forwards = [createRef<Line>(), createRef<Line>()];
  const extent = createRef<Rect>();
  const extentGroup = createRef<Node>();
  const oldCount = createRef<Txt>();
  const backrefBox = createRef<Rect>();
  const damage = createRef<Node>();
  const relocated = createRef<Node>();
  const relocatedCount = createRef<Txt>();
  const newAddresses = [createRef<Txt>(), createRef<Txt>()];
  const backrefs = createRef<Node>();
  const reverseLinks = [createRef<Line>(), createRef<Line>()];
  const levels = createRef<Node>();
  const snapshot = createRef<Node>();
  const snapshotLink = createRef<Line>();
  const nodeCount = createRef<Txt>();
  const leafCounts = [createRef<Txt>(), createRef<Txt>()];
  const dataCount = createRef<Txt>();
  const newNodeCount = createRef<Txt>();
  const newLeafCount = createRef<Txt>();
  const stops = [createRef<Node>(), createRef<Node>()];
  const newNode = createRef<Node>();
  const newLeaf = createRef<Node>();
  const copiedEdges = [createRef<Line>(), createRef<Line>()];
  const leafDataEdge = createRef<Line>();
  const caption = createRef<Txt>();
  view.add(<>
    <Frame title="Кто ссылается на экстент" number="24" />
    <Node ref={backrefDiagram}>
      {[-210, 10].map((y, i) => <Node>
        <Rect ref={owners[i]} x={-500} y={y} width={650} height={110} radius={12} stroke={colors.muted} lineWidth={3}>
          <Txt ref={ownerNames[i]} y={-23} text={i === 0 ? 'aboba.md · 301' : 'copy.md · 303'} fontFamily={font} fontSize={33} fontWeight={600} fill={colors.foreground} />
          <Txt ref={newAddresses[i]} y={75} text="disk_bytenr = 512 МиБ" fontFamily="Menlo" fontSize={27} fill={colors.foreground} opacity={0} />
          <Txt ref={ownerKeys[i]} y={24} text={`(${i === 0 ? 301 : 303}, EXTENT_DATA, 0)`} fontFamily="Menlo" fontSize={27} fill={colors.foreground} />
        </Rect>
        <Line ref={forwards[i]} points={[[-170, y], [325, i === 0 ? -160 : -40]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={13} />
      </Node>)}
      <Node ref={extentGroup}>
      <Rect ref={extent} x={550} y={-100} width={440} height={220} radius={14} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
        <Txt y={-48} text="256 МиБ · 128 КиБ" fontFamily={font} fontSize={31} fill={colors.foreground} />
        <Txt ref={oldCount} y={35} text="refs = 2" fontFamily="Menlo" fontSize={44} fill={colors.foreground} />
      </Rect>
      </Node>
      <Node ref={damage} opacity={0}>
        <Line points={[[690, -195], [750, -135]]} stroke={colors.foreground} lineWidth={6} />
        <Line points={[[750, -195], [690, -135]]} stroke={colors.foreground} lineWidth={6} />
      </Node>
      <Node ref={relocated} x={550} y={-100} opacity={0}>
        <Rect width={440} height={220} radius={14} fill={'#E1E7CE'} stroke={colors.foreground} lineWidth={4} />
        <Txt y={-48} text="512 МиБ · 128 КиБ" fontFamily={font} fontSize={31} fill={colors.foreground} />
        <Txt ref={relocatedCount} y={35} text="refs = 0" fontFamily="Menlo" fontSize={44} fill={colors.foreground} />
      </Node>
      <Line ref={reverseLinks[0]} points={[[550, -215], [550, -290], [-500, -290], [-500, -270]]} radius={12} stroke={colors.muted} lineWidth={4} lineDash={[12, 8]} endArrow arrowSize={13} end={0} />
      <Line ref={reverseLinks[1]} points={[[775, -60], [820, -60], [820, 110], [-500, 110], [-500, 70]]} radius={12} stroke={colors.muted} lineWidth={4} lineDash={[12, 8]} endArrow arrowSize={13} end={0} />
      <Node ref={backrefs} opacity={0}>
        <Rect ref={backrefBox} y={270} width={1700} height={250} radius={14} stroke={colors.muted} lineWidth={3} />
        <Txt x={-780} y={190} offsetX={-1} text="Extent tree · обратные ссылки" fontFamily={font} fontSize={34} fontWeight={600} fill={colors.foreground} />
        <Txt x={-780} y={270} offsetX={-1} text="root = 5,  objectid = 301,  offset = 0" fontFamily="Menlo" fontSize={32} fill={colors.foreground} />
        <Txt x={-780} y={335} offsetX={-1} text="root = 5,  objectid = 303,  offset = 0" fontFamily="Menlo" fontSize={32} fill={colors.foreground} />
      </Node>
    </Node>
    <Node ref={levels} opacity={0}>
      <Rect x={-450} y={-240} width={370} height={90} radius={12} stroke={colors.muted} lineWidth={3}>
        <Txt text="Корень подтома" fontFamily={font} fontSize={32} fill={colors.foreground} />
      </Rect>
      <Node ref={snapshot} x={-450} y={-240} opacity={0}>
        <Rect width={370} height={90} radius={12} stroke={colors.muted} lineWidth={3} />
        <Txt text="Корень снимка" fontFamily={font} fontSize={32} fill={colors.foreground} />
      </Node>
      <Line points={[[-450, -195], [0, -100]]} stroke={colors.muted} lineWidth={3} />
      <Line ref={snapshotLink} points={[[450, -195], [0, -100]]} stroke={colors.foreground} lineWidth={4} end={0} />
      {[-400, 400].map((x, i) => <Node>
        <Line points={[[0, -10], [x, 95]]} stroke={colors.muted} lineWidth={3} />
        <Line points={[[x, 185], [x, 290]]} stroke={colors.muted} lineWidth={3} />
        <Rect x={x} y={140} width={260} height={90} radius={9} stroke={colors.muted} lineWidth={3}>
          <Txt y={-20} text="Лист" fontFamily={font} fontSize={31} fill={colors.foreground} />
          <Txt ref={leafCounts[i]} y={23} text="refs = 1" fontFamily="Menlo" fontSize={27} fill={colors.foreground} />
        </Rect>
        <Rect x={x} y={330} width={300} height={80} radius={8} fill={'#E1E7CE'} stroke={colors.muted} lineWidth={3}>
          <Txt y={-18} text="Данные" fontFamily={font} fontSize={29} fill={colors.foreground} />
          {i === 0 ? <Txt ref={dataCount} y={23} text="refs = 1" fontFamily="Menlo" fontSize={26} fill={colors.foreground} /> : <Txt y={23} text="refs = 1" fontFamily="Menlo" fontSize={26} fill={colors.foreground} />}
        </Rect>
      </Node>)}
      <Rect y={-55} width={300} height={90} radius={9} stroke={colors.muted} lineWidth={3}>
        <Txt y={-20} text="Узел" fontFamily={font} fontSize={31} fill={colors.foreground} />
        <Txt ref={nodeCount} y={23} text="refs = 1" fontFamily="Menlo" fontSize={27} fill={colors.foreground} />
      </Rect>
      <Line ref={copiedEdges[0]} points={[[600, -10], [-400, 95]]} stroke={colors.foreground} lineWidth={4} end={0} />
      <Line ref={copiedEdges[1]} points={[[600, -10], [400, 95]]} stroke={colors.foreground} lineWidth={4} end={0} />
      <Node ref={newNode} x={0} y={-55} opacity={0}>
        <Rect width={300} height={90} radius={9} fill={'#E1E7CE'} stroke={colors.foreground} lineWidth={4} />
        <Txt y={-20} text="Узел′" fontFamily={font} fontSize={31} fill={colors.foreground} />
        <Txt ref={newNodeCount} y={23} text="refs = 1" fontFamily="Menlo" fontSize={27} fill={colors.foreground} />
      </Node>
      <Line ref={leafDataEdge} points={[[750, 185], [-400, 290]]} stroke={colors.foreground} lineWidth={4} end={0} />
      <Node ref={newLeaf} x={-400} y={140} opacity={0}>
        <Rect width={220} height={90} radius={9} fill={'#E1E7CE'} stroke={colors.foreground} lineWidth={4} />
        <Txt y={-20} text="Лист′" fontFamily={font} fontSize={31} fill={colors.foreground} />
        <Txt ref={newLeafCount} y={23} text="refs = 1" fontFamily="Menlo" fontSize={27} fill={colors.foreground} />
      </Node>
      {[[400, 210], [-400, 265]].map(([x, y], i) => <Node ref={stops[i]} x={x} y={y} opacity={0}>
        <Line points={[[-45, 0], [45, 0]]} stroke={colors.foreground} lineWidth={7} />
        <Txt x={i === 0 ? 210 : -230} text="Обход останавливаем" fontFamily={font} fontSize={27} fill={colors.foreground} />
      </Node>)}
    </Node>
    <Txt ref={caption} y={-335} text="" fontFamily={font} fontSize={33} fontWeight={600} fill={colors.foreground} />
  </>);
  yield* beginSlide('Прямые ссылки на данные');
  yield* all(backrefs().opacity(1, 0.5), ...reverseLinks.map(ref => ref().end(1, 0.9)), caption().text('Обратные ссылки: от экстента к владельцам', 0.4));
  yield* beginSlide('Обратные ссылки в extent tree');
  yield* all(extent().stroke(colors.highlight, 0.4), extent().lineWidth(5, 0.4), damage().opacity(1, 0.4), caption().text('Повреждён экстент — какие файлы затронуты?', 0.4), ...owners.map(ref => ref().lineWidth(5, 0.4)));
  yield* beginSlide('Повреждение — находим затронутые файлы');
  yield* all(damage().opacity(0, 0.3), extent().stroke(colors.muted, 0.3), extent().lineWidth(3, 0.3), ...reverseLinks.map(ref => ref().opacity(0, 0.3)), backrefBox().width(900, 0.7), backrefBox().position.x(-400, 0.7), caption().text('Уменьшаем ФС — переносим экстент', 0.4));
  yield* all(relocated().opacity(1, 0.3), relocated().position.y(270, 1));
  yield* beginSlide('Перенос — данные на новом месте');
  yield* all(forwards[0]().points([[-170, -160], [150, -160], [150, 210], [325, 210]], 0.9), forwards[1]().points([[-170, 60], [100, 60], [100, 330], [325, 330]], 0.9), ...owners.map(ref => ref().height(200, 0.9)), ...ownerNames.map(ref => ref().position.y(-50, 0.9)), ...ownerKeys.map(ref => ref().position.y(0, 0.9)), ...newAddresses.map(ref => all(ref().opacity(1, 0.9), ref().position.y(50, 0.9))), oldCount().text('refs = 0', 0.5), relocatedCount().text('refs = 2', 0.5), extentGroup().opacity(0.35, 0.7), caption().text('По backrefs обновляем ссылки обоих файлов', 0.4));
  yield* beginSlide('Перенос — обновили все ссылки');
  yield* all(backrefDiagram().opacity(0, 0.5), levels().opacity(1, 0.6), caption().text('Ссылки учитываются по уровням дерева', 0.4));
  yield* beginSlide('До создания снимка');
  yield* all(snapshot().opacity(1, 0.3), snapshot().position.x(450, 0.9), snapshotLink().end(1, 0.9), nodeCount().text('refs = 2', 0.4), caption().text('Снимок: меняются ссылки на детей корня', 0.4));
  yield* beginSlide('Снимок не обходит всё дерево');
  yield* all(newNode().opacity(1, 0.3), newNode().position.x(600, 1), snapshotLink().points([[450, -195], [600, -100]], 1), nodeCount().text('refs = 1', 0.5), ...copiedEdges.map(ref => ref().end(1, 1)), ...leafCounts.map(ref => ref().text('refs = 2', 0.5)), caption().text('Копируем узел — учитываем ссылки на его детей', 0.4));
  yield* beginSlide('Копия узла добавляет ссылки на листья');
  yield* all(newLeaf().opacity(1, 0.3), newLeaf().position.x(750, 1), copiedEdges[0]().points([[600, -10], [750, 95]], 1), leafDataEdge().end(1, 1), leafCounts[0]().text('refs = 1', 0.5), dataCount().text('refs = 2', 0.5), caption().text('Копируем лист — учитываем его ссылки на данные', 0.4));
  yield* beginSlide('До данных доходим при копировании листа');
  yield* all(levels().opacity(0, 0.5), caption().opacity(0, 0.5));
  yield* snapshotDeletion(view);
});
