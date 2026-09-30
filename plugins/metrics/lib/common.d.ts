export declare const analysisOperations: string[];
declare const operationList: readonly ["search", "stats", "breakdown", "date_breakdown", ...string[]];
export type MetricsOperation = typeof operationList[number];
export declare const operations: string[];
declare const resourceList: readonly ["orders", "returns", "carts"];
export type MetricsResource = typeof resourceList[number];
export declare const resources: string[];
declare const intervalList: readonly ["hour", "day", "week", "month", "year"];
export type MetricsInterval = typeof intervalList[number];
export declare const intervals: string[];
export declare const operatorMap: {
    readonly avg: {
        readonly type: "Float";
        readonly description: "A single-value metrics aggregation that computes the average of numeric values extracted from specific numeric fields of the aggregated records";
    };
    readonly cardinality: {
        readonly type: "Integer";
        readonly description: "A single-value metrics aggregation that calculates an approximate count of distinct values";
    };
    readonly max: {
        readonly type: "Float";
        readonly description: "A single-value metrics aggregation that keeps track and returns the maximum value among the numeric values extracted from specific numeric fields of the aggregated records";
    };
    readonly min: {
        readonly type: "Float";
        readonly description: "A single-value metrics aggregation that keeps track and returns the minimum value among the numeric values extracted from specific numeric fields of the aggregated records";
    };
    readonly percentiles: {
        readonly type: "Float";
        readonly description: "A multi-value metrics aggregation that calculates one or more percentiles (i.e. the point at which a certain percentage of observed values occurs) over numeric values extracted from specific numeric fields of the aggregated records";
    };
    readonly stats: {
        readonly type: "Object";
        readonly description: "A multi-value metrics aggregation that computes stats over numeric values extracted from specific numeric fields of the aggregated records. The stats that are returned consist of: count, min, max, avg, and sum";
    };
    readonly sum: {
        readonly type: "Float";
        readonly description: "A single-value metrics aggregation that sums up numeric values extracted from specific numeric fields of the aggregated records";
    };
    readonly value_count: {
        readonly type: "Integer";
        readonly description: "A single-value metrics aggregation that counts the number of values extracted from specific fields of the aggregated records";
    };
};
export type MetricsOperator = keyof typeof operatorMap;
export declare const operators: string[];
declare const conditionList: readonly ["eq", "ne", "gt", "gte", "lt", "lte", "gt_lt", "gte_lte", "gte_lt", "gt_lte"];
export type MetricsConditionKey = typeof conditionList[number];
export declare const conditions: string[];
export type MetricsCondition = {
    [key in MetricsConditionKey]?: (number | [number, number]);
};
declare const sortList: readonly ["asc", "desc"];
export type MetricsSort = typeof sortList[number];
export declare const sorts: string[];
export type MetricsQuerySearch = {
    limit?: number;
    sort?: MetricsSort;
    sort_by?: string;
    fields: string[];
    cursor?: string;
};
export type MetricsQueryStats = {
    field: string;
    operator: MetricsOperator;
};
export type MetricsQueryBreakdown = {
    by: string;
    field: string;
    operator: MetricsOperator;
    condition?: MetricsCondition;
    sort?: MetricsSort;
    limit?: number;
    breakdown?: MetricsQueryBreakdown;
};
export type MetricsQueryBreakdownResponse = {
    label: string;
    value: string | number;
} & {
    key?: MetricsQueryBreakdown;
};
export type MetricsQueryDateBreakdown = {
    by: string;
    field: string;
    operator: MetricsOperator;
    interval?: MetricsInterval;
    breakdown?: MetricsQueryBreakdown;
};
export type MetricsQueryDateBreakdownResponse = {
    date: string;
    value: any;
} & {
    key?: MetricsQueryBreakdown;
};
export type MetricsFilter = Record<string, any>;
export type MetricsFilterFbt = {
    line_items: {
        item_ids: {
            in: string[];
        };
    };
};
export type MetricsQueryFbt = {
    filter?: MetricsFilterFbt;
};
export type MetricsQuery = (({
    search: MetricsQuerySearch;
} | {
    stats: MetricsQueryStats;
} | {
    breakdown: MetricsQueryBreakdown;
} | {
    date_breakdown: MetricsQueryDateBreakdown;
}) & {
    filter?: MetricsFilter;
}) | MetricsQueryFbt;
export {};
