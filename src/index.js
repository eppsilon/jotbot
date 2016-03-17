#!/usr/bin/env node

import program from 'yargs';
import note from './note';

try {
  program
    .command('note', 'view and manage notes', note.builder, note.handler)
    .parse(process.argv);
} catch (err) {
  if (err.stack) {
    console.error(err.stack);
  } else {
    console.error(err);
  }
}
