import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminSecretLetters } from "@/lib/admin-data";
import { deleteSecretLetterAction, moderateSecretLetterAction } from "../actions";

export default async function AdminSecretLettersPage() {
  const letters = await getAdminSecretLetters();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Secret letters"
        title="Moderation hộp thư bí mật"
        description="Thư bí mật mới luôn vào `pending`. Chỉ thư có `approved` và `is_public = true` mới được hiển thị public."
      />

      <AdminSectionCard title="Danh sách thư">
        {letters.length > 0 ? (
          <div className="space-y-4">
            {letters.map((letter) => (
              <article key={letter.id} className="rounded-[1.6rem] border border-line bg-white/80 p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {letter.isAnonymous ? "Ẩn danh" : letter.senderName || "Không rõ người gửi"}
                    </p>
                    <p className="text-sm text-muted">
                      {letter.targetMemberName ? `Gửi tới: ${letter.targetMemberName}` : "Gửi tới: Cả lớp"} • {letter.status}
                    </p>
                  </div>
                  <p className="text-sm leading-7 text-foreground">{letter.message}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    {new Date(letter.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>

                <form action={moderateSecretLetterAction} className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                  <input type="hidden" name="id" value={letter.id} />
                  <select name="status" defaultValue={letter.status} className="rounded-[1.1rem] border border-line bg-white px-4 py-3">
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input name="is_public" type="checkbox" defaultChecked={letter.isPublic} />
                    Hiển thị public
                  </label>
                  <SubmitButton>Lưu moderation</SubmitButton>
                </form>

                <form action={deleteSecretLetterAction} className="mt-3">
                  <input type="hidden" name="id" value={letter.id} />
                  <ConfirmSubmitButton confirmMessage="Xóa thư bí mật này khỏi database?">
                    Xóa thư
                  </ConfirmSubmitButton>
                </form>
              </article>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="Chưa có thư bí mật nào"
            description="Khi public gửi thư mới, chúng sẽ xuất hiện ở đây để admin duyệt."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
