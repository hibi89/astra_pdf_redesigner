import { blankProject, isProjectDocument, LIMITS, type ImageAsset, type ProjectDocument } from './model.ts';
import { parseStored, STORAGE_KEY } from '../storage.ts';
import { migrateStep1Document } from './model.ts';

const NAME='astra-pdf-redesigner:v2';
const VERSION=1; // IndexedDB upgrade version, independent from document schemaVersion.
const DOCS='documents', ASSETS='assets', META='meta';
export const ACTIVE='activeDocumentId', MIGRATION='v1MigrationFinished';

export function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error??new Error('IndexedDB request failed'));});
}
export function complete(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error??new Error('IndexedDB transaction aborted'));tx.onerror=()=>reject(tx.error??new Error('IndexedDB transaction error'));});
}
export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(NAME,VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(DOCS)) db.createObjectStore(DOCS,{keyPath:'id'});
      if(!db.objectStoreNames.contains(ASSETS)){const store=db.createObjectStore(ASSETS,{keyPath:'id'});store.createIndex('documentId','documentId',{unique:false});}
      if(!db.objectStoreNames.contains(META))db.createObjectStore(META);
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error??new Error('IndexedDB opening failed'));
    req.onblocked=()=>reject(new Error('기존 탭에서 데이터베이스를 사용 중입니다. 다른 탭을 닫아 주세요.'));
  });
}

export async function listDocuments(db:IDBDatabase):Promise<ProjectDocument[]>{
  const tx=db.transaction(DOCS,'readonly');const done=complete(tx);const items=await request(tx.objectStore(DOCS).getAll()) as ProjectDocument[];await done;
  if(items.some(item=>!isProjectDocument(item)))throw new Error('일부 문서 데이터가 손상되었습니다. 기존 기록은 삭제하지 않았습니다. 백업 후 상태를 확인해 주세요.');
  return items.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
}
export async function readDocument(db:IDBDatabase,id:string):Promise<ProjectDocument|undefined>{
  const tx=db.transaction(DOCS,'readonly');const done=complete(tx);const doc=await request(tx.objectStore(DOCS).get(id));await done;
  if(doc!==undefined&&!isProjectDocument(doc))throw new Error('저장된 문서 구조가 손상되었습니다.');
  return doc as ProjectDocument|undefined;
}
export async function readAsset(db:IDBDatabase,id:string):Promise<ImageAsset|undefined>{
  const tx=db.transaction(ASSETS,'readonly');const done=complete(tx);const data=await request(tx.objectStore(ASSETS).get(id));await done;return data as ImageAsset|undefined;
}
export async function readAssets(db:IDBDatabase,documentId:string):Promise<ImageAsset[]>{
  const tx=db.transaction(ASSETS,'readonly');const done=complete(tx);
  const assets=await request(tx.objectStore(ASSETS).index('documentId').getAll(documentId)) as ImageAsset[];
  await done;return assets;
}
export async function readMeta<T>(db:IDBDatabase,key:string):Promise<T|undefined>{
  const tx=db.transaction(META,'readonly');const done=complete(tx);const v=await request(tx.objectStore(META).get(key));await done;return v as T|undefined;
}
export async function saveDocument(db:IDBDatabase,doc:ProjectDocument):Promise<void>{
  if(!isProjectDocument(doc))throw new Error('문서 형식이 잘못되었습니다.');
  const tx=db.transaction(DOCS,'readwrite');const done=complete(tx);tx.objectStore(DOCS).put(doc);await done;
}
export async function writeTransaction(db:IDBDatabase,doc:ProjectDocument,add:ImageAsset[]=[],remove:string[]=[],meta?:Record<string,unknown>):Promise<void>{
  if(!isProjectDocument(doc))throw new Error('문서 형식이 잘못되었습니다.');
  const tx=db.transaction([DOCS,ASSETS,META],'readwrite');const done=complete(tx);
  tx.objectStore(DOCS).put(doc);
  for(const asset of add)tx.objectStore(ASSETS).put(asset);
  for(const id of remove)tx.objectStore(ASSETS).delete(id);
  for(const [key,value] of Object.entries(meta??{}))tx.objectStore(META).put(value,key);
  await done;
}
export async function setActive(db:IDBDatabase,id:string):Promise<void>{
  const tx=db.transaction(META,'readwrite');const done=complete(tx);tx.objectStore(META).put(id,ACTIVE);await done;
}
export async function deleteDocument(db:IDBDatabase,doc:ProjectDocument,nextId:string,replacement?:ProjectDocument):Promise<void>{
  const tx=db.transaction([DOCS,ASSETS,META],'readwrite');const done=complete(tx);
  if(replacement)tx.objectStore(DOCS).put(replacement);
  tx.objectStore(DOCS).delete(doc.id);
  const cursor=tx.objectStore(ASSETS).index('documentId').openKeyCursor(IDBKeyRange.only(doc.id));
  cursor.onsuccess=()=>{const item=cursor.result;if(item){tx.objectStore(ASSETS).delete(item.primaryKey);item.continue();}};
  tx.objectStore(META).put(nextId,ACTIVE);await done;
}
/** Set migration marker and new document atomically. Retain the original localStorage bytes. */
export async function initialize(db:IDBDatabase):Promise<{warning?:string}>{
  let original: string|null=null;
  try{original=localStorage.getItem(STORAGE_KEY);}catch{return{warning:'이전 회고록 저장소에 접근하지 못했습니다. 원본을 삭제하지 않았습니다.'};}
  const parsed=parseStored(original);
  let warning: string|undefined;
  if(original&&!parsed)warning='이전 회고록의 저장 형식이 손상되었거나 지원되지 않는 버전입니다. 원본은 삭제하지 않았습니다.';
  const marker=await readMeta<boolean>(db,MIGRATION);
  if(!marker&&parsed){
    const doc=migrateStep1Document(parsed);
    const tx=db.transaction([DOCS,META],'readwrite');const done=complete(tx);
    const meta=tx.objectStore(META);
    const check=meta.get(MIGRATION);
    check.onsuccess=()=>{if(!check.result){tx.objectStore(DOCS).put(doc);meta.put(true,MIGRATION);meta.put(doc.id,ACTIVE);}};
    await done;
  }
  const list=await listDocuments(db);
  if(!list.length&&!warning){
    await writeTransaction(db,blankProject(),[],[],{});
    const fresh=await listDocuments(db);await setActive(db,fresh[0].id);
  }
  if(list.length>LIMITS.documents)warning='저장된 문서 개수가 제한을 초과합니다.';
  return{warning};
}
