# Static presentation

Build: `npm run build:site`. This produces a standalone `dist/` with the base path
`/btrfs-slides/`. The editor remains available with `npm run start`.

Preview: `npm run preview:site`, then open
`http://127.0.0.1:9001/btrfs-slides/`.

Controls: Space/right arrow/click advances the animation; left arrow goes back;
F toggles fullscreen; the selector jumps to a slide. Links such as
`#slide=32` open a particular slide. Up/down jumps between whole slides.

Upload `dist/` to `/home/t3m8ch/btrfs-slides-dist/` on `t3m8ch-ru`, and
`deploy/install-on-vds.sh` to `/home/t3m8ch/install-btrfs-slides.sh`.
Then run on the VDS:

`sudo bash /home/t3m8ch/install-btrfs-slides.sh`

The script discovers the existing Dockerized Caddy and its `/etc/caddy` bind
mount, preserves the current Caddyfile, inserts a route only for this site's
prefix, validates before applying, and reloads Caddy. Failed reloads roll back
the configuration and site files. Successful deployments retain backups.
It does not replace other domain blocks or restart containers.
