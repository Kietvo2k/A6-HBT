import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminQuizQuestions } from "@/lib/admin-data";
import { deleteQuizAction, setQuizActiveAction, upsertQuizAction } from "../actions";

export default async function AdminQuizPage() {
  const quizzes = await getAdminQuizQuestions();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Quiz"
        title="Quản lý quiz mở khóa"
        description="Bạn có thể giữ nhiều quiz trong database, nhưng public side chỉ dùng quiz có `is_active = true`. Nếu chưa có quiz active, hệ thống sẽ fallback về `quizConfig` local."
      />

      <AdminSectionCard title="Tạo quiz mới">
        <form action={upsertQuizAction} className="grid gap-4 md:grid-cols-2">
          <input
            name="question"
            required
            placeholder="Câu hỏi mở khóa"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2"
          />
          <input name="option_a" required placeholder="Đáp án A" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="option_b" required placeholder="Đáp án B" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="option_c" placeholder="Đáp án C" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="option_d" placeholder="Đáp án D" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <select name="correct_option_id" defaultValue="A" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3">
            {["A", "B", "C", "D"].map((id) => (
              <option key={id} value={id}>
                Đáp án đúng: {id}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 text-sm">
            <input name="is_active" type="checkbox" defaultChecked />
            Đặt làm quiz active
          </label>
          <textarea name="success_message" rows={3} placeholder="Success message" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2" />
          <textarea name="fail_message" rows={3} placeholder="Fail message" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2" />
          <div className="md:col-span-2">
            <SubmitButton>Lưu quiz</SubmitButton>
          </div>
        </form>
      </AdminSectionCard>

      <AdminSectionCard title="Danh sách quiz">
        {quizzes.length > 0 ? (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <details key={quiz.id} className="rounded-[1.6rem] border border-line bg-white/80 p-4">
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{quiz.question}</p>
                    <p className="text-sm text-muted">
                      {quiz.isActive ? "active" : "inactive"} • cập nhật {new Date(quiz.updatedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6d5b90]">
                    Chỉnh sửa
                  </span>
                </summary>

                <form action={upsertQuizAction} className="mt-4 grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={quiz.id} />
                  <input name="question" required defaultValue={quiz.question} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <input name="option_a" defaultValue={quiz.options[0]?.text || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="option_b" defaultValue={quiz.options[1]?.text || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="option_c" defaultValue={quiz.options[2]?.text || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="option_d" defaultValue={quiz.options[3]?.text || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <select name="correct_option_id" defaultValue={quiz.correctOptionId} className="rounded-[1.1rem] border border-line bg-white px-4 py-3">
                    {["A", "B", "C", "D"].map((id) => (
                      <option key={id} value={id}>
                        Đáp án đúng: {id}
                      </option>
                    ))}
                  </select>
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input name="is_active" type="checkbox" defaultChecked={quiz.isActive} />
                    Đặt làm quiz active
                  </label>
                  <textarea name="success_message" rows={3} defaultValue={quiz.successMessage} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <textarea name="fail_message" rows={3} defaultValue={quiz.failMessage} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <SubmitButton>Lưu thay đổi</SubmitButton>
                  </div>
                </form>

                <div className="mt-3 flex flex-wrap gap-3">
                  {!quiz.isActive ? (
                    <form action={setQuizActiveAction}>
                      <input type="hidden" name="id" value={quiz.id} />
                      <SubmitButton variant="secondary">Đặt làm active</SubmitButton>
                    </form>
                  ) : null}
                  <form action={deleteQuizAction}>
                    <input type="hidden" name="id" value={quiz.id} />
                    <ConfirmSubmitButton confirmMessage="Xóa quiz này khỏi database?">
                      Xóa quiz
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="Chưa có quiz nào"
            description="Tạo quiz active đầu tiên để thay thế fallback local trên màn hình unlock."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
