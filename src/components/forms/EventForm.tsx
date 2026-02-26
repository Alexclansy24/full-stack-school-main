"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { eventSchema, EventSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createEvent, updateEvent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import InputField from "../InputField";

const EventForm = ({
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
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createEvent : updateEvent,
    { success: false, error: false }
  );

  const router = useRouter();

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Event ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  const { classes = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Event" : "Update Event"}
      </h1>

      {/* Title */}
      <InputField
        label="Event Title"
        name="title"
        register={register}
        error={errors.title}
        defaultValue={data?.title}
      />

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Description</label>
        <textarea
          {...register("description")}
          defaultValue={data?.description}
          rows={3}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm resize-none"
          placeholder="Enter event description..."
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description.message}</p>
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

      {/* Class (optional) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">
          Class <span className="text-gray-400">(optional — leave blank for school-wide event)</span>
        </label>
        <select
          {...register("classId")}
          defaultValue={data?.classId ?? ""}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
        >
          <option value="">All Classes (School-wide)</option>
          {classes.map((cls: { id: number; name: string }) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        {errors.classId && (
          <p className="text-xs text-red-400">{errors.classId.message}</p>
        )}
      </div>

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

export default EventForm;