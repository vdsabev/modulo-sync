import 'jest';

jest.mock('./plugins/file', () => ({ plugin: { watch: jest.fn() } }));
jest.mock('./plugins/firebase', () => ({ plugin: { watch: jest.fn() } }));

import { plugin as filePlugin } from './plugins/file';
import { plugin as firebasePlugin } from './plugins/firebase';

import './index';

it(`should call plugin.watch`, () => {
  expect(filePlugin.watch).toHaveBeenLastCalledWith({
    sourcePath: 'posts/:postId/content.md',
    destinationPath: 'postContent/:postId',
    destination: firebasePlugin
  });
});
