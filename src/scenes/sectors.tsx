import { Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import {
  all,
  beginSlide,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  sequence,
} from "@motion-canvas/core";
import { colors, font, Frame } from "../theme";

export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const pieces = Array.from({ length: 12 }, () => createRef<Rect>());
  const requirements = createRef<Node>();
  const files = [
    { name: "aboba.md", x: -550, color: colors.muted, cells: [0, 1, 2, 3] },
    { name: "photo.jpg", x: 0, color: colors.accent, cells: [7, 8, 9, 10] },
    { name: "music.flac", x: 550, color: colors.highlight, cells: [20, 21, 22, 23] },
  ];
  const cellPosition = (index: number): [number, number] => [
    -765 + (index % 16) * 102,
    70 + Math.floor(index / 16) * 82,
  ];

  view.add(
    <>
      <Frame title="У нас есть диск. Мы хотим хранить файлы" number="02" />
      <Txt
        x={-850}
        y={-325}
        offsetX={-1}
        text="Накопитель — набор небольших адресуемых секторов по ~0.5-4KB"
        fontFamily={font}
        fontSize={34}
        fill={colors.muted}
      />
      {files.map((file) => (
        <Rect
          x={file.x}
          y={-155}
          width={420}
          height={140}
          radius={8}
          stroke={file.color}
          lineWidth={3}
        >
          <Txt y={-32} text={file.name} fontFamily="Menlo" fontSize={28} fill={colors.foreground} />
          {[0, 1, 2, 3].map((i) => (
            <Rect x={-147 + i * 98} y={30} width={90} height={40} radius={3} fill={file.color} />
          ))}
        </Rect>
      ))}
      <Txt
        x={-850}
        y={-15}
        offsetX={-1}
        text="АДРЕСА СЕКТОРОВ"
        fontFamily={font}
        fontSize={21}
        letterSpacing={2}
        fill={colors.muted}
      />
      {Array.from({ length: 48 }, (_, index) => (
        <Rect
          position={cellPosition(index)}
          width={94}
          height={66}
          radius={4}
          stroke={colors.accent}
          lineWidth={2}
        >
          <Txt
            text={String(index).padStart(2, "0")}
            fontFamily="Menlo"
            fontSize={21}
            fill={colors.muted}
          />
        </Rect>
      ))}
      {files.flatMap((file, group) =>
        file.cells.map((cell, i) => (
          <Rect
            ref={pieces[group * 4 + i]}
            x={file.x - 147 + i * 98}
            y={-125}
            width={90}
            height={40}
            opacity={0}
            radius={3}
            fill={file.color}
          >
            <Txt
              text={String(cell).padStart(2, "0")}
              opacity={0}
              fontFamily="Menlo"
              fontSize={21}
              fill={colors.background}
            />
          </Rect>
        )),
      )}
      <Node ref={requirements} opacity={0}>
        {["Быстро", "Экономно", "Устойчиво к сбоям"].map((text, i) => (
          <>
            <Rect x={-830 + i * 560} y={362} width={10} height={36} fill={colors.highlight} />
            <Txt
              x={-800 + i * 560}
              y={362}
              offsetX={-1}
              text={text}
              fontFamily={font}
              fontSize={36}
              fontWeight={500}
              fill={colors.foreground}
            />
          </>
        ))}
      </Node>
    </>,
  );

  yield* beginSlide("Диск и файлы");
  yield* sequence(
    0.15,
    ...files.map((file, group) =>
      sequence(
        0.07,
        ...file.cells.map((cell, i) => {
          const piece = pieces[group * 4 + i]();
          return all(
            piece.opacity(1, 0.12),
            piece.position(cellPosition(cell), 0.8, easeInOutCubic),
            piece.size([94, 66], 0.8, easeInOutCubic),
            (piece.children()[0] as Txt).opacity(1, 0.8),
          );
        }),
      ),
    ),
  );
  yield* requirements().opacity(1, 0.5, easeOutCubic);
  yield* beginSlide("Как разместить файлы");
});
