# Contributing to CloudCollect

Thank you for your interest in contributing to CloudCollect! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Cloudflare account (for deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cloudcollect.git
   cd cloudcollect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Cloudflare D1 Database**
   ```bash
   # Create database
   npm run db:create
   
   # Run migrations
   npm run db:migrate
   ```

4. **Start development servers**
   ```bash
   # Frontend development
   npm run dev
   
   # Backend API development
   npm run wrangler:dev
   ```

## 🏗️ Project Structure

```
cloudcollect/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── lib/                # Database and core logic
│   ├── workers/            # Cloudflare Workers
│   └── types/              # TypeScript type definitions
├── supabase/
│   └── migrations/         # Database migrations
├── public/                 # Static assets
└── dist/                   # Built application
```

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Component Guidelines

- Use functional components with hooks
- Keep components focused and single-purpose
- Use proper TypeScript types
- Include proper error handling

### Database Guidelines

- All tables must include `company_id` for multi-tenant isolation
- Use prepared statements for all queries
- Include proper indexes for performance
- Follow the existing naming conventions

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Test multi-tenant isolation
- Include error case testing

## 📝 Pull Request Process

1. **Fork the repository** and create your branch from `main`

2. **Make your changes** following the guidelines above

3. **Test your changes** thoroughly
   - Ensure all existing tests pass
   - Add tests for new functionality
   - Test multi-tenant isolation

4. **Update documentation** if needed
   - Update README.md for new features
   - Add JSDoc comments for new functions
   - Update API documentation

5. **Submit a pull request** with:
   - Clear description of changes
   - Screenshots for UI changes
   - Test results
   - Breaking change notes (if any)

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Tested multi-tenant isolation

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🚀 Deployment

### Frontend (Cloudflare Pages)
- Automatically deployed on push to `main`
- Manual deployment: `npm run pages:deploy`

### Backend (Cloudflare Workers)
- Deploy with: `npm run wrangler:deploy`
- Requires Cloudflare API token

## 🐛 Bug Reports

When filing bug reports, please include:

1. **Environment details**
   - Browser and version
   - Operating system
   - Node.js version

2. **Steps to reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior
   - Screenshots if applicable

3. **Additional context**
   - Error messages
   - Console logs
   - Network requests

## 💡 Feature Requests

For feature requests, please:

1. Check existing issues first
2. Provide clear use case
3. Explain the problem it solves
4. Consider implementation complexity
5. Be open to discussion

## 🔒 Security

### Reporting Security Issues

Please report security vulnerabilities privately to:
- Email: security@cloudcollect.com
- Do not create public issues for security problems

### Security Guidelines

- Never commit sensitive data
- Use environment variables for secrets
- Follow OWASP guidelines
- Implement proper input validation
- Ensure multi-tenant data isolation

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

## 📄 License

By contributing to CloudCollect, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Annual contributor appreciation

Thank you for contributing to CloudCollect! 🎉