import { Statistics, DataPoints, HistoricalMetrics, Metrics } from "@/models/Statistics";

export function convertToStatistics(data: any): Statistics {
    const convertToDataPoints = (dataPoints: any[]): DataPoints[] => {
        return dataPoints.map(dp => ({
            date: new Date(dp.date),
            value: dp.value
        }));
    };

    const convertToHistoricalMetrics = (historical: any): HistoricalMetrics => {
        return {
            change: historical.change,
            average: historical.average,
            resolution: historical.resolution,
            quantity: historical.quantity,
            values: convertToDataPoints(historical.values)
        };
    };

    const convertToMetrics = (metrics: any): Metrics => {
        return {
            total: metrics.total,
            historical: convertToHistoricalMetrics(metrics.historical)
        };
    };

    return {
        id: data.id,
        username: data.username,
        downloads: convertToMetrics(data.downloads),
        views: convertToMetrics(data.views)
    };
}
