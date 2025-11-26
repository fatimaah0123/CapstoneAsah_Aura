export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createType('machine_type', ['L', 'M', 'H']);
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
      type: 'machine_type',
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
};
