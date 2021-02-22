const HTMLParser = require('node-html-parser');
const fs = require('fs');

const parseHTML = HTMLParser.parse;


const files = process.argv.slice(2)
let data = {}
files.forEach(file => {
    const dirs = file.split('/').map(d => d.split('-').join(' ').trim())
    const filename = dirs.pop()
    const name = filename.slice(0, filename.indexOf('.'))
    const parent = dirs[0]
    const child = dirs[1]

    if (!data[parent] || !data[parent][child]) {
        data = {
            ...data,
            [parent]: {
                ...data[parent],
                [child]: [{
                    file,
                    name,
                    tags: dirs
                }]
            }
        }
    } else {
        data = {
            ...data,
            [parent]: {
                ...data[parent],
                [child]: [...data[parent][child],
                {
                    file,
                    name,
                    tags: dirs
                }
                ]
            }
        }
    }

});


const root = parseHTML(fs.readFileSync(__dirname + '/index.html').toString(), {
    script: true
});

const a = Object.keys(data).map( id => {
    return`<p class="menu-label is-uppercase has-text-weight-bold">${id}</p>

    ${Object.keys(data[id]).map(child => {

       return `<ul class="menu-list"><li><a class="is-capitalized">${child}</a> <li>
            <ul>
                ${data[id][child].map(node => {
                    return `<li><a class="is-capitalized" href="${node.file}.html"> ${node.name}</a></li>`
                    
                }).join('')}
            </ul>
        </ul>`
    }).join('')}
    `
}).join('')


let html = '<ul>' + a + '</ul>'


// const html = data.map(d => buildTemplate(d))
root.querySelector('#menu').set_content(html)

fs.writeFile('index.html', root.toString(), 'utf8', function (err) {
    if (err) return console.log(err);
});





function buildTemplate({ file, name, tags }) {
    return `
    <div class="tile is-child box notification is-primary is-rounded">
        <p class="title">
            <a href="./${file}.html">${name}</a>
        </p>
        <div class="tags">
        ${tags.map(tag => `<span class="tag is-rounded is-info">${tag}</span>`).join('')}
        </div>    
    </div>    
    `
}

