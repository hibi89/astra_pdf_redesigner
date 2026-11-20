#!/usr/bin/env python3
"""Deterministic synthetic Korean OCR test cases. No customer files or network."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageFont, ImageDraw, ImageFilter

TEXTS = [
    '2026년 11월 14일 계약금 150,000원',
    '승인하지 않습니다. 결제 불가',
    '주문번호 AB-0091 / 합계 80,000원',
    '표 행 01 금액 123,456원',
    '매출액 12.5% 증가했습니다.',
    '갑과 을은 계약을 취소합니다.',
    'PDF 원문은 수정하지 않습니다.',
    '회계 장부 부채 2,300,000원',
    '고객명 홍길동 배송일 2026-12-31',
    '원가 300원 판매가 500원',
    '서울특별시 강남구 테헤란로',
    '개인정보 보호 및 처리 방침',
    'AI 분석 결과 검토가 필요합니다.',
    '수익률 -3.2% 손실 금액 -50원',
    '증빙 자료는 외부 전송 금지',
    '매출채권 1,500원 재고자산 3,200원',
    '제안서 A-101 최종본 3페이지',
    '오늘의 날짜 2026-11-14',
    '제외된 항목은 다시 확인',
    '100.00 USD 19,500 KRW',
]

def main():
    parser = argparse.ArgumentParser(description='20 synthetic OCR cases, no external content')
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--font', type=Path, required=True, help='Locally installed Korean TrueType font')
    args = parser.parse_args()
    out = args.out.resolve()
    font = args.font.resolve(strict=True)
    if not font.is_file() or font.suffix.lower() not in ('.ttf', '.otf'):
        raise SystemExit('A local Korean .ttf/.otf font is required')
    if out.exists() and any(out.iterdir()):
        raise SystemExit('Output folder is not empty; refusing overwrite')
    out.mkdir(parents=True, exist_ok=True)
    records = []
    for i, text in enumerate(TEXTS):
        background = (238, 238, 238) if i in (3, 10) else (255, 255, 255)
        foreground = (65, 65, 65) if i in (3, 10) else (140, 140, 140) if i in (11, 19) else (5, 5, 5)
        size = 42 if i in (4, 13) else 34 if i in (9, 16) else 58
        angle = 1.7 if i in (6, 14) else 0
        blur = 1.0 if i in (8, 17) else 0
        image = Image.new('RGB', (1300, 400), background)
        drawing = ImageDraw.Draw(image)
        drawing.text((65, 120), text, font=ImageFont.truetype(str(font), size), fill=foreground)
        if i in (2, 3, 15):
            drawing.rectangle((40, 60, 1260, 355), outline=(120, 120, 120), width=2)
        if angle:
            image = image.rotate(angle, expand=False, fillcolor=background)
        if blur:
            image = image.filter(ImageFilter.GaussianBlur(blur))
        name = f'ocr_{i+1:02}.png'
        target = out / name
        image.save(target, format='PNG')
        records.append({
            'case': i + 1, 'file': name, 'expected': text,
            'sha256': hashlib.sha256(target.read_bytes()).hexdigest()
        })
    (out / 'manifest.json').write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )
    print(f'Generated {len(records)} synthetic cases. Do not use private customer files.')

if __name__ == '__main__':
    main()
