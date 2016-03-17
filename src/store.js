import Promise from 'bluebird';
import fs from 'fs';
import GitHubSlugger from 'github-slugger';
import yaml from 'js-yaml';
import path from 'path';
import remark from 'remark';

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
  writeNote(details, contents) {
    const date = details.date.substr(0, details.date.indexOf('T'));
    console.log(`Filename: ${date}_${details.slug}.md`);
    console.log(contents);
  }
}

const backend = new FileSystemNoteStoreBackend();

export function createNote(title) {
  const noteData = {
    title,
    slug: slugger.slug(title),
    date: new Date().toISOString()
  };

  const yamlNode = {
    type: 'yaml',
    value: yaml.dump(noteData).trim()
  };

  let noteContents = remark.stringify(yamlNode);
  if (!noteContents.endsWith('\n')) {
    noteContents += '\n';
  }

  return backend.writeNote(noteData, noteContents)
    .then(path => {
      console.log(`Created "${noteData.title}" at ${path}`);
    })
    .catch(err => console.log);
}
