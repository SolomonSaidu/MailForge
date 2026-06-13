# MailForge 📧🔥

MailForge is a developer-first transactional email API service built for reliability, speed, and secure key management.

## 🚀 Features

- **Dual Authentication**: Secure dashboard access via JWT and automated service access via SHA-256 hashed API keys.
- **Key Infrastructure**: Generate, list, and revoke API keys with high-entropy security.
- **Email Core**: Seamless integration with Resend for high-deliverability email sending.
- **Transaction Logging**: Automatic tracking of every email sent (Success/Failure).
- **Analytics Dashboard**: Real-time stats on usage trends and delivery rates.

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT & SHA-256 Hashing
- **Email Provider**: Resend

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- A Resend API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MailForge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://user:password@localhost:5432/mailforge_db"
   JWT_SECRET="your_secret_key"
   RESEND_API_KEY="re_..."
   ```

4. **Database Migration**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

## 📡 API Reference

### Authentication (User)
- `POST /api/v1/auth/register` - Create a new account
- `POST /api/v1/auth/login` - Get a JWT token
- `GET /api/v1/auth/me` - Get current user profile (Requires JWT)

### API Keys
- `POST /api/v1/keys` - Create a new API key (Requires JWT)
- `GET /api/v1/keys` - List all keys (Requires JWT)
- `DELETE /api/v1/keys/:id` - Revoke a key (Requires JWT)

### Email Service
- `POST /api/v1/emails/send` - Send an email (Requires `x-api-key` header)
- `GET /api/v1/emails/logs` - View email history (Requires JWT)

### Analytics
- `GET /api/v1/analytics/dashboard` - View usage stats (Requires JWT)

## 🔒 Security
- Passwords are salted and hashed using **Bcrypt**.
- API Keys are stored as **SHA-256** hashes.
- Route protection is enforced via custom middleware.

## 📄 License
ISC
