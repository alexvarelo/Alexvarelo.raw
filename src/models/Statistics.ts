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

export interface HistoricalValue {
    date: string;
    value: number;
  }
export interface HistoricalData {
  change: number; // total change over the specified period
  resolution: string; // e.g., "days"
  quantity: number; // number of periods in the historical data
  values: HistoricalValue[]; // daily values
}

export interface ImageStatistics {
  total: number; // total count (e.g., total views, downloads, or likes)
  historical: HistoricalData; // historical data for the statistic
}

export interface ImageStats{
  id: string; // unique identifier
  downloads: ImageStatistics; // download statistics
  views: ImageStatistics; // view statistics
  likes: ImageStatistics; // like statistics
}
