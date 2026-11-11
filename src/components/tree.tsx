import {Rect, Txt} from '@motion-canvas/2d';
import {colors, font} from '../theme';

export function TreeBlock({x = 0, y = 0, keys, width = 440}: {x?: number; y?: number; keys: string[]; width?: number}) {
  return <Rect x={x} y={y} width={width} height={110} radius={8} stroke={colors.muted} lineWidth={3} fill={colors.background}>
    {keys.map((key, i) => <Txt x={(i - (keys.length - 1) / 2) * (width / keys.length)} text={key} fontFamily="Menlo" fontSize={32} fill={colors.foreground} />)}
  </Rect>;
}

export function Caption({text}: {text: string}) {
  return <Txt x={-850} y={365} offsetX={-1} text={text} fontFamily={font} fontSize={34} fontWeight={500} fill={colors.foreground} />;
}
