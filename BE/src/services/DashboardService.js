import AppError from '../utils/AppError.js';
import { Pool } from 'pg';
const pool = new Pool();
class DashboardService {
  async getMachineStatus() {
    try {
      const query = `SELECT DISTINCT ON (machine_id) * FROM machines`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new AppError(
        `Terjadi kesalahan  dalam mengambil data mesin : ${error.message}`
      );
    }
  }
}

export default new DashboardService();
