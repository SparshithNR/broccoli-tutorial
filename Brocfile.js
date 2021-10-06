import ComplirePlugin from './plugins/complier-plugin';

export default () => new ComplirePlugin(['app'], {
  destDir: 'dist'
});