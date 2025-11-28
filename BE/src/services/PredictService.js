import { PythonShell } from 'python-shell';
import { Pool } from 'pg';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import AppError from '../utils/AppError.js';

class predictService {
  constructor() {
    this._pyPath = path.resolve(__dirname, '../models/script/main.py');
    this._pool = new Pool();
  }
  async getModelPredicts(payload) {
    try {
      const result = await this._modelPredict(payload);
      return result;
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }

  async postSensorData(payload) {
    const data = Array.isArray(payload) ? payload : [payload];
    const client = await this._pool.connect();
    try {
      await client.query('BEGIN;');
      for (const item of data) {
        await client.query(
          `
          INSERT INTO sensor_data (
            date_time, type, rotational_speed, process_temperature, air_temperature, torque,
            tool_wear, machine_age_hours, hours_since_last, temp_rate_of_change, rpm_variance, machine_id
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        `,
          [
            item.datetime,
            item.Type,
            item.Rotational_speed,
            item.Process_temperature,
            item.Air_temperature,
            item.Torque,
            item.Tool_wear,
            item.machine_age_hours,
            item.hours_since_last,
            item.Temp_Rate_of_Change,
            item.RPM_Variance,
            item.machineID,
          ]
        );
      }
      await client.query('COMMIT;');
      console.log('Sensor Data inserted successfully');
      return true;
    } catch (error) {
      await client.query('ROLLBACK;');
      throw new AppError(error.message, 400);
    } finally {
      client.release();
    }
  }

  async postMaintenaceRecommenndations(payload, id_machine) {
    const data = Array.isArray(payload) ? payload : [payload];
    const id = Array.isArray(id_machine) ? id_machine : [id_machine];
    const client = await this._pool.connect();
    try {
      await client.query('BEGIN;');
      for (let i = 0; i < data.length; i++) {
        await client.query(
          `
          INSERT INTO maintenance_recommendations (
            rul_hours, rul_days, status, priority, action, machine_id
          ) VALUES ($1,$2,$3,$4,$5,$6)
        `,
          [
            data[i].rul_hours,
            data[i].rul_days,
            data[i].status,
            data[i].priority,
            data[i].action,
            id[i].machineID,
          ]
        );
      }
      await client.query('COMMIT;');
      console.log('Maintenance Recommendations inserted successfully');
    } catch (error) {
      await client.query('ROLLBACK;');
      throw new AppError(error.message, 400);
    } finally {
      client.release();
    }
  }

  async postFailureStatistics(payload, machine_id) {
    const data = Array.isArray(payload) ? payload : [paylaod];
    const id = Array.isArray(machine_id) ? machine_id : [machine_id];
    const client = await this._pool.connect();
    try {
      await client.query('BEGIN;');
      for (const item of data) {
        await client.query(
          `
          INSERT INTO failure_statistics (
            type, confidence, heat_dissipation_failure, random_failures, overstrain_failure, power_failure, tool_wear_failure, machine_id
          ) VALUES ($1,$2,$3,$4,$5,$6,$7, $8)
        `,
          [
            item.type,
            item.confidence,
            item.heat_dissipation_failure,
            item.random_failures,
            item.overstrain_failure,
            item.power_failure,
            item.tool_wear_failure,
            id[item.originalIndex].machineID,
          ]
        );
      }
      await client.query('COMMIT;');
      console.log('Failure Statistics inserted successfully');
    } catch (error) {
      await client.query('ROLLBACK;');
      throw new AppError(error.message, 400);
    } finally {
      client.release();
    }
  }

  async _modelPredict(payload) {
    return new Promise((resolve, reject) => {
      try {
        let pyshell = new PythonShell(this._pyPath, {
          mode: 'json',
          pythonOptions: ['-u'],
        });

        pyshell.send(payload);

        pyshell.on('message', (message) => {
          resolve(message);
        });

        pyshell.end((err) => {
          if (err) {
            reject(err);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new predictService();
