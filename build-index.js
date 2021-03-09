const HTMLParser = require('node-html-parser')
const { promises: fs } = require("fs");
const DOC_ROOT = './doc/'

async function main() {
    const parseHTML = HTMLParser.parse
    const files = await getFiles(DOC_ROOT, /\.md*$/)
    const index = await fs.readFile(__dirname + '/index.html')
    const root = parseHTML(index.toString(), {
        script: true
    });
    const esquemas = root.querySelector('#esquemas')
    esquemas.set_content('')
    for (const file of files) {
        const md = await fs.readFile(__dirname + '/' + file.path)
        esquemas.appendChild(`<pre data-mm="${file.path}"> ${md.toString()}</pre>\n`)
    }

    root.querySelector('#menu').set_content(buildTemplate(getTree(files), DOC_ROOT))

    await fs.writeFile('index.html', root.toString(), 'utf8')
    console.log('index.html actualizado')
}

function buildTemplate(data = {}) {
    return '<ul>' + Object.keys(data).map(id => {
        return `<p class="menu-label is-uppercase has-text-weight-bold" style="color: #8FB9A8;">${id}</p>
    
        ${Object.keys(data[id]).map(child => {

            return `<ul class="menu-list"><li><span class="is-capitalized has-text-weight-bold" style="color: #FCD0BA;">${child}</span> <li>
                <ul>
                    ${data[id][child].map(node => {
                        return `<li><a class="is-capitalized" style="color: #F1828D;" data-rel-mm="${node.file.path}" href="${node.file.path}"> ${node.name}</a></li>`

            }).join('')}
                </ul>
            </ul>`
        }).join('')}
        `
    }).join('') + '</ul>'
}


function getTree(files = [], ignorePath = DOC_ROOT) {
    let data = {}
    files.forEach(file => {
        const dirs = file.path.replace(ignorePath, '').split('/').map(d => d.split('-').join(' ').trim())
        const filename = file.name
        const name = filename.slice(0, filename.indexOf('.')).split('-').join(' ')
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
    return data
}


async function getFiles(path = DOC_ROOT, filter = /\.html*$/) {

    const entries = await fs.readdir(path, { withFileTypes: true })

    const files = entries
        .filter(file => !file.isDirectory() && filter.test(file.name))
        .map(file => ({ ...file, path: path + file.name }))


    const folders = entries.filter(folder => folder.isDirectory())


    for (const folder of folders) {
        files.push(...await getFiles(`${path}${folder.name}/`, filter))
    }

    return files

}

main()

