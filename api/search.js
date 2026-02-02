// Vercel 서버리스 함수 - 네이버 쇼핑 검색 API
export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { query, display = 20 } = req.query;

    if (!query) {
        return res.status(400).json({ error: '검색어를 입력해주세요.' });
    }

    // 환경변수에서 API 키 가져오기
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return res.status(500).json({
            error: 'API 키가 설정되지 않았습니다.',
            hint: 'Vercel 환경변수를 확인해주세요.'
        });
    }

    try {
        const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=${display}&sort=sim`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Naver-Client-Id': clientId,
                'X-Naver-Client-Secret': clientSecret
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('네이버 API 오류:', response.status, errorText);
            return res.status(response.status).json({
                error: `네이버 API 오류: ${response.status}`,
                details: errorText
            });
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('서버 오류:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.', details: error.message });
    }
}
