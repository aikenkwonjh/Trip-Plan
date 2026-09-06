import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { city, days } = await request.json();

    if (!city || typeof city !== 'string') {
      return Response.json({ error: '도시 이름이 필요합니다.' }, { status: 400 });
    }

    const numDays = Math.min(Math.max(Number(days) || 3, 1), 14);

    const prompt = `당신은 여행 추천 전문가입니다. "${city}"에 대해 다음 작업을 수행하세요:

1. 이 도시에서 가장 인기 있고 많이 찾는 할것들(관광지, 액티비티, 음식 등) 10개를 뽑아주세요.
2. 이 10개를 바탕으로 ${numDays}일간의 여행 일정을 하루별로 나누어 구성해주세요 (동선과 지역을 고려해서 묶어주세요).

반드시 아래 JSON 형식으로만 응답하고, 다른 설명이나 마크다운 코드블럭은 붙이지 마세요:
{
  "topActivities": [
    { "name": "장소/활동 이름", "description": "한줄 설명" }
  ],
  "itinerary": [
    { "day": 1, "activities": ["오전: ...", "오후: ...", "저녁: ..."] }
  ]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    const rawText = textBlock ? textBlock.text : '';

    const cleaned = rawText.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      return Response.json(
        { error: 'AI 응답을 해석하는 데 실패했습니다. 다시 시도해주세요.' },
        { status: 502 }
      );
    }

    return Response.json({
      city,
      days: numDays,
      topActivities: parsed.topActivities || [],
      itinerary: parsed.itinerary || [],
    });
  } catch (err) {
    console.error('plan API error:', err);
    return Response.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
