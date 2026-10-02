"use client";
// Agriplan icon set — Phosphor icons exposed under the lucide-style names the
// app already uses. Default weight is "fill", matching CropManager's Font Awesome solid set;
// small UI glyphs (chevrons, ×, +, spinners) render "bold".
import type { CSSProperties } from "react";
import {
  TrendUp, TrendDown, Minus as PhMinus, Bell as PhBell, Coins as PhCoins, FileText as PhFileText, X as PhX,
  ClipboardText, SquaresFour, UsersThree, PlusCircle as PhPlusCircle, List, ChartBar, CaretLeft, CaretRight,
  CaretDown, CaretUp, UserCircle as PhUserCircle, SignOut, Moon as PhMoon, Sun as PhSun, ShieldCheck, House,
  Stack, CheckCircle as PhCheckCircle, Warning, Tray, Package as PhPackage, Briefcase as PhBriefcase,
  Plus as PhPlus, CircleNotch, UploadSimple, MagnifyingGlass, ArrowsClockwise, Pulse, WarningCircle,
  Clock as PhClock, XCircle as PhXCircle, ShieldWarning, Skull as PhSkull, Database as PhDatabase,
  MapPin as PhMapPin, PawPrint as PhPawPrint, GearSix, ListChecks as PhListChecks, Buildings, BookOpenText,
  Factory as PhFactory, CurrencyDollar, ChartLineUp, SealCheck, PaperPlaneTilt, Check as PhCheck,
  User as PhUser, Percent as PhPercent, FloppyDisk, GlobeHemisphereWest, Copy as PhCopy, EnvelopeSimple,
  DownloadSimple, PencilSimple, Trash, CalendarBlank, Lightning, ArrowLeft as PhArrowLeft, Sparkle,
} from "@phosphor-icons/react";
import type { Icon as PhIcon } from "@phosphor-icons/react";

export interface IconProps {
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  /** accepted for lucide compatibility; Phosphor weights replace stroke width */
  strokeWidth?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}

function make(Ph: PhIcon, defaultWeight: IconProps["weight"] = "fill") {
  function Icon({ size = 18, className, style, weight }: IconProps) {
    return <Ph size={size} weight={weight ?? defaultWeight} className={className} style={style} aria-hidden="true" />;
  }
  return Icon;
}

// navigation / structure
export const LayoutDashboard = make(SquaresFour);
export const Users = make(UsersThree);
export const User = make(PhUser);
export const UserCircle = make(PhUserCircle);
export const PlusCircle = make(PhPlusCircle);
export const Menu = make(List, "bold");
export const Home = make(House);
export const LogOut = make(SignOut);
export const Layers = make(Stack);
export const Settings = make(GearSix);
export const Moon = make(PhMoon);
export const Sun = make(PhSun);
export const Bell = make(PhBell);
export const Search = make(MagnifyingGlass, "bold");

// small glyphs (bold reads better than fill at 12-16px)
export const ChevronLeft = make(CaretLeft, "bold");
export const ChevronRight = make(CaretRight, "bold");
export const ChevronDown = make(CaretDown, "bold");
export const ChevronUp = make(CaretUp, "bold");
export const X = make(PhX, "bold");
export const Plus = make(PhPlus, "bold");
export const Minus = make(PhMinus, "bold");
export const Check = make(PhCheck, "bold");
export const Loader2 = make(CircleNotch, "bold");
export const ArrowLeft = make(PhArrowLeft, "bold");
export const RefreshCw = make(ArrowsClockwise, "bold");

// documents & data
export const FileText = make(PhFileText);
export const BarChart2 = make(ChartBar);
export const LineChart = make(ChartLineUp);
export const TrendingUp = make(TrendUp, "bold");
export const TrendingDown = make(TrendDown, "bold");
export const Download = make(DownloadSimple);
export const Upload = make(UploadSimple);
export const Edit2 = make(PencilSimple);
export const Trash2 = make(Trash);
export const Copy = make(PhCopy);
export const Save = make(FloppyDisk);
export const Send = make(PaperPlaneTilt);
export const Calendar = make(CalendarBlank);
export const Clock = make(PhClock);
export const Database = make(PhDatabase);
export const ClipboardList = make(ClipboardText);
export const ClipboardCheck = make(SealCheck);
export const ListChecks = make(PhListChecks);
export const Inbox = make(Tray);
export const Activity = make(Pulse);
export const Zap = make(Lightning);
export const Sparkles = make(Sparkle);

// business
export const Coins = make(PhCoins);
export const DollarSign = make(CurrencyDollar);
export const Percent = make(PhPercent, "bold");
export const Building2 = make(Buildings);
export const BookOpen = make(BookOpenText);
export const Factory = make(PhFactory);
export const Package = make(PhPackage);
export const Briefcase = make(PhBriefcase);
export const Globe = make(GlobeHemisphereWest);
export const Mail = make(EnvelopeSimple);
export const MapPin = make(PhMapPin);
export const PawPrint = make(PhPawPrint);

// status
export const CheckCircle = make(PhCheckCircle);
export const CheckCircle2 = make(PhCheckCircle);
export const XCircle = make(PhXCircle);
export const AlertCircle = make(WarningCircle);
export const AlertTriangle = make(Warning);
export const Shield = make(ShieldCheck);
export const ShieldAlert = make(ShieldWarning);
export const Skull = make(PhSkull);
