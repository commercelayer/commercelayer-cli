# @commercelayer/cli-plugin-metrics

Commerce Layer CLI Metrics plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-metrics.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-metrics)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-metrics.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-metrics)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-metrics.svg)](https://github.com/@commercelayer/cli-plugin-metrics/blob/master/package.json)

<!-- toc -->

* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
## Usage
<!-- usage -->

```sh-session
commercelayer COMMAND

commercelayer [COMMAND] (--help | -h) for detailed information about plugin commands.
```
<!-- usagestop -->
## Commands
<!-- commands -->

* [`commercelayer metrics:breakdown RESOURCE`](#commercelayer-metricsbreakdown-resource)
* [`commercelayer metrics:date_breakdown RESOURCE`](#commercelayer-metricsdate_breakdown-resource)
* [`commercelayer metrics:fbt`](#commercelayer-metricsfbt)
* [`commercelayer metrics:search RESOURCE`](#commercelayer-metricssearch-resource)
* [`commercelayer metrics:stats RESOURCE`](#commercelayer-metricsstats-resource)

### `commercelayer metrics:breakdown RESOURCE`

Perform a breakdown query on the Metrics API endpoint.

```sh-session
USAGE
  $ commercelayer metrics:breakdown RESOURCE -b <value> -f <value> -O
    avg|cardinality|max|min|percentiles|stats|sum|value_count [-F <value>] [-B <value>] [-c <value>] [-s asc|desc] [-l
    <value>]

FLAGS
  -B, --breakdown=<value>  the optional nested breakdown
  -F, --filter=<value>     the filter to apply to the query in JSON format (enclosed in single quotes)
  -O, --operator=<option>  (required) the computing operator
                           <options: avg|cardinality|max|min|percentiles|stats|sum|value_count>
  -b, --by=<value>         (required) the field you want the results of the query aggragated by
  -c, --condition=<value>  an additional constraint to fine-tune the set of records
  -f, --field=<value>      (required) the field you want the metrics or statistics computed on
  -l, --limit=<value>      the maximum number of records shown in the response
  -s, --sort=<option>      the way you want the results of the query to be sorted
                           <options: asc|desc>

DESCRIPTION
  perform a breakdown query on the Metrics API endpoint

ALIASES
  $ commercelayer metrics:break
  $ commercelayer breakdown

EXAMPLES
  $ commercelayer metrics:breakdown orders -b order.country_code -f order.id -O value_count -s desc -l 20

  cl breakdown orders -b order.country_code -f order.id -O value_count -s desc -l 20 -B '{"by": "line_items.name","field": "line_items.id","operator": "value_count","sort": "desc","limit": 20}'

FLAG DESCRIPTIONS
  -B, --breakdown=<value>  the optional nested breakdown

    a JSON object (enclosed in single quotes) containing the nested breakdown

  -O, --operator=avg|cardinality|max|min|percentiles|stats|sum|value_count  the computing operator

    the list of valid operators depends on the value of the field key

  -c, --condition=<value>  an additional constraint to fine-tune the set of records

    the condition is applied to the computed results of the query and it is available for operators that return single
    numeric (float or integer) values.
```

_See code: [src/commands/metrics/breakdown.ts](https://github.com/commercelayer/commercelayer-cli-plugin-metrics/blob/main/src/commands/metrics/breakdown.ts)_

### `commercelayer metrics:date_breakdown RESOURCE`

Perform a date breakdown query on the Metrics API endpoint.

```sh-session
USAGE
  $ commercelayer metrics:date_breakdown RESOURCE -b <value> -f <value> -O
    avg|cardinality|max|min|percentiles|stats|sum|value_count [-F <value>] [-B <value>] [-i hour|day|week|month|year]

FLAGS
  -B, --breakdown=<value>  the optional nested breakdown
  -F, --filter=<value>     the filter to apply to the query in JSON format (enclosed in single quotes)
  -O, --operator=<option>  (required) the computing operator
                           <options: avg|cardinality|max|min|percentiles|stats|sum|value_count>
  -b, --by=<value>         (required) the field you want the results of the query aggragated by
  -f, --field=<value>      (required) the field you want the metrics or statistics computed on
  -i, --interval=<option>  the time interval over which the metrics are computed
                           <options: hour|day|week|month|year>

DESCRIPTION
  perform a date breakdown query on the Metrics API endpoint

ALIASES
  $ commercelayer metrics:breakdate
  $ commercelayer metrics:date
  $ commercelayer breakdate
  $ commercelayer date_breakdown

EXAMPLES
  $ commercelayer metrics:date_breakdown orders -b order.placed_at -f order.total_amount_with_taxes -O stats -i month

FLAG DESCRIPTIONS
  -B, --breakdown=<value>  the optional nested breakdown

    a JSON object (enclosed in single quotes) containing the nested breakdown

  -O, --operator=avg|cardinality|max|min|percentiles|stats|sum|value_count  the computing operator

    the list of valid operators depends on the value of the field key
```

_See code: [src/commands/metrics/date_breakdown.ts](https://github.com/commercelayer/commercelayer-cli-plugin-metrics/blob/main/src/commands/metrics/date_breakdown.ts)_

### `commercelayer metrics:fbt`

Perform a Frequently Bought Together query on the Metrics API analysis endpoint.

```sh-session
USAGE
  $ commercelayer metrics:fbt [-i <value>...]

FLAGS
  -i, --in=<value>...  a list of SKU or bundle IDs associated as line items to one or more orders

DESCRIPTION
  perform a Frequently Bought Together query on the Metrics API analysis endpoint

ALIASES
  $ commercelayer fbt

EXAMPLES
  $ commercelayer metrics:fbt --in xYZkjABcde,yzXKjYzaCx
```

_See code: [src/commands/metrics/fbt.ts](https://github.com/commercelayer/commercelayer-cli-plugin-metrics/blob/main/src/commands/metrics/fbt.ts)_

### `commercelayer metrics:search RESOURCE`

Perform a search query on the Metrics API endpoint.

```sh-session
USAGE
  $ commercelayer metrics:search RESOURCE -f <value>... [-F <value>] [-l <value>] [-s asc|desc -b <value>] [-c
    <value>]

FLAGS
  -F, --filter=<value>     the filter to apply to the query in JSON format (enclosed in single quotes)
  -b, --sort_by=<value>    the date field you want the results of the query sorted by
  -c, --cursor=<value>     the cursor pointing to a specific page in the paginated search results
  -f, --fields=<value>...  (required) comma-separated list of fields you want to be returned for each record in the
                           response
  -l, --limit=<value>      the maximum number of records shown in the response
  -s, --sort=<option>      the way you want the results of the query to be sorted
                           <options: asc|desc>

DESCRIPTION
  perform a search query on the Metrics API endpoint

ALIASES
  $ commercelayer search

EXAMPLES
  commercelayewr metrics:search orders -l 5 -s asc -b order.placed_at -f order.id,order.number,order.placed_at,customer.email
```

_See code: [src/commands/metrics/search.ts](https://github.com/commercelayer/commercelayer-cli-plugin-metrics/blob/main/src/commands/metrics/search.ts)_

### `commercelayer metrics:stats RESOURCE`

Perform a stats query on the Metrics API endpoint.

```sh-session
USAGE
  $ commercelayer metrics:stats RESOURCE -f <value> -O avg|cardinality|max|min|percentiles|stats|sum|value_count
    [-F <value>]

FLAGS
  -F, --filter=<value>     the filter to apply to the query in JSON format (enclosed in single quotes)
  -O, --operator=<option>  (required) the computing operator
                           <options: avg|cardinality|max|min|percentiles|stats|sum|value_count>
  -f, --field=<value>      (required) the field you want the metrics or statistics computed on

DESCRIPTION
  perform a stats query on the Metrics API endpoint

ALIASES
  $ commercelayer stats

EXAMPLES
  $ commercelayer metrics:stats orders -f order.total_amount_with_taxes --op avg

  cl stats orders -f order.total_amount_with_taxes -O stats
```

_See code: [src/commands/metrics/stats.ts](https://github.com/commercelayer/commercelayer-cli-plugin-metrics/blob/main/src/commands/metrics/stats.ts)_
<!-- commandsstop -->
