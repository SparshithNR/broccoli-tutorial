const Plugin = require('broccoli-plugin');
const { JSDOM } = require('jsdom');

class ComplirePlugin extends Plugin {
    constructor(inputNodes, options) {
        super(inputNodes, {
            annotation: options.annotation,
            persistentOutput: true,
          });
    }
    build() {
        const content = this.input.readFileSync('template.li', 'utf-8');
        const processed = this.processFile(content);
        this.output.writeFileSync('index.html', processed);
    }

    processFile(content) {
        const lineByLine = content.split(/\r?\n/);
        const dom = new JSDOM(`<!DOCTYPE html>`);
        let currentElement = '';
        let tagClosed = true;
        let existingElement = false;
        lineByLine.forEach(function(line) {
            const lineSplit = line.split(' ');
            if (tagClosed) {
                if (['head', 'body'].includes(lineSplit[1])) {
                    currentElement = dom.window.document[lineSplit[1]];
                    existingElement = true;
                } else {
                    currentElement = dom.window.document.createElement(lineSplit[1]);
                }
                let classPresent = line.includes(`class=`);
                if(classPresent) {
                    const className = line.split('class=')[1].replace(/"/g, '');
                    currentElement.className = className;
                }
                tagClosed = false;
            } else {
                currentElement.innerHTML = line.trim();
                if (!existingElement) {
                    dom.window.document.appendChild(currentElement);
                }
                tagClosed = true;
                existingElement = false;
            }
        });
        return dom.serialize();
    }
}

module.exports = ComplirePlugin;