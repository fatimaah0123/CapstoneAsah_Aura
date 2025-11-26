export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('sensor_data', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    date_time: {
      type: 'timestamp',
      notNull: true,
    },
    rotational_speed: {
      type: 'float',
      notNull: true,
    },
    process_temperature: {
      type: 'float',
      notNull: true,
    },
    air_temperature: {
      type: 'float',
      notNull: true,
    },
    torque: {
      type: 'float',
      notNull: true,
    },
    tool_wear: {
      type: 'float',
      notNull: true,
    },
    target: {
      type: 'integer',
      notNull: true,
    },
    failure_type: {
      type: 'varchar(255)',
      notNull: false,
    },
    machine_id: {
      type: 'integer',
      notNull: true,
      references: '"machines"',
      onDelete: 'cascade',
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('sensor_data');
};
