import React from 'react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'mauve' | 'lilac';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading, 
  disabled,
  icon,
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] text-sm tracking-wide shadow-lg hover:-translate-y-1";
  
  const variants = {
    primary: "bg-gradient-to-r from-denim to-[#7D8EAB] text-white hover:shadow-denim/40 focus:ring-denim/30 border border-white/20",
    secondary: "bg-white text-denim border-2 border-polarsky/50 hover:border-denim hover:bg-polarsky/10 focus:ring-polarsky/30 shadow-sm",
    ghost: "bg-transparent text-gray-500 hover:text-denim hover:bg-polarsky/10 focus:ring-polarsky/20 shadow-none hover:translate-y-0",
    danger: "bg-white text-mauvelous border-2 border-mauvelous/20 hover:bg-red-50 focus:ring-mauvelous/20 shadow-sm",
    mauve: "bg-gradient-to-r from-mauvelous to-[#D17585] text-white hover:shadow-mauvelous/40 focus:ring-mauvelous/30 border border-white/20",
    lilac: "bg-gradient-to-r from-lilacfizz to-[#B089AD] text-white hover:shadow-lilacfizz/40 focus:ring-lilacfizz/30 border border-white/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        <>
          {icon && <span className="opacity-90">{icon}</span>}
          <span className="relative z-10">{children}</span>
        </>
      )}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full group relative">
      {label && <label className="block text-xs font-extrabold text-denim uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-lilacfizz">{label}</label>}
      <input 
        className={`w-full px-6 py-4 rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-polarsky/20 focus:border-denim focus:ring-4 focus:ring-polarsky/20 outline-none transition-all duration-300 text-gray-800 font-medium placeholder-gray-400 shadow-sm group-hover:bg-white group-hover:shadow-md ${error ? 'border-mauvelous focus:ring-mauvelous/20' : ''} ${className}`}
        {...props} 
      />
      {error && <p className="mt-1.5 text-xs text-mauvelous font-bold ml-1 animate-pulse flex items-center gap-1">⚠️ {error}</p>}
    </div>
  );
};

// --- Select (Custom styled) ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="w-full group">
      {label && <label className="block text-xs font-extrabold text-denim uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-lilacfizz">{label}</label>}
      <div className="relative">
        <select 
          className={`w-full px-6 py-4 rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-polarsky/20 focus:border-denim focus:ring-4 focus:ring-polarsky/20 outline-none appearance-none transition-all duration-300 text-gray-800 font-medium cursor-pointer shadow-sm group-hover:bg-white group-hover:shadow-md ${className}`}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-denim">
          <svg className="w-5 h-5 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
};

// --- Card ---
interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  action?: React.ReactNode;
  headerColor?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '', action, headerColor = 'text-gray-800', noPadding = false }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(146,161,195,0.2)] border border-white/50 hover:shadow-[0_20px_50px_-10px_rgba(146,161,195,0.3)] transition-all duration-500 overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-gradient-to-b from-white/50 to-transparent">
          {title && <h3 className={`text-xl font-bold tracking-tight ${headerColor}`}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`${noPadding ? '' : 'p-8'} text-gray-600`}>
        {children}
      </div>
    </div>
  );
};

// --- Stat Card ---
interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  colorTheme?: 'denim' | 'mauve' | 'lilac' | 'sky';
  trend?: 'up' | 'down' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, colorTheme = 'denim' }) => {
  
  const themes = {
    denim: { 
      bg: 'bg-gradient-to-br from-denim to-[#7D8EAB]', 
      text: 'text-white', 
      subText: 'text-white/70',
      iconBg: 'bg-white/20 text-white backdrop-blur-md' 
    },
    mauve: { 
      bg: 'bg-gradient-to-br from-mauvelous to-[#D17585]', 
      text: 'text-white', 
      subText: 'text-white/70',
      iconBg: 'bg-white/20 text-white backdrop-blur-md' 
    },
    lilac: { 
      bg: 'bg-gradient-to-br from-lilacfizz to-[#B089AD]', 
      text: 'text-white', 
      subText: 'text-white/70',
      iconBg: 'bg-white/20 text-white backdrop-blur-md' 
    },
    sky: { 
      bg: 'bg-gradient-to-br from-polarsky to-denim', 
      text: 'text-white', 
      subText: 'text-white/70',
      iconBg: 'bg-white/20 text-white backdrop-blur-md' 
    },
  };

  const t = themes[colorTheme];

  return (
    <div className={`relative overflow-hidden ${t.bg} p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 transform hover:-translate-y-2 transition-all duration-300 group`}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:translate-x-5 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-xl transform -translate-x-5 translate-y-5"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
           <p className={`text-[11px] font-black uppercase tracking-widest mb-3 ${t.text} opacity-80`}>{label}</p>
           <h4 className={`text-4xl font-black tracking-tight ${t.text} drop-shadow-sm`}>{value}</h4>
           {subValue && <p className={`text-sm mt-2 font-medium ${t.subText}`}>{subValue}</p>}
        </div>
        
        {icon && (
          <div className={`p-4 rounded-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${t.iconBg} shadow-inner`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};