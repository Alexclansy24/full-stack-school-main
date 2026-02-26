"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { lessonSchema, LessonSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createLesson, updateLesson } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import InputField from "../InputField";

const LessonForm = ({
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
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createLesson : updateLesson,
    { success: false, error: false }
  );

  const router = useRouter();

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Lesson ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  const {
  subjects = [],
  classes = [],
  teachers = [],
} = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Lesson" : "Update Lesson"}
      </h1>

      {/* Lesson Name */}
      <InputField
        label="Lesson Name"
        name="name"
        register={register}
        error={errors.name}
        defaultValue={data?.name}
      />

      {/* Day */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Day</label>
        <select
          {...register("day")}
          defaultValue={data?.day}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
        >
          <option value="MONDAY">Monday</option>
          <option value="TUESDAY">Tuesday</option>
          <option value="WEDNESDAY">Wednesday</option>
          <option value="THURSDAY">Thursday</option>
          <option value="FRIDAY">Friday</option>       
        </select>
        {errors.day && (
          <p className="text-xs text-red-400">{errors.day.message}</p>
        )}
      </div>

      {/* Start Time */}
      <InputField
        label="Start Time"
        name="startTime"
        type="datetime-local"
        register={register}
        error={errors.startTime}
        defaultValue={
          data?.startTime
            ? new Date(data.startTime).toISOString().slice(0, 16)
            : ""
        }
      />

      {/* End Time */}
      <InputField
        label="End Time"
        name="endTime"
        type="datetime-local"
        register={register}
        error={errors.endTime}
        defaultValue={
          data?.endTime
            ? new Date(data.endTime).toISOString().slice(0, 16)
            : ""
        }
      />

      {/* Subject */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Subject</label>
        <select
          {...register("subjectId")}
          defaultValue={data?.subjectId}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
        >
          <option value="">Select Subject</option>
          {subjects.map((subject: any) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        {errors.subjectId && (
          <p className="text-xs text-red-400">
            {errors.subjectId.message}
          </p>
        )}
      </div>

      {/* Class */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Class</label>
        <select
          {...register("classId")}
          defaultValue={data?.classId}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
        >
          <option value="">Select Class</option>
          {classes.map((cls: any) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        {errors.classId && (
          <p className="text-xs text-red-400">
            {errors.classId.message}
          </p>
        )}
      </div>

      {/* Teacher */}
      <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
            defaultValue={data?.teacherId}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name + " " + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherId.message.toString()}
            </p>
          )}
        </div>

      {/* Hidden ID (for update) */}
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

export default LessonForm;