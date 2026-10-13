# trading-dashboard

A web dashboard for [strategy-arena](https://github.com/Adrianval96/strategy-arena), a daily trading simulator where several agents trade the same past market side by side. The dashboard starts simulation runs, follows them live and compares the agents. Simulation only: no real money.

It talks to the strategy-arena engine service through a fixed HTTP contract, pinned in [`contract/openapi.yaml`](contract/openapi.yaml). Until it points at a running service, it uses a mock API inside this app that answers in the same shapes.

## What exists

| Piece                                                                     | State                                                                                            |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| App shell                                                                 | Layout, colours and fonts from the design, light and dark                                        |
| Runs list                                                                 | Done: every run with its status, market, agents and best result or progress, from `GET /v1/runs` |
| New-run form, run view (equity chart, leaderboard, trades), live progress | Not built yet                                                                                    |
| Mock API                                                                  | `GET /v1/runs` only, with five sample runs, under `/api/mock/v1`                                 |

The full design is [`design/mockup.html`](design/mockup.html): a single-page mockup with its own fake API. Open it in a browser to see every view, including starting a run and watching it progress.

## Run it

Node 22:

```bash
npm install
npm run dev
```

Open http://localhost:3000. The app calls the mock API in this app. `NEXT_PUBLIC_API_BASE_URL` sets where the API lives, but pointing it at a running strategy-arena service doesn't work yet: the service doesn't serve `GET /v1/runs` and doesn't accept calls from another origin.

## Checks

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```

## Layout

| Path                    | What it holds                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `contract/openapi.yaml` | The API contract, copied from strategy-arena. It changes there first, then gets copied here |
| `src/api/schema.ts`     | Types generated from the contract with `npm run gen:api`; don't edit by hand                |
| `src/api/client.ts`     | Typed calls to the API; a `success: false` envelope becomes an `ApiError`                   |
| `src/mock/`             | The mock API's sample runs; the route handlers under `src/app/api/mock/v1/` serve them      |
| `src/components/`       | UI, one folder per feature                                                                  |
| `src/lib/`              | Formatting helpers                                                                          |

Every API response is a `{ success, data, error, meta }` envelope with snake_case fields; times are ISO 8601 with a time zone.
