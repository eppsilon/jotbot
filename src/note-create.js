import {createNote} from './store';

export default {
  builder(program) {
    return program
      .demand(1);
  },
  handler(args) {
    const title = args._.pop();
    return createNote(title);
  }
};
