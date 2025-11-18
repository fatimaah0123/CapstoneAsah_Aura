export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('chat_sessions', {
    sessions_id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    user_query: {
      type: 'TEXT',
    },
    agent_response: {
      type: 'TEXT',
    },
    timestamp: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('chat_sessions');
};
