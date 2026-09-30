import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title: "TONGBAO PTO | Chọn đúng bộ trích công suất cho xe chuyên dụng",
 description: "Tư vấn PTO POSSTRANS và HWP theo hộp số, thiết bị công tác và ứng dụng. Gửi thông số hoặc ảnh tem hộp số cho TONGBAO Việt Nam. Hotline 0981 763 332.",
 metadataBase: new URL("https://tongbao-pto.qtd261.chatgpt.site"),
 alternates: {canonical: "/"}, robots: {index: false,follow:false},
 openGraph:{title:"TONGBAO PTO — Giải pháp truyền động xe chuyên dụng",description:"Gửi thông tin xe hoặc ảnh tem hộp số. TONGBAO hỗ trợ đối chiếu cấu hình PTO.",locale:"vi_VN",type:"website"},
 icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="vi"><body>{children}</body></html>}
