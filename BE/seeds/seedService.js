// src/services/MachineService.js
import { Pool } from 'pg';
import 'dotenv/config';

class SeedService {
  constructor() {
    this._pool = new Pool();
  }

  async seed() {
    const query1 = `
        INSERT INTO machines (name, type, location)
        SELECT 
            name_base || ' ' || num AS name,
            (CASE WHEN num % 3 = 1 THEN 'L'
                  WHEN num % 3 = 2 THEN 'M'
                  ELSE 'H' END)::machine_type_enum AS type,
            'Location ' || ((num % 10) + 1) AS location
        FROM (
            SELECT gs AS num,
                  CASE ((gs - 1) % 10) + 1
                      WHEN 1 THEN 'Generator'
                      WHEN 2 THEN 'Pump'
                      WHEN 3 THEN 'Compressor'
                      WHEN 4 THEN 'Fan'
                      WHEN 5 THEN 'Boiler'
                      WHEN 6 THEN 'Motor'
                      WHEN 7 THEN 'Turbine'
                      WHEN 8 THEN 'Valve'
                      WHEN 9 THEN 'Conveyor'
                      WHEN 10 THEN 'Heater'
                  END AS name_base
            FROM generate_series(1, 400) AS gs
        ) AS sub;
    `;

    const query2 = `
    INSERT INTO thresholds (status, priority, action)
    VALUES
      ('CRITICAL', 'URGENT', 'Schedule maintenance IMMEDIATELY (within 1-2 days)'),
      ('CRITICAL', 'HIGH', 'Schedule maintenance within 1-2 weeks'),
      ('WARNING', 'MEDIUM', 'Schedule maintenance within 4-8 weeks'),
      ('NORMAL', 'LOW', 'Continue routine monitoring');
    `;

    try {
      await this._pool.query(query1);
      await this._pool.query(query2);
      console.log('Seeding completed.');
    } catch (error) {
      console.error('Seeding error:', error);
      throw error;
    } finally {
      await this._pool.end();
      console.log('Database connection closed.');
    }
  }
}

export default new SeedService();
