# PLACEHOLDER_project-name

경희대학교 중앙 IT 동아리 쿠러그(KHLUG) 프론트엔드 프로젝트 템플릿입니다.

## 시작하기

### 1. PLACEHOLDER 값 교체

`PLACEHOLDER_`로 시작하는 값을 프로젝트에 맞게 교체합니다.

```sh
grep -r "PLACEHOLDER_" .
```

| 파일 | 항목 |
|---|---|
| `package.json` | `name` |
| `vite.config.ts` | PWA manifest의 앱 이름, 설명 |
| `index.html` | 페이지 제목, OG 태그, favicon URL |

### 2. 의존성 설치

```sh
yarn
```

### 3. 개발 서버 실행

```sh
yarn dev
```

## 개발 명령어

- `yarn dev` — Vite 개발 서버
- `yarn build` — 프로덕션 빌드
- `yarn lint` — ESLint 실행
- `yarn preview` — 프로덕션 빌드 미리보기

## 디렉토리 구조

```
src/
├── api/
│   ├── manage/        # 운영진 전용 API
│   └── public/        # 공개 API
├── components/        # 프로젝트 전용 UI 컴포넌트
├── features/          # 기능별 컨테이너와 비즈니스 로직
├── hooks/             # 프로젝트 전용 React 훅
├── layouts/           # 프로젝트 전용 레이아웃
├── pages/
│   ├── manage/        # 운영진용 페이지 (/manage/*)
│   └── member/        # 일반 사용자용 페이지 (/member/*)
├── util/              # 프로젝트 전용 유틸리티
├── App.tsx            # 라우터 설정
└── main.tsx           # 앱 진입점
```

공용 컴포넌트, 훅, 레이아웃, 유틸리티는 `@khlug/common-module`에서 제공합니다.