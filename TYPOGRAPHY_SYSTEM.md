# Typography & Icon System

## Font Stack

### Primary UI Font: Plus Jakarta Sans
- **Usage**: All functional UI elements (buttons, labels, inputs, navigation, body text)
- **CSS Variable**: `--font-jakarta` 
- **Applied via**: `font-jakarta` class or inherits from body

### Display Font: Outfit
- **Usage**: Marketing pages, payment forms, large headings, brand elements
- **CSS Variable**: `--font-display`
- **Applied via**: `font-outfit` class

---

## Font Size Standards

### Minimum Sizes
- **Body Text**: `text-sm` (14px) - minimum for all body content
- **Labels**: `text-sm` (14px) - form labels, helper text, captions
- **Micro Labels**: `text-xs` (12px) - ONLY for section headers (uppercase), version numbers, keyboard shortcuts
- **Never Use**: text-[10px] or smaller

### Standard Sizes
- **Navigation Items**: `text-base` (16px)
- **Page Descriptions**: `text-base` (16px)
- **Inputs/Form Fields**: `text-base` (16px)
- **Buttons**: `text-base` (16px) for primary, `text-sm` (14px) for secondary
- **Headings**: 
  - Page titles: `text-3xl` (30px)
  - Section headings: `text-base` (16px) or `text-lg` (18px)
  - Sub-headings: `text-sm` (14px)

### Font Weights
- **Regular**: 400 (default)
- **Medium**: 500 (navigation items, labels)
- **Semibold**: 600 (active states, headings)
- **Bold**: 700 (brand logo, emphasis)

---

## Icon System

### Icon Libraries
- **Lucide React**: Dashboard layout (sidebar, topbar, user menu)
- **Hugeicons React**: Settings page and functional areas
- **Custom SVG Icons**: Dashboard nav (DashboardIcon, InvoiceIcon, ContactsIcon, etc.)

### Icon Sizes
- **Standard Navigation**: `h-5 w-5` (20px) - sidebar navigation items
- **Dropdown/Inline**: `h-4 w-4` (16px) - user menu, dropdown items
- **Settings Page**: `size={16}` or `size={20}` via props (Hugeicons)
- **Never Use**: Icons smaller than 16px

### Icon Color
- **Primary Actions**: `#14462a` (brand green)
- **Default State**: `#65676B` (muted gray)
- **Active State**: `#14462a` (brand green)
- **Destructive**: `#DC2626` (red)

---

## Component Standards

### Inputs
- **Height**: `h-11` (44px) - standard touch target
- **Font Size**: `text-base` (16px)
- **Border Radius**: `rounded-full` (pills)
- **Border Color**: `#E4E6EB`

### Buttons
- **Primary**: `h-11` (44px), `text-base`, `rounded-full`, `bg-[#14462a]`
- **Secondary**: `h-10` (40px), `text-sm`, `rounded-full`
- **Tertiary/Small**: `h-9` (36px), `text-sm`, `rounded-xl`

### Navigation Items
- **Height**: Auto (py-2.5)
- **Font Size**: `text-base` (16px)
- **Border Radius**: `rounded-xl`
- **Active State**: 
  - Background: `rgba(24, 119, 242, 0.08)`
  - Text Color: `#14462a`
  - Border Left: `3px solid #14462a`
  - Font Weight: 600

### Labels
- **Font Size**: `text-sm` (14px)
- **Spacing**: `mb-2.5` (bottom margin)
- **Font Weight**: 400 (normal) or 500 (medium)

---

## Spacing System

### Standard Gaps
- **Navigation Items**: `gap-3` (12px)
- **Form Fields**: `gap-4` (16px) or `gap-6` (24px)
- **Sections**: `space-y-6` (24px vertical)

### Padding
- **Sidebar**: `p-4` (16px)
- **Content Area**: `p-4` (16px) mobile, `p-6` (24px) desktop
- **Navigation Items**: `px-3 py-2.5` (12px horizontal, 10px vertical)

---

## Color Palette

### Primary
- **Brand Blue**: `#14462a`
- **Blue Hover**: `rgba(24, 119, 242, 0.9)`
- **Blue Background**: `rgba(24, 119, 242, 0.08)`

### Text
- **Primary**: `#2D2D2D` (dark gray)
- **Secondary**: `#65676B` (medium gray)
- **Muted**: `#B0B3B8` (light gray)

### Borders
- **Default**: `#E4E6EB` (very light gray)

### Semantic Colors
- **Success Green**: `#0D9488`
- **Warning Orange**: `#F59E0B`
- **Error Red**: `#DC2626`
- **Purple**: `#7C3AED`

---

## Layout Dimensions

### Sidebar
- **Width**: `w-64` (256px) desktop
- **Mobile**: Full width sheet

### Topbar
- **Height**: `h-16` (64px)
- **Border**: `1px solid #E4E6EB` bottom

### Section Headers
- **Font Size**: `text-xs` (12px)
- **Transform**: `uppercase`
- **Tracking**: `tracking-wider`
- **Letter Spacing**: `0.05em`
- **Color**: `#B0B3B8`
- **Font Weight**: 600

---

## Implementation Examples

### Navigation Item
```tsx
<Link
  href="/dashboard"
  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-base transition-all"
  style={{
    backgroundColor: 'rgba(24, 119, 242, 0.08)',
    color: '#14462a',
    fontWeight: 600,
    borderLeft: '3px solid #14462a'
  }}
>
  <DashboardIcon className="h-5 w-5" />
  <span>Dashboard</span>
</Link>
```

### Form Input
```tsx
<div>
  <label className="text-sm font-normal mb-2.5 block" style={{ color: '#2D2D2D' }}>
    Email Address
  </label>
  <input
    type="email"
    className="w-full h-11 px-4 rounded-full text-base"
    style={{ border: '1px solid #E4E6EB' }}
  />
</div>
```

### Button
```tsx
<button
  className="h-11 px-6 rounded-full font-semibold text-base"
  style={{ backgroundColor: '#14462a', color: 'white' }}
>
  Save Changes
</button>
```

---

## Validation Checklist

When creating new components, ensure:

- [ ] Minimum font size is `text-sm` (14px), except micro-labels which are `text-xs` (12px)
- [ ] Icons are minimum 16px (`h-4 w-4`) or 20px (`h-5 w-5`)
- [ ] Inputs use `h-11` (44px) height with `text-base` (16px) font
- [ ] Navigation items use `text-base` (16px)
- [ ] Active states have proper visual feedback (background, border, weight)
- [ ] Touch targets are minimum 40px (h-10) for interactive elements
- [ ] Colors use the established palette (no random hex values)
- [ ] Spacing follows the standard gap/padding system
- [ ] Font weights are appropriate (500 for labels, 600 for active/headings)
- [ ] Border radius is consistent (`rounded-full` for inputs/buttons, `rounded-xl` for nav)

---

## Notes

- **Readability First**: All text must be readable at standard viewing distances
- **Consistency**: Use established patterns rather than creating new variations
- **Touch Targets**: Mobile-friendly sizes (44px minimum for primary actions)
- **Visual Hierarchy**: Clear distinction between headings, body, and labels
- **Accessibility**: Sufficient color contrast and font sizes for all users
