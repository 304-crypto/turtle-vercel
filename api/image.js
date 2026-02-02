// Vercel 서버리스 함수 - 이미지 프록시
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

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: '이미지 URL을 입력해주세요.' });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({ error: '이미지 다운로드 실패' });
        }

        const contentType = response.headers.get('content-type');
        const buffer = await response.arrayBuffer();

        res.setHeader('Content-Type', contentType || 'image/jpeg');
        res.setHeader('Content-Disposition', 'attachment');
        res.status(200).send(Buffer.from(buffer));

    } catch (error) {
        console.error('이미지 다운로드 오류:', error);
        res.status(500).json({ error: '이미지 다운로드 실패', details: error.message });
    }
}
