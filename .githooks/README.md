# Git hooks (tracked)

These hooks are version-controlled so they travel with the repo. Git does **not**
use them automatically — each clone must opt in once (a security feature: Git
never auto-runs tracked hooks):

```sh
git config core.hooksPath .githooks
```

Run that once after cloning. Verify with `git rev-parse --git-path hooks`
(should print `.githooks`).

## Hooks

- **pre-push** — runs the INSPECTUS VLDR test suite (`bun test` in
  `INSPEKTUS/inspectus-vldr/`), which includes the `transform-sync.test.js`
  drift guard that keeps the deployed `transform.js` and the `inspectus-os`
  twin behaviorally identical. A failing test blocks the push.
  - Requires [bun](https://bun.sh). If bun isn't on PATH the hook skips with a
    warning (so GUI git clients don't get bricked).
  - Emergency bypass: `git push --no-verify`.
