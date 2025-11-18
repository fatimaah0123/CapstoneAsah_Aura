export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createType('equipment_status', ['active', 'maintenance', 'down']);

  pgm.createTable('equipments', {
    id: {
      type: 'serial',
      primaryKey: true,
      notNull: true,
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    type: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    location: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    installation_date: {
      type: 'DATE',
      notNull: true,
    },
    status: {
      type: 'equipment_status',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('equipments');
  pgm.dropType('equipment_status');
};
