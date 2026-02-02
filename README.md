# 💝 다정 상품분석기 - Vercel 배포용

네이버 쇼핑 API를 활용한 상품 정보 수집 및 분석 웹앱입니다.

## ✨ 주요 기능

- 🔍 **상품 검색**: 네이버 쇼핑에서 상품 정보 자동 수집
- 📊 **상품 분석**: GPT용 상품 정보 자동 생성
- 💬 **블로그 분석**: 실제 후기 기반 상품 분석글 생성
- 📋 **원클릭 복사**: 클립보드 복사 기능
- 📱 **반응형 디자인**: 모바일/태블릿/PC 모두 지원

## 🚀 배포 방법

자세한 배포 가이드는 [`VERCEL_DEPLOY.md`](./VERCEL_DEPLOY.md) 파일을 참고하세요.

### 빠른 시작

1. GitHub에 레포지토리 생성
2. Vercel에서 Import
3. 환경변수 설정:
   - `NAVER_CLIENT_ID`
   - `NAVER_CLIENT_SECRET`
4. Deploy 클릭!

## 📁 프로젝트 구조

```
turtle-vercel/
├── api/                    # Vercel 서버리스 함수
│   ├── search.js          # 네이버 쇼핑 검색 API
│   ├── blog.js            # 네이버 블로그 검색 API
│   └── image.js           # 이미지 프록시
├── public/                 # 정적 파일
│   ├── index.html         # 메인 페이지
│   ├── app.js             # 클라이언트 JavaScript
│   └── style.css          # 스타일시트
├── vercel.json            # Vercel 설정
├── package.json           # 프로젝트 정보
└── VERCEL_DEPLOY.md       # 배포 가이드
```

## 🔑 환경변수

Vercel 환경변수에 다음을 설정해야 합니다:

- `NAVER_CLIENT_ID`: 네이버 API Client ID
- `NAVER_CLIENT_SECRET`: 네이버 API Client Secret

## 💡 기술 스택

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Vercel Serverless Functions
- **API**: Naver Open API (Shopping, Blog)
- **Deployment**: Vercel

## 📝 라이선스

개인 및 상업적 사용 가능

---

**Made with 💝 by 다정**
