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
  Shield,
  Sparkles,
  Globe2,
  CreditCard,
  CheckCircle2,
  Star,
  Building2,
} from "lucide-react";

export function getButtonIcon(text: string): React.ComponentType<{ className?: string }> | null {
  const lower = (text || "").toLowerCase().trim();
  if (!lower) return null;

  // Primary narrative concepts
  if (lower.includes("official") || lower.includes("structure")) return Shield;
  if (lower.includes("money + meaning") || lower.includes("meaning")) return Sparkles;
  if (lower.includes("global") || lower.includes("device") || lower.includes("workspace")) return Globe2;

  // Financial actions
  if (lower.includes("pay") || lower.includes("payment") || lower.includes("payments")) return CreditCard;
  if (lower.includes("invoice") || lower.includes("send invoice")) return CheckCircle2;

  // Pricing and waitlist
  if (lower.includes("pricing") || lower.includes("view pricing")) return DollarSign;
  if (lower.includes("waitlist") || lower.includes("join")) return Play;

  // Contact/Support related
  if (lower.includes("talk to") || lower.includes("talk with") || lower.includes("contact")) return Users;
  if (lower.includes("support") || lower.includes("help")) return MessageSquare;
  if (lower.includes("send") || lower.includes("submit") || lower.includes("start conversation")) return Send;

  // Content/Learning related
  if (lower.includes("explore") || lower.includes("browse") || lower.includes("search")) return Search;
  if (lower.includes("download")) return Download;
  if (lower.includes("read") || lower.includes("article") || lower.includes("blog")) return BookOpen;
  if (lower.includes("guide") || lower.includes("tutorial") || lower.includes("docs")) return FileText;

  // Actions & conversions
  if (lower.includes("subscribe")) return Mail;
  if (lower.includes("get started") || lower.includes("start") || lower.includes("begin")) return Play;
  if (lower.includes("try") || lower.includes("demo")) return Zap;

  // Social proof / testimonials
  if (lower.includes("testimonial") || lower.includes("stories") || lower.includes("reviews")) return Star;

  // Company / business
  if (lower.includes("team") || lower.includes("company") || lower.includes("business")) return Building2;

  // Default fallback
  return ArrowRight;
}
