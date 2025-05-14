import { type MetricsOperation, type MetricsResource } from "./common";
export declare function metricsRequest(operation: MetricsOperation, query: any, resource?: MetricsResource, flags?: any): Promise<Response>;
