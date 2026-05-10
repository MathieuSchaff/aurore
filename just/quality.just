# Check code with Biome (pass tests=1 to use biome.tests.json)
lint tests="":
    #!/usr/bin/env bash
    BIOME_CONFIG=$([ -n "{{tests}}" ] && echo "--config-path=biome.tests.json" || echo "")
    bunx biome check $BIOME_CONFIG .

# Fix lint issues (pass tests=1 to use biome.tests.json)
lint-fix tests="":
    #!/usr/bin/env bash
    BIOME_CONFIG=$([ -n "{{tests}}" ] && echo "--config-path=biome.tests.json" || echo "")
    bunx biome check --write $BIOME_CONFIG .

# Format code with Biome (pass tests=1 to use biome.tests.json)
format tests="":
    #!/usr/bin/env bash
    BIOME_CONFIG=$([ -n "{{tests}}" ] && echo "--config-path=biome.tests.json" || echo "")
    bunx biome format --write $BIOME_CONFIG .

# Audit changed files vs main (new issues only)
fallow:
    npx fallow audit --format compact

# Global dead-code scan
fallow-scan:
    npx fallow dead-code --production --include-dupes --summary

# Find duplications
fallow-dupes:
    npx fallow dupes

# Analyze cyclomatic/cognitive complexity
fallow-health:
    npx fallow health

# Save audit baseline (reset after big cleanup)
fallow-baseline:
    npx fallow dead-code --save-baseline .fallow/audit-dead-code.json --quiet
    npx fallow health --save-baseline .fallow/audit-health.json --quiet
    npx fallow dupes --save-baseline .fallow/audit-dupes.json --quiet
