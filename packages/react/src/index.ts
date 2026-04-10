// ── Atoms ──────────────────────────────────────
export { Alert, AlertTitle, AlertDescription } from './components/atoms/Alert';
export { AspectRatio } from './components/atoms/AspectRatio';
export { Avatar, AvatarImage, AvatarFallback } from './components/atoms/Avatar';
export { Badge, type BadgeProps } from './components/atoms/Badge';
export { Button, type ButtonProps } from './components/atoms/Button';
// (buttonVariants is an internal CVA helper — not exported)
export { Checkbox } from './components/atoms/Checkbox';
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/atoms/Collapsible';
export { IconButton, type IconButtonProps } from './components/atoms/IconButton';
export { Input, type InputProps } from './components/atoms/Input';
export { Label } from './components/atoms/Label';
export { Progress } from './components/atoms/Progress';
export { RadioGroup, RadioGroupItem } from './components/atoms/RadioGroup';
export { Separator } from './components/atoms/Separator';
export { Kbd } from './components/atoms/Kbd';
export { Skeleton } from './components/atoms/Skeleton';
export { Slider } from './components/atoms/Slider';
export { Spinner } from './components/atoms/Spinner';
export { Switch } from './components/atoms/Switch';
export { Textarea } from './components/atoms/Textarea';
export { Toggle } from './components/atoms/Toggle';
// (toggleVariants is an internal CVA helper — not exported)
export { Display, H1, H2, H3, H4, H5, BodyLarge, Body, BodySmall, Caption } from './components/atoms/Typography';
export { DesignSystemProvider, useTheme } from './components/atoms/DesignSystemProvider';
export type { Theme, DesignSystemProviderProps } from './components/atoms/DesignSystemProvider';
export { ThemeToggle } from './components/atoms/ThemeToggle';
export { CurrencyBadge, type CurrencyBadgeProps } from './components/atoms/CurrencyBadge';
export { Tag, type TagProps } from './components/atoms/Tag';
export { StatusPill, type StatusPillProps, type InstructionStatus } from './components/atoms/StatusPill';
export { StatusRing, type StatusRingProps, type Urgency } from './components/atoms/StatusRing';
export { StateBadge, type StateBadgeProps, type StateBadgeIntent } from './components/atoms/StateBadge';
export { UrgencyBadge, type UrgencyBadgeProps, type UrgencyLevel } from './components/atoms/UrgencyBadge';
export { BankingWindowDot, type BankingWindowDotProps, type WindowStatus } from './components/atoms/BankingWindowDot';
export { MonoAmount, deriveFreshnessState, type MonoAmountProps, type AmountColor, type AmountCurrency, type FreshnessState } from './components/atoms/MonoAmount';
export { FreshnessChip, type FreshnessChipProps } from './components/atoms/FreshnessChip';

// ── Molecules ──────────────────────────────────
export {
  Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from './components/molecules/Breadcrumb';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardDivider } from './components/molecules/Card';
export type { CardProps, CardHeaderProps, CardFooterProps, CardDividerProps } from './components/molecules/Card';
export { DatePicker, type DatePickerProps } from './components/molecules/DatePicker';
export {
  Form, FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage, useFormField,
} from './components/molecules/Form';
export { HoverCard, HoverCardContent, HoverCardTrigger } from './components/molecules/HoverCard';
export { InputNumber } from './components/molecules/InputNumber';
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './components/molecules/InputOTP';
export {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from './components/molecules/Pagination';
export { Popover, PopoverContent, PopoverTrigger } from './components/molecules/Popover';
export { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/molecules/Resizable';
export { ScrollArea, ScrollBar } from './components/molecules/ScrollArea';
export { Segmented, type SegmentedProps } from './components/molecules/Segmented';
export {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel,
  SelectSeparator, SelectScrollUpButton, SelectScrollDownButton,
  SelectTrigger, SelectValue,
} from './components/molecules/Select';
export { Stepper, type StepperProps } from './components/molecules/Stepper';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/molecules/Tabs';
export { ToggleGroup, ToggleGroupItem } from './components/molecules/ToggleGroup';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/molecules/Tooltip';
export { DetailCard, type DetailCardProps } from './components/molecules/DetailCard';
export { FormCard, type FormCardProps } from './components/molecules/FormCard';
export { KpiCard, type KpiCardProps } from './components/molecules/KpiCard';

// ── Organisms ──────────────────────────────────
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/organisms/Accordion';
export { Calendar, CalendarDayButton } from './components/organisms/Calendar';
export {
  Carousel, CarouselContent, CarouselItem,
  CarouselNext, CarouselPrevious, type CarouselApi,
} from './components/organisms/Carousel';
export {
  Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from './components/organisms/Command';
export {
  ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup,
  ContextMenuItem, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup,
  ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub,
  ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger,
} from './components/organisms/ContextMenu';
export {
  AlertDialog, AlertDialogTrigger, AlertDialogPortal, AlertDialogOverlay,
  AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from './components/organisms/AlertDialog';
export {
  Menubar, MenubarMenu, MenubarGroup, MenubarPortal, MenubarSub, MenubarRadioGroup,
  MenubarTrigger, MenubarContent, MenubarItem, MenubarCheckboxItem, MenubarRadioItem,
  MenubarLabel, MenubarSeparator, MenubarShortcut, MenubarSubTrigger, MenubarSubContent,
} from './components/organisms/Menubar';
export {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogOverlay, DialogPortal,
  DialogTitle, DialogTrigger,
} from './components/organisms/Dialog';
export {
  Drawer, DrawerClose, DrawerContent, DrawerDescription,
  DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal,
  DrawerTitle, DrawerTrigger,
} from './components/organisms/Drawer';
export {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from './components/organisms/DropdownMenu';
export { EmptyState, type EmptyStateProps } from './components/organisms/EmptyState';
export {
  NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from './components/organisms/NavigationMenu';
export {
  Sheet, SheetClose, SheetContent, SheetDescription,
  SheetFooter, SheetHeader, SheetOverlay, SheetPortal,
  SheetTitle, SheetTrigger,
} from './components/organisms/Sheet';
export { Toaster } from './components/organisms/Sonner';
export {
  Table, TableBody, TableCaption, TableCell,
  TableFooter, TableHead, TableHeader, TableRow,
} from './components/organisms/Table';
export { Timeline, type TimelineItem } from './components/organisms/Timeline';
export {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator,
  type SidebarMenuButtonProps,
} from './components/organisms/Sidebar';
