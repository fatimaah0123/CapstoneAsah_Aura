export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('maintenance_recommendations', {
    recommendation_id: {
      type: 'SERIAL',
      primaryKey: true,
      notNull: true,
    },
    equipment_id: {
      type: 'INTEGER',
      notNull: true,
      references: 'equipments(id)',
      onDelete: 'CASCADE',
    },
    anomaly_id: {
      type: 'INTEGER',
      notNull: true,
      references: 'anomaly_losg(id)',
      onDelete: 'CASCADE',
    },
    predicted_tick: {
      type: 'VARCHAR(255)',
    },
    action: {
      type: 'TEXT',
    },
    generated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('maintenance_recommendations');
};
