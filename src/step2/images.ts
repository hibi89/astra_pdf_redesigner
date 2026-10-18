import { LIMITS, newIdentifier, type ImageAsset } from './model.ts';

export function imageType(bytes:Uint8Array): 'image/png'|'image/jpeg'|'image/webp'|null {
  if(bytes.length>=24&&bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71&&bytes[4]===13&&bytes[5]===10&&bytes[6]===26&&bytes[7]===10)return'image/png';
  if(bytes.length>=4&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return'image/jpeg';
  if(bytes.length>=16&&ascii(bytes,0,4)==='RIFF'&&ascii(bytes,8,4)==='WEBP')return'image/webp';
  return null;
}
const ascii=(x:Uint8Array,at:number,n:number)=>String.fromCharCode(...x.slice(at,at+n));
const u24=(x:Uint8Array,p:number)=>x[p]|x[p+1]<<8|x[p+2]<<16;
const u32be=(x:Uint8Array,p:number)=>(x[p]*16777216)+(x[p+1]<<16)+(x[p+2]<<8)+x[p+3];
/** Read dimensions before full image decompression where format headers permit. */
export function imageDimensions(bytes:Uint8Array,mime:string):{width:number;height:number}|null{
  if(mime==='image/png'&&bytes.length>=24)return{width:u32be(bytes,16),height:u32be(bytes,20)};
  if(mime==='image/webp'&&bytes.length>=30){
    const chunk=ascii(bytes,12,4);
    if(chunk==='VP8X')return{width:1+u24(bytes,24),height:1+u24(bytes,27)};
    if(chunk==='VP8 '&&bytes.length>=30)return{width:((bytes[26]|bytes[27]<<8)&0x3fff),height:((bytes[28]|bytes[29]<<8)&0x3fff)};
    if(chunk==='VP8L'&&bytes.length>=25)return{width:1+(((bytes[22]&0x3f)<<8)|bytes[21]),height:1+(((bytes[24]&0xf)<<10)|(bytes[23]<<2)|((bytes[22]&0xc0)>>6))};
  }
  if(mime==='image/jpeg'){
    let i=2;
    while(i+9<bytes.length){
      if(bytes[i]!==255){i++;continue;}let marker=bytes[++i];while(marker===255)marker=bytes[++i];i++;
      if(marker===0xd9||marker===0xda)break;
      if((marker>=0xc0&&marker<=0xc3)||(marker>=0xc5&&marker<=0xc7)||(marker>=0xc9&&marker<=0xcb)||(marker>=0xcd&&marker<=0xcf))
        return {height:(bytes[i+3]<<8)|bytes[i+4],width:(bytes[i+5]<<8)|bytes[i+6]};
      if(i+1>=bytes.length)break;
      const len=(bytes[i]<<8)|bytes[i+1];if(len<2)break;i+=len;
    }
  }
  return null;
}
export async function validateImage(file:Blob, originalName:string,documentId:string,id=newIdentifier()):Promise<ImageAsset>{
  if(file.size===0||file.size>LIMITS.imageBytes)throw new Error('이미지 파일은 1개당 10MiB 이하여야 합니다.');
  const first=new Uint8Array(await file.slice(0,Math.min(file.size,65536)).arrayBuffer());
  const mime=imageType(first);
  if(!mime)throw new Error('PNG, JPEG, WebP 이미지만 사용할 수 있으며 실제 파일 형식을 확인합니다.');
  if(file.type&&file.type!==mime)throw new Error('이미지의 MIME 유형과 실제 데이터가 다릅니다.');
  const dimensions=imageDimensions(first,mime);
  if(dimensions&&(!dimensions.width||!dimensions.height||dimensions.width*dimensions.height>LIMITS.imagePixels))throw new Error('이미지는 2,000만 픽셀 이하여야 합니다.');
  let bitmap:ImageBitmap;
  try{bitmap=await createImageBitmap(file);}catch{throw new Error('이미지를 열 수 없습니다. 손상되었거나 지원되지 않는 파일입니다.');}
  const width=bitmap.width,height=bitmap.height;bitmap.close();
  if(!width||!height||width*height>LIMITS.imagePixels)throw new Error('이미지는 2,000만 픽셀 이하여야 합니다.');
  return{id,documentId,mimeType:mime,originalName:originalName.slice(0,240),byteSize:file.size,width,height,blob:file};
}
