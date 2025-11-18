export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('sensor_data', {
    id: {
      type: 'serial',
      primaryKey: true,
      notNull: true,
    },
    date_time: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    equipment_id: {
      type: 'INTEGER',
      notNull: true,
      references: 'equipments(id)',
      onDelete: 'CASCADE',
    },
    rotational_speed: {
      type: 'FLOAT',
      notNull: true,
    },
    process_temperature: {
      type: 'FLOAT',
      notNull: true,
    },
    air_temperature: {
      type: 'FLOAT',
      notNull: true,
    },
    torque: {
      type: 'FLOAT',
      notNull: true,
    },
    tool_wear: {
      type: 'FLOAT',
      notNull: true,
    },
    target: {
      type: 'BOOLEAN',
      notNull: true,
    },
    failure_type: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
  });
};
export const down = (pgm) => {
  pgm.dropTable('sensor_data');
};
