import { DatabaseZap, TriangleAlert } from "lucide-react";

type DataStateNoticeProps = {
  message?: string;
};

export default function DataStateNotice({
  message,
}: DataStateNoticeProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-[1.5rem] border border-[#f0ddbc] bg-[#fff8ea] px-4 py-4 text-sm leading-7 text-[#86653a]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-full bg-[#fff1ca] p-2 text-[#d19949]">
          {message.includes("Không thể") ? (
            <TriangleAlert className="h-4 w-4" />
          ) : (
            <DatabaseZap className="h-4 w-4" />
          )}
        </span>
        <p>{message}</p>
      </div>
    </div>
  );
}
