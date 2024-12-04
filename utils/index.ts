import { format, formatDistanceToNow, isToday } from "date-fns";

export default function getDueDateMessage(dueDate: Date, createdAt: Date) {
  if (dueDate) {
    const dueDateObj = new Date(dueDate);

    if (isToday(dueDateObj)) {
      const relativeTime = formatDistanceToNow(dueDateObj, {
        addSuffix: true,
      });
      return `Due ${relativeTime}`;
    }

    return `Due by ${format(dueDateObj, "do MMM y, h:mm a")}`;
  }

  // Fallback to created_at if due_date_at is null
  return `Created on ${format(new Date(createdAt), "do MMM y, h:mm a")}`;
}
