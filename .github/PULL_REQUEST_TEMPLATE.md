## 🌿 Aurore — Pull Request Template

### 🚀 Description
Provide a concise summary of the changes and the reasoning behind them.

- [ ] New feature?
- [ ] Bug fix?
- [ ] Refactoring?
- [ ] Documentation?

### 🛠️ Technical Details
What specific changes did you make?
- Backend routes?
- Shared schemas?
- Frontend components?
- Database migrations?

### 🧪 How was it tested?
- [ ] Unit tests?
- [ ] Integration tests?
- [ ] Manual verification?

### 🛡️ Security Check
- [ ] Does this change handle PII (Personally Identifiable Information)?
- [ ] Are the inputs validated with Zod?
- [ ] Is the database query scoped by `userId`?

---

### ✅ Checklist
- [ ] I have read the [CONTRIBUTING.md](./CONTRIBUTING.md).
- [ ] `make lint-fix` passes.
- [ ] `make ts-check` passes.
- [ ] All tests pass (`make test-all`).
