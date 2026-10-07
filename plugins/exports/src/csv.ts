/**
 * The number of records of a CSV text: its line breaks outside quoted fields
 * (a quoted field can hold commas, line breaks and escaped "" quotes). The
 * header line counts as a record, as does each record ended by a line break.
 *
 * A single linear scan: a regular expression matching whole records
 * backtracks exponentially on some inputs (ReDoS).
 */
export const countCsvRecords = (csv: string): number => {
  let records = 0
  let quoted = false
  for (const char of csv) {
    // An escaped quote ("") toggles twice, staying inside the field
    if (char === '"') quoted = !quoted
    else if (char === '\n' && !quoted) records++
  }
  return records
}
