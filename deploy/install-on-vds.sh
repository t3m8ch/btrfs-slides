#!/usr/bin/env bash
# Run on t3m8ch-ru: sudo bash /home/t3m8ch/install-btrfs-slides.sh
# Adds only /btrfs-slides to the existing domain; preserves other sites/routes.
set -euo pipefail
[[ $EUID == 0 ]] || { echo 'Run this script with sudo.' >&2; exit 1; }
SOURCE=/home/t3m8ch/btrfs-slides-dist
[[ -f "$SOURCE/index.html" ]] || { echo "Missing $SOURCE/index.html" >&2; exit 1; }
CONTAINER=''
PROBE=$(mktemp)
trap 'rm -f "$PROBE"' EXIT
for id in $(docker ps -q); do
  if docker cp "$id:/etc/caddy/Caddyfile" "$PROBE" >/dev/null 2>&1 && grep -q '^t3m8ch.ru' "$PROBE"; then
    [[ -z "$CONTAINER" ]] || { echo 'Multiple Caddy containers match; refusing to guess.' >&2; exit 1; }
    CONTAINER=$id
  fi
done
[[ -n "$CONTAINER" ]] || { echo 'Caddy container for t3m8ch.ru not found.' >&2; exit 1; }
HOST_DIR=$(docker inspect -f '{{range .Mounts}}{{if and (eq .Destination "/etc/caddy") (eq .Type "bind")}}{{.Source}}{{end}}{{end}}' "$CONTAINER")
[[ -n "$HOST_DIR" && -f "$HOST_DIR/Caddyfile" ]] || { echo 'Expected /etc/caddy directory bind mount not found.' >&2; exit 1; }
STAMP=$(date +%Y%m%d-%H%M%S)-$$
CONFIG="$HOST_DIR/Caddyfile"
CANDIDATE="$HOST_DIR/Caddyfile.btrfs-candidate-$STAMP"
BACKUP="$HOST_DIR/Caddyfile.before-btrfs-$STAMP"
TARGET="$HOST_DIR/site/btrfs-slides"
STAGED="$HOST_DIR/site/.btrfs-slides-new-$STAMP"
PREVIOUS="$HOST_DIR/site/.btrfs-slides-before-$STAMP"
cp -p "$CONFIG" "$BACKUP"
python3 - "$CONFIG" "$CANDIDATE" <<'PY'
import pathlib, re, sys
source, target = map(pathlib.Path, sys.argv[1:])
text = source.read_text()
block = '''
\t# BEGIN btrfs-slides managed route
\tredir /btrfs-slides /btrfs-slides/ 308
\thandle /btrfs-slides/* {
\t\troot * /etc/caddy/site
\t\tencode zstd gzip
\t\theader {
\t\t\t>Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; base-uri 'self'; frame-ancestors 'none'"
\t\t\t>X-Content-Type-Options "nosniff"
\t\t\t>Referrer-Policy "strict-origin-when-cross-origin"
\t\t\t>Cache-Control "no-cache"
\t\t}
\t\tfile_server
\t}
\t# END btrfs-slides managed route
'''
managed = r'(?ms)^\t# BEGIN btrfs-slides managed route\n.*?^\t# END btrfs-slides managed route\n'
if re.search(managed, text):
    text, count = re.subn(managed, lambda _: block.lstrip('\n'), text)
else:
    opener = r'(?m)^t3m8ch\.ru(?:\s*,\s*www\.t3m8ch\.ru)?[ \t]*\{[ \t]*$'
    text, count = re.subn(opener, lambda m: m.group(0) + '\n' + block, text)
if count != 1:
    raise SystemExit('Expected exactly one domain block/managed route. No configuration changed.')
target.write_text(text)
PY
docker exec "$CONTAINER" caddy validate --config "/etc/caddy/$(basename "$CANDIDATE")" --adapter caddyfile
mkdir -p "$HOST_DIR/site"
cp -a "$SOURCE" "$STAGED"
chown -R root:root "$STAGED"
chmod -R a+rX "$STAGED"
CHANGED=0
rollback() {
  if [[ $CHANGED == 1 ]]; then
    cp -p "$BACKUP" "$CONFIG"
    if [[ -d "$TARGET" ]]; then mv "$TARGET" "$HOST_DIR/site/.btrfs-slides-failed-$STAMP"; fi
    if [[ -d "$PREVIOUS" ]]; then mv "$PREVIOUS" "$TARGET"; fi
    docker exec "$CONTAINER" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile || true
    echo "Deployment failed; previous configuration restored. Backup: $BACKUP" >&2
  fi
}
trap rollback ERR
if [[ -e "$TARGET" ]]; then mv "$TARGET" "$PREVIOUS"; fi
CHANGED=1
mv "$STAGED" "$TARGET"
cat "$CANDIDATE" > "$CONFIG"
docker exec "$CONTAINER" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
CHANGED=0
trap - ERR
rm -f "$CANDIDATE"
echo 'Deployed: https://t3m8ch.ru/btrfs-slides/'
echo "Previous Caddy configuration: $BACKUP"
if [[ -d "$PREVIOUS" ]]; then echo "Previous site files: $PREVIOUS"; fi
