# GitHub Setup Commands

## Complete Git Commands to Push Your Project

### Step 1: Add All Files to Git
```bash
# Add all files to staging area
git add .

# Check what files are staged
git status
```

### Step 2: Create Initial Commit
```bash
# Create your first commit with a descriptive message
git commit -m "🚀 Initial commit: Country Currency Exchange API

✨ Features:
- NestJS REST API with TypeScript
- Real-time exchange rates integration
- MySQL database with TypeORM
- Automated GDP calculations
- Interactive Swagger UI documentation
- Image generation capabilities
- Comprehensive error handling
- Full API documentation

🛠️ Tech Stack: NestJS, TypeScript, MySQL, Swagger, TypeORM"
```

### Step 3: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `country-currency-exchange` (or your preferred name)
   - **Description**: `🌍 NestJS REST API for country data management with real-time exchange rates, GDP calculations, and interactive Swagger documentation. Features MySQL integration, image generation, and comprehensive error handling.`
   - **Visibility**: Public (recommended) or Private
   - **DO NOT** initialize with README, .gitignore, or license (since you already have these)

### Step 4: Connect Local Repository to GitHub
```bash
# Add GitHub repository as remote origin
# Replace YOUR_USERNAME and YOUR_REPOSITORY_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Verify remote was added correctly
git remote -v
```

### Step 5: Push to GitHub
```bash
# Push your code to GitHub (first time)
git push -u origin master

# For subsequent pushes, you can just use:
# git push
```

## Alternative: Using GitHub CLI (if installed)
If you have GitHub CLI installed, you can create and push in one step:

```bash
# Create GitHub repository and push (requires GitHub CLI)
gh repo create country-currency-exchange --public --description "🌍 NestJS REST API for country data management with real-time exchange rates and Swagger docs" --push
```

## Repository Settings Recommendations

### Topics/Tags (Add these in GitHub repository settings)
```
nestjs typescript rest-api mysql swagger country-data exchange-rates nodejs typeorm api-documentation image-generation real-time-data
```

### Repository Description
```
🌍 NestJS REST API for country data management with real-time exchange rates, GDP calculations, and interactive Swagger documentation. Features MySQL integration, image generation, and comprehensive error handling.
```

## Future Git Workflow

### Making Changes and Pushing Updates
```bash
# Check current status
git status

# Add specific files
git add filename.ts
# OR add all changes
git add .

# Commit with descriptive message
git commit -m "✨ Add new feature: description of changes"

# Push to GitHub
git push
```

### Creating Feature Branches (Best Practice)
```bash
# Create and switch to new feature branch
git checkout -b feature/new-feature-name

# Make your changes, then:
git add .
git commit -m "✨ Implement new feature"
git push -u origin feature/new-feature-name

# Then create Pull Request on GitHub
```

## Troubleshooting

### If you get authentication errors:
1. **Personal Access Token**: Create one at GitHub Settings > Developer settings > Personal access tokens
2. **SSH Keys**: Set up SSH keys for easier authentication
3. **GitHub CLI**: Use `gh auth login` for easier authentication

### If remote already exists:
```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```

### If you want to rename the branch from 'master' to 'main':
```bash
git branch -M main
git push -u origin main
```

## Project Structure for GitHub
Your repository will have this clean structure:
```
country-currency-exchange/
├── src/                    # Source code
├── test/                   # Test files
├── README.md              # Project documentation
├── REPOSITORY_DESCRIPTION.md  # GitHub descriptions
├── api-test.http          # API testing file
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
└── Other config files
```

## Security Notes
- ✅ Your `.env` file is already in `.gitignore`
- ✅ Never commit actual database credentials
- ✅ Use `.env.example` for template
- ✅ Keep API keys and secrets secure