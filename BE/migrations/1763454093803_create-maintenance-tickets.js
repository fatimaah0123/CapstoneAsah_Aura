export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('maintenance_tickets', {
    ticket_id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    equipment_id: {
      type: 'INTEGER',
      notNull: true,
      references: 'equipments(id)',
      onDelete: 'CASCADE',
    },
    recommendation_id: {
      type: 'INTEGER',
      notNull: true,
      references: 'recommendations(id)',
      onDelete: 'CASCADE',
    },
    status: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    assigned_team: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('maintenance_tickets');
};
