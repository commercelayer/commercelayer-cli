# @commercelayer/cli-generator

Private workspace package, not published. It generates the parts of the CLI plugins that derive from the Commerce Layer API, driven by each plugin's `gen.config.ts`.

```sh
cl-generate                     # download the schema, update the snapshot, generate
cl-generate --local             # generate from the committed snapshot, offline
cl-generate --env <name>        # download from an environment declared in gen.config.ts
cl-generate --api-host <domain> # download from an explicit domain
cl-generate --api-version <v>   # download a specific schema version
```

Plugins call it through their `generate` / `generate-local` scripts.

## Configuration

`gen.config.ts` (default export of `defineConfig({...})`):

| Field | |
| --- | --- |
| `name` | shown in the logs |
| `environments` | API domains by environment (`production` required when there is a `schema`); the OpenAPI schema is served by `data.<domain>` |
| `schema` | `{ kind: 'openapi', snapshot, extract }`: `extract` reduces the downloaded OpenAPI document (about 5 MB) to what the plugin needs, which is what the committed `snapshot` holds |
| `outputs` | paths owned by the generator |
| `format` | paths to run `biome check --write` on after generating |
| `generate` | the generator, usually a preset |

## Presets

- `triggerCommands({ mode: 'per-resource' | 'single-resource', ... })`: one command and one spec per trigger attribute, plus the trigger list module, from `gen/templates/*.tpl` (used by `triggers` and `orders`).
- `resourceList({ output, name, resources })`: the resource list module, from a list the plugin builds from its SDK (used by `resources` and `provisioning`).
