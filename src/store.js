import Promise from 'bluebird';
import fs from 'fs';
import GitHubSlugger from 'github-slugger';
import yaml from 'js-yaml';
import path from 'path';
import remark from 'remark';
import * as Rx from 'rxjs';

const readdir = Promise.promisify(fs.readdir);
const stat = Promise.promisify(fs.stat);
const writeFile = Promise.promisify(fs.writeFile);

const slugger = new GitHubSlugger();

// interface NoteStoreBackend {
//
// }
//
class FileSystemNoteStoreBackend /*implements NoteStoreBackend*/ {
  constructor() {
    this.notesPath = '/Users/brett/Dropbox/Notes';
  }

  listNotes() {
    return Rx.Observable.fromPromise(readdir(this.notesPath))
      // take entry list and emit each entry as value
      .flatMap(entries => Rx.Observable.of(...entries))
      .flatMap(entry => {
        // stat each entry, then tie the path to it
        const entryPath = path.join(this.notesPath, entry);
        return stat(entryPath).then(fstats => Object.assign(fstats, { path: entryPath }));
      })
      // just emit MD files that aren't hidden
      .filter(fstats => fstats.isFile() &&
        !fstats.path.startsWith('.') &&
        fstats.path.endsWith('.md'));
  }

  writeNote(details, contents) {
    const date = details.date.substr(0, details.date.indexOf('T'));
    const filename = `${date}_${details.slug}.md`;
    const filePath = path.join(this.notesPath, filename);
    return writeFile(filePath, contents)
      .then(() => {
        return filePath;
      });
  }
}

class MockNoteStoreBackend /*implements NoteStoreBackend*/ {
  listNotes() {
    return Promise.resolve(['2016-03-17_blah.md', '2016-03-18_woo-hoo-yay.md']);
  }

  writeNote(details, contents) {
    const date = details.date.substr(0, details.date.indexOf('T'));
    const filePath = `${date}_${details.slug}.md`;
    console.log(`Filename: ${filePath}`);
    console.log(contents);
    return Promise.resolve(filePath);
  }
}

const backend = new FileSystemNoteStoreBackend();
//const backend = new MockNoteStoreBackend();

export function listNotes() {
  return backend.listNotes()
    .subscribe(note => {
      //notes.forEach(note => {
        console.log(note.path);
      //});
    });
}

export function createNote(title) {
  const noteData = {
    title,
    slug: slugger.slug(title),
    date: new Date().toISOString()
  };

  const rootNode = {
    type: 'root',
    children: []
  };

  const yamlNode = {
    type: 'yaml',
    value: yaml.dump(noteData).trim()
  };

  const headingNode = {
    type: 'heading',
    depth: 1,
    children: [{ type: 'text', value: noteData.title }]
  };

  rootNode.children.push(yamlNode);
  rootNode.children.push(headingNode);

  let noteContents = remark.stringify(rootNode);
  if (!noteContents.endsWith('\n')) {
    noteContents += '\n';
  }

  return backend.writeNote(noteData, noteContents)
    .then(path => {
      console.log(`Created "${noteData.title}" at ${path}`);
    })
    .catch(err => console.log);
}
