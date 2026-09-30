import {requireChatGPTUser} from "@/app/chatgpt-auth";
import {isAdmin} from "@/lib/admin-auth";
import AdminPanel from "@/components/admin-panel";
export const dynamic="force-dynamic";
export default async function Admin(){await requireChatGPTUser("/admin");const user=await isAdmin();if(!user)return <main className="policy-page"><a href="/">TONGBAO PTO</a><h1>Khu vực quản trị yêu cầu</h1><p>Tài khoản này chưa được cấp quyền xem dữ liệu khách hàng. Vui lòng sử dụng tài khoản quản trị đã được cấu hình.</p></main>;return <AdminPanel/>}
