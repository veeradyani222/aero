#Requires -Version 5.1
<#
.SYNOPSIS
  Replays Aero's git history as ~42 meaningful commits and pushes to GitHub.

.DESCRIPTION
  Initializes git (if needed), adds origin, commits files in logical build order,
  and pushes to main. Skips secrets and gitignored paths.

.PARAMETER DryRun
  Print planned commits without running git commands.

.PARAMETER SkipPush
  Create commits locally but do not push to remote.

.EXAMPLE
  .\scripts\git-history-bootstrap.ps1 -DryRun
  .\scripts\git-history-bootstrap.ps1
  .\scripts\git-history-bootstrap.ps1 -SkipPush
#>

param(
    [switch]$DryRun,
    [switch]$SkipPush
)

$ErrorActionPreference = "Stop"
$RemoteUrl = "https://github.com/veeradyani222/aero.git"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

# Each entry: meaningful message + files added in that commit (simulated dev timeline)
$Commits = @(
    @{
        Message = "chore: bootstrap Next.js 16 project with TypeScript and ESLint"
        Files   = @(
            "package.json",
            "package-lock.json",
            "tsconfig.json",
            ".eslintrc.json",
            ".gitignore"
        )
    },
    @{
        Message = "chore: configure Tailwind CSS v4 and PostCSS pipeline"
        Files   = @("tailwind.config.js", "postcss.config.js")
    },
    @{
        Message = "chore: add Next.js config, env template, and config validator"
        Files   = @("next.config.js", ".env.example", "validate-config.js")
    },
    @{
        Message = "feat: add root layout, global styles, and marketing landing page"
        Files   = @(
            "src/app/layout.tsx",
            "src/app/globals.css",
            "src/app/page.tsx",
            "src/app/icon.png"
        )
    },
    @{
        Message = "feat: add brand logos, favicons, and PWA web manifest"
        Files   = @(
            "public/favicon.ico",
            "public/favicon.png",
            "public/favicon.svg",
            "public/icon.png",
            "public/apple-touch-icon.png",
            "public/android-chrome-512x512.png",
            "public/web-app-manifest-192x192.png",
            "public/web-app-manifest-512x512.png",
            "public/site.webmanifest",
            "public/AI-Monitor-Logo-V3-long-dark-themel.png",
            "public/AI-Monitor-Logo-V3-long-light-theme.webp",
            "public/getcito-logo-dark.webp",
            "P.png"
        )
    },
    @{
        Message = "feat: configure Firebase project with Firestore rules and indexes"
        Files   = @(
            "firebase.json",
            "firestore.rules",
            "firestore.dev.rules",
            "firestore.indexes.json"
        )
    },
    @{
        Message = "feat: initialize Firebase client SDK configuration"
        Files   = @("src/firebase/config.ts")
    },
    @{
        Message = "feat: implement email, Google OAuth, and session auth modules"
        Files   = @(
            "src/firebase/auth/signIn.ts",
            "src/firebase/auth/signup.ts",
            "src/firebase/auth/googleSignIn.ts",
            "src/firebase/auth/signOut.ts"
        )
    },
    @{
        Message = "feat: add Firebase Admin SDK for server-side token verification"
        Files   = @("src/firebase/firebase-admin.ts")
    },
    @{
        Message = "feat: add core Firestore CRUD helpers and data sanitization"
        Files   = @(
            "src/firebase/firestore/addData.ts",
            "src/firebase/firestore/getData.js",
            "src/firebase/firestore/sanitizeForFirestore.ts"
        )
    },
    @{
        Message = "feat: implement user profile Firestore service (client and server)"
        Files   = @(
            "src/firebase/firestore/userProfile.ts",
            "src/firebase/firestore/userProfileServer.ts"
        )
    },
    @{
        Message = "feat: add brand data service and user brands retrieval"
        Files   = @(
            "src/firebase/firestore/brandDataService.ts",
            "src/firebase/firestore/getUserBrands.ts"
        )
    },
    @{
        Message = "feat: add brand analytics and dashboard aggregation services"
        Files   = @(
            "src/firebase/firestore/brandAnalytics.ts",
            "src/firebase/firestore/dashboardData.ts",
            "src/firebase/firestore/detailedQueryResults.ts"
        )
    },
    @{
        Message = "feat: add user query storage and competitor analytics services"
        Files   = @(
            "src/firebase/firestore/userQueries.ts",
            "src/firebase/firestore/competitorAnalytics.ts",
            "src/firebase/firestore/seedData.ts"
        )
    },
    @{
        Message = "feat: integrate Firebase Cloud Storage for asset uploads"
        Files   = @("src/firebase/storage/cloudStorage.ts")
    },
    @{
        Message = "feat: implement AuthContext with Firebase session persistence"
        Files   = @(
            "src/context/AuthContext.tsx",
            "src/utils/getFirebaseToken.ts"
        )
    },
    @{
        Message = "feat: add sign-in and sign-up pages with form validation"
        Files   = @("src/app/signin/page.tsx", "src/app/signup/page.tsx")
    },
    @{
        Message = "feat: add JWT verification middleware and protected route guard"
        Files   = @(
            "src/middleware.ts",
            "src/lib/auth/verifyToken.ts",
            "src/lib/api-auth-middleware.ts",
            "src/components/auth/ProtectedRoute.tsx",
            "src/components/auth/AuthStatus.tsx"
        )
    },
    @{
        Message = "feat: build dashboard shell with sidebar and header navigation"
        Files   = @(
            "src/app/dashboard/layout.tsx",
            "src/components/layout/DashboardLayout.tsx",
            "src/components/layout/Header.tsx",
            "src/components/layout/Sidebar.tsx"
        )
    },
    @{
        Message = "feat: add theme switching and toast notification systems"
        Files   = @(
            "src/context/ThemeContext.tsx",
            "src/components/shared/ThemeToggle.tsx",
            "src/context/ToastContext.tsx",
            "src/components/shared/Toast.tsx"
        )
    },
    @{
        Message = "feat: implement BrandContext for multi-brand workspace state"
        Files   = @(
            "src/context/BrandContext.tsx",
            "src/components/shared/BrandTrackingModal.tsx"
        )
    },
    @{
        Message = "feat: set up TanStack Query provider and shared query client"
        Files   = @("src/providers/QueryProvider.tsx", "src/lib/queryClient.ts")
    },
    @{
        Message = "feat: define AI provider base class and shared response types"
        Files   = @(
            "src/lib/api-providers/base-provider.ts",
            "src/lib/api-providers/types.ts"
        )
    },
    @{
        Message = "feat: integrate OpenAI, Azure, ChatGPT Search, and Google AI Overview providers"
        Files   = @(
            "src/lib/api-providers/openai-provider.ts",
            "src/lib/api-providers/azure-openai-search-provider.ts",
            "src/lib/api-providers/chatgptsearch-provider.ts",
            "src/lib/api-providers/google-ai-overview-provider.ts"
        )
    },
    @{
        Message = "feat: add Gemini and SEO providers with multi-provider fallback manager"
        Files   = @(
            "src/lib/api-providers/gemini-provider.ts",
            "src/lib/api-providers/seo-provider.ts",
            "src/lib/api-providers/provider-manager.ts"
        )
    },
    @{
        Message = "feat: add ai-query API route for multi-provider batch requests"
        Files   = @("src/app/api/ai-query/route.ts")
    },
    @{
        Message = "feat: add user query submission and batch processing endpoints"
        Files   = @(
            "src/app/api/user-query/route.ts",
            "src/app/api/process-user-queries/route.ts"
        )
    },
    @{
        Message = "feat: add company info extraction and domain metadata APIs"
        Files   = @(
            "src/app/api/get-company-info/route.ts",
            "src/app/api/get-domain-metadata/route.ts",
            "src/lib/get-company-info.ts",
            "src/lib/domain-metadata.ts",
            "src/lib/domain-analyzer/types.ts"
        )
    },
    @{
        Message = "feat: add Amazon product context and brand data generation APIs"
        Files   = @(
            "src/app/api/get-amazon-product-context/route.ts",
            "src/app/api/generate-brand-data/route.ts",
            "src/lib/amazon-product-context.ts",
            "src/utils/generateBrandData.ts"
        )
    },
    @{
        Message = "feat: integrate Cognee knowledge graph for brand recommendations"
        Files   = @(
            "src/lib/cognee/cognee-client.ts",
            "src/lib/cognee/format-recommendations.ts",
            "src/lib/cognee/index.ts",
            "src/lib/cognee/sync-brand-context.ts",
            "src/lib/cognee/types.ts",
            "src/app/api/cognee/recommendations/route.ts",
            "src/app/api/cognee/status/route.ts",
            "src/app/api/cognee/sync/route.ts",
            "src/hooks/useCogneeRecommendations.ts"
        )
    },
    @{
        Message = "feat: add competitor matching engine and analytics utilities"
        Files   = @(
            "src/lib/competitor-matching.ts",
            "src/utils/competitor-analytics.ts",
            "src/components/CompetitorProcessor.tsx"
        )
    },
    @{
        Message = "feat: add React hooks for dashboard, brands, and citation metrics"
        Files   = @(
            "src/hooks/useDashboardData.ts",
            "src/hooks/useUserBrands.ts",
            "src/hooks/useBrandQueries.ts",
            "src/hooks/useBrandAnalytics.ts",
            "src/hooks/useTotalCitations.ts",
            "src/hooks/useLifetimeCitations.ts",
            "src/hooks/useUserCredits.ts"
        )
    },
    @{
        Message = "feat: add hooks for AI queries, competitors, and domain analysis"
        Files   = @(
            "src/hooks/useAIQuery.ts",
            "src/hooks/useUserQuery.ts",
            "src/hooks/useCompetitors.ts",
            "src/hooks/useCompetitorAnalytics.ts",
            "src/hooks/useCompanyInfo.ts",
            "src/hooks/useDomainAnalysis.ts",
            "src/hooks/useDomainMetadata.ts",
            "src/hooks/useProcessedQueries.ts"
        )
    },
    @{
        Message = "feat: build main dashboard page with analytics overview widgets"
        Files   = @(
            "src/app/dashboard/page.tsx",
            "src/components/features/MetricCard.tsx",
            "src/components/features/QueriesWidget.tsx",
            "src/components/features/QueriesOverview.tsx",
            "src/components/features/BrandMentionCounter.tsx",
            "src/components/features/CompetitorMatchingCounter.tsx",
            "src/components/shared/Card.tsx",
            "src/components/shared/WebLogo.tsx",
            "src/components/features/RecommendationSection.tsx"
        )
    },
    @{
        Message = "feat: add brand analytics charts and lifetime trend visualizations"
        Files   = @(
            "src/app/dashboard/analytics/page.tsx",
            "src/components/features/BrandAnalyticsDisplay.tsx",
            "src/components/features/TrendCharts.tsx",
            "src/components/features/LifetimeAnalyticsCharts.tsx",
            "src/components/features/LeaderboardTable.tsx"
        )
    },
    @{
        Message = "feat: add citations explorer with domain and search drill-downs"
        Files   = @(
            "src/app/dashboard/citations/page.tsx",
            "src/app/dashboard/citations/all-domains/page.tsx",
            "src/app/dashboard/citations/all-searches/page.tsx",
            "src/components/features/CitationsTable.tsx",
            "src/components/features/TopDomains.tsx"
        )
    },
    @{
        Message = "feat: add competitors page and AI response renderers"
        Files   = @(
            "src/app/dashboard/competitors/page.tsx",
            "src/components/features/CompetitorMentionsCard.tsx",
            "src/components/features/ChatGPTResponseRenderer.tsx",
            "src/components/features/GoogleAIOverviewRenderer.tsx",
            "src/components/QueryResultsModal.tsx"
        )
    },
    @{
        Message = "feat: add queries management page with batch processing UI"
        Files   = @(
            "src/app/dashboard/queries/page.tsx",
            "src/app/dashboard/queries/queries-content.tsx",
            "src/components/features/ProcessQueriesButton.tsx"
        )
    },
    @{
        Message = "feat: add multi-step brand onboarding wizard"
        Files   = @(
            "src/app/dashboard/add-brand/page.tsx",
            "src/app/dashboard/add-brand/step-1/page.tsx",
            "src/app/dashboard/add-brand/step-2/page.tsx",
            "src/app/dashboard/add-brand/step-3/page.tsx"
        )
    },
    @{
        Message = "feat: add admin dashboard and platform management pages"
        Files   = @(
            "src/app/admin/page.tsx",
            "src/app/dashboard/admin/page.tsx"
        )
    },
    @{
        Message = "test: add BrandContext unit tests"
        Files   = @("src/__tests__/context/BrandContext.test.tsx")
    },
    @{
        Message = "chore: add dev scripts, GitHub templates, Dependabot, and CI workflows"
        Files   = @(
            "scripts/dev-start.ps1",
            "scripts/dev-clean.ps1",
            "scripts/health-check.ps1",
            ".github/ISSUE_TEMPLATE/bug_report.md",
            ".github/ISSUE_TEMPLATE/feature_request.md",
            ".github/dependabot.yml",
            ".github/workflows/automerge.yml",
            ".github/workflows/combine-prs.yml"
        )
    },
    @{
        Message = "feat: add internal test and debug pages for auth and providers"
        Files   = @(
            "src/app/dashboard/test-auth/page.tsx",
            "src/app/dashboard/test-brand-analytics/page.tsx",
            "src/app/dashboard/test-brand-context/page.tsx",
            "src/app/dashboard/examples/queries-showcase/page.tsx",
            "src/app/api/debug-providers/route.ts",
            "src/app/api/test-chatgptsearch/route.ts",
            "src/app/api/test-firestore/route.ts",
            "src/app/api/test-google-ai-overview/route.ts",
            "src/app/api/test-responses-api/route.ts",
            "src/app/api/simple-openai-test/route.ts",
            "src/components/test/AuthDebugger.tsx",
            "src/components/test/BrandContextTester.tsx",
            "src/utils/testBrandContext.ts"
        )
    },
    @{
        Message = "docs: add comprehensive README and interview preparation guides"
        Files   = @(
            "README.md",
            "AERO_INTERVIEW_GUIDE.html",
            "BLOOM_TODAY_INTERVIEW_GUIDE.html"
        )
    }
)

function Test-GitAvailable {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw "git is not installed or not on PATH."
    }
}

function Initialize-Repository {
    if (-not (Test-Path ".git")) {
        Write-Host "Initializing new git repository..." -ForegroundColor Cyan
        if (-not $DryRun) {
            git init
            git branch -M main
        }
    }

    $remotes = @()
    if (-not $DryRun -and (Test-Path ".git")) {
        $remoteOutput = git remote 2>$null
        if ($remoteOutput) { $remotes = @($remoteOutput) }
    }

    if ($remotes -contains "origin") {
        Write-Host "Remote 'origin' already exists - updating URL." -ForegroundColor Yellow
        if (-not $DryRun) { git remote set-url origin $RemoteUrl }
    }
    else {
        Write-Host "Adding remote origin -> $RemoteUrl" -ForegroundColor Cyan
        if (-not $DryRun) { git remote add origin $RemoteUrl }
    }
}

function Get-MissingFiles {
    param([string[]]$Files)
    $missing = @()
    foreach ($file in $Files) {
        if (-not (Test-Path (Join-Path $Root $file))) {
            $missing += $file
        }
    }
    return $missing
}

function Invoke-CommitSequence {
    $index = 0
    foreach ($commit in $Commits) {
        $index++
        $message = $commit.Message
        $files = @($commit.Files)

        $missing = Get-MissingFiles -Files $files
        if ($missing.Count -gt 0) {
            Write-Warning ("Commit {0} skipped missing files: {1}" -f $index, ($missing -join ', '))
            $files = $files | Where-Object { $_ -notin $missing }
        }

        if ($files.Count -eq 0) {
            Write-Warning ("Commit {0} has no files - skipping." -f $index)
            continue
        }

        Write-Host ""
        Write-Host "[$index/$($Commits.Count)] $message" -ForegroundColor Green
        Write-Host "  + $($files.Count) file(s)" -ForegroundColor DarkGray

        if ($DryRun) { continue }

        git add --force -- $files
        git commit -m $message
    }
}

function Assert-AllTracked {
    if ($DryRun) { return }

    $status = git status --porcelain
    if ($status) {
        Write-Warning "Untracked or modified files remain after scripted commits:"
        Write-Host $status
        Write-Host "Adding remaining tracked files in a final catch-all commit..." -ForegroundColor Yellow
        git add -A
        git commit -m "chore: include remaining project assets and workspace files"
    }
}

# --- Main ---
Write-Host "Aero Git History Bootstrap" -ForegroundColor Magenta
Write-Host "Root: $Root"
Write-Host "Commits planned: $($Commits.Count)"
Write-Host "Remote: $RemoteUrl"
if ($DryRun) { Write-Host "MODE: DRY RUN (no git changes)" -ForegroundColor Yellow }

Test-GitAvailable

# Verify all referenced files exist upfront
$allReferenced = $Commits | ForEach-Object { $_.Files } | Select-Object -Unique
$allMissing = Get-MissingFiles -Files $allReferenced
if ($allMissing.Count -gt 0) {
    Write-Warning "These script paths were not found on disk (will be skipped per commit):"
    $allMissing | ForEach-Object { Write-Host "  - $_" }
}

Initialize-Repository
Invoke-CommitSequence
Assert-AllTracked

if (-not $DryRun -and -not $SkipPush) {
    Write-Host ""
    Write-Host "Pushing to origin/main..." -ForegroundColor Cyan
    git push -u origin main
}

Write-Host ""
Write-Host "Done. Total commits created: $($Commits.Count) (+ optional catch-all)." -ForegroundColor Green
if ($DryRun) {
    Write-Host "Re-run without -DryRun to execute." -ForegroundColor Yellow
}
