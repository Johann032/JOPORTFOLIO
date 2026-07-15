import { getProjects } from "./lib/mdx"

async function run() {
  const projects = await getProjects()
  console.log(JSON.stringify(projects, null, 2))
}

run().catch(console.error)
