import config from "./config";


const FILTERS: Filter[] = [
	{ predicate: '*_eq', description: 'The attribute is equal to the filter value' },
	{ predicate: '*_not_eq', description: 'The attribute is not equal to the filter value' },
	{ predicate: '*_matches', description: 'The attribute matches the filter value with "LIKE" operator' },
	{ predicate: '*_does_not_match', description: 'The attribute does not match the filter value with "LIKE" operator' },
	{ predicate: '*_matches_any', description: 'The attribute matches all of the filter values (comma-separated) with "LIKE" operator' },
	{ predicate: '*_matches_all', description: 'The attribute matches all of the filter values (comma-separated) with "LIKE" operator' },
	{ predicate: '*_does_not_match_any', description: 'The attribute does not match any of the filter values (comma-separated) with "LIKE" operator' },
	{ predicate: '*_does_not_match_all', description: 'The attribute matches none of the filter values (comma-separated) with "LIKE" operator' },
	{ predicate: '*_lt', description: 'The attribute is less than the filter value' },
	{ predicate: '*_lteq', description: 'The attribute is less than or equal to the filter value' },
	{ predicate: '*_gt', description: 'The attribute is greater than the filter value' },
	{ predicate: '*_gteq', description: 'The attribute is greater than or equal to the filter value' },
	{ predicate: '*_present', description: 'The attribute is not null and not empty' },
	{ predicate: '*_blank', description: 'The attribute is null or empty' },
	{ predicate: '*_null', description: 'The attribute is null' },
	{ predicate: '*_not_null', description: 'The attribute is not null' },
	{ predicate: '*_in', description: 'The attribute matches any of the filter values (comma-separated)' },
	{ predicate: '*_not_in', description: 'The attribute matches none of the filter values (comma-separated)' },
	{ predicate: '*_lt_any', description: 'The attribute is less than any of the filter values (comma-separated)' },
	{ predicate: '*_lteq_any', description: 'The attribute is less than or equal to any of the filter values (comma-separated)' },
	{ predicate: '*_gt_any', description: 'The attribute is greater than any of the filter values (comma-separated)' },
	{ predicate: '*_gteq_any', description: 'The attribute is greater than or qual to any of the filter values (comma-separated)' },
	{ predicate: '*_lt_all', description: 'The attribute is less than all of the filter values (comma-separated)' },
	{ predicate: '*_lteq_all', description: 'The attribute is less than or equal to all of the filter values (comma-separated)' },
	{ predicate: '*_gt_all', description: 'The attribute is greater than all of the filter values (comma-separated)' },
	{ predicate: '*_gteq_all', description: 'The attribute is greater or equal to all of the filter values (comma-separated)' },
	{ predicate: '*_not_eq_all', description: 'The attribute is equal to none of the filter values (comma-separated)' },
	{ predicate: '*_start', description: 'The attribute starts with the filter value (comma-separated)' },
	{ predicate: '*_not_start', description: 'The attribute does not start with the filter value (comma-separated)' },
	{ predicate: '*_start_any', description: 'The attribute starts with any of the filter values (comma-separated)' },
	{ predicate: '*_start_all', description: 'The attribute starts with all of the filter values (comma-separated)' },
	{ predicate: '*_not_start_any', description: 'The attribute does not start with any of the filter values (comma-separated)' },
	{ predicate: '*_not_start_all', description: 'The attribute starts with none of the filter values (comma-separated)' },
	{ predicate: '*_end', description: 'The attribute ends with the filter value' },
	{ predicate: '*_not_end', description: 'The attribute does not end with the filter value' },
	{ predicate: '*_end_any', description: 'The attribute ends with any of the filter values (comma-separated)' },
	{ predicate: '*_end_all', description: 'The attribute ends with all of the filter values (comma-separated)' },
	{ predicate: '*_not_end_any', description: 'The attribute does not end with any of the filter values (comma-separated)' },
	{ predicate: '*_not_end_all', description: 'The attribute ends with none of the filter values (comma-separated)' },
	{ predicate: '*_cont', description: 'The attribute contains the filter value' },
	{ predicate: '*_not_cont', description: 'The attribute does not contains the filter value' },
	{ predicate: '*_cont_any', description: 'The attribute contains any of the filter values (comma-separated)' },
	{ predicate: '*_cont_all', description: 'The attribute contains all of the filter values (comma-separated)' },
	{ predicate: '*_not_cont_all', description: 'The attribute contains none of the filter values (comma-separated)' },
	{ predicate: '*_jcont', description: 'The attribute contains a portion of the JSON used as  filter value (works with object only)' },
	{ predicate: '*_true', description: 'The attribute is true' },
	{ predicate: '*_false', description: 'The attribute is false' },
] as const


const documentation = config.doc.core_filtering_data


interface Filter extends Record<string, unknown> {
	predicate: string;
	description: string;
}


const filterList = (): string[] => {
	return FILTERS.map(f => f.predicate.replace('*', ''))
}


const filterAvailable = (filter: string): boolean => {
	const filter_ = filter.startsWith('_') ? filter : `_${filter}`
	return filterList().some(f => filter_.endsWith(f))
}


const applyFilter = (predicate: string, ...fields: string[]): string => {
	if (!filterAvailable(predicate)) throw new Error('Unknown filter: ' + predicate)
	let out = ''
	for (const f of fields) out += (out.length === 0 ? '' : '_or_') + f
	out += predicate.startsWith('_') ? predicate : `_${predicate}`
	return out
}


const filters = (): Filter[] => {
	return { ...FILTERS }
}



export { type Filter, documentation,
	filterAvailable as available,
	filterList as list,
	applyFilter as apply,
	filters
}
