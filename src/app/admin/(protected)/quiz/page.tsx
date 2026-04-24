import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminQuizQuestions } from "@/lib/admin-data";
import { deleteQuizAction, setQuizActiveAction, upsertQuizAction } from "../actions";

export default async function AdminQuizPage() {
  const quizzes = await getAdminQuizQuestions();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Quiz"
        title="Manage unlock quiz"
        description="You can keep multiple quiz entries in the database, but the public website only uses the quiz with is_active = true. If there is no active database quiz, the app falls back to local quizConfig."
      />

      <AdminSectionCard title="Create a new quiz">
        <form action={upsertQuizAction} className="grid gap-4 md:grid-cols-2">
          <input
            name="question"
            required
            placeholder="Unlock question"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2"
          />
          <input
            name="option_a"
            required
            placeholder="Option A"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <input
            name="option_b"
            required
            placeholder="Option B"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <input
            name="option_c"
            placeholder="Option C"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <input
            name="option_d"
            placeholder="Option D"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <select
            name="correct_option_id"
            defaultValue="A"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          >
            {["A", "B", "C", "D"].map((id) => (
              <option key={id} value={id}>
                Correct option: {id}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 text-sm">
            <input name="is_active" type="checkbox" defaultChecked />
            Set as active quiz
          </label>
          <textarea
            name="success_message"
            rows={3}
            placeholder="Success message"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2"
          />
          <textarea
            name="fail_message"
            rows={3}
            placeholder="Fail message"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2"
          />
          <div className="md:col-span-2">
            <SubmitButton>Save quiz</SubmitButton>
          </div>
        </form>
      </AdminSectionCard>

      <AdminSectionCard title="Quiz list">
        {quizzes.length > 0 ? (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <details
                key={quiz.id}
                className="rounded-[1.6rem] border border-line bg-white/80 p-4"
              >
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {quiz.question}
                    </p>
                    <p className="text-sm text-muted">
                      {quiz.isActive ? "active" : "inactive"} • updated{" "}
                      {new Date(quiz.updatedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6d5b90]">
                    Edit
                  </span>
                </summary>

                <form
                  action={upsertQuizAction}
                  className="mt-4 grid gap-4 md:grid-cols-2"
                >
                  <input type="hidden" name="id" value={quiz.id} />
                  <input
                    name="question"
                    required
                    defaultValue={quiz.question}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2"
                  />
                  <input
                    name="option_a"
                    defaultValue={quiz.options[0]?.text || ""}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <input
                    name="option_b"
                    defaultValue={quiz.options[1]?.text || ""}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <input
                    name="option_c"
                    defaultValue={quiz.options[2]?.text || ""}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <input
                    name="option_d"
                    defaultValue={quiz.options[3]?.text || ""}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <select
                    name="correct_option_id"
                    defaultValue={quiz.correctOptionId}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  >
                    {["A", "B", "C", "D"].map((id) => (
                      <option key={id} value={id}>
                        Correct option: {id}
                      </option>
                    ))}
                  </select>
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input
                      name="is_active"
                      type="checkbox"
                      defaultChecked={quiz.isActive}
                    />
                    Set as active quiz
                  </label>
                  <textarea
                    name="success_message"
                    rows={3}
                    defaultValue={quiz.successMessage}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2"
                  />
                  <textarea
                    name="fail_message"
                    rows={3}
                    defaultValue={quiz.failMessage}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2"
                  />
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <SubmitButton>Save changes</SubmitButton>
                  </div>
                </form>

                <div className="mt-3 flex flex-wrap gap-3">
                  {!quiz.isActive ? (
                    <form action={setQuizActiveAction}>
                      <input type="hidden" name="id" value={quiz.id} />
                      <SubmitButton variant="secondary">
                        Set as active
                      </SubmitButton>
                    </form>
                  ) : null}
                  <form action={deleteQuizAction}>
                    <input type="hidden" name="id" value={quiz.id} />
                    <SubmitButton
                      variant="danger"
                      confirmMessage="Delete this quiz from the database?"
                    >
                      Delete quiz
                    </SubmitButton>
                  </form>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="No quizzes yet"
            description="Create the first active quiz to replace the local unlock fallback."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
