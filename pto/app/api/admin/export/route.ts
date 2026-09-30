import {isAdmin} from "@/lib/admin-auth";
import {getStorage,json} from "@/lib/storage";
export const dynamic="force-dynamic";
function csv(v:unknown){let s=String(v??"");if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
export async function GET(){if(!await isAdmin())return json({message:"Không có quyền truy cập."},403);const {db}=getStorage();const r=await db.prepare("SELECT reference,created_at,name,phone,brand,application,status,payload FROM leads ORDER BY created_at DESC LIMIT 10000").all<Record<string,unknown>>();const keys=["reference","created_at","name","phone","brand","application","status","payload"];const body="\uFEFF"+[keys.map(csv).join(","),...r.results.map(row=>keys.map(k=>csv(row[k])).join(","))].join("\r\n");return new Response(body,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":"attachment; filename=tongbao-pto-leads.csv","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}})}
