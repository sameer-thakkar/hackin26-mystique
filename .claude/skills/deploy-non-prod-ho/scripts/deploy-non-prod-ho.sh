#!/usr/bin/env bash

# deploy-non-prod-ho: Headout deployment script using Nimbus API
# Usage: deploy-non-prod-ho <service-name> <commit/version> <environment>
# Environments: test, ode

set -euo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

# Base URLs for each environment
declare -A BASE_URLS=(
    ["test"]="https://medusa.dev-headout.com"
    ["ode"]="https://medusa.dev-headout.com"
)

# ArgoCD hostnames per environment
declare -A ARGOCD_HOSTS=(
    ["test"]="argocd.test-headout.com"
    ["ode"]="argocd.dev-headout.com"
)

# Namespace (typically argocd)
NAMESPACE="argocd"

# Polling configuration
POLL_INTERVAL=10        # seconds between polls
POLL_TIMEOUT=60        # max wait time in seconds (1 minutes)

# Cookie name (shared between test and ODE)
declare -A COOKIE_NAMES=(
    ["test"]="ory_session_practicalcraymr4kynf904"
    ["ode"]="ory_session_practicalcraymr4kynf904"
)

# Cookie storage directory
COOKIE_DIR="${HOME}/.deploy-non-prod-ho"

# ============================================================================
# COLORS
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" >&2
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

validate_ode_namespace() {
    local ode_namespace="$1"

    # ODE namespaces can only contain lowercase letters and hyphens
    # Must start and end with a letter
    if [[ ! "$ode_namespace" =~ ^[a-z]([a-z-]*[a-z])?$ ]] && [[ ! "$ode_namespace" =~ ^[a-z]$ ]]; then
        log_error "Invalid ODE namespace format: $ode_namespace"
        echo "ODE namespaces can only contain lowercase letters and hyphens, and must start/end with a letter."
        exit 1
    fi
}

usage() {
    echo "Usage:"
    echo "  deploy-non-prod-ho <service-name> <commit-hash> --env test"
    echo "  deploy-non-prod-ho <service-name> <commit-hash> --ode <ode-namespace>"
    echo ""
    echo "Arguments:"
    echo "  service-name         Name of the service to deploy (e.g., hub-frontend)"
    echo "  commit-hash          Short git commit hash (7 chars, e.g., 7ec56d5)"
    echo "  --env test           Deploy to test environment"
    echo "  --ode <namespace>    Deploy to ODE preview instance"
    echo ""
    echo "Examples:"
    echo "  deploy-non-prod-ho hub-frontend 7ec56d5 --env test"
    echo "  deploy-non-prod-ho hub-frontend 7ec56d5 --ode final"
    echo "  deploy-non-prod-ho hub-frontend 7ec56d5 --ode my-preview"
    echo ""
    echo "Configuration:"
    echo "  Set cookie:          deploy-non-prod-ho --set-cookie <cookie-value>"
    echo "  List services:       deploy-non-prod-ho --list-services <environment>"
    echo "  List builds:         deploy-non-prod-ho --list-builds <service>"
    echo "  List ODE namespaces: deploy-non-prod-ho --list-ode-namespaces"
    echo "  List ODE services:   deploy-non-prod-ho --list-ode-services"
    echo "  ODE dependencies:    deploy-non-prod-ho --ode-dependencies <service-name>"
    echo "  ODE status:          deploy-non-prod-ho --ode-status <ode-namespace>"
    echo "  Wake up ODE:         deploy-non-prod-ho --upscale <ode-namespace>"
    echo "  Create ODE:          deploy-non-prod-ho --create-ode <ode-namespace> <service-name[,service2,...]> <version>"
    echo "  Delete ODE:          deploy-non-prod-ho --delete-ode <ode-namespace>"
    echo "  Share ODE:           deploy-non-prod-ho --share-ode <ode-namespace> <email>"
    echo "  Show cookie config:  deploy-non-prod-ho --show-cookies"
    exit 0
}

init_cookie_dir() {
    if [[ ! -d "$COOKIE_DIR" ]]; then
        mkdir -p "$COOKIE_DIR"
        chmod 700 "$COOKIE_DIR"
    fi
}

get_cookie_file() {
    local env="$1"
    echo "${COOKIE_DIR}/${env}.cookie"
}

check_cookie() {
    local env="$1"
    local cookie_file=$(get_cookie_file "$env")

    if [[ ! -f "$cookie_file" ]]; then
        log_error "No cookie found for $env environment. Please set it first:"
        echo "  deploy-non-prod-ho --set-cookie <cookie-value>"
        exit 1
    fi

    # Validate file format first to prevent injection (format: name:value)
    # Cookie value must match the same pattern as set_cookie validation
    if ! grep -qE '^[a-zA-Z0-9_-]+:[a-zA-Z0-9._=-]+$' "$cookie_file"; then
        log_error "Cookie file for $env is malformed. Please reset it:"
        echo "  deploy-non-prod-ho --set-cookie <cookie-value>"
        exit 1
    fi

    # Read cookie name and value from file (format: name:value)
    # Use IFS for safer parsing instead of cut
    IFS=: read -r CURRENT_COOKIE_NAME CURRENT_COOKIE_VALUE < "$cookie_file"

    if [[ -z "$CURRENT_COOKIE_NAME" || -z "$CURRENT_COOKIE_VALUE" ]]; then
        log_error "Cookie file for $env is malformed. Please reset it:"
        echo "  deploy-non-prod-ho --set-cookie <cookie-value>"
        exit 1
    fi
}

set_cookie() {
    local cookie_value="$1"

    # Validate cookie value format before storing
    # Only allow alphanumeric, dots, equals, hyphens, and underscores for security
    # This prevents header injection and command injection attacks
    if [[ ! "$cookie_value" =~ ^[a-zA-Z0-9._=-]+$ ]]; then
        log_error "Invalid cookie value format. Cookie must contain only alphanumeric characters, dots, equals signs, hyphens, and underscores."
        exit 1
    fi

    if [[ -z "$cookie_value" ]]; then
        log_error "Cookie value cannot be empty."
        exit 1
    fi

    # Only test environment (shared with ODE)
    local env="test"
    local cookie_name="${COOKIE_NAMES[$env]}"

    init_cookie_dir

    # Store for both test and ode
    for shared_env in test ode; do
        local cookie_file=$(get_cookie_file "$shared_env")
        echo "${cookie_name}:${cookie_value}" > "$cookie_file"
        chmod 600 "$cookie_file"
    done
    log_success "Cookie saved for TEST and ODE environments (name: $cookie_name)"
}

show_cookies() {
    init_cookie_dir
    log_info "Cookie configuration:"
    echo ""
    for env in test ode; do
        local cookie_file=$(get_cookie_file "$env")
        if [[ -f "$cookie_file" ]]; then
            local name=$(cut -d':' -f1 "$cookie_file")
            echo "  $env: cookie name = $name (configured)"
        else
            echo "  $env: NOT CONFIGURED"
        fi
    done
}

get_base_url() {
    local env="$1"
    local url="${BASE_URLS[$env]}"
    if [[ -z "$url" ]]; then
        log_error "Unknown environment: $env"
        echo "Valid environments: test, ode"
        exit 1
    fi
    echo "$url"
}

get_argocd_host() {
    local env="$1"
    echo "${ARGOCD_HOSTS[$env]}"
}

# ============================================================================
# API FUNCTIONS
# ============================================================================

api_call() {
    local base_url="$1"
    local endpoint="$2"
    local payload="$3"

    local response
    local http_code

    response=$(curl -s -w "\n%{http_code}" --proto '=https' -X POST \
        "${base_url}/${endpoint}" \
        -H "Content-Type: application/json" \
        -H "Cookie: ${CURRENT_COOKIE_NAME}=${CURRENT_COOKIE_VALUE}" \
        -d "$payload")

    http_code=$(echo "$response" | tail -n1)
    response=$(echo "$response" | sed '$d')

    if [[ ! "$http_code" =~ ^[23][0-9]{2}$ ]]; then
        log_error "API call failed with HTTP $http_code"
        echo "$response" >&2
        return 1
    fi

    echo "$response"
}

get_applications_json() {
    local env="$1"
    local base_url=$(get_base_url "$env")
    
    # Build payload with projects
    local payload='{
        "projects": [
            {"hostName": "argocd.test-headout.com", "name": "headout-env-test-microservices"},
            {"hostName": "argocd.dev-headout.com", "name": "headout-env-ondemand-microservices"}
        ],
        "namespace": "argocd"
    }'

    local response=$(api_call "$base_url" "twirp/medusa.pb.deployment.Deployments/ListApplications" "$payload")
    echo "$response"
}

list_services() {
    local env="$1"
    check_cookie "$env"

    log_info "Fetching services list..."

    local response=$(get_applications_json "$env")

    # Check if response is valid
    if ! echo "$response" | jq -e '.applications' &>/dev/null; then
        log_error "Failed to fetch applications"
        echo "$response"
        exit 1
    fi

    # Print header
    echo ""
    printf "${CYAN}%-40s %-50s %-20s %-10s${NC}\n" "APP NAME" "VERSION" "HEALTH" "ENV"
    printf "%-40s %-50s %-20s %-10s\n" "$(printf '%.0s-' {1..40})" "$(printf '%.0s-' {1..50})" "$(printf '%.0s-' {1..20})" "$(printf '%.0s-' {1..10})"

    # Parse and display applications
    echo "$response" | jq -r '.applications[] | 
        [.name, .version, .health, .project] | 
        @tsv' | while IFS=$'\t' read -r name version health project; do
        
        # Color-code health status
        if [[ "$health" == "Healthy" ]]; then
            health_colored="${GREEN}${health}${NC}"
        elif [[ "$health" == "Degraded" ]]; then
            health_colored="${YELLOW}${health}${NC}"
        else
            health_colored="${RED}${health}${NC}"
        fi
        
        # Truncate long values for display
        name_truncated=$(echo "$name" | cut -c1-39)
        version_truncated=$(echo "$version" | cut -c1-49)
        project_short=$(echo "$project" | sed 's/headout-env-//' | sed 's/-microservices//')
        
        # Print with proper alignment
        printf "%-40s %-50s " "$name_truncated" "$version_truncated"
        
        # Print health with color, then pad to reach ENV column
        echo -ne "${health_colored}"
        # Calculate padding needed (20 chars - actual health text length)
        padding=$((20 - ${#health}))
        printf "%*s" "$padding" ""
        
        printf "%-10s\n" "$project_short"
    done

    echo ""
}

check_service_lock() {
    local service="$1"
    local env="$2"

    # Locks are only applicable to test environment for now
    if [[ "$env" != "test" ]]; then
        return 0
    fi

    log_info "Verifying if service '$service' is locked in test..."

    local response=$(get_applications_json "test")
    local project_filter="headout-env-test-microservices"

    # Extract lock information
    local lock_info=$(echo "$response" | jq -r --arg app "$service" --arg proj "$project_filter" \
        '.applications[] | select(.project == $proj and .name == $app) | .lock')

    if [[ -z "$lock_info" || "$lock_info" == "null" ]]; then
        return 0
    fi

    local is_locked=$(echo "$lock_info" | jq -r '.lock // false')

    if [[ "$is_locked" == "true" ]]; then
        local reason=$(echo "$lock_info" | jq -r '.reason // "No reason provided"')
        local owner=$(echo "$lock_info" | jq -r '.owner // "Unknown"')
        
        echo "" >&2
        log_error "CANNOT DEPLOY: Service '$service' is LOCKED in test environment."
        echo -e "  ${YELLOW}Reason:${NC}  $reason" >&2
        echo -e "  ${YELLOW}Owner:${NC}   $owner" >&2
        echo "" >&2
        exit 1
    fi

    return 0
}

# resolve_app_name: Resolves the canonical service name used by the Nimbus API.
# This handles cases where the user input might include or omit the 'headout-' prefix.
# Arguments: service_name, environment (test/ode), ode_namespace (optional)
resolve_app_name() {
    local service="$1"
    local env="$2"
    local ode_namespace="${3:-}" # Optional, only for ODE

    local found_name=""

    if [[ "$env" == "ode" ]]; then
        local base_url=$(get_base_url "ode")
        # Ensure ode_namespace is provided
        if [[ -z "$ode_namespace" ]]; then
            echo "$service"
            return
        fi

        # Validate ODE namespace format
        validate_ode_namespace "$ode_namespace"

        local payload=$(jq -n --arg namespace "$ode_namespace" '{deploy_namespace: $namespace}')
        local response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetStatus" "$payload")
        
        # Try exact match
        found_name=$(echo "$response" | jq -r --arg app "$service" '.apps[]? | select(.app == $app) | .app' | head -1)
        
        # Try stripped
        if [[ -z "$found_name" ]]; then
            local stripped="${service#headout-}"
            found_name=$(echo "$response" | jq -r --arg app "$stripped" '.apps[]? | select(.app == $app) | .app' | head -1)
        fi
        
        if [[ -z "$found_name" ]]; then
            local prefixed="headout-$service"
            found_name=$(echo "$response" | jq -r --arg app "$prefixed" '.apps[]? | select(.app == $app) | .app' | head -1)
        fi

    else
        # Test environment uses ListApplications which groups apps by project.
        local project_filter="headout-env-test-microservices"
        local initial_list=$(get_applications_json "$env")
        
        # Try exact match
        found_name=$(echo "$initial_list" | jq -r --arg app "$service" --arg proj "$project_filter" \
            '.applications[] | select(.project == $proj) | select(.name == $app) | .name')
        
        # Try stripped
        if [[ -z "$found_name" ]]; then
            local stripped="${service#headout-}"
            found_name=$(echo "$initial_list" | jq -r --arg app "$stripped" --arg proj "$project_filter" \
                '.applications[] | select(.project == $proj) | select(.name == $app) | .name')
        fi
        
        # Try prefixed
        if [[ -z "$found_name" ]]; then
            local prefixed="headout-$service"
            found_name=$(echo "$initial_list" | jq -r --arg app "$prefixed" --arg proj "$project_filter" \
                '.applications[] | select(.project == $proj) | select(.name == $app) | .name')
        fi
    fi
    
    # Return found name or original if not found
    if [[ -n "$found_name" ]]; then
        echo "$found_name"
    else
        echo "$service"
    fi
}

list_builds() {
    local service="$1"
    local env="$2"
    check_cookie "$env"
    local base_url=$(get_base_url "$env")

    log_info "Fetching builds for $service in $env environment..."

    local payload=$(jq -n \
        --arg app "$service" \
        '{applicationName: $app, limit: 100}')

    local response=$(api_call "$base_url" "twirp/medusa.pb.deployment.Deployments/ListApplicationVersions" "$payload")

    echo "$response" | jq -r '.versions[] | .tag' 2>/dev/null || {
        log_error "Failed to parse response. Raw response:"
        echo "$response"
        exit 1
    }
}

find_build_version() {
    local service="$1"
    local commit="$2"
    local env="$3"
    local base_url=$(get_base_url "$env")

    local payload=$(jq -n \
        --arg app "$service" \
        '{applicationName: $app, limit: 100}')

    local response=$(api_call "$base_url" "twirp/medusa.pb.deployment.Deployments/ListApplicationVersions" "$payload")
    # Find versions containing the commit hash
    local versions=$(echo "$response" | jq -r --arg commit "$commit" \
        '.versions[]? | select(.tag != null) | select(.tag | contains($commit)) | .tag')
    
    echo "$versions"
}

check_build_ready() {
    local service="$1"
    local version="$2"
    local env="$3"
    local base_url=$(get_base_url "$env")

    local payload=$(jq -n \
        --arg app "$service" \
        '{applicationName: $app, limit: 100}')

    local response=$(api_call "$base_url" "twirp/medusa.pb.deployment.Deployments/ListApplicationVersions" "$payload")
    # Check if version tag exists
    # If the tag is present in the list, it is considered ready.
    local found=$(echo "$response" | jq -r --arg ver "$version" \
        '.versions[] | select(.tag == $ver) | .tag')

    if [[ -n "$found" ]]; then
        echo "ready"
    else
        echo "not_found"
    fi
}

deploy() {
    local service="$1"
    local version="$2"
    local env="$3"
    local base_url=$(get_base_url "$env")
    local argocd_host=$(get_argocd_host "$env")

    log_info "Initiating deployment..."
    log_info "  Service:     $service"
    log_info "  Version:     $version"
    log_info "  Environment: $env"
    log_info "  ArgoCD Host: $argocd_host"

    local payload=$(jq -n \
        --arg name "$service" \
        --arg ns "$NAMESPACE" \
        --arg ver "$version" \
        --arg host "$argocd_host" \
        '{
            name: $name,
            namespace: $ns,
            version: $ver,
            customCanaryPercentage: -1,
            hostname: $host
        }')

    local response=$(api_call "$base_url" "twirp/medusa.pb.deployment.Deployments/UpdateApplicationVersion" "$payload")

    # Check for errors in response
    if echo "$response" | jq -e '.error' &>/dev/null; then
        log_error "Deployment failed:"
        echo "$response" | jq -r '.error'
        exit 1
    fi

    log_success "Deployment initiated successfully!"
    # echo "$response" | jq '.' 2>/dev/null || echo "$response"
}

# wait_for_deployment: Polls the environment until the service reaches the target version and is healthy.
# This function handles the divergence between Test (standard projects) and ODE (dynamic namespaces).
wait_for_deployment() {
    local service="$1"
    local target_version="$2"
    local env="$3"
    local ode_namespace="${4:-}"
    
    local elapsed=0
    local deploy_timeout=600 # 10 minutes wait for rollout
    
    log_info "Waiting for deployment rollout to complete..."
    log_info "Target: $service -> $target_version"

    # Resolve canonical app name once
    local resolved_name=$(resolve_app_name "$service" "$env" "$ode_namespace")
    if [[ "$resolved_name" != "$service" ]]; then
        log_info "Resolved application name: $service -> $resolved_name"
        service="$resolved_name"
    fi

    # Project filter is used for standard 'test' environment Lookups
    local project_filter="headout-env-test-microservices"

    # Define validation logic based on environment
    while [[ $elapsed -lt $deploy_timeout ]]; do
        local current_version=""
        local current_health=""

        if [[ "$env" == "ode" ]]; then
            # ODE Logic: Uses GetStatus endpoint which is scoped to a specific ODE namespace.
            # We look for "Running" status as the success indicator for ODE pods.
             local base_url=$(get_base_url "ode")
             local payload=$(jq -n --arg namespace "$ode_namespace" '{deploy_namespace: $namespace}')
             local response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetStatus" "$payload")

             # Extract status for the service
             # Service name is already resolved
             local app_status=$(echo "$response" | jq -r --arg app "$service" \
                '.apps[]? | select(.app == $app) | "\(.deployedTag)|\(.status)"' | head -1)
            
             current_version=$(echo "$app_status" | cut -d'|' -f1)
             current_health=$(echo "$app_status" | cut -d'|' -f2)

             # DEBUG (Optional): Useful for troubleshooting ODE status mismatches
             # echo "DEBUG: Target='$target_version' vs Current='$current_version' | Health='$current_health'" >&2

        else
            # Test/Generic Logic: Use ListApplications
            # Service name already resolved above
            
            local response=$(get_applications_json "$env")
            local current_state=$(echo "$response" | jq -r --arg app "$service" --arg proj "$project_filter" \
                '.applications[] | select(.name == $app and .project == $proj) | "\(.version)|\(.health)"')
            
            current_version=$(echo "$current_state" | cut -d'|' -f1)
            current_health=$(echo "$current_state" | cut -d'|' -f2)

            # DEBUG (Optional): Useful for troubleshooting ArgoCD status issues
            # echo "DEBUG: Target='$target_version' vs Current='$current_version' | Health='$current_health'" >&2
        fi

        # Clear line
        echo -ne "\r\033[K" >&2
        
        # Check success conditions
        # For ODE, status might be "Running". For Test, it's "Healthy".
        local health_ok=false
        if [[ "$current_health" == "Healthy" || "$current_health" == "Running" ]]; then
            health_ok=true
        fi

        if [[ "$current_version" == "$target_version" ]]; then
            if [[ "$health_ok" == "true" ]]; then
                log_success "Deployment completed! $service is $current_health on version $target_version"
                return 0
            else
                 echo -ne "${YELLOW}[WAITING]${NC} Version updated, health is $current_health... ${elapsed}s" >&2
            fi
        else
             echo -ne "${CYAN}[WAITING]${NC} Waiting for version update (Current: ${current_version:-unknown})... ${elapsed}s" >&2
        fi

        sleep $POLL_INTERVAL
        elapsed=$((elapsed + POLL_INTERVAL))
    done
    
    echo "" >&2
    log_error "Timeout waiting for deployment rollout after ${deploy_timeout}s"
    exit 1
}

# ============================================================================
# ODE-SPECIFIC FUNCTIONS
# ============================================================================

upscale_ode() {
    local ode_namespace="$1"

    # Validate ODE namespace format
    validate_ode_namespace "$ode_namespace"

    check_cookie "ode"

    log_info "Upscaling ODE environment '$ode_namespace'..."
    local base_url=$(get_base_url "ode")
    
    # Payload for UpScaleNamespaces
    local payload=$(jq -n --arg ns "$ode_namespace" '{namespace: [$ns]}')
    
    local response=$(api_call "$base_url" "twirp/medusa.pb.zero.scaler.Manager/UpScaleNamespaces" "$payload")
    
    log_success "Upscale triggered for '$ode_namespace'"
    
    # Wait a bit for it to register
    echo -n "Waiting for environment to wake up..."
    for i in {1..5}; do
        echo -n "."
        sleep 1
    done
    echo ""
}

list_ode_namespaces() {
    check_cookie "ode"
    local base_url=$(get_base_url "ode")

    log_info "Fetching ODE namespaces..."

    local response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetEnvList" "{}")

    echo "$response" | jq -r '.envs[]' 2>/dev/null || {
        log_error "Failed to parse response. Raw response:"
        echo "$response"
        exit 1
    }
}

list_ode_services() {
    check_cookie "ode"
    local base_url=$(get_base_url "ode")

    log_info "Fetching ODE services..."

    local response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetAppList" "{}")

    echo "$response" | jq -r '.apps[]' 2>/dev/null || {
        log_error "Failed to parse response. Raw response:"
        echo "$response"
        exit 1
    }
}

get_ode_dependencies() {
    local service_name="$1"
    check_cookie "ode"
    local base_url=$(get_base_url "ode")

    log_info "Fetching dependencies for service: $service_name"

    local response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetAppList" "{}")

    # Check if service exists and has dependencies
    local deps=$(echo "$response" | jq -r --arg app "$service_name" '.app_relations[$app].apps[]? // empty' 2>/dev/null)

    if [[ -z "$deps" ]]; then
        echo "Service '$service_name' has no dependencies"
    else
        echo "Dependencies for $service_name:"
        echo "$deps" | while read -r dep; do
            echo "  - $dep"
        done
    fi
}


get_ode_status() {
    local ode_namespace="$1"

    # Validate ODE namespace format
    validate_ode_namespace "$ode_namespace"

    check_cookie "ode"
    local base_url=$(get_base_url "ode")
    log_info "Fetching status for ODE environment: $ode_namespace"
    local payload=$(jq -n \
        --arg env "$ode_namespace" \
        '{deploy_namespace: $env}')
    local response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetStatus" "$payload")
    # Check if ODE is paused (has deploy_namespace but no apps)
    if echo "$response" | jq -e '.deploy_namespace' >/dev/null && ! echo "$response" | jq -e '.apps' >/dev/null; then
         echo ""
         echo -e "${YELLOW}ODE Environment '$ode_namespace' is currently PAUSED.${NC}"
         echo ""
         return 0
    fi

    # Check if response is valid
    if ! echo "$response" | jq -e '.apps' &>/dev/null; then
        log_error "Failed to parse response. Raw response:"
        echo "$response"
        exit 1
    fi

    echo ""
    echo -e "${CYAN}ODE Environment: $ode_namespace${NC}"
    
    printf "${CYAN}%-40s %-50s %-20s %-10s${NC}\n" "APP" "VERSION" "STATUS" "HEALTH"
    printf "%-40s %-50s %-20s %-10s\n" "$(printf '%.0s-' {1..40})" "$(printf '%.0s-' {1..50})" "$(printf '%.0s-' {1..20})" "$(printf '%.0s-' {1..10})"

    echo "$response" | jq -r '.apps[] | "\(.app)|\(.deployedTag)|(\(.status))|\(.ready_containers)/\(.total_containers)"' | \
    while IFS='|' read -r app version status health; do
        # Color code status
        if [[ "$status" == "Running" ]]; then
            status_colored="${GREEN}${status}${NC}"
        else
            status_colored="${YELLOW}${status}${NC}"
        fi
        
        # Truncate if needed
        app_truncated=$(echo "$app" | cut -c1-39)
        version_truncated=$(echo "$version" | cut -c1-49)
        
        printf "%-40s %-50s " "$app_truncated" "$version_truncated"
        
        # Print status with color, then pad
        echo -ne "${status_colored}"
        # Calculate padding needed (20 chars - actual status text length)
        padding=$((20 - ${#status}))
        printf "%*s" "$padding" ""
        
        printf "%-10s\n" "$health"
    done

    echo ""
}


deploy_ode() {
    local service="$1"
    local version="$2"
    local ode_namespace="$3"

    # Validate ODE namespace format
    validate_ode_namespace "$ode_namespace"

    local base_url=$(get_base_url "ode")

    log_info "Initiating ODE deployment..."
    log_info "  Service:     $service"
    log_info "  Version:     $version"
    log_info "  ODE Namespace: $ode_namespace"

    local payload=$(jq -n \
        --arg env "$ode_namespace" \
        --arg app "$service" \
        --arg ver "$version" \
        '{deploy_namespace: $env, apps: {($app): $ver}}')

    local response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/UpgradeEnvironment" "$payload")

    # Check for errors in response
    if echo "$response" | jq -e '.error' &>/dev/null; then
        log_error "Deployment failed:"
        echo "$response" | jq -r '.error'
        exit 1
    fi

    # Check for success
    if echo "$response" | jq -e '.message' &>/dev/null; then
        log_success "ODE deployment successful!"
        # echo "$response" | jq '.'
    else
        log_error "Unexpected response:"
        echo "$response"
        exit 1
    fi
}

create_ode() {
    local ode_namespace="$1"
    local services_input="$2"  # Now accepts comma-separated services
    local version="$3"

    # Validate ODE namespace format
    validate_ode_namespace "$ode_namespace"

    # Validate version format (commit SHA or 'latest')
    # Accept: commit hashes (7-40 hex chars) or 'latest'
    if [[ ! "$version" =~ ^([a-fA-F0-9]{7,40}|latest)$ ]]; then
        log_error "Invalid version format: $version"
        echo "Version must be a git commit SHA (7-40 hex characters) or 'latest'"
        exit 1
    fi

    check_cookie "ode"
    local base_url=$(get_base_url "ode")
    
    log_info "Creating new ODE environment: $ode_namespace"
    log_info "  Version:     $version"
    
    # Split comma-separated services and validate each
    IFS=',' read -ra SERVICE_ARRAY <<< "$services_input"
    # Trim whitespace and update array elements
    for i in "${!SERVICE_ARRAY[@]}"; do
        # Trim whitespace
        SERVICE_ARRAY[$i]=$(echo "${SERVICE_ARRAY[$i]}" | xargs)
        if [[ ! "${SERVICE_ARRAY[$i]}" =~ ^[a-zA-Z0-9_-]+$ ]]; then
            log_error "Invalid service name: ${SERVICE_ARRAY[$i]}. Service names must contain only alphanumeric characters, underscores, and hyphens."
            exit 1
        fi
    done

    echo ""
    echo "Services to deploy:"
    for service in "${SERVICE_ARRAY[@]}"; do
        echo "  - $service"
    done
    
    # Get service list to resolve dependencies
    local service_list_response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetAppList" "{}")
    
    # Collect all dependencies for all services
    declare -A all_services_map
    
    # Add all requested services
    for service in "${SERVICE_ARRAY[@]}"; do
        all_services_map["$service"]=1
    done
    
    # Get dependencies for each service and add them
    local has_deps=false
    for service in "${SERVICE_ARRAY[@]}"; do
        local deps=$(echo "$service_list_response" | jq -r --arg app "$service" '.app_relations[$app].apps[]? // empty' 2>/dev/null)
        if [[ -n "$deps" ]]; then
            has_deps=true
            while read -r dep; do
                all_services_map["$dep"]=1
            done <<< "$deps"
        fi
    done
    
    # Show dependencies if any
    if [[ "$has_deps" == "true" ]]; then
        echo ""
        echo -e "${YELLOW}Including dependencies:${NC}"
        for service in "${SERVICE_ARRAY[@]}"; do
            local deps=$(echo "$service_list_response" | jq -r --arg app "$service" '.app_relations[$app].apps[]? // empty' 2>/dev/null)
            if [[ -n "$deps" ]]; then
                echo "  From $service:"
                echo "$deps" | while read -r dep; do
                    echo "    - $dep"
                done
            fi
        done
        echo ""
    fi
    
    # Build services object with all services (requested + dependencies)
    local services_json="{}"
    for service in "${!all_services_map[@]}"; do
        services_json=$(echo "$services_json" | jq --arg app "$service" --arg ver "$version" '. + {($app): $ver}')
    done
    
    # Show final list
    echo ""
    echo "Final services list ($(echo "$services_json" | jq '. | length') services total):"
    echo "$services_json" | jq -r 'keys[]' | sort | while read -r service; do
        echo "  - $service: $version"
    done
    
    # Confirm creation
    echo ""
    read -p "Create ODE '$ode_namespace' with above services? [y/N] " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        log_warn "ODE creation cancelled"
        exit 0
    fi
    
    # Build final payload
    local payload=$(jq -n \
        --arg env "$ode_namespace" \
        --argjson apps "$services_json" \
        '{deploy_namespace: $env, apps: $apps}')
    
    log_info "Creating ODE environment..."
    local response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/CreateNewEnvironment" "$payload")
    
    # Check response
    if echo "$response" | jq -e '.http_resp.message' &>/dev/null; then
        log_success "ODE environment created!"
        echo "$response" | jq '.http_resp'
    else
        log_error "Creation failed:"
        echo "$response"
        exit 1
    fi
}

delete_ode() {
    local ode_namespace="$1"

    # Validate ODE namespace format
    validate_ode_namespace "$ode_namespace"

    check_cookie "ode"
    local base_url=$(get_base_url "ode")

    log_warn "Deleting ODE environment: $ode_namespace"
    
    # Confirm deletion
    echo ""
    read -p "Are you sure you want to delete ODE '$ode_namespace'? [y/N] " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        log_warn "ODE deletion cancelled"
        exit 0
    fi
    
    local payload=$(jq -n --arg env "$ode_namespace" '{deploy_namespace: $env}')
    
    log_info "Deleting ODE environment..."
    local response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/DeleteEnvironment" "$payload")
    
    # Check response
    if echo "$response" | jq -e '.message' &>/dev/null; then
        log_success "ODE environment deleted!"
        # echo "$response" | jq '.'
    else
        log_error "Deletion failed:"
        echo "$response"
        exit 1
    fi
}

share_ode() {
    local ode_namespace="$1"
    local email="$2"

    # Validate ODE namespace format
    validate_ode_namespace "$ode_namespace"

    # Validate email domain
    if [[ ! "$email" =~ @headout\.com$ ]]; then
        log_error "Invalid email domain. Only @headout.com emails are allowed."
        echo "Provided: $email"
        exit 1
    fi

    check_cookie "ode"
    local base_url=$(get_base_url "ode")
    
    # Validate that the ODE namespace exists
    log_info "Validating ODE namespace '$ode_namespace' exists..."
    local env_list_response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetEnvList" "{}")
    local ode_exists=$(echo "$env_list_response" | jq -r --arg ode "$ode_namespace" '.envs[] | select(. == $ode)')
    
    if [[ -z "$ode_exists" ]]; then
        log_error "ODE namespace '$ode_namespace' not found in your accessible ODEs."
        echo ""
        echo "Available ODE namespaces:"
        echo "$env_list_response" | jq -r '.envs[]' | while read -r env; do
            echo "  - $env"
        done
        exit 1
    fi
    
    log_info "Sharing ODE environment '$ode_namespace' with $email..."
    
    local payload=$(jq -n \
        --arg email "$email" \
        --arg ode_name "$ode_namespace" \
        '{email: $email, odeName: $ode_name}')
    
    local response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.AccessControlService/AddEmailToWhitelist" "$payload")
    
    # Check response - empty object {} means success
    if [[ "$response" == "{}" ]]; then
        log_success "ODE environment '$ode_namespace' shared with $email successfully!"
    else
        # Check if there's an error in the response
        if echo "$response" | jq -e '.error' &>/dev/null; then
            log_error "Sharing failed:"
            echo "$response" | jq -r '.error'
            exit 1
        else
            log_success "ODE environment '$ode_namespace' shared with $email!"
            echo "$response"
        fi
    fi
}

# ============================================================================
# MAIN DEPLOYMENT FLOW
# ============================================================================

# wait_for_build: Searches for a valid build tag and polls if not found.
# It handles ambiguous matches (multi-tag) by allowing the user to select or wait.
wait_for_build() {
    local service="$1"
    local commit="$2"
    local env="$3"

    local elapsed=0
    local version=""

    log_info "Searching for build with commit: $commit"

    while [[ $elapsed -lt $POLL_TIMEOUT ]]; do
        # Search for builds matching the commit (fuzzy search by tag)
        local versions
        versions=$(find_build_version "$service" "$commit" "$env")
        
        # Count matching versions to detect ambiguity
        local count
        if [[ -z "$versions" ]]; then
            count=0
        else
            count=$(echo "$versions" | wc -l | tr -d ' ')
        fi

        # Clear the spinner line before logging
        echo -ne "\r\033[K" >&2

        if [[ $count -eq 1 ]]; then
             # trim whitespace
            version=$(echo "$versions" | tr -d '[:space:]')
            log_success "Found unique build version: $version"

            local status=$(check_build_ready "$service" "$version" "$env")

            if [[ "$status" == "ready" ]]; then
                log_success "Build is ready for deployment!"
                echo "$version"
                return 0
            else
                log_info "Build status: $status - waiting..."
            fi
        elif [[ $count -gt 1 ]]; then
            log_error "Ambiguous commit hash! Found $count matching versions:"
            echo "$versions" >&2
            log_error "Please provide a longer commit hash to be unique."
            exit 1
        else
            log_info "Build not found yet, polling... (${elapsed}s elapsed)"
        fi

        sleep $POLL_INTERVAL
        elapsed=$((elapsed + POLL_INTERVAL))

        # Show spinner
        echo -ne "\r${CYAN}[WAITING]${NC} Polling for build... ${elapsed}s / ${POLL_TIMEOUT}s" >&2
    done

    echo "" >&2
    log_error "Timeout waiting for build after ${POLL_TIMEOUT}s"
    exit 1
}

main_deploy() {
    local service="$1"
    local commit_or_version="$2"
    local env="$3"

    check_cookie "$env"

    log_info "Starting deployment process for $env..."
    echo "------------------------------------------------------------"

    # Resolve canonical app name early for consistent lookups
    local resolved_service_name=$(resolve_app_name "$service" "$env")
    if [[ "$resolved_service_name" != "$service" ]]; then
        log_info "Resolved service name: $service -> $resolved_service_name"
    fi

    # Check for service lock in test environment
    check_service_lock "$resolved_service_name" "$env"

    # Wait for build and get full version string
    local full_version=$(wait_for_build "$resolved_service_name" "$commit_or_version" "$env")

    if [[ -z "$full_version" ]]; then
        log_error "Could not find a valid build version"
        exit 1
    fi

    echo "------------------------------------------------------------"

    # Confirm deployment
    echo ""
    read -p "Deploy $resolved_service_name version $full_version to $env? [y/N] " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        log_warn "Deployment cancelled"
        exit 0
    fi

    # Execute deployment
    deploy "$resolved_service_name" "$full_version" "$env"
    
    # Wait for rollout validation
    wait_for_deployment "$resolved_service_name" "$full_version" "$env"

    echo "------------------------------------------------------------"
    log_success "Deployment complete!"
}

main_deploy_ode() {
    local service="$1"
    local commit_or_version="$2"
    local ode_namespace="$3"

    # Validate ODE namespace format
    validate_ode_namespace "$ode_namespace"

    check_cookie "ode"

    log_info "Starting ODE deployment process..."
    echo "------------------------------------------------------------"

    # Check if ODE is paused and upscale if needed
    local base_url=$(get_base_url "ode")
    local status_payload=$(jq -n --arg env "$ode_namespace" '{deploy_namespace: $env}')
    local status_response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetStatus" "$status_payload")
    
    # ODEs often pause to save resources. If 'apps' is empty, the environment is paused.
    local apps_count=$(echo "$status_response" | jq '.apps | length' 2>/dev/null)
    
    if [[ "$apps_count" == "0" || "$apps_count" == "null" ]]; then
        log_warn "ODE environment '$ode_namespace' appears to be PAUSED."
        # Call upscale_ode to wake up the environment before attempting deployment
        upscale_ode "$ode_namespace"
        
        # Re-fetch status after waking up to ensure we are good to go
        log_info "Verifying environment status..."
        sleep 5
        status_response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetStatus" "$status_payload")
    fi

    # For ODE, we need to find the full version tag from the commit hash
    # Use the same robust polling/search logic as test environment
    local full_version=$(wait_for_build "$service" "$commit_or_version" "ode")

    if [[ -z "$full_version" ]]; then
        log_error "Could not find a valid build version"
        exit 1
    fi


    echo "------------------------------------------------------------"

    # Show dependencies
    log_info "Checking dependencies for $service..."
    
    # Resolve canonical name for dependency lookup (handles prefixes like 'headout-')
    local resolved_service_name=$(resolve_app_name "$service" "ode" "$ode_namespace")
    if [[ "$resolved_service_name" != "$service" ]]; then
        log_info "Resolving dependency name: $service -> $resolved_service_name"
    fi
    
    local base_url=$(get_base_url "ode")
    local app_list_response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetAppList" "{}")
    local deps=$(echo "$app_list_response" | jq -r --arg app "$resolved_service_name" '.app_relations[$app].apps[]? // empty' 2>/dev/null)

    if [[ -n "$deps" ]]; then
        echo ""
        echo -e "${YELLOW}Dependencies for $service:${NC}"
        echo "$deps" | while read -r dep; do
            echo "  - $dep"
        done
        echo ""
    else
        log_info "$service has no dependencies"
    fi

    echo "------------------------------------------------------------"

    # Show current status
    log_info "Current status of $resolved_service_name in ODE environment '$ode_namespace':"
    local payload=$(jq -n --arg env "$ode_namespace" '{deploy_namespace: $env}')
    local status_response=$(api_call "$base_url" "twirp/medusa.pb.ondemand.Manager/GetStatus" "$payload")
    
    echo "$status_response" | jq --arg app "$resolved_service_name" '.apps[] | select(.app == $app)' 2>/dev/null || log_warn "Service not found in current status"
    
    # Show dependency status if dependencies exist
    if [[ -n "$deps" ]]; then
        echo ""
        echo -e "${YELLOW}Dependency status in '$ode_namespace':${NC}"
        echo "$deps" | while read -r dep; do
            local dep_status=$(echo "$status_response" | jq -r --arg app "$dep" '.apps[] | select(.app == $app) | "\(.app): \(.deployedTag) (\(.status))"' 2>/dev/null)
            if [[ -n "$dep_status" ]]; then
                echo "  $dep_status"
            else
                echo "  $dep: NOT DEPLOYED"
            fi
        done
        echo ""
    fi

    echo "------------------------------------------------------------"


    # Confirm deployment
    echo ""
    read -p "Deploy $resolved_service_name version $full_version to ODE '$ode_namespace'? [y/N] " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        log_warn "Deployment cancelled"
        exit 0
    fi

    # Execute deployment
    deploy_ode "$resolved_service_name" "$full_version" "$ode_namespace"

    # Wait for rollout validation
    wait_for_deployment "$resolved_service_name" "$full_version" "ode" "$ode_namespace"

    echo "------------------------------------------------------------"
    log_success "ODE deployment complete!"
}

# ============================================================================
# ARGUMENT PARSING
# ============================================================================

if [[ $# -eq 0 ]]; then
    usage
fi

case "$1" in
    --set-cookie)
        if [[ -z "$2" ]]; then
            log_error "Please provide cookie value"
            echo "Usage: deploy-non-prod-ho --set-cookie <cookie-value>"
            exit 1
        fi
        set_cookie "$2"
        exit 0
        ;;
    --show-cookies)
        show_cookies
        exit 0
        ;;
    --list-services)
        if [[ -z "$2" ]]; then
            log_error "Please provide environment"
            exit 1
        fi
        list_services "$2"
        exit 0
        ;;
    --list-builds)
        if [[ -z "$2" ]]; then
            log_error "Please provide service name"
            echo "Usage: deploy-non-prod-ho --list-builds <service>"
            exit 1
        fi
        list_builds "$2" "test"
        exit 0
        ;;
    --list-ode-namespaces)
        list_ode_namespaces
        exit 0
        ;;
    --list-ode-services)
        list_ode_services
        exit 0
        ;;
    --ode-dependencies)
        if [[ -z "$2" ]]; then
            log_error "Please provide service name"
            echo "Usage: deploy-non-prod-ho --ode-dependencies <service-name>"
            exit 1
        fi
        get_ode_dependencies "$2"
        exit 0
        ;;
    --ode-status)
        if [[ -z "$2" ]]; then
            log_error "Please provide ODE namespace"
            echo "Usage: deploy-non-prod-ho --ode-status <ode-namespace>"
            exit 1
        fi
        get_ode_status "$2"
        exit 0
        ;;
    --create-ode)
        if [[ -z "$2" || -z "$3" || -z "$4" ]]; then
            log_error "Please provide ODE namespace, service name, and version"
            echo "Usage: deploy-non-prod-ho --create-ode <ode-namespace> <service-name> <version>"
            exit 1
        fi
        create_ode "$2" "$3" "$4"
        exit 0
        ;;
    --delete-ode)
        if [[ -z "$2" ]]; then
            log_error "Please provide ODE namespace"
            echo "Usage: deploy-non-prod-ho --delete-ode <ode-namespace>"
            exit 1
        fi
        delete_ode "$2"
        exit 0
        ;;
    --upscale)
        if [[ -z "$2" ]]; then
            log_error "Please provide ODE namespace"
            echo "Usage: deploy-non-prod-ho --upscale <ode-namespace>"
            exit 1
        fi
        upscale_ode "$2"
        exit 0
        ;;
    --share-ode)
        if [[ -z "$2" || -z "$3" ]]; then
            log_error "Please provide ODE namespace and email"
            echo "Usage: deploy-non-prod-ho --share-ode <ode-namespace> <email>"
            exit 1
        fi
        share_ode "$2" "$3"
        exit 0
        ;;
    --help|-h)
        usage
        ;;

    *)
        # Handle main deployment with --env or --ode flag
        # Expected: <service> <commit> --env test
        # OR:       <service> <commit> --ode <ode-instance-name>
        
        if [[ $# -lt 3 ]]; then
            log_error "Invalid arguments"
            usage
            exit 1
        fi
        
        service="$1"
        commit="$2"
        flag="$3"

        # Validate service name format (allow alphanumeric, underscores, and hyphens)
        if [[ ! "$service" =~ ^[a-zA-Z0-9_-]+$ ]]; then
            log_error "Invalid service name format: $service"
            echo "Service names must contain only alphanumeric characters, underscores, and hyphens."
            exit 1
        fi

        # Validate commit format
        # Only accept git commit hashes (7-40 hex chars) for test/ODE environments
        if [[ ! "$commit" =~ ^[a-fA-F0-9]{7,40}$ ]]; then
            log_error "Invalid commit format: $commit"
            echo "Must be a git commit hash (7-40 hex characters). Version tags are not supported for test/ODE environments."
            exit 1
        fi

        if [[ "$flag" == "--env" ]]; then
            # Test environment deployment
            if [[ "$4" != "test" ]]; then
                log_error "Invalid environment: $4"
                echo "Only 'test' is supported with --env flag"
                echo "Usage: deploy-non-prod-ho <service> <commit> --env test"
                exit 1
            fi
            main_deploy "$service" "$commit" "test"
            
        elif [[ "$flag" == "--ode" ]]; then
            # ODE preview instance deployment
            if [[ -z "$4" ]]; then
                log_error "ODE namespace required"
                echo "Usage: deploy-non-prod-ho <service> <commit> --ode <ode-namespace>"
                echo "Example: deploy-non-prod-ho hub-frontend 7ec56d5 --ode final"
                exit 1
            fi
            ode_namespace="$4"
            main_deploy_ode "$service" "$commit" "$ode_namespace"
            
        else
            log_error "Invalid flag: $flag"
            echo "Expected --env or --ode"
            usage
            exit 1
        fi
        ;;
esac
