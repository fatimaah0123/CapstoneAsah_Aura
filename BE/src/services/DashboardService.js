import AppError from '../utils/AppError.js';
import { Pool } from 'pg';
const pool = new Pool();
class DashboardService {
  async getDashboardSummary() {
    try {
      const query = `
      WITH latest_sensor AS (
        SELECT DISTINCT ON (machine_id) *
        FROM sensor_data
        ORDER BY machine_id, date_time DESC
      )
      SELECT 
        mr.status
      FROM latest_sensor ls
      JOIN maintenance_recommendations mr 
        ON mr.sensor_data_id = ls.id
      ORDER BY ls.machine_id;
      `;
      const result = await pool.query(query);
      const totalMachines = result.rows.length;
      const machineNormal = result.rows.filter(
        (machine) => machine.status === 'NORMAL'
      );
      const machineWarning = result.rows.filter(
        (machine) => machine.status === 'WARNING'
      );
      const machineCritical = result.rows.filter(
        (machine) => machine.status === 'CRITICAL'
      );
      return {
        totalMachine: {
          value: totalMachines,
          rate: 100,
        },
        machineNormal: {
          value: machineNormal.length,
          rate: (machineNormal.length / totalMachines) * 100,
        },
        machineWarning: {
          value: machineWarning.length,
          rate: (machineWarning.length / totalMachines) * 100,
        },
        machineCritical: {
          value: machineCritical.length,
          rate: (machineCritical.length / totalMachines) * 100,
        },
      };
    } catch (error) {
      throw new AppError(
        `Terjadi kesalahan  dalam mengambil data dashboard summary : ${error.message}`,
        500
      );
    }
  }

  async getDashboardTrend(days = 5) {
    try {
      const query = `
      SELECT 
        date_trunc('day', sd.date_time) AS day,
        COUNT(*) FILTER (WHERE mr.status = 'NORMAL') AS normal_count,
        COUNT(*) FILTER (WHERE mr.status = 'WARNING') AS warning_count,
        COUNT(*) FILTER (WHERE mr.status = 'CRITICAL') AS critical_count
      FROM sensor_data sd
      JOIN maintenance_recommendations mr
        ON mr.sensor_data_id = sd.id
      WHERE sd.date_time >= current_date - (($1 - 1) || ' days')::interval
      GROUP BY day
      ORDER BY day;
      `;
      const result = await pool.query(query, [days]);
      return { days: result.rows.length, data: result.rows };
    } catch (error) {
      throw new AppError(
        `Terjadi kesalahan  dalam mengambil data dashboard trend : ${error.message}`,
        500
      );
    }
  }
}

export default new DashboardService();
