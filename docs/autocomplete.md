# `commercelayer autocomplete`

Display autocomplete installation instructions.

* [`commercelayer autocomplete [SHELL]`](#commercelayer-autocomplete-shell)

### `commercelayer autocomplete [SHELL]`

Display autocomplete installation instructions.

```sh-session
USAGE
  $ commercelayer autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ commercelayer autocomplete

  $ commercelayer autocomplete bash

  $ commercelayer autocomplete zsh

  $ commercelayer autocomplete powershell

  $ commercelayer autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.34/src/commands/autocomplete/index.ts)_
