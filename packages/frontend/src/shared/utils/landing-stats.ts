export interface LandingStats {
  topCompanies: string;
  activeInternships: string;
  studentsPlaced: string;
  userRating: string;
}

export const DEFAULT_LANDING_STATS: LandingStats = {
  topCompanies: '500+',
  activeInternships: '10K+',
  studentsPlaced: '50K+',
  userRating: '4.8/5',
};

const STORAGE_KEY = 'interhive_landing_stats';

export const getLandingStats = (): LandingStats => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    // fallback to defaults on error
  }
  return DEFAULT_LANDING_STATS;
};

export const saveLandingStats = (stats: LandingStats): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    window.dispatchEvent(new Event('landing-stats-updated'));
  } catch (err) {
    console.error('Failed to save landing stats:', err);
  }
};
