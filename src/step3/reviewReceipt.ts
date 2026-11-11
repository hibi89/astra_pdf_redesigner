// STEP7: private local review acknowledgement receipt. Not a source-content fidelity certification.
import {isProjectDocument, type ProjectDocument} from '../step2/model.ts';
import {isReviewed,reviewableBlocks} from './sourceReview.ts';

export const SOURCE_REVIEW_RECEIPT_FORMAT='astra-local-source-review-receipt';
export const SOURCE_REVIEW_RECEIPT_VERSION=1;
export interface SourceReviewReceipt {
  format:typeof SOURCE_REVIEW_RECEIPT_FORMAT;
  version:typeof SOURCE_REVIEW_RECEIPT_VERSION;
  source_sha256:string;
  source_size_bytes:number;
  project_content_sha256:string;
  anchored_block_count:number;
  acknowledged_block_count:number;
  unacknowledged_block_count:number;
  stale_acknowledgement_count:number;
  unanchored_block_count:number;
  anchored_source_page_count:number;
  status:'REVIEW_INCOMPLETE'|'ALL_ANCHORED_BLOCKS_ACKNOWLEDGED';
  source_fidelity_certified:false;
  owner_approval:'NOT_GRANTED';
  external_transfer:false;
  original_modified:false;
}
const DENY=():never=>{throw new Error('원본 검토 영수증을 생성할 수 없습니다. 문서와 원본을 다시 확인하세요.');};
const HEX=(bytes:ArrayBuffer):string=>[...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,'0')).join('');
async function sha256(bytes:ArrayBuffer):Promise<string>{
  if(!globalThis.crypto?.subtle)DENY();
  return HEX(await crypto.subtle.digest('SHA-256',bytes));
}
export async function makeSourceReviewReceipt(
  project:ProjectDocument,
  marks:Readonly<Record<string,string>>,
  original:Blob,
):Promise<SourceReviewReceipt>{
  if(!isProjectDocument(project) || !marks || typeof marks!=='object' || Array.isArray(marks) ||
     !(original instanceof Blob) || original.size<5 || original.size>30*1024*1024)DENY();
  const anchors=reviewableBlocks(project);
  const acknowledgements=anchors.filter(block=>isReviewed(block,marks));
  const stale=anchors.filter(block=>Object.hasOwn(marks,block.id)&&!isReviewed(block,marks));
  const all=project.content.sections.flatMap(section=>section.blocks);
  const pageCount=new Set(anchors.map(block=>block.origin?.page)).size;
  // Exact source/project content snapshots are only used for cryptographic fingerprints.
  // Neither source bytes nor document text are returned in the receipt or logged.
  const originalBuffer=await original.arrayBuffer();
  const projectBytes=new TextEncoder().encode(JSON.stringify(project.content));
  const [sourceHash,projectHash]=await Promise.all([
    sha256(originalBuffer),sha256(projectBytes.buffer.slice(
      projectBytes.byteOffset,projectBytes.byteOffset+projectBytes.byteLength) as ArrayBuffer)
  ]);
  const unacknowledged=anchors.length-acknowledgements.length;
  return Object.freeze({
    format:SOURCE_REVIEW_RECEIPT_FORMAT,version:SOURCE_REVIEW_RECEIPT_VERSION,
    source_sha256:sourceHash,source_size_bytes:original.size,project_content_sha256:projectHash,
    anchored_block_count:anchors.length,acknowledged_block_count:acknowledgements.length,
    unacknowledged_block_count:unacknowledged,stale_acknowledgement_count:stale.length,
    unanchored_block_count:all.length-anchors.length,anchored_source_page_count:pageCount,
    status:anchors.length>0 && unacknowledged===0?'ALL_ANCHORED_BLOCKS_ACKNOWLEDGED':'REVIEW_INCOMPLETE',
    source_fidelity_certified:false,owner_approval:'NOT_GRANTED',
    external_transfer:false,original_modified:false
  });
}
export function downloadSourceReviewReceipt(report:SourceReviewReceipt):void{
  if(report.format!==SOURCE_REVIEW_RECEIPT_FORMAT||
     report.owner_approval!=='NOT_GRANTED'||report.source_fidelity_certified!==false)DENY();
  const blob=new Blob([JSON.stringify(report,null,2)+'\n'],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.href=url;link.download='astra-source-review.json';
  document.body.append(link);link.click();link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),60_000);
}
