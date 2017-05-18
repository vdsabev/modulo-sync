import 'jest';

jest.mock('./stores/local', () => ({ store: { watch: jest.fn() } }));
jest.mock('./stores/firebase', () => ({ store: { watch: jest.fn() } }));

import { store as localStore } from './stores/local';
import { store as firebaseStore } from './stores/firebase';

import './index';

it(`should call store.watch`, () => {
  expect(localStore.watch).toHaveBeenLastCalledWith({
    sourcePath: 'posts/:postId/content.md',
    destinationPath: 'postContent/:postId',
    destination: firebaseStore
  });
});
