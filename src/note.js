import noteCreate from './note-create';

export default {
  builder(program) {
    return program
      .command('create', 'creates a new note document', noteCreate);
  },
  handler(args) {
  }
};
