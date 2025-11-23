import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'ghost';

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
  as?: 'button' | 'a';
};

type ButtonProps =
  | (CommonProps &
      ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button'; href?: undefined })
  | (CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string });

const Button = ({ children, className, variant = 'primary', fullWidth, as = 'button', ...props }: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
  const variantStyles =
    variant === 'primary'
      ? 'bg-primaryPurple text-white hover:bg-darkPurple focus-visible:outline-primaryPurple shadow-lg shadow-primaryPurple/25'
      : 'border border-primaryPurple/40 text-primaryPurple hover:border-primaryPurple hover:bg-lightPurpleBg/60 focus-visible:outline-primaryPurple bg-white';

  if (as === 'a') {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        className={clsx(baseStyles, variantStyles, fullWidth && 'w-full', className)}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={clsx(baseStyles, variantStyles, fullWidth && 'w-full', className)}
      type={buttonProps.type ?? 'button'}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button;
