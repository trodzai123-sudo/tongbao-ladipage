import {z} from "zod";
export const MAX_FILE_BYTES=10*1024*1024;
export const MAX_TOTAL_BYTES=24*1024*1024;
export const MAX_FILES=6;
export const fileRoles=["nameplate","installation","datasheet"] as const;
export const numericSpecs=["engineRpm","outputRpm","powerKw","torqueNm","flowLpm","pressureBar","centerDistanceMm","vehicleWeightKg","rearAxleRatio","minSpeedKmh","maxSpeedKmh","gradePercent","tireRadiusMm"] as const;
export function normalizePhone(value:string){const s=value.replace(/[\s().-]/g,"");if(/^\+84[35789]\d{8}$/.test(s))return "0"+s.slice(3);if(/^84[35789]\d{8}$/.test(s))return "0"+s.slice(2);return s;}
const text=(max:number)=>z.string().trim().max(max);
const optionalNumber=z.string().trim().max(32).refine(v=>v===""||(/^\d+(?:[.,]\d+)?$/.test(v)&&Number(v.replace(",","."))>0),"Thông số phải là số dương hoặc để trống nếu chưa rõ.");
export const specSchema=z.object({
 engineRpm:optionalNumber,outputRpm:optionalNumber,powerKw:optionalNumber,torqueNm:optionalNumber,flowLpm:optionalNumber,pressureBar:optionalNumber,centerDistanceMm:optionalNumber,vehicleWeightKg:optionalNumber,rearAxleRatio:optionalNumber,minSpeedKmh:optionalNumber,maxSpeedKmh:optionalNumber,gradePercent:optionalNumber,tireRadiusMm:optionalNumber,
 housing:text(100),dimensions:text(1500),ratio:text(100),outputType:text(100),rotation:z.enum(["unknown","CW","CCW"]),shiftType:text(100),pumpModel:text(120)
});
export const leadSchema=z.object({
 brand:z.enum(["POSSTRANS","HWP"]),application:z.enum(["fire","sanitation","crane","municipal","construction","other"]),
 name:text(100).min(2,"Vui lòng nhập họ tên người liên hệ."),phone:z.string().transform(normalizePhone).refine(v=>/^0[35789]\d{8}$/.test(v),"Vui lòng nhập số di động Việt Nam hợp lệ."),
 company:text(150),province:text(100),email:text(180).refine(v=>!v||z.string().email().safeParse(v).success,"Email chưa đúng định dạng."),
 vehicleMake:text(100).min(1,"Vui lòng nhập hãng xe hoặc ghi chưa rõ."),vehicleModel:text(100),transmissionMake:text(100),transmissionModel:text(100),unknownTransmission:z.boolean(),
 equipment:z.enum(["hydraulic","water","vacuum","mechanical","other","unknown"]),operation:z.enum(["stationary","mobile","continuous","intermittent","unknown"]),family:z.enum(["transfer","flywheel","slowwalking","unknown"]),
 quantity:z.number().int().min(1).max(100000),neededBy:text(100),notes:text(2000),specs:specSchema,
 consent:z.literal(true),website:z.string().max(0),idempotencyKey:z.string().uuid(),
 utm:z.object({utm_source:text(150),utm_medium:text(150),utm_campaign:text(150),utm_content:text(150),utm_term:text(150)}),
 attachments:z.array(z.object({name:text(180).min(1),size:z.number().int().positive().max(MAX_FILE_BYTES),role:z.enum(fileRoles)})).max(MAX_FILES)
}).superRefine((d,ctx)=>{
 const hasNameplate=d.attachments.some(f=>f.role==="nameplate");
 if((d.brand==="HWP"||d.unknownTransmission||!d.transmissionMake||!d.transmissionModel)&&!hasNameplate)ctx.addIssue({code:z.ZodIssueCode.custom,path:["attachments"],message:"Vui lòng tải ảnh tem hộp số để kỹ thuật đối chiếu."});
 const total=d.attachments.reduce((n,f)=>n+f.size,0);if(total>MAX_TOTAL_BYTES)ctx.addIssue({code:z.ZodIssueCode.custom,path:["attachments"],message:"Tổng dung lượng ảnh và tài liệu không vượt quá 24 MB."});
 const min=Number(d.specs.minSpeedKmh.replace(",",".")),max=Number(d.specs.maxSpeedKmh.replace(",","."));
 if(d.family==="slowwalking"&&min&&max&&min>max)ctx.addIssue({code:z.ZodIssueCode.custom,path:["specs","maxSpeedKmh"],message:"Tốc độ tối đa cần lớn hơn hoặc bằng tốc độ tối thiểu."});
});
export type LeadInput=z.infer<typeof leadSchema>;
export type TechnicalSpecs=z.infer<typeof specSchema>;
export const emptySpecs:TechnicalSpecs={engineRpm:"",outputRpm:"",powerKw:"",torqueNm:"",flowLpm:"",pressureBar:"",centerDistanceMm:"",vehicleWeightKg:"",rearAxleRatio:"",minSpeedKmh:"",maxSpeedKmh:"",gradePercent:"",tireRadiusMm:"",housing:"",dimensions:"",ratio:"",outputType:"",rotation:"unknown",shiftType:"",pumpModel:""};
export function detectFileType(b:Uint8Array):"image/jpeg"|"image/png"|"image/webp"|"application/pdf"|null{
 if(b.length<12)return null;
 if(b[0]===255&&b[1]===216&&b[2]===255)return "image/jpeg";
 if([137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v))return "image/png";
 const s=new TextDecoder().decode(b.slice(0,12));if(s.startsWith("RIFF")&&s.slice(8,12)==="WEBP")return "image/webp";
 if(s.startsWith("%PDF-"))return "application/pdf";return null;
}
export const statuses=["NEW","REVIEWING","NEED_MORE_INFO","QUOTED","CLOSED"] as const;
export const statusLabels:Record<typeof statuses[number],string>={NEW:"Mới tiếp nhận",REVIEWING:"Đang kiểm tra",NEED_MORE_INFO:"Cần bổ sung",QUOTED:"Đã báo giá",CLOSED:"Đã đóng"};
