import {Line, Rect, Txt} from '@motion-canvas/2d';

export const colors = {
  background: '#F3F6F4',
  foreground: '#27301F',
  muted: '#5B6E2C',
  accent: '#7D8D39',
  highlight: '#FF5A22',
  border: '#7D8D39',
};

export const font = 'Helvetica Neue';

export function Frame({title, number}: {title: string; number: string}) {
  return <>
    <Rect x={-842} y={-425} width={16} height={48} fill={colors.highlight} />
    <Txt x={-800} y={-425} offsetX={-1} text={title} fontFamily={font} fontSize={64} fontWeight={600} letterSpacing={-2} fill={colors.foreground} />
    <Line points={[[-850, 435], [850, 435]]} stroke={colors.border} lineWidth={2} />
    <Txt x={-850} y={483} offsetX={-1} text="Как устроен BTRFS" fontFamily={font} fontSize={24} fill={colors.muted} />
    <Txt x={850} y={483} offsetX={1} text={number} fontFamily="Menlo" fontSize={24} fill={colors.muted} />
  </>;
}
