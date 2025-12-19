# Plaen Design System

This document outlines the unified component system and design patterns used across the Plaen application.

## Colors

### Brand Colors
- **Primary Green**: `#14462a` - Used for primary actions, active states, brand elements
- **Text Dark**: `#2D2D2D` - Primary text color
- **Text Muted**: `#65676B` - Secondary text
- **Text Light**: `#949494` - Labels, hints
- **Text Placeholder**: `#B0B3B8` - Placeholder text, descriptions
- **Background Light**: `#F9F9F9` - Input backgrounds, cards
- **Background Hover**: `#F5F5F5` - Hover state for inputs
- **Background Subtle**: `#FAFBFC` - Subtle card backgrounds
- **Border Light**: `#E4E6EB` - Card borders
- **Border Subtle**: `#F0F0F0` - Dividers

### Semantic Colors
- **Success/Teal**: `#0D9488` - Paid, success states
- **Warning/Amber**: `#F59E0B` - Pending, warning states
- **Error/Red**: `#EF4444` - Error, danger states

## Typography

### Font Sizes
- **xs**: `text-xs` (12px) - Hints, timestamps
- **sm**: `text-sm` (14px) - Body text, labels
- **base**: `text-base` (16px) - Primary content
- **lg**: `text-lg` (18px) - Section headings
- **xl**: `text-xl` (20px) - Page headings
- **2xl**: `text-2xl` (24px) - Modal titles

### Font Weights
- **normal**: `font-normal` (400) - Body text
- **medium**: `font-medium` (500) - Labels, small headings
- **semibold**: `font-semibold` (600) - Section titles
- **bold**: `font-bold` (700) - Large amounts, emphasis

## Components

### Form Components

Import from `@/components/ui/form-field`:

```tsx
import {
  TextField,
  TextareaField,
  SelectField,
  FormField,
  SettingsSection,
  SettingsCard,
  SettingsRow,
} from "@/components/ui/form-field"
```

#### TextField
Text input with optional label, description, error state, and icons.

```tsx
<TextField
  label="Email Address"
  type="email"
  placeholder="email@example.com"
  description="We'll never share your email"
  error="Invalid email format"
  required
  leftIcon={<Mail size={18} />}
  size="sm" | "md" | "lg"
/>
```

#### TextareaField
Multi-line text input with label and description.

```tsx
<TextareaField
  label="Description"
  placeholder="Enter description..."
  description="Max 500 characters"
/>
```

#### SelectField
Dropdown select with options.

```tsx
<SelectField
  label="Country"
  placeholder="Select country"
  value={country}
  onValueChange={setCountry}
  options={[
    { value: "gh", label: "Ghana" },
    { value: "ng", label: "Nigeria" },
  ]}
  size="sm" | "md" | "lg"
/>
```

#### SettingsSection
Group related settings with a title and optional description.

```tsx
<SettingsSection 
  title="Personal Information" 
  description="Manage your profile"
  action={<Button>Edit</Button>}
>
  {/* Settings content */}
</SettingsSection>
```

#### SettingsCard
Card wrapper for settings content.

```tsx
<SettingsCard className="border-red-200">
  {/* Card content */}
</SettingsCard>
```

#### SettingsRow
Single setting item with optional icon and action.

```tsx
<SettingsRow
  icon={<User size={18} />}
  title="Profile Settings"
  description="Update your personal information"
>
  <Switch checked={enabled} onCheckedChange={setEnabled} />
</SettingsRow>
```

### Search Input

Import from `@/components/ui/search-input`:

```tsx
import { SearchInput } from "@/components/ui/search-input"

<SearchInput
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onClear={() => setSearch("")}
  placeholder="Search invoices..."
  size="sm" | "md" | "lg"
  fullWidth
/>
```

### Buttons

Import from `@/components/ui/button`:

```tsx
// Primary action
<Button className="rounded-full h-11 px-6 bg-[#14462a] text-white hover:bg-[#14462a]/90">
  Save Changes
</Button>

// Secondary/Cancel
<Button
  variant="outline"
  className="rounded-full h-11 px-6 border-0 bg-[#F9F9F9] text-[#2D2D2D] hover:bg-[#F0F0F0]"
>
  Cancel
</Button>

// Ghost/Icon button
<Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0">
  <Copy size={16} />
</Button>

// Danger
<Button
  variant="outline"
  className="rounded-full h-9 px-4 border-red-300 text-red-600 hover:bg-red-50"
>
  Delete
</Button>
```

### Tabs

Use the custom tab trigger pattern for settings-style tabs:

```tsx
function TabTrigger({ value, icon, label }) {
  return (
    <TabsTrigger
      value={value}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-normal transition-all
                 data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#65676B]
                 data-[state=active]:bg-[#14462a] data-[state=active]:text-white"
    >
      {icon}
      <span>{label}</span>
    </TabsTrigger>
  )
}
```

### Badges

```tsx
// Success badge
<Badge className="rounded-full px-2 py-0.5 bg-teal-100 text-teal-700 border-0">
  Paid
</Badge>

// Brand badge
<Badge className="rounded-full px-2 py-0.5 bg-[#14462a]/10 text-[#14462a] border-0">
  Active
</Badge>

// Warning badge
<Badge className="rounded-full px-2 py-0.5 bg-amber-100 text-amber-700 border-0">
  Pending
</Badge>
```

## Icons

Using **iconsax-react** library. Always use `size` and `color` props, not className:

```tsx
import { User, Card, Notification } from "iconsax-react"

// Correct
<User size={18} color="#14462a" />
<Card size={24} color="#2D2D2D" variant="Linear" />

// Incorrect - don't use className for sizing
<User className="h-6 w-6" />
```

### Icon Sizes
- **16px**: Table icons, inline icons
- **18px**: Button icons, form icons
- **20px**: KPI icons, card icons
- **24px**: Large icons, section headers
- **28-32px**: Avatar placeholders, modal headers

## Spacing

### Border Radius
- **rounded-lg**: `8px` - Small elements
- **rounded-xl**: `12px` - Inputs, small cards
- **rounded-2xl**: `16px` - Cards, modals
- **rounded-3xl**: `24px` - Large cards
- **rounded-full**: Buttons, badges, avatars

### Common Spacing Patterns
- **gap-2**: `8px` - Tight spacing (inline elements)
- **gap-3**: `12px` - Default spacing
- **gap-4**: `16px` - Component spacing
- **gap-6**: `24px` - Section spacing
- **gap-8**: `32px` - Large section spacing

## Layout Patterns

### Page Container
```tsx
<div className="flex-1 overflow-auto px-8 py-6">
  {/* Page content */}
</div>
```

### Two-Column Grid
```tsx
<div className="grid grid-cols-2 gap-6">
  {/* Grid items */}
</div>
```

### Settings Page Pattern
```tsx
<Tabs defaultValue="profile">
  <TabsList className="mb-8 flex flex-wrap gap-2 bg-transparent p-0 h-auto">
    {/* Tab triggers */}
  </TabsList>
  
  <TabsContent value="profile" className="space-y-8">
    <SettingsSection title="Section Title">
      {/* Section content */}
    </SettingsSection>
    
    <SettingsActions saveLabel="Save Changes" />
  </TabsContent>
</Tabs>
```

## Accessibility

- Always include `aria-label` for icon-only buttons
- Use `aria-invalid` for form validation
- Include `placeholder` text for all inputs
- Ensure sufficient color contrast (4.5:1 for text)
