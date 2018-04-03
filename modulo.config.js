// Example configuration
const { file } = require('./plugins/file');
const { firebase } = require('./plugins/firebase');
const { invoke, partial } = require('./plugins/utils');

module.exports = () => ({
  options: {
    firebase: {
      keyFilename: 'posts/firebase.json',
      databaseURL: 'https://modulo-one.firebaseio.com'
    }
  },
  events: [
    {
      watch: file.watch('posts/:postId/content.md'),
      'on [add, change]': [file.run('readFile'), firebase.set('postContent/:postId')],
      'on [unlink]': partial(firebase.remove, 'postContent/:postId')
    },
    {
      watch: file.watch('posts/:postId/content.md'),
      'on [add, change]': [file.run('readFile'), invoke('toString'), partial(file.run('writeFile'), 'posts/:postId/content2.md')],
      'on [unlink]': partial(file.run('unlink'), 'posts/:postId/content2.md')
    }
  ]
});
