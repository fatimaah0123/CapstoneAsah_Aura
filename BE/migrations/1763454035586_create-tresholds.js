export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('thresholds', {
    threshold_id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    equipment_type: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    parameter_name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    min_normal: {
      type: 'FLOAT',
      notNull: true,
    },
    max_normal: {
      type: 'FLOAT',
      notNull: true,
    },
    min_warning: {
      type: 'FLOAT',
      notNull: true,
    },
    max_warning: {
      type: 'FLOAT',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('thresholds');
};
