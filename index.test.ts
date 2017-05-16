import 'jest';

const array: any = { map: jest.fn(() => array), filter: jest.fn(() => array) };
const glob = { sync: jest.fn(() => array) };
jest.mock('glob', () => glob);

import { requireAndSync } from './index';

describe(`requireAndSync`, () => {
  it(`should require a file, then call its sync method`, () => {
    const file = { type: 'local', sync: jest.fn() };
    jest.mock('./index.test', () => file);

    requireAndSync('./index.test');
    expect(file.sync).toHaveBeenLastCalledWith({
      source: { type: 'local', path: './posts/*/content.md' },
      destination: { type: 'firebase', path: 'postContent' }
    });
  });
});

it(`should call glob.sync`, () => {
  expect(glob.sync).toHaveBeenLastCalledWith('./stores/!(*.test).js', { cwd: __dirname });
  expect(glob.sync().map).toHaveBeenLastCalledWith(requireAndSync);
});
