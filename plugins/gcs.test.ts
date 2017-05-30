import 'jest';

it(`TODO`);

// import * as path from 'path';
// jest.mock('path', () => ({ ...path, sep: '/' }));

// import { constant } from '../utils';

// const readStream: any = {
//   push: jest.fn(),
//   pipe: jest.fn(() => readStream),
//   on: jest.fn(() => readStream)
// };
// jest.mock('stream', constant({ Readable: jest.fn(constant(readStream)) }));
// import { Readable } from 'stream';

// const fileResult: any = {
//   download: jest.fn(() => fileResult),
//   delete: jest.fn(() => fileResult),
//   catch: jest.fn(() => fileResult),
//   createWriteStream: jest.fn()
// };
// const file = jest.fn(constant(fileResult));
// jest.mock('@google-cloud/storage', () => jest.fn(constant({ bucket: constant({ file }) })));

// jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
// import { logger } from '../logger';

// import { plugin } from './gcs';

// describe(`read`, () => {
//   it(`should read reference`, () => {
//     plugin.read('read');
//     expect(file).toHaveBeenLastCalledWith('read');
//     expect(file().download).toHaveBeenCalled();
//     expect(file().catch).toHaveBeenLastCalledWith(logger.error);
//   });
// });

// describe(`write`, () => {
//   it(`should create read stream and call bucket API methods`, () => {
//     plugin.write('write', 'content');
//     expect(file).toHaveBeenLastCalledWith('write');
//     expect(file().createWriteStream).toHaveBeenCalled();
//     expect(Readable).toHaveBeenCalled();
//   });
// });

// describe(`delete`, () => {
//   it(`should call bucket API methods`, () => {
//     plugin.delete('delete');
//     expect(file).toHaveBeenLastCalledWith('delete');
//     expect(file().delete).toHaveBeenCalled();
//     expect(file().catch).toHaveBeenLastCalledWith(logger.error);
//   });
// });

// describe(`watch`, () => {
//   it(`should log action`, () => {
//     if (!plugin.watch) throw new Error('Invalid plugin watch function!');

//     plugin.watch({ sourcePath: 'a', destinationPath: 'b', destination: plugin });
//     expect(logger.log).toHaveBeenLastCalledWith('[GCS] a -> b');
//   });
// });
