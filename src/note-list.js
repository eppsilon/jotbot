import {listNotes} from './store';

export default {
  builder(program) {
    return program;
  },
  handler(args) {
    return listNotes();
  }
};
