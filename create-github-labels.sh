#!/bin/bash

# GitHub Labels Creation Script for WPPOOL QA Assignment
# This script creates all required labels for bug tracking, priority, severity, and components

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       GitHub Labels Setup - WPPOOL QA Assignment              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "Please install it first:"
    echo "  Ubuntu/Debian: sudo apt install gh"
    echo "  macOS: brew install gh"
    echo ""
    echo "Then run: gh auth login"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ You are not authenticated with GitHub CLI."
    echo ""
    echo "Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI detected and authenticated"
echo ""
echo "Creating labels for repository: mehedimohammad213/wppool-flexTable-woocommerce-playwright-suite"
echo ""

# Navigate to repository directory
cd /home/dev2/Documents/wppool

# Function to create label
create_label() {
    local name="$1"
    local color="$2"
    local description="$3"

    gh label create "$name" --color "$color" --description "$description" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Created: $name"
    else
        echo "⚠️  Already exists or error: $name"
    fi
}

echo "📋 Creating Base Labels..."
create_label "bug" "d73a4a" "Something isn't working"
create_label "enhancement" "a2eeef" "New feature or request"
create_label "suggestion" "84b6eb" "Improvement suggestion"
create_label "documentation" "0075ca" "Documentation improvements"
create_label "test" "7057ff" "Testing related"

echo ""
echo "🎯 Creating Priority Labels..."
create_label "priority:critical" "b60205" "Critical - Blocks functionality"
create_label "priority:high" "d93f0b" "High - Important to fix"
create_label "priority:medium" "fbca04" "Medium - Should fix"
create_label "priority:low" "f9d0c4" "Low - Nice to have"

echo ""
echo "🔥 Creating Severity Labels..."
create_label "severity:critical" "b60205" "System crash, data loss"
create_label "severity:major" "d93f0b" "Major feature broken"
create_label "severity:moderate" "fbca04" "Feature partially works"
create_label "severity:minor" "fef2c0" "Small issue, cosmetic"
create_label "severity:trivial" "f9d0c4" "Typo, formatting"

echo ""
echo "🧩 Creating Component Labels..."
create_label "component:flextable" "1d76db" "FlexTable plugin related"
create_label "component:woocommerce" "96588a" "WooCommerce related"
create_label "component:wordpress" "21759b" "WordPress core related"
create_label "component:test-automation" "7057ff" "Test suite related"

echo ""
echo "📊 Creating Status Labels..."
create_label "status:investigating" "fbca04" "Under investigation"
create_label "status:confirmed" "d93f0b" "Bug confirmed"
create_label "status:needs-info" "d876e3" "Needs more information"
create_label "status:ready" "0e8a16" "Ready to work on"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ LABELS CREATED!                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🔗 View labels at:"
echo "   https://github.com/mehedimohammad213/wppool-flexTable-woocommerce-playwright-suite/labels"
echo ""
echo "📝 Next steps:"
echo "   1. Run your tests"
echo "   2. Document any bugs found"
echo "   3. Create GitHub issues using the templates"
echo "   4. Apply appropriate labels to each issue"
echo ""
echo "📚 For detailed instructions, see: GITHUB_ISSUES_SETUP.md"
echo ""
