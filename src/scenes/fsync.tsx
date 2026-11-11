import { Line, Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { all, beginSlide, createRef } from "@motion-canvas/core";
import { colors, font, Frame } from "../theme";

// Fast fsync path, with the log-root tree and per-subvolume log drawn together.
// Data extents are persisted outside the tree log. Some cases require full commit.
// https://btrfs.readthedocs.io/en/latest/btrfs-man5.html
export default makeScene2D(function* (view) {
  view.fill(colors.background);
  const memory = createRef<Node>();
  const disk = createRef<Node>();
  const cache = Array.from({ length: 3 }, () => createRef<Rect>());
  const call = createRef<Txt>();
  const superblock = createRef<Rect>();
  const logField = createRef<Txt>();
  const rootField = createRef<Txt>();
  const root = createRef<Rect>();
  const fs = createRef<Rect>();
  const fileState = createRef<Txt>();
  const log = createRef<Rect>();
  const bytes = createRef<Rect>();
  const packet = createRef<Rect>();
  const dataWrite = createRef<Line>();
  const logWrite = createRef<Line>();
  const rootPointer = createRef<Line>();
  const fsPointer = createRef<Line>();
  const logPointer = createRef<Line>();
  const replay = createRef<Line>();
  const dataPointer = createRef<Line>();
  const caption = createRef<Txt>();
  const phase = createRef<Txt>();
  const blackout = createRef<Rect>();
  view.add(
    <>
    <Frame title="Что делает fsync" number="31" />
      <Txt
        ref={phase}
        y={-335}
        text="Изменения копятся в памяти"
        fontFamily={font}
        fontSize={34}
        fill={colors.muted}
      />
      <Node ref={memory}>
        <Rect
          x={-570}
          y={10}
          width={540}
          height={580}
          radius={22}
          stroke={colors.muted}
          lineWidth={3}
          lineDash={[12, 8]}
        />
        <Txt
          x={-570}
          y={-235}
          text="ОЗУ · кэш"
          fontFamily={font}
          fontSize={35}
          fontWeight={600}
          fill={colors.foreground}
        />
        {[-125, 15, 155].map((y, i) => (
          <Rect
            ref={cache[i]}
            x={-570}
            y={y}
            width={450}
            height={100}
            radius={9}
            stroke={colors.muted}
            lineWidth={3}
            fill={i === 0 ? "#FFE0D3" : "#E1E7CE"}
            opacity={0}
          >
            <Txt
              y={-22}
              text={["aboba.md", "copy.md", "notes.txt"][i]}
              fontFamily={font}
              fontSize={31}
              fontWeight={600}
              fill={colors.foreground}
            />
            <Txt
              y={25}
              text={i === 0 ? "Новые 4 КиБ + метаданные" : "Другие изменения"}
              fontFamily={font}
              fontSize={27}
              fill={colors.foreground}
            />
          </Rect>
        ))}
      </Node>
      <Node ref={disk}>
        <Rect
          x={325}
          y={10}
          width={990}
          height={580}
          radius={22}
          stroke={colors.muted}
          lineWidth={3}
        />
        <Txt
          x={760}
          y={-245}
          offsetX={1}
          text="На устройстве"
          fontFamily={font}
          fontSize={29}
          fill={colors.muted}
        />
        <Rect
          ref={superblock}
          x={300}
          y={-190}
          width={460}
          height={125}
          radius={10}
          stroke={colors.foreground}
          lineWidth={3}
        >
          <Txt
            y={-38}
            text="Суперблок"
            fontFamily={font}
            fontSize={31}
            fontWeight={600}
            fill={colors.foreground}
          />
          <Txt
            ref={rootField}
            y={5}
            text="root = прежний Root tree"
            fontFamily="Menlo"
            fontSize={23}
            fill={colors.foreground}
          />
          <Txt
            ref={logField}
            y={43}
            text="log_root = 0"
            fontFamily="Menlo"
            fontSize={23}
            fill={colors.foreground}
          />
        </Rect>
        <Line
          ref={rootPointer}
          points={[
            [150, -127],
            [50, -95],
            [50, -75],
          ]}
          radius={10}
          stroke={colors.foreground}
          lineWidth={4}
          endArrow
        />
        <Line
          ref={fsPointer}
          points={[
            [50, 5],
            [50, 75],
          ]}
          stroke={colors.muted}
          lineWidth={3}
          endArrow
        />
        <Rect
          ref={root}
          x={50}
          y={-35}
          width={300}
          height={80}
          radius={9}
          stroke={colors.muted}
          lineWidth={3}
          fill={"#E1E7CE"}
        >
          <Txt text="Root tree" fontFamily={font} fontSize={32} fill={colors.foreground} />
        </Rect>
        <Rect
          ref={fs}
          x={50}
          y={145}
          width={320}
          height={140}
          radius={10}
          stroke={colors.muted}
          lineWidth={3}
          fill={"#E1E7CE"}
        >
          <Txt
            y={-35}
            text="FS tree"
            fontFamily={font}
            fontSize={32}
            fontWeight={600}
            fill={colors.foreground}
          />
          <Txt
            ref={fileState}
            y={25}
            text={"aboba.md\nпрежние записи"}
            fontFamily={font}
            fontSize={27}
            fill={colors.foreground}
          />
        </Rect>
        <Rect
          ref={log}
          x={590}
          y={0}
          width={360}
          height={150}
          radius={10}
          stroke={colors.foreground}
          lineWidth={4}
          fill={"#E1E7CE"}
          opacity={0}
        >
          <Txt
            y={-45}
            text="Tree log"
            fontFamily={font}
            fontSize={33}
            fontWeight={600}
            fill={colors.foreground}
          />
          <Txt
            y={18}
            text={"aboba.md\nINODE_ITEM · EXTENT_DATA"}
            fontFamily="Menlo"
            fontSize={23}
            fill={colors.foreground}
          />
        </Rect>
        <Rect
          ref={bytes}
          x={590}
          y={225}
          width={360}
          height={80}
          radius={8}
          fill={"#FFE0D3"}
          stroke={colors.highlight}
          lineWidth={4}
          opacity={0}
        >
          <Txt text="Новые 4 КиБ" fontFamily={font} fontSize={31} fill={colors.foreground} />
        </Rect>
        <Line
          ref={dataWrite}
          points={[
            [-345, -125],
            [-265, -125],
            [-265, 255],
            [395, 255],
          ]}
          radius={12}
          stroke={colors.foreground}
          lineWidth={4}
          endArrow
          end={0}
        />
        <Line
          ref={logWrite}
          points={[
            [-345, -125],
            [-230, -125],
            [-230, -95],
            [590, -95],
            [590, -75],
          ]}
          radius={10}
          stroke={colors.foreground}
          lineWidth={4}
          endArrow
          end={0}
        />
        <Line
          ref={logPointer}
          points={[
            [450, -127],
            [590, -100],
            [590, -75],
          ]}
          radius={10}
          stroke={colors.foreground}
          lineWidth={4}
          endArrow
          end={0}
        />
        <Line
          ref={replay}
          points={[
            [410, 0],
            [270, 0],
            [270, 145],
            [210, 145],
          ]}
          radius={12}
          stroke={colors.foreground}
          lineWidth={5}
          endArrow
          arrowSize={17}
          end={0}
        />
        <Line
          ref={dataPointer}
          points={[
            [210, 185],
            [300, 185],
            [300, 225],
            [410, 225],
          ]}
          radius={10}
          stroke={colors.foreground}
          lineWidth={4}
          endArrow
          end={0}
        />
      </Node>
      <Rect
        ref={packet}
        x={-570}
        y={-125}
        width={360}
        height={80}
        radius={8}
        fill={"#FFE0D3"}
        stroke={colors.highlight}
        lineWidth={4}
        opacity={0}
      >
        <Txt text="Новые 4 КиБ" fontFamily={font} fontSize={31} fill={colors.foreground} />
      </Rect>
      <Txt
        ref={call}
        x={-570}
        y={345}
        text="fsync(aboba.md)"
        fontFamily="Menlo"
        fontSize={34}
        fill={colors.foreground}
        opacity={0}
      />
      <Txt
        ref={caption}
        y={395}
        text=""
        fontFamily={font}
        fontSize={32}
        fontWeight={600}
        fill={colors.foreground}
      />
      <Rect ref={blackout} width={1920} height={1080} fill={colors.foreground} opacity={0}>
        <Txt
          text="БАЦ! Питание отключено"
          fontFamily={font}
          fontSize={54}
          fill={colors.background}
        />
      </Rect>
    </>,
  );
  for (const item of cache) yield* item().opacity(1, 0.4);
  yield* beginSlide("Изменения нескольких файлов накопились в кэше");
  yield* all(
    call().opacity(1, 0.5),
    cache[0]().lineWidth(5, 0.5),
    phase().text("Вызываем fsync для aboba.md", 0.4),
  );
  yield* beginSlide("fsync — сохраняем изменения выбранного файла");
  yield* all(dataWrite().end(1, 0.7), packet().opacity(1, 0.3));
  yield* packet().position([-570, 255], 0.6);
  yield* packet().position([590, 225], 1);
  yield* all(
    bytes().opacity(1, 0.3),
    packet().opacity(0, 0.3),
    dataWrite().opacity(0, 0.3),
    caption().text("Байты файла записываем в экстенты данных", 0.4),
  );
  yield* beginSlide("Данные файла записаны на устройство");
  yield* all(
    logWrite().end(1, 0.8),
    log().opacity(1, 0.8),
    phase().text("В Tree log сохраняем необходимые метаданные файла", 0.4),
    caption().text("Полную транзакцию в этом примере пока не фиксируем", 0.4),
  );
  yield* beginSlide("Метаданные для восстановления записаны в Tree log");
  yield* logWrite().opacity(0, 0.3);
  yield* all(logField().text("log_root → Tree log", 0.6), logPointer().end(1, 0.7));
  yield* all(
    call().text("fsync вернул 0", 0.4),
    phase().text("Данные и лог сохранены, указатель на лог — в суперблоке", 0.4),
    caption().text("Изменения aboba.md переживут отключение питания", 0.4),
  );
  yield* beginSlide("fsync успешно завершился — файл сохранён");
  yield* blackout().opacity(1, 0.65);
  yield* beginSlide("Питание отключилось после fsync");
  memory().opacity(0);
  disk().position.x(-325);
  call().opacity(0);
  rootPointer().end(0);
  fsPointer().end(0);
  logPointer().end(0);
  for (const item of [superblock, root, fs, log, bytes]) item().opacity(0.15);
  phase().text("Повторный запуск · читаем суперблок");
  caption().text("Кэш потерян. Данные и Tree log остались на устройстве");
  yield* blackout().opacity(0, 0.6);
  yield* superblock().opacity(1, 0.7);
  yield* beginSlide("Перезапуск — читаем суперблок и находим Tree log");
  yield* all(rootPointer().end(1, 0.7), root().opacity(1, 0.7));
  yield* all(
    fsPointer().end(1, 0.7),
    fs().opacity(1, 0.7),
    phase().text("Открываем состояние последней полной фиксации", 0.4),
  );
  yield* beginSlide("FS tree пока содержит прежние записи");
  yield* all(
    logPointer().end(1, 0.7),
    log().opacity(1, 0.7),
    bytes().opacity(1, 0.7),
    phase().text("Читаем Tree log и воспроизводим изменения", 0.4),
  );
  yield* replay().end(1, 0.8);
  yield* all(
    fileState().text("aboba.md\nобновлённые записи", 0.6),
    fs().stroke(colors.foreground, 0.6),
    dataPointer().end(1, 0.8),
    caption().text("Восстановленные записи ссылаются на уже сохранённые данные", 0.4),
  );
  yield* beginSlide("Replay — восстановили записи файла из Tree log");
  yield* all(
    rootField().text("root = новый Root tree", 0.6),
    root().stroke(colors.foreground, 0.6),
    logField().text("log_root = 0", 0.6),
    logPointer().end(0, 0.6),
    replay().end(0, 0.6),
    log().opacity(0.15, 0.6),
    phase().text("Фиксируем результат восстановления", 0.4),
    caption().text("aboba.md восстановлен. Лог больше не нужен", 0.4),
  );
  yield* beginSlide("Результат replay зафиксирован — лог очищен");
  yield* all(
    phase().text("Tree log позволяет обойтись без полной фиксации при каждом fsync", 0.4),
    caption().text("Если логирования недостаточно, fsync фиксирует полную транзакцию", 0.4),
  );
  yield* beginSlide("Tree log — быстрый путь fsync, иногда требуется полный commit");
});
