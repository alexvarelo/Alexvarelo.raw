export interface DataPoints {
    date: Date;
    value: number;
}

export interface HistoricalMetrics {
    change: number;
    average: number;
    resolution: string;
    quantity: number;
    values: DataPoints[];
}

export interface Metrics {
    total: number;
    historical: HistoricalMetrics;
}
export interface Statistics {
    id: string;
    username: string;
    downloads: Metrics;
    views: Metrics;
}