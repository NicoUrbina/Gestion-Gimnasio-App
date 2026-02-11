import api from './api';

export interface BcvRateResponse {
  usd_rate: string;
  date?: string;
}

export async function getBcvUsdRate(): Promise<BcvRateResponse> {
  const { data } = await api.get<BcvRateResponse>('/exchange-rate/bcv/');
  return data;
}
