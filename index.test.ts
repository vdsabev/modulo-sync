import 'jest';

import { parseEventDefinition } from './config';
jest.mock('./config', () => ({
  parseEventDefinition,
  config: { events: [{ 'on file [a, b]': 'c', 'do exec [d]': 'e' }] }
}));

jest.mock('./plugins/file', () => ({ plugin: { on: jest.fn() } }));
jest.mock('./plugins/exec', () => ({ plugin: { do: jest.fn() } }));

import { pattern } from './pattern';
import { plugin as source } from './plugins/file';
import { plugin as destination } from './plugins/exec';
import { last } from './utils';

import './index';

it(`should call source.on`, () => {
  expect(source.on).toHaveBeenCalled();

  const sourceCall = last(source.on.mock.calls);
  expect(sourceCall[0]).toEqual(['a', 'b']);
});

it(`should call destination.do`, () => {
  const sourceCall = last(source.on.mock.calls);
  sourceCall[2]('a', 'b', 'c');

  expect(destination.do).toHaveBeenCalled();

  const destinationCall = last(destination.do.mock.calls);
  expect(destinationCall[0]).toEqual(['d']);
  expect(destinationCall[1]).toEqual('e');
  expect(destinationCall[2]).toEqual('b');
  expect(destinationCall[3]).toEqual('c');
});
