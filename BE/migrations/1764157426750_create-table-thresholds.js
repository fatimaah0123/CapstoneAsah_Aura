export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('thresholds', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    status: {
      type: 'varchar(255)',
      notNull: true,
    },
    priority: {
      type: 'varchar(255)',
      notNull: true,
    },
    action: {
      type: 'varchar(255)',
      notNull: true,
    },
  });
};
export const down = (pgm) => {
  pgm.dropTable('thresholds');
};
