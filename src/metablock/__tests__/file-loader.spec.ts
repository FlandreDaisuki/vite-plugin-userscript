import path from 'path';
import { loadMetaFile } from '../file-loader';

const JSON_FILEPATH = path.join(__dirname, './metablock.json');
const JSON5_FILEPATH = path.join(__dirname, './metablock.json5');
const YAML_FILEPATH = path.join(__dirname, './metablock.yml');
const MJS_FILEPATH = path.join(__dirname, './metablock.mjs');

test('load *.json', async() => {
  const json = await loadMetaFile(JSON_FILEPATH);
  expect(json).toStrictEqual({ name: 'metablock' });
});

test('load *.json5', async() => {
  const json5 = await loadMetaFile(JSON5_FILEPATH);
  expect(json5).toStrictEqual({ name: 'metablock' });
});

test('load *.yml', async() => {
  const yml = await loadMetaFile(YAML_FILEPATH);
  expect(yml).toStrictEqual({ name: 'metablock' });
});

test('load unsupported file format', async() => {
  expect(() => loadMetaFile(MJS_FILEPATH))
    .rejects.toThrow('Do not support .mjs now.');
});
