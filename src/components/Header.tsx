import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartItemCount: number;
}

export function Header({ cartItemCount }: HeaderProps) {
  return (
    <header className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(270_91%_65%/0.2),transparent)]" />
      
      {/* Floating Emojis Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Layer 1 - Slow floating emojis */}
        <div className="absolute top-[10%] left-[15%] text-6xl opacity-10 animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }}>
          🧪
        </div>
        <div className="absolute top-[20%] right-[10%] text-5xl opacity-15 animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}>
          ⚗️
        </div>
        <div className="absolute bottom-[25%] left-[8%] text-4xl opacity-20 animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}>
          🔬
        </div>
        <div className="absolute top-[35%] right-[20%] text-3xl opacity-25 animate-float" style={{ animationDelay: '3s', animationDuration: '4.5s' }}>
          💊
        </div>
        <div className="absolute bottom-[15%] right-[15%] text-5xl opacity-10 animate-float" style={{ animationDelay: '4s', animationDuration: '5.5s' }}>
          🧬
        </div>
        <div className="absolute top-[45%] left-[25%] text-4xl opacity-15 animate-float" style={{ animationDelay: '1.5s', animationDuration: '4.8s' }}>
          ⚡
        </div>
        
        {/* Layer 2 - Medium floating emojis */}
        <div className="absolute top-[60%] left-[12%] text-3xl opacity-20 animate-float" style={{ animationDelay: '2.5s', animationDuration: '5.2s' }}>
          🌟
        </div>
        <div className="absolute top-[15%] left-[40%] text-2xl opacity-30 animate-float" style={{ animationDelay: '3.2s', animationDuration: '4.3s' }}>
          💎
        </div>
        <div className="absolute bottom-[30%] right-[35%] text-4xl opacity-12 animate-float" style={{ animationDelay: '0.8s', animationDuration: '5.8s' }}>
          🔮
        </div>
        <div className="absolute top-[25%] left-[60%] text-3xl opacity-18 animate-float" style={{ animationDelay: '4.2s', animationDuration: '4.7s' }}>
          ✨
        </div>
        
        {/* Layer 3 - Small accent emojis */}
        <div className="absolute top-[40%] right-[8%] text-2xl opacity-25 animate-float" style={{ animationDelay: '1.8s', animationDuration: '3.5s' }}>
          🧪
        </div>
        <div className="absolute bottom-[40%] left-[35%] text-2xl opacity-20 animate-float" style={{ animationDelay: '2.8s', animationDuration: '4.1s' }}>
          💜
        </div>
        <div className="absolute top-[50%] left-[5%] text-xl opacity-30 animate-float" style={{ animationDelay: '3.5s', animationDuration: '3.8s' }}>
          🟣
        </div>
        <div className="absolute bottom-[20%] left-[50%] text-xl opacity-25 animate-float" style={{ animationDelay: '4.5s', animationDuration: '4.2s' }}>
          🌙
        </div>
      </div>
      
      {/* Content */}
      <div className="relative container-custom py-8 lg:py-12 z-10">
        <div className="text-center space-y-4 animate-fade-in">
          {/* Logo and Title */}
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-glow-strong animate-float border-2 border-food-primary/30">
              <span className="text-3xl filter drop-shadow-lg" role="img" aria-label="Laboratory">🧪</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-gradient text-balance leading-tight">
                ChronoMedical
              </h1>
              <p className="text-sm lg:text-base text-food-text-secondary font-medium max-w-xl mx-auto text-balance">
                Premium laboratory products delivered with complete discretion
              </p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-6">
            <div className="status-indicator online">
              Available now
            </div>
            
            {cartItemCount > 0 && (
              <div className="status-indicator">
                <span className="text-food-primary font-semibold">{cartItemCount}</span>
                item{cartItemCount !== 1 ? 's' : ''} in cart
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}