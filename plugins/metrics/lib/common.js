"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sorts = exports.conditions = exports.operators = exports.operatorMap = exports.intervals = exports.resources = exports.operations = exports.analysisOperations = void 0;
// Operations
exports.analysisOperations = ['fbt'];
const operationList = ['search', 'stats', 'breakdown', 'date_breakdown', ...exports.analysisOperations];
exports.operations = operationList;
// Resources
const resourceList = ['orders', 'returns', 'carts'];
exports.resources = resourceList;
// Intervals
const intervalList = ['hour', 'day', 'week', 'month', 'year'];
exports.intervals = intervalList;
// Operators
exports.operatorMap = {
    avg: { type: 'Float', description: 'A single-value metrics aggregation that computes the average of numeric values extracted from specific numeric fields of the aggregated records' },
    cardinality: { type: 'Integer', description: 'A single-value metrics aggregation that calculates an approximate count of distinct values' },
    max: { type: 'Float', description: 'A single-value metrics aggregation that keeps track and returns the maximum value among the numeric values extracted from specific numeric fields of the aggregated records' },
    min: { type: 'Float', description: 'A single-value metrics aggregation that keeps track and returns the minimum value among the numeric values extracted from specific numeric fields of the aggregated records' },
    percentiles: { type: 'Float', description: 'A multi-value metrics aggregation that calculates one or more percentiles (i.e. the point at which a certain percentage of observed values occurs) over numeric values extracted from specific numeric fields of the aggregated records' },
    stats: { type: 'Object', description: 'A multi-value metrics aggregation that computes stats over numeric values extracted from specific numeric fields of the aggregated records. The stats that are returned consist of: count, min, max, avg, and sum' },
    sum: { type: 'Float', description: 'A single-value metrics aggregation that sums up numeric values extracted from specific numeric fields of the aggregated records' },
    value_count: { type: 'Integer', description: 'A single-value metrics aggregation that counts the number of values extracted from specific fields of the aggregated records' }
};
exports.operators = Object.keys(exports.operatorMap);
// Conditions
const conditionList = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'gt_lt', 'gte_lte', 'gte_lt', 'gt_lte'];
exports.conditions = conditionList;
const sortList = ['asc', 'desc'];
exports.sorts = sortList;
