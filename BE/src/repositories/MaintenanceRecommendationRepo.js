import { Pool } from 'pg';

class MaintenanceRecommendationRepo {
  constructor() {
    this._pool = new Pool();
  }
}

export default new MaintenanceRecommendationRepo();
