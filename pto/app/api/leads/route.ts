import {leadSchema,detectFileType,MAX_TOTAL_BYTES,MAX_FILES} from "@/lib/intake";
import {getStorage,json,sameOrigin,rateLimit} from "@/lib/storage";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 if(!sameOrigin(request)||request.headers.get("X-PTO-Request")!=="1")return json({message:"Yêu cầu không hợp lệ. Vui lòng tải lại trang."},403);
 const length=Number(request.headers.get("content-length")||0);
 if(length>MAX_TOTAL_BYTES+256000)return json({message:"Tổng dung lượng gửi vượt quá 24 MB."},413);
 let form:FormData;
 try{
  if(!await rateLimit(request))return json({message:"Bạn đã gửi nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau 10 phút hoặc liên hệ Zalo."},429);
  // Bound actual bytes as Content-Length is not authoritative.
  const reader=request.body?.getReader();if(!reader)return json({message:"Thiếu dữ liệu yêu cầu."},400);
  const chunks:Uint8Array[]=[];let total=0;
  for(;;){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>MAX_TOTAL_BYTES+256000){await reader.cancel();return json({message:"Tổng dung lượng gửi vượt quá 24 MB."},413)}chunks.push(value)}
  const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}chunks.length=0;
  form=await new Request(request.url,{method:"POST",headers:{"content-type":request.headers.get("content-type")||""},body:bytes}).formData();
 }catch{return json({message:"Chưa tiếp nhận được yêu cầu. Vui lòng thử lại hoặc liên hệ Zalo."},503)}
 let raw:unknown;try{raw=JSON.parse(String(form.get("payload")||""))}catch{return json({message:"Dữ liệu phiếu không đúng định dạng."},400)}
 const parsed=leadSchema.safeParse(raw);if(!parsed.success)return json({message:parsed.error.issues[0]?.message||"Vui lòng kiểm tra phiếu."},400);
 const data=parsed.data;const uploads=form.getAll("files").filter((v):v is File=>typeof v!=="string");
 if(uploads.length!==data.attachments.length||uploads.length>MAX_FILES)return json({message:"Danh sách ảnh và tài liệu không khớp."},400);
 const validated:{file:File;mime:string;role:string;name:string}[]=[];
 for(let i=0;i<uploads.length;i++){
  const file=uploads[i],meta=data.attachments[i];if(file.size!==meta.size)return json({message:"Dung lượng tài liệu không khớp."},400);
  const mime=detectFileType(new Uint8Array(await file.slice(0,32).arrayBuffer()));
  const ext=file.name.split('.').pop()?.toLowerCase();const allowedExt:Record<string,string[]>={"image/jpeg":["jpg","jpeg"],"image/png":["png"],"image/webp":["webp"],"application/pdf":["pdf"]};
  if(!mime||!ext||!allowedExt[mime].includes(ext)||file.type!==mime)return json({message:"File không đúng định dạng JPG, PNG, WebP hoặc PDF."},400);
  if(meta.role==="nameplate"&&!mime.startsWith("image/"))return json({message:"Tem hộp số cần là ảnh JPG, PNG hoặc WebP."},400);
  validated.push({file,mime,role:meta.role,name:file.name.replace(/[\x00-\x1f\x7f/\\]/g,"_").slice(0,180)});
 }
 const {db,bucket}=getStorage();
 const existing=await db.prepare("SELECT reference FROM leads WHERE idempotency_key = ?").bind(data.idempotencyKey).first<{reference:string}>();
 if(existing)return json({reference:existing.reference});
 const id=crypto.randomUUID(),reference="TB-"+id.replace(/-/g,"").slice(0,12).toUpperCase(),now=new Date().toISOString();
 const stored:{id:string;key:string;name:string;mime:string;role:string;size:number}[]=[];
 try{
  for(const v of validated){const attachmentId=crypto.randomUUID(),key=`leads/${id}/${attachmentId}`;await bucket.put(key,v.file.stream(),{httpMetadata:{contentType:v.mime,contentDisposition:"attachment"}});stored.push({id:attachmentId,key,name:v.name,mime:v.mime,role:v.role,size:v.file.size})}
  const statements=[db.prepare("INSERT INTO leads (id,reference,idempotency_key,brand,name,phone,application,status,payload,created_at,updated_at) VALUES (?,?,?,?,?,?,?,'NEW',?,?,?)").bind(id,reference,data.idempotencyKey,data.brand,data.name,data.phone,data.application,JSON.stringify({...data,idempotencyKey:undefined,website:undefined,consentAt:now}),now,now),...stored.map(f=>db.prepare("INSERT INTO attachments (id,lead_id,object_key,name,mime,role,size) VALUES (?,?,?,?,?,?,?)").bind(f.id,id,f.key,f.name,f.mime,f.role,f.size))];
  await db.batch(statements);
  return json({reference},201);
 }catch{
  await Promise.allSettled(stored.map(f=>bucket.delete(f.key)));
  const raced=await db.prepare("SELECT reference FROM leads WHERE idempotency_key = ?").bind(data.idempotencyKey).first<{reference:string}>();if(raced)return json({reference:raced.reference});
  console.error("pto_lead_save_failed",{reference});return json({message:"Chưa lưu được yêu cầu. Thông tin vẫn được giữ trên trang, vui lòng thử lại."},503);
 }
}
