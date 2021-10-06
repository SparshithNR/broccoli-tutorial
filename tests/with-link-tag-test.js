const { createBuilder, createTempDir } = require('broccoli-test-helper');
const { expect } = require('chai');
const CompilerPlugin = require('../plugins/complier-plugin');

describe('CompilerPlugin with Link Tag', function () {
    it('should build', async function () {
      const input = await createTempDir();
      try {
        const subject = new CompilerPlugin([input.path()]);
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

          expect(output.changes(), 'should create index.html').to.deep.equal({
            'index.html': 'create',
          });
          expect(output.read(), 'should have content').to.deep.equal({
            'index.html': '<!DOCTYPE html><html><head>this is a head</head><body>body text</body></html>'
          });

          // UPDATE
          input.write({
            'template.li':
`- head
    this is a head
- link
    app.css`
          });
          await output.build();

          expect(output.changes()).to.deep.equal({
            'index.html': 'change',
          }, 'should change index.html');
          expect(output.read(), 'should have updated content with link tag').to.deep.equal({
            'index.html': '<!DOCTYPE html><html><head>this is a head<link rel="stylesheet" href="app.css"></head><body></body></html>',
          });

        } finally {
          await output.dispose();
        }
      } finally {
        await input.dispose();
      }
    });
  });