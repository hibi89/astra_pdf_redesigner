#!/usr/bin/env python3
"""Synthetic-only Korean Tesseract provider smoke (not an Astra release test)."""
import hashlib
import json
import subprocess
import tempfile
from pathlib import Path
from shutil import which
from PIL import Image, ImageDraw, ImageFont

FONT=Path('/usr/share/fonts/truetype/nanum/NanumGothic.ttf')
SAMPLES=[
 '안녕하세요 한국어 문서 2026',
 '보고서 제목 4500원 금액',
 '원본 PDF 숫자 12345 검수',
]
def main():
 binary=which('tesseract')
 if not binary or not FONT.is_file():
  print(json.dumps({'status':'UNAVAILABLE','reason':'provider-or-font-unavailable'}))
  return 2
 probe=subprocess.run([binary,'--list-langs'],capture_output=True,text=True,timeout=12)
 if not {'kor','eng'}.issubset(set(probe.stdout.splitlines())):
  print(json.dumps({'status':'UNAVAILABLE','reason':'kor+eng-assets-unavailable'}))
  return 2
 results=[]
 with tempfile.TemporaryDirectory(prefix='astra-synthetic-korean-ocr-') as tmp:
  font=ImageFont.truetype(str(FONT),48)
  for index,source in enumerate(SAMPLES):
   filename=Path(tmp)/f'sample-{index}.png'
   image=Image.new('RGB',(1200,180),(255,255,255))
   ImageDraw.Draw(image).text((36,45),source,font=font,fill=(0,0,0))
   image.save(filename)
   output=subprocess.run([binary,str(filename),'stdout','-l','kor+eng','--psm','6'],
      capture_output=True,text=True,timeout=35)
   text=output.stdout.strip()
   results.append({'sample':index+1,'fixture_sha256':hashlib.sha256(filename.read_bytes()).hexdigest(),
      'expected':source,'recognized':text,'exact':text==source,'return_code':output.returncode})
 exact=sum(x['exact'] for x in results)
 print(json.dumps({'status':'BASIC_PROVIDER_SMOKE_PASS' if exact>=2 else 'INCOMPLETE',
  'exact':exact,'total':len(results),'results':results,
  'not_commercial_release':True,'no_customer_input':True},ensure_ascii=False,indent=2))
 return 0 if exact>=2 else 1

if __name__=='__main__':
 raise SystemExit(main())
