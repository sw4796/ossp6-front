# OSSP6 Frontend

Vite + React 기반의 OSSP6조 프론트엔드 레포입니다.

---

## 🚀 프로젝트 시작 방법

### 1. 레포 클론 & 패키지 설치

```bash
git clone https://github.com/your-org/ossp6-frontend.git
cd ossp6-frontend
npm install
```
### 2. 환경변수(.env) 설정
env
VITE_API_URL=http://localhost:8080
실제 백엔드 API 서버 주소로 수정

### 3. 개발 서버 실행
```bash
npm run dev
http://localhost:5173 등 안내된 주소에서 확인
```
### 📁 파일/폴더 구조
```bash
ossp6-frontend/
├── public/                # 정적 파일(index.html 등)
├── src/
│   ├── api/               # Axios 등 API 연동 함수
│   ├── assets/            # 이미지, 폰트 등
│   ├── components/        # 재사용 컴포넌트
│   ├── hooks/             # 커스텀 리액트 훅
│   ├── pages/             # 각 라우트 페이지
│   ├── styles/            # CSS, SCSS 등 스타일
│   ├── utils/             # 유틸리티 함수
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css          # 전체 스타일 적용
├── .env                   # 환경변수 (gitignore 필수)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```
### 🛠️ 사용 스택/라이브러리
- Vite: 빠른 빌드/개발환경 도구

- React: 프론트엔드 UI 라이브러리

- React Router DOM: SPA 라우팅

- Axios: API 비동기 통신

- ESLint, Prettier: 코드 스타일 통일 및 자동 포매팅 (옵션)

### ✅ 기본 개발/설정 사항
- .gitignore, .env로 중요 파일 관리

- src/ 폴더 구조 사전 분리

- 라우터 및 API 연동 미리 세팅

- ESLint/Prettier 등 코드 스타일 도구 적용 가능
