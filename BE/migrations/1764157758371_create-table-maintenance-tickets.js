export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createType('status_enum', ['open', 'in_progress', 'closed']);
  pgm.createType('maintenance_type_enum', [
    'preventive',
    'corrective',
    'predictive',
    'inspective',
  ]);
  pgm.createTable('maintenance_tickets', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    name_pic: {
      type: 'varchar(255)',
      notNull: true,
    },
    contact: {
      type: 'varchar(255)',
      notNull: true,
    },
    member: {
      type: 'jsonb',
      notNull: true,
    },
    date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    estimated_duration: {
      type: 'varchar(255)',
      notNull: true,
    },
    maintenance_type: {
      type: 'maintenance_type_enum',
      notNull: true,
    },
    status: {
      type: 'status_enum',
      notNull: true,
      default: 'open',
    },
    part: {
      type: 'varchar(255)',
      notNull: true,
    },
    additional_notes: {
      type: 'text',
      notNull: false,
    },
    image: {
      type: 'varchar(255)',
      notNull: false,
    },
    machine_id: {
      type: 'integer',
      notNull: true,
      references: 'machines',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('maintenance_tickets');
  pgm.dropType('status_enum');
  pgm.dropType('maintenance_type_enum');
};
