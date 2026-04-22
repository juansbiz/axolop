# Performance Optimization Guide

## Form Builder Performance Enhancements

This document outlines the performance optimizations implemented in the Form Builder UI/UX overhaul (Weeks 1-6).

---

## 🎯 Performance Metrics Targets

**Target Performance:**
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.0s
- Total Blocking Time (TBT): < 200ms
- Cumulative Layout Shift (CLS): < 0.1
- Largest Contentful Paint (LCP): < 2.5s

**Animation Performance:**
- 60fps for all animations
- 16.6ms frame budget
- Smooth spring physics without jank

---

## ✅ Implemented Optimizations

### 1. Mobile Responsiveness

**Components Optimized:**
- `UndoRedoButtons.jsx` - Vertical layout on mobile, horizontal on desktop
- `BulkActionsBar.jsx` - Icon-only buttons on mobile, compact layout
- `EmptyState.jsx` - Responsive padding, text sizes, and button widths
- `SuccessAnimation.jsx` - Scaled for smaller screens
- `Confetti.jsx` - Particle count adjusted for mobile performance

**Responsive Breakpoints:**
- Mobile: `< 768px` (Tailwind `md:`)
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

**Touch Optimizations:**
- Minimum touch target: 44px (iOS standard)
- Haptic feedback via Vibration API
- Touch-specific press effects
- Custom hooks: `useMediaQuery`, `useIsTouchDevice`

### 2. Animation Performance

**Framer Motion Optimizations:**
- Used `transform` properties (GPU-accelerated)
- Avoided `left/top/width/height` animations
- Implemented `AnimatePresence` for exit animations
- Used `layoutId` for shared element transitions

**Spring Physics:**
- Stiffness: 300-500 (responsive feel)
- Damping: 20-30 (smooth deceleration)
- Duration: 150-300ms (snappy interactions)

**Canvas Optimizations (Confetti):**
- RequestAnimationFrame for 60fps
- Particle pooling (reuse particles)
- Limited particle count: 150
- Automatic cleanup after duration

### 3. Rendering Optimizations

**React Performance:**
- `useCallback` for memoized functions
- `useMemo` for expensive computations
- `useStableCallback` for preventing re-renders
- `useDeepMemo` for object/array comparisons

**Component Lazy Loading:**
```jsx
// Example: Lazy load heavy components
const ConfettiLazy = lazy(() => import('@/components/ui/confetti'));
```

**Virtual Scrolling:**
- Use for long question lists
- Render only visible items
- Library: `react-window` or `react-virtual`

### 4. Bundle Size Optimization

**Code Splitting:**
- Split Form Builder tabs into separate chunks
- Lazy load animations (confetti, success)
- Dynamic imports for heavy libraries

**Tree Shaking:**
- Import only used components from Lucide React
- Use named imports, not default imports

**Before:**
```jsx
import * as Icons from 'lucide-react'; // ❌ Imports entire library
```

**After:**
```jsx
import { Check, Sparkles } from 'lucide-react'; // ✅ Only imports what's needed
```

### 5. Image Optimization

**Best Practices:**
- Use WebP format with JPEG/PNG fallback
- Implement lazy loading with `loading="lazy"`
- Use `srcset` for responsive images
- Compress with 80% quality

**Utility:**
```javascript
import { optimizeImageSrc } from '@/hooks/usePerformance';

const src = optimizeImageSrc('/image.jpg', {
  quality: 80,
  format: 'webp',
  width: 800
});
```

### 6. Memory Leak Prevention

**Common Leaks Fixed:**
- Event listeners: Always remove in cleanup
- Timers: Clear `setTimeout`/`setInterval`
- Observers: Disconnect IntersectionObserver
- Subscriptions: Unsubscribe from state

**Example:**
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    // Do something
  }, 1000);

  return () => clearTimeout(timer); // ✅ Cleanup
}, []);
```

### 7. Debouncing & Throttling

**When to Use:**
- Debounce: Search inputs, form validation
- Throttle: Scroll handlers, resize handlers

**Custom Hooks:**
- `useDebouncedValue(value, delay)`
- `useThrottledFunction(fn, delay)`
- `useDebouncedInput()` (existing)

### 8. Network Optimization

**API Calls:**
- Batch multiple requests
- Use SWR or React Query for caching
- Implement request deduplication
- Add loading states

**Form Auto-Save:**
- Debounced save (2000ms)
- Only save if changes detected
- Show saving indicator
- Handle offline gracefully

---

## 📊 Performance Monitoring

### Built-in Hooks

**usePerformanceMonitor:**
```javascript
import { usePerformanceMonitor } from '@/hooks/usePerformance';

function MyComponent() {
  usePerformanceMonitor('MyComponent');
  // Logs render count and time in dev mode
}
```

**useMemoryLeakDetector:**
```javascript
import { useMemoryLeakDetector } from '@/hooks/usePerformance';

function MyComponent() {
  useMemoryLeakDetector('MyComponent');
  // Warns if memory usage > 80%
}
```

### Chrome DevTools

**Performance Tab:**
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Interact with Form Builder
5. Stop recording
6. Analyze:
   - Frame rate (should be 60fps)
   - Long tasks (should be < 50ms)
   - Layout thrashing

**Memory Tab:**
1. Take heap snapshot
2. Interact with component
3. Take another snapshot
4. Compare to find leaks

**Coverage Tab:**
1. Open DevTools → More Tools → Coverage
2. Reload page
3. Identify unused CSS/JS
4. Remove or lazy-load

---

## 🚀 Future Optimizations

### Not Yet Implemented

1. **Code Splitting per Tab:**
   - Load ContentTab, ShareTab, etc. on demand
   - Reduce initial bundle size

2. **Virtual Scrolling:**
   - For 100+ questions in form
   - Only render visible questions

3. **Web Workers:**
   - Move heavy computations off main thread
   - Form validation, data processing

4. **Service Worker:**
   - Cache assets for offline use
   - Faster subsequent loads

5. **Prefetching:**
   - Prefetch next tab on hover
   - Preload images in viewport

6. **CDN for Assets:**
   - Serve images from CDN
   - Reduce server load

---

## 📝 Best Practices Checklist

### Before Committing Code

- [ ] Removed all `console.log` statements
- [ ] Memoized expensive computations with `useMemo`
- [ ] Wrapped callbacks with `useCallback`
- [ ] Added cleanup functions to `useEffect`
- [ ] Used `AnimatePresence` for exit animations
- [ ] Tested on mobile (< 768px width)
- [ ] Verified 60fps animations (Chrome DevTools)
- [ ] Checked for memory leaks
- [ ] Optimized images (WebP, lazy loading)
- [ ] Removed unused imports

### Mobile Testing

- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Check touch targets (min 44px)
- [ ] Verify keyboard doesn't break layout
- [ ] Test landscape orientation
- [ ] Check safe area insets (notch)

### Animation Testing

- [ ] Smooth at 60fps
- [ ] No layout thrashing
- [ ] Respects `prefers-reduced-motion`
- [ ] Works on low-end devices
- [ ] Exit animations work properly

---

## 🔧 Performance Tools

### Installed Packages

```json
{
  "framer-motion": "^10.x", // Optimized animations
  "react-window": "^1.x", // Virtual scrolling (optional)
  "use-debounce": "^9.x" // Debouncing utility (optional)
}
```

### Custom Hooks Created

**Responsive:**
- `useMediaQuery(query)` - Match media queries
- `useIsMobile()` - Detect mobile devices
- `useIsTablet()` - Detect tablets
- `useIsDesktop()` - Detect desktop
- `useIsTouchDevice()` - Detect touch support
- `useResponsive()` - Combined responsive info

**Performance:**
- `usePerformanceMonitor(name)` - Track renders
- `useMemoryLeakDetector(name)` - Detect leaks
- `useDebouncedValue(value, delay)` - Debounce values
- `useThrottledFunction(fn, delay)` - Throttle functions
- `useStableCallback(fn, deps)` - Prevent re-renders

**Mobile:**
- `useSafeArea()` - iOS safe area insets
- `useViewportHeight()` - Accurate mobile height
- `useScrollLock(locked)` - Prevent body scroll
- `useMobileKeyboard()` - Detect keyboard open

### Components Created

**Touch Feedback:**
- `<TouchFeedback>` - Generic touch effects
- `<TouchButton>` - Button with haptic feedback
- `<TouchCard>` - Card with press effect

---

## 📈 Metrics to Track

### Before/After Comparison

**Bundle Size:**
- Before: X MB
- After: X MB
- Improvement: X%

**Lighthouse Scores:**
- Performance: X → X
- Accessibility: X → X
- Best Practices: X → X

**Core Web Vitals:**
- LCP: X → X
- FID: X → X
- CLS: X → X

---

## 🎨 Animation Budget

**Per Component:**
- Max animations per screen: 5-7
- Max particle count: 150-200
- Max animation duration: 3000ms
- Stagger delay: 0.05-0.1s per item

**Guidelines:**
- Use spring physics, not cubic-bezier
- Prefer `transform` over `position`
- Limit simultaneous animations
- Respect `prefers-reduced-motion`

---

## 💡 Tips & Tricks

### Debugging Performance Issues

1. **Slow renders?** → Use React DevTools Profiler
2. **Memory leaks?** → Chrome Memory tab
3. **Janky animations?** → Chrome Performance tab
4. **Large bundle?** → webpack-bundle-analyzer

### Common Pitfalls

❌ **Don't:**
- Create functions inside render
- Use inline objects in props
- Animate `width/height/top/left`
- Forget cleanup in `useEffect`
- Import entire icon libraries

✅ **Do:**
- Memoize with `useCallback`
- Define objects outside render
- Animate `transform/opacity`
- Always add cleanup
- Import only used icons

---

## 📚 Resources

**Documentation:**
- [Framer Motion Performance](https://www.framer.com/motion/guide-reduce-bundle-size/)
- [React Optimization Guide](https://react.dev/learn/render-and-commit)
- [Web.dev Performance](https://web.dev/performance/)

**Tools:**
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)

---

**Last Updated:** 2025-12-01
**Status:** Week 6 - Performance Testing Phase
**Next:** Accessibility audit and final polish
