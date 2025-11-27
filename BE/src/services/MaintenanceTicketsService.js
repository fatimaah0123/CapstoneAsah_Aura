import { Pool } from 'pg';
import AppError from '../utils/AppError.js';

const pool = new Pool();

class MaintenanceTicketsService {
  async getAllMaintenanceTickets() {
    try {
      const query = `
        SELECT 
          mt.id,
          mt.name_pic,
          mt.date,
          mt.additional_notes,
          mt.status,
          mt.machine_id,
          m.name as machine_name
        FROM maintenance_tickets mt
        LEFT JOIN machines m ON mt.machine_id = m.id
        ORDER BY mt.created_at DESC
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new AppError(
        `Terdapat kesalahan dalam mengambil data ticket: ${error.message}`
      );
    }
  }

  async getMaintenanceTicketById(id) {
    try {
      const query = `
        SELECT 
          id,
          name_pic,
          contact,
          member,
          date,
          estimated_duration,
          maintenance_type,
          status,
          part,
          additional_notes,
          image,
          machine_id,
          created_at,
          updated_at
        FROM maintenance_tickets 
        WHERE id = $1
      `;

      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new AppError(
        `Terdapat kesalahan dalam fetching data ticket: ${error.message}`
      );
    }
  }

  async createMaintenanceTicket(ticketData) {
    try {
      const {
        name_pic,
        contact,
        member,
        date,
        estimated_duration,
        maintenance_type,
        part,
        additional_notes,
        image,
        machine_id,
      } = ticketData;

      const query = `
        INSERT INTO maintenance_tickets (
          name_pic, contact, member, date, estimated_duration, 
          maintenance_type, status, part, additional_notes, image, machine_id
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, 'open', $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        name_pic,
        contact,
        JSON.stringify(member),
        date,
        estimated_duration,
        maintenance_type,
        part,
        additional_notes,
        image,
        machine_id,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new AppError(`${error.message}`, 400);
    }
  }

  async updateMaintenanceTicket(id, ticketData) {
    try {
      const {
        name_pic,
        contact,
        member,
        date,
        estimated_duration,
        maintenance_type,
        status,
        part,
        additional_notes,
        image,
        machine_id,
      } = ticketData;

      const query = `
        UPDATE maintenance_tickets 
        SET 
          name_pic = $1,
          contact = $2,
          member = $3,
          date = $4,
          estimated_duration = $5,
          maintenance_type = $6,
          status = $7,
          part = $8,
          additional_notes = $9,
          image = $10,
          machine_id = $11,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING *
      `;

      const values = [
        name_pic,
        contact,
        JSON.stringify(member),
        date,
        estimated_duration,
        maintenance_type,
        status,
        part,
        additional_notes,
        image,
        machine_id,
        id,
      ];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new AppError(`${error.message}`, 400);
    }
  }

  async deleteMaintenanceTicket(id) {
    try {
      const query =
        'DELETE FROM maintenance_tickets WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new AppError(`Tidak dapat menghapus ticket: ${error.message}`, 400);
    }
  }
}

export default new MaintenanceTicketsService();
