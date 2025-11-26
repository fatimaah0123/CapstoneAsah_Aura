export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('failure_statistics', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    heat_dissipation_failure: {
      type: 'float',
      notNull: true,
    },
    random_failures: {
      type: 'float',
      notNull: true,
    },
    overstrain_failure: {
      type: 'float',
      notNull: true,
    },
    power_failure: {
      type: 'float',
      notNull: true,
    },
    tool_wear_failure: {
      type: 'float',
      notNull: true,
    },
    machine_id: {
      type: 'integer',
      notNull: true,
      references: 'machines',
      onDelete: 'CASCADE',
    },
    create_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('failure_statistics');
};
