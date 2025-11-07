import {
  ArrowRight,
  Users,
  DollarSign,
  BookOpen,
  Download,
  Mail,
  Send,
  MessageSquare,
  Play,
  Search,
  FileText,
  Zap,
} from "lucide-react";

export function getButtonIcon(text: string): React.ComponentType<{ className?: string }> | null {
  const lowerText = text.toLowerCase();

  // Contact/Support related
  if (lowerText.includes("talk to") || lowerText.includes("contact")) {
    return Users;
  }
  if (lowerText.includes("support") || lowerText.includes("help")) {
    return MessageSquare;
  }
  if (lowerText.includes("send") || lowerText.includes("submit")) {
    return Send;
  }

  // Pricing/Payment related
  if (lowerText.includes("pricing") || lowerText.includes("view pricing")) {
    return DollarSign;
  }

  // Content/Learning related
  if (lowerText.includes("explore") || lowerText.includes("browse")) {
    return Search;
  }
  if (lowerText.includes("download")) {
    return Download;
  }
  if (lowerText.includes("read") || lowerText.includes("article")) {
    return BookOpen;
  }
  if (lowerText.includes("guide") || lowerText.includes("tutorial")) {
    return FileText;
  }

  // Actions
  if (lowerText.includes("subscribe")) {
    return Mail;
  }
  if (lowerText.includes("start") || lowerText.includes("get started")) {
    return Play;
  }
  if (lowerText.includes("try") || lowerText.includes("demo")) {
    return Zap;
  }

  // Default fallback
  return ArrowRight;
}
