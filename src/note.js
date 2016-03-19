import noteCreate from './note-create';
import noteList from './note-list';

export default {
  builder(program) {
    return program
      .command('create', 'creates a new note', noteCreate)
      .command('list', 'displays a list of notes', noteList);
  },
  handler(args) {
  }
};
