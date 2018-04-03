it(`TODO`);

// import { parseEventDefinition } from './config';

// jest.mock('./config', () => ({
//   parseEventDefinition,
//   config: { events: [{ 'on file [a, b]': 'c', 'do exec [d]': 'e' }] }
// }));

// jest.mock('./plugins/file', () => ({ plugin: { watch: jest.fn() } }));
// jest.mock('./plugins/exec', () => ({ plugin: { run: jest.fn() } }));

// import { last } from 'compote-fp';

// import { pattern } from './pattern';
// import * as source from './plugins/file';
// import * as destination from './plugins/exec';

// import './index';

// it(`should call source.on`, () => {
//   expect(source.watch).toHaveBeenCalled();

//   const sourceCall = last(source.watch.mock.calls);
//   expect(sourceCall[0]).toEqual(['a', 'b']);
// });

// it(`should call destination.do`, () => {
//   expect(source.on).toHaveBeenCalled();

//   const sourceCall = last(source.on.mock.calls);
//   sourceCall[2]('a', 'b', 'c');

//   expect(destination.do).toHaveBeenCalled();

//   const destinationCall = last(destination.do.mock.calls);
//   expect(destinationCall[0]).toEqual(['d']);
//   expect(destinationCall[1]).toEqual('e');
//   expect(destinationCall[2]).toEqual('b');
//   expect(destinationCall[3]).toEqual('c');
// });
