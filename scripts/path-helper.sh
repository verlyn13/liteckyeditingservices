#!/bin/bash

# Path Helper for Litecky Editing Services
# Source this file to ensure correct working directory and paths

PROJECT_ROOT="/home/verlyn13/Projects/verlyn13/liteckyeditingservices"

# Function to ensure we're in the project root
ensure_project_root() {
    if [ "$(pwd)" != "$PROJECT_ROOT" ]; then
        echo "⚠️  Not in project root. Changing to: $PROJECT_ROOT"
        cd "$PROJECT_ROOT" || {
            echo "❌ Failed to change to project root"
            return 1
        }
    fi
    echo "✅ Working in project root: $(pwd)"
}

# Function to run commands in worker directories
run_in_worker() {
    local worker_name="$1"
    shift
    local worker_path="$PROJECT_ROOT/workers/$worker_name"

    if [ ! -d "$worker_path" ]; then
        echo "❌ Worker directory not found: $worker_path"
        return 1
    fi

    echo "🔧 Running in worker '$worker_name': $*"
    (cd "$worker_path" && "$@")
}

# Function to validate current path
validate_path() {
    if [ "$(pwd)" != "$PROJECT_ROOT" ]; then
        echo "❌ Not in project root: $(pwd)"
        echo "   Expected: $PROJECT_ROOT"
        return 1
    fi

    echo "✅ Path validation passed"
    return 0
}

# Auto-correct path if sourced
if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    ensure_project_root
fi
