# 🚀 Vercel 배포 가이드

**무료**로 온라인 웹앱을 배포하세요! Vercel은 슬립 모드가 없어 항상 빠릅니다.

---

## 📋 사전 준비

### 네이버 API 키 확인

배포 시 환경변수로 사용할 API 키를 확인하세요:
- **Client ID**: 원본 `config.js` 파일에서 확인
- **Client Secret**: 원본 `config.js` 파일에서 확인

> ⚠️ **중요**: API 키는 GitHub에 업로드하지 마세요 (보안 보호)

---

## 🔧 1단계: GitHub 레포지토리 생성

### GitHub Desktop 사용 (추천)

1. **GitHub Desktop** 실행
2. **File** → **Add Local Repository**
3. `c:\Users\USER\Desktop\app-test\turtle\turtle-vercel` 폴더 선택
4. "Create a repository" 버튼 클릭
5. 레포지토리 정보 입력:
   - **Name**: `naver-product-collector` (원하는 이름)
   - **Description**: 네이버 쇼핑 상품 정보 수집기
   - **Keep this code private**: 체크 (또는 Public 선택)
6. **Create Repository** 클릭
7. **Publish repository** 클릭하여 GitHub에 업로드

### 확인사항

- `.gitignore`에 의해 민감한 파일이 제외되었는지 확인
- GitHub Desktop의 "Changes" 탭에서 `config.js`가 보이지 않아야 정상

---

## 🌐 2단계: Vercel에서 배포

### Vercel 계정 생성

1. [vercel.com](https://vercel.com) 접속
2. **Sign Up** 클릭
3. **Continue with GitHub** 선택 (GitHub 계정으로 로그인)
4. Vercel에 GitHub 접근 권한 허용

### 프로젝트 배포

1. Vercel 대시보드에서 **Add New...** → **Project** 클릭
2. **Import Git Repository** 섹션에서 방금 생성한 GitHub 레포지토리 찾기
   - 목록에 안 보이면 **Adjust GitHub App Permissions**에서 레포지토리 권한 추가
3. **Import** 클릭

### 프로젝트 설정

다음 항목을 확인/입력하세요:

| 항목 | 값 |
|------|-----|
| **Framework Preset** | Other (자동 감지됨) |
| **Root Directory** | `./` (기본값) |
| **Build Command** | 비워두기 (정적 파일) |
| **Output Directory** | `public` |

### 환경변수 설정 (중요!)

**Environment Variables** 섹션에서:

1. **Add** 버튼 클릭
2. 다음 2개의 환경변수 추가:

```
Name: NAVER_CLIENT_ID
Value: [config.js에서 복사한 Client ID 값]
```

```
Name: NAVER_CLIENT_SECRET
Value: [config.js에서 복사한 Client Secret 값]
```

> 🔐 **보안 팁**: 환경변수는 암호화되어 안전하게 저장됩니다

### 배포 시작

1. **Deploy** 버튼 클릭
2. 배포 진행 상황 확인 (약 30초~1분 소요)
3. 상태가 **Ready**로 변경되면 배포 완료! 🎉

---

## ✅ 3단계: 접속 확인

1. 배포 완료 후 **Visit** 버튼 클릭
2. 자동으로 생성된 URL로 접속됨
   - 예: `https://naver-product-collector.vercel.app`
3. 상품명 입력 후 검색 테스트

### 예상 URL 형식
```
https://[프로젝트이름].vercel.app
```

---

## 🎨 4단계: 커스텀 도메인 (선택사항)

무료로 커스텀 도메인을 연결할 수 있습니다!

1. Vercel 프로젝트 → **Settings** → **Domains**
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 도메인 연결

---

## 📱 모바일에서도 사용하기

배포된 URL을 스마트폰에서도 접속 가능합니다!
- 북마크에 추가하면 앱처럼 사용 가능
- 카카오톡으로 링크 공유도 가능

---

## 💡 Vercel 무료 플랜 장점

✅ **완전 무료** (취미 프로젝트용)
✅ **슬립 모드 없음** (항상 빠른 응답)
✅ **자동 HTTPS**
✅ **무제한 대역폭**
✅ **자동 배포** (GitHub push 시 자동 재배포)
✅ **글로벌 CDN** (전 세계 어디서나 빠름)

### 제한사항

- 월 100GB 대역폭 (개인 사용 충분)
- 월 100시간 서버리스 함수 실행 시간

> 💡 **팁**: 대부분의 개인 프로젝트는 무료 플랜으로 충분합니다!

---

## 🔄 코드 업데이트 방법

코드를 수정한 후:

1. **GitHub Desktop**에서 변경사항 확인
2. **Commit to main** 입력 후 커밋
3. **Push origin** 클릭
4. Vercel이 **자동으로 재배포** 시작 (약 30초~1분)
5. 배포 완료 후 자동으로 사이트 업데이트

---

## 🐛 문제 해결

### "API 키가 설정되지 않았습니다" 오류

**원인**: 환경변수가 제대로 설정되지 않음

**해결방법**:
1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables** 클릭
3. `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` 확인
4. 값이 정확한지 재확인 후 **Save**
5. **Deployments** 탭에서 **Redeploy** 클릭

### 배포가 실패함

**확인사항**:
1. Vercel 대시보드 → **Deployments** → 실패한 배포 클릭
2. **Build Logs**에서 오류 확인
3. 파일 구조가 올바른지 확인:
   ```
   turtle-vercel/
   ├── api/
   │   ├── search.js
   │   ├── blog.js
   │   └── image.js
   ├── public/
   │   ├── index.html
   │   ├── app.js
   │   └── style.css
   ├── vercel.json
   └── package.json
   ```

### 검색이 작동하지 않음

1. 브라우저 개발자 도구 (F12) → **Console** 탭 확인
2. 네트워크 오류가 있는지 확인
3. API 키가 올바른지 재확인
4. Vercel 환경변수 재설정 후 **Redeploy**

---

## 🎯 다음 단계

배포 완료 후:
- ✅ URL을 북마크에 추가
- ✅ 모바일에서도 테스트
- ✅ 친구들과 공유!
- ✅ 커스텀 도메인 연결 (선택)

---

## 📞 지원

문제가 발생하면:
- [Vercel 문서](https://vercel.com/docs)
- [Vercel 커뮤니티](https://github.com/vercel/vercel/discussions)

**축하합니다! 이제 전 세계 어디서나 웹앱을 사용할 수 있습니다! 🎉**
