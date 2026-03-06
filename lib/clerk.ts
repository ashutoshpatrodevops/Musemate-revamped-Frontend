export const clerkAppearance = {
  layout: {
    socialButtonsPlacement: 'bottom',
    socialButtonsVariant: 'iconButton',
  },
  variables: {
    colorPrimary: '#0b3b5a',
    colorBackground: '#ffffff',
    colorInputBackground: '#f8fafc',
    colorInputText: '#0f172a',
    colorText: '#0f172a',
    colorTextSecondary: '#475569',
  },
  elements: {
    rootBox: 'mx-auto w-full',
    card: 'rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur',
    headerTitle: 'text-[1.65rem] leading-tight font-bold tracking-tight text-slate-900',
    headerSubtitle: 'text-slate-600',
    formFieldLabel: 'text-slate-700 font-semibold text-sm',
    formFieldInput:
      'h-11 rounded-xl border-slate-200 bg-slate-50/70 focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20 transition-all',
    formButtonPrimary:
      'h-11 rounded-xl bg-sky-900 hover:bg-sky-800 text-sm font-semibold normal-case shadow-lg shadow-sky-900/20 transition-all',
    socialButtonsBlockButton:
      'h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors',
    dividerLine: 'bg-slate-200',
    dividerText: 'text-slate-500 text-xs font-medium',
    footerActionLink: 'text-sky-900 font-semibold hover:text-sky-700',
    // Fix for the UserButton popover
    userButtonPopoverFooter: 'hidden',
  },
} as const;

export const clerkLocalization = {
  signIn: {
    start: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your MuseMate account',
    },
  },
  signUp: {
    start: {
      title: 'Create an Account',
      subtitle: 'Join MuseMate and start exploring amazing museums',
    },
  },
} as const;