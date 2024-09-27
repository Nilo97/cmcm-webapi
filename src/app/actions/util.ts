import { format } from "date-fns";
import { pt } from "date-fns/locale";

export function limitText(text: any, limit: any) {
  if (!text) {
    return "Por actualizar...";
  }
  if (text?.length <= limit) {
    return text;
  } else {
    return text?.substring(0, limit) + "...";
  }
}

export function formatCurrency(value: any) {
  const formattedValue = value.toLocaleString("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formattedValue.replace("MTn", "MT");
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const readableDate = format(date, "dd/MM/yyyy", { locale: pt });

  return `${readableDate}`;
}

export function formatTime(dateString: string | null | undefined): string {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "-";
  }

  const readableTime = format(date, "HH:mm", { locale: pt });

  return `${readableTime}`;
}

export function translateStatus(status: string): string {
  switch (status) {
    case "OPENED":
      return "Aberto";
    case "CLOSED":
      return "Fechado";
    default:
      return status;
  }
}

export function statusColor(status: string): string {
  return status === "OPENED"
    ? "teal.500"
    : status === "CLOSED"
    ? "red.500"
    : "black";
}

