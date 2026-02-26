"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createResult, updateResult } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputField from "../InputField";

const ResultForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    { success: false, error: false }
  );

  // Track whether result is for exam or assignment
  const [assessmentType, setAssessmentType] = useState<"exam" | "assignment">(
    data?.examId ? "exam" : "assignment"
  );

  const router = useRouter();

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Result ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  const {
    exams = [],
    assignments = [],
    students = [],
  } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Result" : "Update Result"}
      </h1>

      {/* Score */}
      <InputField
        label="Score"
        name="score"
        type="number"
        register={register}
        error={errors.score}
        defaultValue={data?.score}
      />

      {/* Student */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Student</label>
        <select
          {...register("studentId")}
          defaultValue={data?.studentId ?? ""}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
        >
          <option value="">Select Student</option>
          {students.map((student: { id: string; name: string; surname: string }) => (
            <option key={student.id} value={student.id}>
              {student.name + " " + student.surname}
            </option>
          ))}
        </select>
        {errors.studentId && (
          <p className="text-xs text-red-400">{errors.studentId.message}</p>
        )}
      </div>

      {/* Assessment Type Toggle */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Assessment Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              value="exam"
              checked={assessmentType === "exam"}
              onChange={() => setAssessmentType("exam")}
              className="accent-blue-400"
            />
            Exam
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              value="assignment"
              checked={assessmentType === "assignment"}
              onChange={() => setAssessmentType("assignment")}
              className="accent-blue-400"
            />
            Assignment
          </label>
        </div>
      </div>

      {/* Exam (shown when assessmentType is exam) */}
      {assessmentType === "exam" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Exam</label>
          <select
            {...register("examId")}
            defaultValue={data?.examId ?? ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          >
            <option value="">Select Exam</option>
            {exams.map((exam: { id: number; title: string }) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
          {errors.examId && (
            <p className="text-xs text-red-400">{errors.examId.message}</p>
          )}
        </div>
      )}

      {/* Assignment (shown when assessmentType is assignment) */}
      {assessmentType === "assignment" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Assignment</label>
          <select
            {...register("assignmentId")}
            defaultValue={data?.assignmentId ?? ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          >
            <option value="">Select Assignment</option>
            {assignments.map((assignment: { id: number; title: string }) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
          {errors.assignmentId && (
            <p className="text-xs text-red-400">{errors.assignmentId.message}</p>
          )}
        </div>
      )}

      {/* Hidden ID for update */}
      {data && (
        <input type="hidden" {...register("id")} value={data.id} />
      )}

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;