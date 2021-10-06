import CompilerPlugin from './plugins/compiler-plugin';

export default () => new CompilerPlugin(['app'], {
  destDir: 'dist'
});