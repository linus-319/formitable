# Project Setup

### Clone the repo
```bash
git clone git@github.com:linus-319/formitable.git
cd formitable
```
### Start backend

```bash
cd backend
cp .env.example .env
docker compose up
```

You can view the backend api in the browser at `http://localhost:8000/api/v1/hello/`

### Start frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

You can view the frontend at `http://localhost:5173` - it should display the message "Hello from Django!"
