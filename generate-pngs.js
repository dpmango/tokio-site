const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const shell = require('shelljs');
const { argv } = process;

let fullpath = '';
let basedir = '';
let svgCode = '';

if (!shell.which('inkscape')) {
  throw 'Inkscape binary not found';
}

if (!argv[2]) {
  throw 'No path given';
} else {
  fullpath = path.resolve(__dirname, argv[2]);
  basedir = path.dirname(fullpath);
}

svgCode = fs.readFileSync(fullpath, { encoding: 'utf-8' });

createPngs();

function createPngs() {
  let width,
    height;

  (function s() {
    const $ = cheerio.load(svgCode);
    const $el = $('svg');
    const vb = $el.attr('viewBox');
    if (vb) {
      const splice = vb.split(' ')
        .splice(2);
      console.log(splice);
      width = +splice[0];
      height = +splice[1];
      return;
    }

    width = +$el.attr('width');
    height = +$el.attr('height');
  })();

  shell.pushd(basedir);
  const filename = path.basename(fullpath, '.svg');
  shell.exec(`inkscape -z -e ${filename}.png -w ${width} -h ${height} ${filename}.svg`);
  shell.exec(`inkscape -z -e ${filename}@2x.png -w ${width * 2} -h ${height * 2} ${filename}.svg`);
  shell.popd();
}