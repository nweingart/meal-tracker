import axios, { AxiosInstance } from 'axios';
import { supabase } from './supabase';
import {
  DailyLog,
  Food,
  MealLogEntry,
  UserProfile,
  TrackingSummary,
} from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(async (config) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    });
  }

  // Log endpoints
  async createLogEntry(input: string): Promise<MealLogEntry> {
    const response = await this.client.post('/api/log', { input });
    return response.data;
  }

  async getLogByDate(date: string): Promise<DailyLog> {
    const response = await this.client.get(`/api/log/${date}`);
    return response.data;
  }

  async updateLogEntry(id: string, servings: number): Promise<MealLogEntry> {
    const response = await this.client.patch(`/api/log/${id}`, { servings });
    return response.data;
  }

  async deleteLogEntry(id: string): Promise<void> {
    await this.client.delete(`/api/log/${id}`);
  }

  // Food library endpoints
  async getFoods(): Promise<Food[]> {
    const response = await this.client.get('/api/foods');
    return response.data;
  }

  async updateFood(id: string, updates: Partial<Food>): Promise<Food> {
    const response = await this.client.patch(`/api/foods/${id}`, updates);
    return response.data;
  }

  async deleteFood(id: string): Promise<void> {
    await this.client.delete(`/api/foods/${id}`);
  }

  // Profile endpoints
  async getProfile(): Promise<UserProfile | null> {
    const response = await this.client.get('/api/profile');
    return response.data;
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const response = await this.client.put('/api/profile', updates);
    return response.data;
  }

  // Tracking endpoints
  async getTrackingSummary(startDate: string, endDate: string): Promise<TrackingSummary> {
    const response = await this.client.get('/api/tracking/summary', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  }
}

export const api = new ApiClient();
