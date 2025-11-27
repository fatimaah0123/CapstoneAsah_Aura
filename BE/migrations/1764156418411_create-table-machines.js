export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createType('machine_type_enum', ['L', 'M', 'H']);
  pgm.createTable('machines', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    type: {
      type: 'machine_type_enum',
      notNull: true,
    },
    location: {
      type: 'varchar(255)',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('machines');
  pgm.dropType('machine_type_enum');
};
