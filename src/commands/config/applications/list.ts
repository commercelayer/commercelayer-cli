import fs from 'fs'

type ApplicationsList = (path: string) => void

const applicationsList: ApplicationsList = (path) => {
  const directories = fs.readdirSync(path)
  directories.map((dir) => console.log(`- ${dir}`))
}

export default applicationsList
