import { PythonShell } from 'python-shell';
import { Pool } from 'pg';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import AppError from '../utils/AppError.js';

class PredictService {
  constructor() {
    this._pyPath = path.resolve(__dirname, '../models/script/main.py');
    this._pool = new Pool();
  }
  async createPredicts(payload) {
    try {
      const result = await this._predict(payload);
      const recommendations = [].concat(
        await this._formattedMaintenanceRecommendationData(result)
      );

      const failureStatistics = [].concat(
        await this._formattedFailureStatisticData(result)
      );

      await this._createMaintenanceRecommenndations(recommendations, payload);

      if (failureStatistics.length !== 0) {
        await this._createFailureStatistics(failureStatistics, payload);
      }
      return true;
    } catch (error) {
      throw new AppError(error.message, error.statusCode);
    }
  }

  async createSensorData(data) {
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
      throw new AppError(
        `Terdapat kesalahan dalam memproses data sensor : ${error.message}`,
        400
      );
    } finally {
      client.release();
    }
  }

  async _createMaintenanceRecommenndations(data, id) {
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
      throw new AppError(
        `Terdapat kesalahan dalam memproses data maintenance recommendation : ${error.message}`,
        400
      );
    } finally {
      client.release();
    }
  }

  async _createFailureStatistics(data, id) {
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
      throw new AppError(
        `Terdapat kesalahan dalam memproses data failure statistics : ${error.message}`,
        400
      );
    } finally {
      client.release();
    }
  }

  async _formattedMaintenanceRecommendationData(payload) {
    const result = payload.map((data) => data.prediction);

    return result;
  }

  async _formattedFailureStatisticData(payload) {
    const result = payload
      .map((data, index) => ({
        ...data,
        originalIndex: index,
      }))
      .filter((data) => data.failure.type != null)
      .map((data) => ({
        originalIndex: data.originalIndex,
        type: data.failure.type,
        confidence: data.failure.confidence,
        heat_dissipation_failure:
          data.failure.probabilities['Heat Dissipation Failure'],
        random_failures: data.failure.probabilities['Random Failures'],
        overstrain_failure: data.failure.probabilities['Overstrain Failure'],
        power_failure: data.failure.probabilities['Power Failure'],
        tool_wear_failure: data.failure.probabilities['Tool Wear Failure'],
      }));

    return result;
  }
  async _predict(payload) {
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
            reject(
              new AppError(
                `Terdapat kesalahan pada python shell : ${err.message}`,
                500
              )
            );
          }
        });
      } catch (error) {
        reject(
          new AppError(`Terdapat kesalahan pada model : ${error.message}`, 500)
        );
      }
    });
  }
}

export default new PredictService();
