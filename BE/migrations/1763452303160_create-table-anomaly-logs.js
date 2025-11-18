export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createType('severity', ['low', 'medium', 'high', 'critical']);

  pgm.createTable('anomaly_logs', {
    id: {
      type: 'serial',
      primaryKey: true,
      notNull: true,
    },
    equipment_id: {
      type: 'INTEGER',
      notNull: true,
      references: 'equipments(id)',
      onDelete: 'CASCADE',
    },
    anomaly_type: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    severity: {
      type: 'severity',
      notNull: true,
    },
    confidence_score: {
      type: 'FLOAT',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('anomaly_logs');
  pgm.dropType('severity');
};
