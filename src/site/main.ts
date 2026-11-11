import {Presenter, Vector2} from '@motion-canvas/core';
import type {Project, Slide} from '@motion-canvas/core';
// The Motion Canvas Vite plugin bootstraps the project for the browser.
// @ts-expect-error The plugin's project query has no ambient module declaration.
import project from '../project?project';
import './style.css';

const presentation = project as Project;
const presenter = new Presenter(presentation);
const stage = document.querySelector<HTMLDivElement>('#stage')!;
const root = document.querySelector<HTMLElement>('#presentation')!;
const loading = document.querySelector<HTMLDivElement>('#loading')!;
const sceneSelect = document.querySelector<HTMLSelectElement>('#scene')!;
const previous = document.querySelector<HTMLButtonElement>('#previous')!;
const next = document.querySelector<HTMLButtonElement>('#next')!;
const step = document.querySelector<HTMLSpanElement>('#step')!;
const titles = [
  'Как устроен BTRFS', 'Секторы', 'Копии', 'VFS', 'Интерфейс VFS', 'Имена и inode',
  'Зачем B-дерево', 'Узлы и листья', 'Ключи и поиск', 'Вставка', 'Разные записи',
  'Расположение записей', 'Адресные пространства', 'Chunks', 'Суперблок', 'Карта деревьев',
  'Записи FS tree', 'Поиск по пути', 'Чтение файла', 'Copy-on-Write', 'Reflink', 'Снимки',
  'Счётчики ссылок', 'Обратные ссылки', 'Транзакции', 'Фиксация и сбой',
  'Группы блоков', 'Выделение места', 'Контрольные суммы', 'Весь путь изменения',
  'fsync', 'Спасибо за внимание!',
];
let slides: Slide[] = [];
let ready = false;
let waiting = false;
let current = 0;
let hideTimer: ReturnType<typeof setTimeout>;
stage.append(presenter.stage.finalBuffer);

function showControls() {
  root.classList.remove('quiet');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (!document.querySelector('#controls:focus-within')) root.classList.add('quiet');
  }, 2800);
}
function advance() {
  if (ready && waiting) presenter.resume();
  showControls();
}
function back() {
  if (ready) presenter.requestPreviousSlide();
  showControls();
}
async function fullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await root.requestFullscreen();
  } catch { showControls(); }
}
function requestedScene() {
  const value = Number(new URLSearchParams(location.hash.slice(1)).get('slide'));
  return Number.isInteger(value) && value >= 1 && value <= titles.length ? value - 1 : 0;
}
function goToScene(index: number) {
  const first = slides.find(slide => slide.scene.name === presentation.scenes[index]?.name);
  if (first) presenter.requestSlide(first.id);
}

presenter.onSlidesChanged.subscribe(value => {
  slides = value;
  sceneSelect.replaceChildren(...presentation.scenes.map((scene, i) => {
    const option = document.createElement('option');
    option.value = String(i);
    option.textContent = `${String(i + 1).padStart(2, '0')} · ${titles[i] ?? scene.name}`;
    return option;
  }));
  sceneSelect.disabled = false;
  if (requestedScene() > 0) goToScene(requestedScene());
});
presenter.onInfoChanged.subscribe(info => {
  if (!info.currentSlideId) return;
  ready = true;
  waiting = info.isWaiting;
  loading.hidden = true;
  const slide = slides.find(item => item.id === info.currentSlideId);
  const index = presentation.scenes.findIndex(scene => scene.name === slide?.scene.name);
  if (index < 0) return;
  current = index;
  sceneSelect.value = String(index);
  const sceneSteps = slides.filter(item => item.scene.name === slide?.scene.name);
  const position = sceneSteps.findIndex(item => item.id === info.currentSlideId) + 1;
  step.textContent = `${position} / ${sceneSteps.length}`;
  next.disabled = !info.hasNext || !info.isWaiting;
  previous.disabled = !info.hasPrevious;
  history.replaceState(null, '', `#slide=${index + 1}`);
});
presentation.logger.onLogged.subscribe(entry => {
  if (entry.level === 'error') {
    console.error(entry.message, entry.stack ?? '');
    loading.hidden = false;
    loading.textContent = 'Не удалось воспроизвести презентацию. Обновите страницу.';
  }
});
previous.addEventListener('click', back);
next.addEventListener('click', advance);
document.querySelector('#fullscreen')!.addEventListener('click', fullscreen);
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) stage.focus();
  else showControls();
});
sceneSelect.addEventListener('change', () => { goToScene(Number(sceneSelect.value)); showControls(); });
stage.addEventListener('click', advance);
root.addEventListener('pointermove', showControls);
window.addEventListener('hashchange', () => goToScene(requestedScene()));
window.addEventListener('keydown', event => {
  if (event.target instanceof HTMLSelectElement) return;
  if (event.key === ' ' && event.target instanceof HTMLButtonElement) return;
  if ([' ', 'ArrowRight', 'PageDown', 'ArrowLeft', 'PageUp', 'Home', 'End', 'f', 'F'].includes(event.key)) event.preventDefault();
  if ([' ', 'ArrowRight', 'PageDown'].includes(event.key)) advance();
  else if (['ArrowLeft', 'PageUp'].includes(event.key)) back();
  else if (event.key === 'Home') goToScene(0);
  else if (event.key === 'End') goToScene(titles.length - 1);
  else if (event.key.toLowerCase() === 'f') void fullscreen();
  else if (event.key === 'ArrowDown') goToScene(Math.min(current + 1, titles.length - 1));
  else if (event.key === 'ArrowUp') goToScene(Math.max(current - 1, 0));
});
showControls();
void document.fonts.ready.then(() => presenter.present({
  name: presentation.name, size: new Vector2(1920, 1080), resolutionScale: 1,
  fps: 60, colorSpace: 'srgb', background: '#F3F6F4', slide: null,
}));
