const { createBuilder, createTempDir } = require('broccoli-test-helper');
const { expect } = require('chai');
const ComplirePlugin = require('../plugins/complier-plugin');

describe('ComplirePlugin', function () {
    it('should build', async function () {
      const input = await createTempDir();
      try {
        const subject = new ComplirePlugin([input.path()]);
        const output = createBuilder(subject);
        try {
          input.write({
            'template.li':
`- head
    this is a head
- body
    body text`
          });
          await output.build();

          expect(output.read()).to.deep.equal({
            'index.html': '<!DOCTYPE html><html><head>this is a head</head><body>body text</body></html>'
          });
          expect(output.changes()).to.deep.equal({
            'index.html': 'create',
          });

          // UPDATE
          input.write({
            'template.li':
`- head
    this is a head`
          });
          await output.build();

          expect(output.read()).to.deep.equal({
            'index.html': '<!DOCTYPE html><html><head>this is a head</head><body></body></html>',
          });
          expect(output.changes()).to.deep.equal({
            'index.html': 'change',
          });

          await output.build();

          expect(output.changes(), 'should not change anything').to.deep.equal({});
        } finally {
          await output.dispose();
        }
      } finally {
        await input.dispose();
      }
    });
  });