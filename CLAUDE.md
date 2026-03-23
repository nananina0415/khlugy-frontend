# CLAUDE.md

## 프로젝트 개요

쿠러그(KHLUG) 프론트엔드 프로젝트 템플릿입니다. React + TypeScript + Vite 기반이며, 공용 컴포넌트와 유틸리티는 `@khlug/common-module`에서 제공받습니다.

- **패키지 매니저**: Yarn 4

## 개발 명령어

- **개발 서버**: `yarn dev`
- **빌드**: `yarn build`
- **린트**: `yarn lint`
- **미리보기**: `yarn preview`

## 아키텍처

### 주요 기술 스택

- **React 18** + TypeScript
- **Vite** (SWC 플러그인)
- **React Router v6** (future flags 활성화)
- **TanStack Query** 서버 상태 관리
- **Axios** API 호출
- **Chakra UI v3** UI 컴포넌트
- **dayjs** 날짜 처리 (UTC/timezone/relativeTime 플러그인, ko 로케일)
- **react-toastify** 토스트 알림
- **@khlug/common-module** 공용 컴포넌트/훅/레이아웃/유틸

### 디렉토리 구조

```
src/
├── api/
│   ├── manage/        # 운영진 전용 API (관리자 권한 필요)
│   └── public/        # 공개 API
├── components/        # 프로젝트 전용 재사용 UI 컴포넌트 (로직 없음)
├── features/          # 기능별 컨테이너와 비즈니스 로직
├── hooks/             # 프로젝트 전용 React 훅
├── layouts/           # 프로젝트 전용 레이아웃
├── pages/
│   ├── manage/        # 운영진용 페이지 (/manage/* 경로)
│   ├── member/        # 일반 사용자용 페이지 (/member/* 경로)
│   └── public/        # 비인증 사용자용 페이지 (/public/* 경로)
├── util/              # 프로젝트 전용 유틸리티
├── App.tsx            # 라우터 설정
└── main.tsx           # 앱 진입점
```

공용 컴포넌트, 훅, 레이아웃, 유틸리티가 필요하면 `@khlug/common-module`에서 import합니다. 프로젝트 고유 코드만 `src/` 내에 작성합니다.

### 주요 아키텍처 패턴

1. **기능별 구조**: 복잡한 기능은 `features/`에 컨테이너 패턴으로 구성
2. **API 레이어 분리**: API 호출은 `src/api/`에 도메인별로 구성, `apiClient`는 `@khlug/common-module`에서 import
3. **컨테이너 패턴**: 비즈니스 로직과 상태는 컨테이너에 캡슐화
4. **로직 없는 컴포넌트**: `src/components/`는 props만 받는 순수 UI 컴포넌트

### 상태 관리

- **TanStack Query**: 서버 상태
- **React Router**: 네비게이션 상태
- **useState / useReducer**: 컴포넌트 로컬 상태

## 페이지 권한 및 구조

### URL 경로 구조

- `/manage/*` — 운영진 전용 (관리자 권한 필요)
- `/member/*` — 일반 사용자 (로그인 필요)
- `/public/*` — 외부 사용자도 볼 수 있음 (인증 없을 때)
- `/` - 로그인 페이지 처럼 권한에 무관한 특수한 경우, 서비스가 단일페이지로 나타나는데 권한에 따라 페이지구성이 달라지는 페이지 등

### 레이아웃

- **운영진용** (`/manage/*`): `MainLayout` (네비게이션 바 포함)
- **일반 사용자용** (`/member/*`): `SimpleLogoLayout` (로고만)
- **비인증용** (`/public/*`): `SimpleLogoLayout` 또는 레이아웃 없음

레이아웃은 `@khlug/common-module`에서 import합니다.

### API 권한 구조

- `src/api/manage/` — 운영진 권한이 필요한 API
- `src/api/public/` — 일반 사용자가 접근 가능한 API (운영진 권한 불필요)
- 유저 데이터의 `manager: boolean` 필드로 권한 구분

### 새 운영진 페이지 구성 가이드

1. `src/pages/manage/` 하위에 폴더 추가
2. `App.tsx`에서 `/manage/...` 경로로 라우트 등록
3. `MainLayout` 레이아웃 적용
4. 필요한 API는 `src/api/manage/`에 추가

### /login 페이지

해당 서비스에서 쿠러그 회원과는 별개로 서비스 자체 사용자를 관리할 때 사용합니다. 쿠러그 멤버/운영진 인증을 사용한다면 로그인은 쿠러그 사이트에서 처리하므로 `/login`이 필요하지 않습니다.

자세한 내용은 `src/pages/컨벤션` 파일을 참고하세요.

### 라우트와 폴더 이름

경로 파라미터(`:id` 등)는 `App.tsx`의 라우트 정의에서만 사용합니다. 폴더 이름은 의미 기반으로 작성합니다.

예: 폴더 `pages/manage/user/detail/`, 라우트 `path="/manage/user/:id"`

## 디자인 & UX 원칙

1. **UX 최우선** — 사용자 경험을 최우선으로 고려
2. **미니멀 디자인** — 그림자, 그라데이션보다 깔끔하고 명확한 인터페이스
3. **사용성 중심** — 랜딩 페이지가 아니므로 화려함보다 실용성
4. **구현 복잡도 균형** — 구현 난이도가 급격히 높아지면 차선책 고려

## TypeScript 설정

- strict 모드, ES2020 타겟, bundler 모듈 해상도
- `noUnusedLocals`, `noUnusedParameters` 활성화
- noEmit 모드 (Vite에서 처리)
