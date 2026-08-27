import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

interface BoundaryFixture {
  fixture: string
  virtualPath: string
  expectedMessage: string
}

const repositoryRoot = `${import.meta.dir}/..`
const biome = `${repositoryRoot}/node_modules/.bin/biome`
const fixtures: BoundaryFixture[] = [
  {
    fixture: 'frontend/lint-fixtures/auth-boundaries/component-imports-store.tsx.fixture',
    virtualPath: 'frontend/src/component/auth-boundary-fixture/StoreConsumer.tsx',
    expectedMessage: 'Auth store is internal to the session state adapter',
  },
  {
    fixture: 'frontend/lint-fixtures/auth-boundaries/component-imports-transition.tsx.fixture',
    virtualPath: 'frontend/src/component/auth-boundary-fixture/TransitionConsumer.tsx',
    expectedMessage: 'Session transitions are restricted to named infrastructure writers',
  },
  {
    fixture: 'frontend/lint-fixtures/auth-boundaries/business-reexports-transition.ts.fixture',
    virtualPath: 'frontend/src/features/products/auth-boundary-fixture/TransitionFacade.ts',
    expectedMessage: 'Session transitions are restricted to named infrastructure writers',
  },
  {
    fixture: 'frontend/lint-fixtures/auth-boundaries/business-imports-bearer.ts.fixture',
    virtualPath: 'frontend/src/features/products/auth-boundary-fixture/BearerConsumer.ts',
    expectedMessage: 'Raw bearer access is restricted to transport adapters',
  },
  {
    fixture: 'frontend/lint-fixtures/auth-boundaries/non-scheduler-imports-expiration.ts.fixture',
    virtualPath: 'frontend/src/lib/queries/auth-boundary-fixture/ExpirationConsumer.ts',
    expectedMessage: 'Credential expiration is restricted to freshness and scheduling',
  },
]

for (const fixture of fixtures) {
  const source = await Bun.file(join(repositoryRoot, fixture.fixture)).text()
  const target = join(repositoryRoot, fixture.virtualPath)
  const targetDirectory = dirname(target)
  await mkdir(targetDirectory)

  try {
    await writeFile(target, source)
    const child = Bun.spawn([biome, 'lint', '--colors=off', target], {
      cwd: repositoryRoot,
      stdout: 'pipe',
      stderr: 'pipe',
    })
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ])
    const diagnostics = `${stdout}\n${stderr}`

    if (exitCode === 0) {
      throw new Error(`${fixture.fixture} passed but must violate its auth import boundary`)
    }
    if (!diagnostics.includes(fixture.expectedMessage)) {
      throw new Error(
        `${fixture.fixture} failed without the expected boundary diagnostic:\n${diagnostics}`
      )
    }
  } finally {
    await rm(targetDirectory, { recursive: true })
  }
}

console.log(`Auth import boundaries: ${fixtures.length} negative fixtures rejected`)
