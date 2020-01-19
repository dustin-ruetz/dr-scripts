const {copyFile, readdir, readFile, writeFile} = require('fs').promises
const path = require('path')
const yargsParser = require('yargs-parser')

// verify that only one argument is passed via the CLI
const parsedArgs = yargsParser(process.argv.slice(2))
if (parsedArgs._.length !== 1) {
  throw new Error(
    '`dr-scripts init-repo` accepts one argument (a repo-name); ' +
      `${parsedArgs._.length} arguments were passed.`,
  )
}

const repoName = parsedArgs._[0]

// verify that repo-name contains only lowercase alphanumeric characters and hyphens
const illegalRepoName = /[^a-z0-9-]/.test(repoName)
if (illegalRepoName) {
  throw new Error(
    'repo-name can only contain lowercase alphanumeric characters and hyphens.',
  )
}

// cwd = current working directory
const cwd = process.cwd()

const here = p => path.join(__dirname, p)
const hereRelative = p => here(p).replace(cwd, '.')

const initRepoFilesDir = hereRelative('../init-repo-files/')

const getFilenames = {
  files: [
    {name: 'editorconfig', type: 'dotfile'},
    {name: 'gitattributes', type: 'dotfile'},
    {name: 'gitignore', type: 'dotfile'},
    {name: 'license-mit', type: 'license'},
    {name: 'package', type: 'json'},
    {name: 'readme', type: 'md'},
  ],
  initial: () => readdir(initRepoFilesDir),
  new: function(initialName) {
    const file = this.files.find(file => file.name === initialName)
    const type = file ? file.type : undefined

    switch (type) {
      case undefined:
        return undefined
      case 'dotfile':
        return `.${initialName}`
      case 'license':
        return initialName.replace('-mit', '')
      default:
        return `${initialName}.${type}`
    }
  },
}

async function writeFileContent(newFilename) {
  const file = {
    fullPath: `${cwd}/${newFilename}`,
    getContent: function() {
      const content = readFile(this.fullPath, {encoding: 'utf8'})
      return content
    },
  }

  const content = await file.getContent()

  let replaceContent
  switch (newFilename) {
    case 'license':
      replaceContent = {from: '{copyright-year}', to: new Date().getFullYear()}
      break
    case 'package.json':
    case 'readme.md':
      replaceContent = {from: /{repo-name}/g, to: repoName}
      break
  }

  writeFile(
    file.fullPath,
    content.replace(replaceContent.from, replaceContent.to),
    {encoding: 'utf8'},
  )

  // eslint-disable-next-line no-console
  console.log(
    `* Set ${replaceContent.from} to ${replaceContent.to} in ${newFilename}.`,
  )
}

async function copyFiles() {
  const results = {
    failed: [],
    succeeded: [],
  }

  const initialFilenames = await getFilenames.initial()

  // array iteration with promises adapted from "Making array iteration easy when using async/await" by Antonio Val
  // https://medium.com/@antonioval/making-array-iteration-easy-when-using-async-await-6315c3225838
  await Promise.all(
    initialFilenames.map(async initialFilename => {
      const newFilename = getFilenames.new(initialFilename)

      if (newFilename) {
        // `await copyFile` below ensures that the `copyFile` operation completes
        // before pushing the filename into the results[failed/succeeded] arrays
        await copyFile(
          `${initRepoFilesDir}/${initialFilename}`,
          `${cwd}/${newFilename}`,
        )
          .then(() => {
            switch (newFilename) {
              case 'license':
              case 'package.json':
              case 'readme.md':
                writeFileContent(newFilename)
                break
            }

            results.succeeded.push({name: newFilename})
          })
          .catch(() =>
            results.failed.push({
              name: initialFilename,
              error: 'failed to copy',
            }),
          )
      } else {
        results.failed.push({
          name: initialFilename,
          error: 'unknown file name/type',
        })
      }
    }),
  )

  // `await Promise.all` above ensures that all `copyFile` operations complete
  // (i.e. every file in the array is copied) prior to returning the results
  return results
}

copyFiles().then(({failed, succeeded}) => {
  /* eslint-disable no-console */
  console.log(`Results of copying init-repo-files to ${cwd}/:`)

  function logFilenames(fileList) {
    // sort fileList using file.name
    fileList.sort(function(fileA, fileB) {
      if (fileA.name < fileB.name) return -1
      if (fileA.name > fileB.name) return 1
      return 0
    })

    switch (fileList) {
      case failed:
        fileList.forEach(file =>
          console.log(` ❌  ${file.name} (error: ${file.error})`),
        )
        break
      case succeeded:
        fileList.forEach(file => console.log(` ✅  ${file.name}`))
        break
    }
  }

  if (succeeded.length > 0) {
    console.log(`\n Copying succeeded for ${succeeded.length} file(s):`)
    logFilenames(succeeded)
  }

  if (failed.length > 0) {
    console.error(`\n Copying failed for ${failed.length} file(s):`)
    logFilenames(failed)
  }
  /* eslint-enable no-console */
})
