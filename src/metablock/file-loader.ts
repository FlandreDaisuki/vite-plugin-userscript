import fs from 'fs-extra';
import path from 'path';
import YAML from 'js-yaml';
import JSON5 from 'json5';
import { UnsupportedFormat } from './error';


const loadJSON = async(filepath: string) => {
  try {
    const content = await fs.readFile(filepath, 'utf8');
    return JSON5.parse(content);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const loadYAML = async(filepath: string) => {
  try {
    const content = await fs.readFile(filepath, 'utf8');
    return YAML.load(content);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const loadMetaFile = async(filename: string) => {
  const filepath = path.resolve(filename);
  const ext = path.extname(filepath);
  switch (ext) {
  case '.json':
  case '.json5':
    return loadJSON(filepath);
  case '.yaml':
  case '.yml':
    return loadYAML(filepath);
  default:
    throw new UnsupportedFormat(`Do not support ${ext} now.`);
  }
};

export default loadMetaFile;
