import Promise from 'bluebird';
import fs from 'fs';
import remark from 'remark';
import GitHubSlugger from 'github-slugger';
import yaml from 'js-yaml';

const writeFile = Promise.promisify(fs.writeFile);

const slugger = new GitHubSlugger();

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

  console.log(remark.stringify(yamlNode));
  const noteDate = noteData.date.substr(0, noteData.date.indexOf('T'));
  console.log(`${noteDate}_${noteData.slug}.md`);
  //writeFile(yamlData.slug)
}
