import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {beginSlide, createRef} from '@motion-canvas/core';
import {colors, font, Frame} from '../theme';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const leaves = createRef<Node>();
  const offsets = createRef<Node>();
  view.add(<>
    <Frame title="Узел направляет поиск. Лист хранит записи." number="08" />
    <Txt y={-310} text="ВНУТРЕННИЙ УЗЕЛ" fontFamily={font} fontSize={27} letterSpacing={3} fill={colors.muted} />
    <Rect y={-205} width={1200} height={150} radius={8} stroke={colors.muted} lineWidth={4} fill={colors.background} />
    <Rect x={-500} y={-205} width={200} height={150} fill={colors.muted} radius={6}>
      <Txt text="Заголовок" fontFamily={font} fontSize={26} fill={colors.background} />
    </Rect>
    {[-170, 330].map((x, i) => <Rect x={x} y={-205} width={440} height={120} radius={5} stroke={colors.accent} lineWidth={2}>
      <Txt text={`ключ ${i + 1}\nадрес дочернего блока`} textAlign="center" fontFamily={font} fontSize={28} lineHeight={43} fill={colors.foreground} />
    </Rect>)}
    <Node ref={leaves} opacity={0}>
      <Line points={[[-170, -130], [-440, 55]]} stroke={colors.muted} lineWidth={5} endArrow arrowSize={17} />
      <Line points={[[330, -130], [440, 55]]} stroke={colors.muted} lineWidth={5} endArrow arrowSize={17} />
      {[-440, 440].map((x, i) => <Node x={x}>
        <Txt x={-330} y={15} text={`ЛИСТ ${i + 1}`} fontFamily={font} fontSize={27} fill={colors.muted} />
        <Rect y={170} width={800} height={230} radius={8} stroke={colors.muted} lineWidth={4} />
        <Rect y={80} width={800} height={50} fill={colors.muted}>
          <Txt text="Заголовок листа" fontFamily={font} fontSize={25} fill={colors.background} />
        </Rect>
        <Rect x={-250} y={195} width={220} height={150} stroke={colors.accent} lineWidth={3} radius={4}>
          <Txt text={`ключ ${i + 1}\noffset · size`} textAlign="center" fontFamily="Menlo" fontSize={25} lineHeight={42} fill={colors.foreground} />
        </Rect>
        <Rect y={195} width={220} height={150} radius={4} stroke={colors.muted} lineWidth={3} lineDash={[12, 9]}>
          <Txt text={'свободное\nместо'} textAlign="center" fontFamily={font} fontSize={25} lineHeight={36} fill={colors.muted} />
        </Rect>
        <Rect x={250} y={195} width={220} height={150} fill={colors.accent} radius={4}>
          <Txt text={`данные ${i + 1}`} fontFamily={font} fontSize={29} fill={colors.background} />
        </Rect>
      </Node>)}
    </Node>
    <Node ref={offsets} opacity={0}>
      {[-440, 440].map(x => <Line points={[[x - 250, 285], [x - 250, 320], [x + 250, 320], [x + 250, 285]]} stroke={colors.foreground} lineWidth={4} endArrow arrowSize={14} />)}
      <Txt y={373} text="В листе: описатели растут →     ← содержимое растёт" fontFamily={font} fontSize={31} fill={colors.foreground} />
    </Node>
    <Txt x={-850} y={408} offsetX={-1} text="Листья упрощены до одной записи. Как в B+ дереве, полезные записи — в листьях." fontFamily={font} fontSize={22} fill={colors.muted} />
  </>);
  yield* beginSlide('Внутренний узел');
  yield* leaves().opacity(1, 0.5);
  yield* beginSlide('Устройство листа');
  yield* offsets().opacity(1, 0.4);
  yield* beginSlide('Описатель и содержимое');
});
