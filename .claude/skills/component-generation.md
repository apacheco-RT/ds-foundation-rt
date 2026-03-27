# Skill: Component Generation from Registry

## Trigger
When asked to build any UI element, widget, or component.

## Protocol
1. **Lookup** — fetch component schema from `.claude/registry-context/components/{id}.md`
2. **Resolve tokens** — map all token paths to `var(--ds-*)` CSS custom properties
3. **Select adapter** — apply `adapters.tailwind` class mappings (default adapter)
4. **Generate** — produce React + Radix UI implementation
5. **Validate** — check all variants, ARIA attributes, and token usage before returning
6. **Annotate** — add `@ds-component` header comment

## Output template
```tsx
// @ds-component: {id} | @ds-adapter: tailwind | @ds-version: {version}
import * as Primitive from '@radix-ui/{primitive}';
import { cn } from '@/lib/utils';

const {Name}Variants = {
  solid: '{tailwind.solid}',
  outline: '{tailwind.outline}',
  ghost: '{tailwind.ghost}',
  link: '{tailwind.link}',
} as const;

interface {Name}Props {
  variant?: keyof typeof {Name}Variants;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  'aria-label'?: string;
}

export function {Name}({ variant = 'solid', size = 'md', children, ...props }: {Name}Props) {
  return (
    <Primitive.Root
      className={cn('{tailwind.base}', {Name}Variants[variant])}
      {...props}
    >
      {children}
    </Primitive.Root>
  );
}
```

## Validation checklist
- [ ] All registry variants implemented
- [ ] All required ARIA attributes present
- [ ] No hardcoded color values (no `#hex`, no raw `rgb()`)
- [ ] Token paths resolve via `var(--ds-*)` only
- [ ] Component accepts and forwards `children`
- [ ] Radix primitive used as base
- [ ] @ds-component header comment present
