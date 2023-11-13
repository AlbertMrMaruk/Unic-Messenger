export const formatDate = (date) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const messageDate = new Date(date);

  if (isSameDay(now, messageDate)) {
    return "Сегодня";
  } else if (isSameDay(yesterday, messageDate)) {
    return "Вчера";
  } else {
    return formatFullDate(messageDate);
  }
};

const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const formatFullDate = (date) => {
  const options = { month: "short", day: "numeric" };
  return date.toLocaleDateString("ru-RU", options);
};
