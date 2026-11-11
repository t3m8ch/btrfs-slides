import {Img, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, beginSlide, createRef, easeOutCubic} from '@motion-canvas/core';
import {colors, font} from '../theme';
import meme from '../assets/btrfs-meme.png';

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const title = createRef<Txt>();
  const picture = createRef<Img>();
  const accent = createRef<Rect>();
  view.add(<>
    <Txt ref={title} x={-850} y={-100} offsetX={-1} text={"Спасибо\nза внимание!"} fontFamily={font} fontSize={100} fontWeight={600} letterSpacing={-3} lineHeight={120} fill={colors.foreground} opacity={0} />
    <Rect ref={accent} x={-800} y={100} width={100} height={10} fill={colors.highlight} scaleX={0} />
    <Img ref={picture} src={meme} x={490} y={-10} height={790} opacity={0} scale={0.96} />
    <Line points={[[-850, 435], [850, 435]]} stroke={colors.border} lineWidth={2} />
    <Txt x={-850} y={483} offsetX={-1} text="Артём Кудяков" fontFamily={font} fontSize={28} fill={colors.foreground} />
    <Txt x={850} y={483} offsetX={1} text="32" fontFamily="Menlo" fontSize={24} fill={colors.muted} />
  </>);
  yield* all(title().opacity(1, 0.7), accent().scale.x(1, 0.7, easeOutCubic));
  yield* all(picture().opacity(1, 0.7), picture().scale(1, 0.8, easeOutCubic));
  yield* beginSlide('Спасибо за внимание!');
});
