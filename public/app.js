/**
 * 네이버 쇼핑 상품 정보 수집기 - Vercel 버전
 * config.js 없이 직접 설정 포함
 */

// 설정
const CONFIG = {
    SEARCH_DISPLAY: 20,
    OUTPUT_FORMAT: {
        showBrand: true,
        showMaker: true,
        showCategory: true,
        showPriceRange: true,
        showMalls: true,
        maxMalls: 5
    }
};

// DOM Elements
const productNameInput = document.getElementById('productName');
const promoLinkInput = document.getElementById('promoLink');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const charCount = document.getElementById('charCount');
const copyBtn = document.getElementById('copyBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const analysisSection = document.getElementById('analysisSection');
const analysisText = document.getElementById('analysisText');
const analysisCharCount = document.getElementById('analysisCharCount');
const copyAnalysisBtn = document.getElementById('copyAnalysisBtn');
const productListSection = document.getElementById('productListSection');
const productList = document.getElementById('productList');
const toast = document.getElementById('toast');
const currentDate = document.getElementById('currentDate');

// 현재 날짜 표시
const today = new Date();
const dateStr = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`;
currentDate.textContent = dateStr;

// 검색된 상품 데이터 저장
let searchedProducts = [];

// Enter 키로 검색
productNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
});

searchBtn.addEventListener('click', searchProducts);
copyBtn.addEventListener('click', copyToClipboard);
analyzeBtn.addEventListener('click', analyzeProduct);
copyAnalysisBtn.addEventListener('click', copyAnalysisToClipboard);

async function searchProducts() {
    const keyword = productNameInput.value.trim();
    if (!keyword) {
        alert('상품명을 입력해주세요!');
        productNameInput.focus();
        return;
    }

    showLoading(true);
    hideResult();

    try {
        const products = await fetchNaverShopping(keyword);
        searchedProducts = products;

        if (products.length === 0) {
            alert('검색 결과가 없습니다. 다른 키워드로 검색해보세요.');
            showLoading(false);
            return;
        }

        const output = generateOutput(products[0], keyword, products);
        displayResult(output);
        displayProductList(products);

    } catch (error) {
        console.error('검색 오류:', error);
        alert(`검색 중 오류가 발생했습니다.\n\n${error.message}`);
    } finally {
        showLoading(false);
    }
}

async function fetchNaverShopping(keyword) {
    const url = `/api/search?query=${encodeURIComponent(keyword)}&display=${CONFIG.SEARCH_DISPLAY}`;
    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API 오류 (${response.status})`);
    }

    const data = await response.json();
    return data.items || [];
}

function generateOutput(product, keyword, allProducts) {
    const promoLink = promoLinkInput.value.trim();
    const cleanTitle = stripHtml(product.title);
    const brand = product.brand || '정보 없음';
    const maker = product.maker || '정보 없음';
    const category = formatCategory(product.category1, product.category2, product.category3, product.category4);

    const prices = allProducts.map(p => parseInt(p.lprice)).filter(p => !isNaN(p));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const malls = [...new Set(allProducts.map(p => p.mallName).filter(Boolean))];
    const mallsStr = malls.slice(0, CONFIG.OUTPUT_FORMAT.maxMalls).join(', ');

    let output = `[상품 정보]\n`;
    output += `📌 상품명: ${cleanTitle}\n`;
    if (CONFIG.OUTPUT_FORMAT.showBrand) output += `📌 브랜드: ${brand}\n`;
    if (CONFIG.OUTPUT_FORMAT.showMaker) output += `📌 제조사: ${maker}\n`;
    if (CONFIG.OUTPUT_FORMAT.showCategory) output += `📌 카테고리: ${category}\n`;
    output += `📌 최저가: ${formatPrice(minPrice)}원\n`;
    if (CONFIG.OUTPUT_FORMAT.showPriceRange && minPrice !== maxPrice) {
        output += `📌 가격대: ${formatPrice(minPrice)}원 ~ ${formatPrice(maxPrice)}원\n`;
    }
    if (CONFIG.OUTPUT_FORMAT.showMalls && mallsStr) output += `📌 판매처: ${mallsStr}\n`;
    output += `\n[검색 키워드]: ${keyword}\n`;
    if (promoLink) output += `[홍보 링크]: ${promoLink}\n`;

    return output;
}

function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function formatCategory(cat1, cat2, cat3, cat4) {
    const categories = [cat1, cat2, cat3, cat4].filter(Boolean);
    return categories.join(' > ') || '정보 없음';
}

function formatPrice(price) {
    return price.toLocaleString('ko-KR');
}

function displayResult(output) {
    resultText.textContent = output;
    charCount.textContent = output.length;
    resultSection.classList.remove('hidden');
}

function displayProductList(products) {
    productList.innerHTML = '';

    products.forEach((product) => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <div class="product-image-wrap">
                <img src="${product.image}" alt="${stripHtml(product.title)}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2250%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2214%22>No Image</text></svg>'">
                <button class="btn-open-link" title="상품 페이지 열기">🔗</button>
                <button class="btn-save-img" title="이미지 저장">💾</button>
            </div>
            <div class="product-info">
                <div class="name">${stripHtml(product.title)}</div>
                <div class="brand">${product.brand || product.maker || '브랜드 정보 없음'}</div>
                <div class="price">${formatPrice(parseInt(product.lprice))}원</div>
                <div class="mall">${product.mallName}</div>
            </div>
        `;

        item.querySelector('.product-info').addEventListener('click', () => {
            const output = generateOutput(product, productNameInput.value.trim(), products);
            displayResult(output);
            resultSection.scrollIntoView({ behavior: 'smooth' });
        });

        item.querySelector('.btn-open-link').addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(product.link, '_blank');
        });

        item.querySelector('.btn-save-img').addEventListener('click', (e) => {
            e.stopPropagation();
            downloadImage(product.image, stripHtml(product.title));
        });

        productList.appendChild(item);
    });

    productListSection.classList.remove('hidden');
}

async function downloadImage(imageUrl, productName) {
    try {
        const response = await fetch(`/api/image?url=${encodeURIComponent(imageUrl)}`);
        if (!response.ok) throw new Error('이미지 다운로드 실패');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${productName.substring(0, 50)}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast('이미지가 저장되었습니다!');
    } catch (error) {
        console.error('이미지 다운로드 오류:', error);
        window.open(imageUrl, '_blank');
    }
}

async function copyToClipboard() {
    const text = resultText.textContent;
    try {
        await navigator.clipboard.writeText(text);
        showToast('클립보드에 복사되었습니다!');
    } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('클립보드에 복사되었습니다!');
    }
}

function showToast(message) {
    const toastMessage = toast.querySelector('.toast-message');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2000);
}

function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
        searchBtn.disabled = true;
    } else {
        loading.classList.add('hidden');
        searchBtn.disabled = false;
    }
}

function hideResult() {
    resultSection.classList.add('hidden');
    productListSection.classList.add('hidden');
    analysisSection.classList.add('hidden');
}

async function analyzeProduct() {
    if (searchedProducts.length === 0) {
        alert('먼저 상품을 검색해주세요!');
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span>⏳</span> 분석 중...';

    try {
        const product = searchedProducts[0];
        const keyword = productNameInput.value.trim();
        const promoLink = promoLinkInput.value.trim();
        const cleanTitle = stripHtml(product.title);
        const blogPosts = await fetchBlogReviews(cleanTitle);
        const output = generateAnalysisOutput(product, keyword, promoLink, searchedProducts, blogPosts);
        displayAnalysisResult(output);
    } catch (error) {
        console.error('분석 오류:', error);
        alert('분석 중 오류가 발생했습니다.');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span>✨</span> 상품 분석하기';
    }
}

async function fetchBlogReviews(productName) {
    try {
        const url = `/api/blog?query=${encodeURIComponent(productName)}&display=5`;
        const response = await fetch(url);
        if (!response.ok) return [];
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.warn('블로그 검색 오류:', error);
        return [];
    }
}

function generateAnalysisOutput(product, keyword, promoLink, allProducts, blogPosts = []) {
    const cleanTitle = stripHtml(product.title);
    const brand = product.brand || 'BRAND';
    const maker = product.maker || brand;
    const category = formatCategory(product.category1, product.category2, product.category3, product.category4);

    const prices = allProducts.map(p => parseInt(p.lprice)).filter(p => !isNaN(p));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const malls = [...new Set(allProducts.map(p => p.mallName).filter(Boolean))];
    const mallsStr = malls.slice(0, 4).join(', ');

    let output = `[상품 정보]\n`;
    output += `📌 상품명: ${cleanTitle}\n📌 브랜드: ${brand}\n📌 제조사: ${maker}\n📌 카테고리: ${category}\n📌 최저가: ${formatPrice(minPrice)}원\n`;
    if (minPrice !== maxPrice) output += `📌 가격대: ${formatPrice(minPrice)}원 ~ ${formatPrice(maxPrice)}원\n`;
    if (mallsStr) output += `📌 판매처: ${mallsStr}\n`;
    if (promoLink) output += `📌 구매 링크: ${promoLink}\n`;

    output += `\n안녕하세요! 오늘은 ${cleanTitle} 소개해드릴게요.\n`;
    output += `요즘 ${product.category2 || product.category1 || '이 분야'} 쪽에서 핫한 아이템인데, 직접 알아본 정보 공유드립니다.\n`;
    output += `\n---\n\n👍 장점 정리\n\n다른 분들은 어떻게 평가했을까요? 후기 모아봤어요.\n\n`;

    if (blogPosts.length > 0) {
        blogPosts.slice(0, 3).forEach(post => {
            const description = stripHtml(post.description || '');
            const snippet = description.length > 80 ? description.substring(0, 80) + '...' : description;
            if (snippet) output += `"${snippet}"\n\n`;
        });
    } else {
        output += `"${cleanTitle}이 눈에 들어오실 거예요. 실제 검색량도 많고, 후기 반응도 괜찮은... 사용 후기에..."\n\n`;
    }

    output += `• 튼튼하고 오래 쓸 것 같다고 해요\n• 사용하기 편하다는 의견이 대다수예요\n• 마감 처리가 깔끔하다는 평이 있어요\n`;
    output += `\n---\n\n🤔 이건 알고 가세요\n\n반대로 이런 피드백도 있더라고요.\n\n`;
    output += `• 배송 중 파손 케이스가 간혹 있으니 확인 필수예요\n• 개인 취향에 따라 호불호가 있을 수 있어요\n`;
    output += `\n---\n\n🎯 이런 분께 추천\n\n• 리뷰 믿고 사시는 분\n• 온라인 쇼핑 자주 하시는 분\n• 브랜드보다 실속 챙기시는 분\n`;
    output += `\n---\n\n🛒 쇼핑 정보\n\n• 현재 최저가: ${formatPrice(minPrice)}원${minPrice !== maxPrice ? ` ~ ${formatPrice(maxPrice)}원` : ''}\n`;
    output += `• 판매처: ${mallsStr}\n• 배송비/배송기간 확인 필수\n• 교환/환불 정책 체크\n`;
    output += `\n---\n\n📝 한줄 정리\n\n${cleanTitle} 어떠셨나요? 가격, 품질, 후기 다 고려했을 때 괜찮은 선택지라고 봐요. 도움이 되셨으면 좋겠네요!\n`;

    return output;
}

function displayAnalysisResult(output) {
    analysisText.textContent = output;
    analysisCharCount.textContent = output.length;
    analysisSection.classList.remove('hidden');
    analysisSection.scrollIntoView({ behavior: 'smooth' });
}

async function copyAnalysisToClipboard() {
    const text = analysisText.textContent;
    try {
        await navigator.clipboard.writeText(text);
        showToast('분석글이 클립보드에 복사되었습니다!');
    } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('분석글이 클립보드에 복사되었습니다!');
    }
}
