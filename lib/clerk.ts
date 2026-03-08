export const clerkAppearance = {
  layout: {
    socialButtonsPlacement: 'top',
    socialButtonsVariant: 'blockButton',
    shimmer: false,
  },
  variables: {
    colorPrimary: '#7c3aed',
    colorBackground: '#fafaf9',
    colorInputBackground: '#ffffff',
    colorInputText: '#1c1917',
    colorText: '#1c1917',
    colorTextSecondary: '#78716c',
    borderRadius: '10px',
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '15px',
  },
  elements: {
    rootBox: 'mx-auto w-full max-w-[420px]',

    card: [
      'rounded-[1.75rem]',
      'border border-stone-200 dark:border-stone-700/60',
      'bg-white dark:bg-stone-900',
      'shadow-[0_8px_48px_-8px_rgba(109,40,217,0.12),0_2px_8px_-2px_rgba(0,0,0,0.06)]',
      'dark:shadow-[0_8px_48px_-8px_rgba(109,40,217,0.25),0_2px_8px_-2px_rgba(0,0,0,0.4)]',
      'px-1 py-1',
    ].join(' '),

    // Header
    headerTitle: [
      'text-[1.75rem] font-bold tracking-[-0.03em] leading-tight',
      'text-stone-900 dark:text-stone-50',
    ].join(' '),
    headerSubtitle: 'text-stone-500 dark:text-stone-400 text-[0.9rem] mt-1 font-normal',

    // Social buttons
    socialButtonsBlockButton: [
      'h-11 rounded-xl gap-3 transition-all duration-150',
      'border border-stone-200 bg-stone-50 text-stone-700 font-medium text-sm',
      'hover:bg-white hover:border-stone-300 hover:shadow-sm',
      'dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300',
      'dark:hover:bg-stone-700 dark:hover:border-stone-600',
    ].join(' '),
    socialButtonsBlockButtonText: [
      'font-semibold text-[0.875rem]',
      'text-stone-800 dark:text-stone-200',
    ].join(' '),
    socialButtonsProviderIcon: 'w-4 h-4',

    // Divider
    dividerRow: 'my-4',
    dividerLine: 'bg-stone-100 dark:bg-stone-700/60',
    dividerText: [
      'text-[0.7rem] uppercase tracking-[0.12em] font-semibold px-3',
      'text-stone-400 dark:text-stone-500',
    ].join(' '),

    // Form
    formFieldLabel: [
      'font-semibold text-[0.8rem] tracking-wide mb-1.5',
      'text-stone-800 dark:text-stone-200',
    ].join(' '),
    formFieldInput: [
      'h-11 rounded-xl px-4 text-[0.9rem] transition-all duration-150',
      'border border-stone-200 bg-white text-stone-900 placeholder:text-stone-300',
      'focus:border-violet-500 focus:ring-3 focus:ring-violet-500/10',
      'hover:border-stone-300',
      'dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-600',
      'dark:focus:border-violet-500 dark:focus:ring-violet-500/20',
      'dark:hover:border-stone-600',
    ].join(' '),
    formFieldInputShowPasswordButton: [
      'text-stone-400 hover:text-stone-700',
      'dark:text-stone-500 dark:hover:text-stone-300',
    ].join(' '),

    // Primary CTA
    formButtonPrimary: [
      'h-11 rounded-xl normal-case transition-all duration-200',
      'bg-violet-600 hover:bg-violet-700 active:bg-violet-800',
      'text-white font-bold text-[0.9rem] tracking-wide',
      'shadow-[0_4px_24px_-4px_rgba(109,40,217,0.5)]',
      'hover:shadow-[0_4px_32px_-4px_rgba(109,40,217,0.65)]',
      'active:scale-[0.98]',
    ].join(' '),

    // Footer
    footer: 'mt-2',
    footerActionText: 'text-stone-500 dark:text-stone-400 text-sm',
    footerActionLink: [
      'font-bold underline underline-offset-2 transition-colors',
      'text-violet-600 hover:text-violet-800 decoration-violet-300',
      'dark:text-violet-400 dark:hover:text-violet-300 dark:decoration-violet-700',
    ].join(' '),

    // Misc
    identityPreviewText: 'font-semibold text-stone-900 dark:text-stone-100',
    identityPreviewEditButton: [
      'transition-colors',
      'text-stone-400 hover:text-violet-600',
      'dark:text-stone-500 dark:hover:text-violet-400',
    ].join(' '),
    userButtonPopoverFooter: 'hidden',

    // Alert / error
    formFieldErrorText: 'text-red-500 dark:text-red-400 text-xs font-medium mt-1',
    alert: [
      'rounded-xl border',
      'bg-red-50 border-red-100',
      'dark:bg-red-950/40 dark:border-red-900/60',
    ].join(' '),
    alertText: 'text-red-700 dark:text-red-400 text-sm font-medium',
  },
} as const;

export const clerkLocalization = {
  signIn: {
    start: {
      title: 'Welcome back',
      subtitle: 'Sign in to continue to your workspace',
    },
  },
  signUp: {
    start: {
      title: 'Create your account',
      subtitle: 'Start your Cultural journey with MuseMate',
    },
  },
} as const;