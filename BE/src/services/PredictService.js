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
  async postPredict(data) {
    try {
      const result = await this._modelPredict(data);
      return result;
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }

  async insertDataSensor(payload) {
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
      console.log('Data inserted successfully');
      return true;
    } catch (error) {
      await client.query('ROLLBACK;');
      throw new AppError(error.message, 400);
    } finally {
      client.release();
    }
  }

  async _modelPredict(data) {
    return new Promise((resolve, reject) => {
      try {
        let pyshell = new PythonShell(this._pyPath, {
          mode: 'json',
          pythonOptions: ['-u'],
        });

        pyshell.send(data);

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
