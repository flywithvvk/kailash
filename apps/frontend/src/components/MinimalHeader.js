import { ExternalLink } from "lucide-react";

export const MinimalHeader = () => {
  const headerButtons = [
    {
      label: "Go4Garage",
      url: "https://go4garage.in",
      type: "link",
      bgColor: "hsl(var(--g4g-purple))",
      hoverBgColor: "hsl(var(--g4g-purple-light))",
      textColor: "#FFFFFF"
    },
    {
      label: "URGAA",
      url: "https://urgaa.in",
      type: "link",
      bgColor: "#006400",
      hoverBgColor: "#004d00",
      textColor: "#FFFFFF"
    },
    {
      label: "GST (Go4Garage Service Tool)",
      tooltip: "Go4Garage Service Tools",
      url: "#",
      type: "link",
      bgColor: "#000000",
      hoverBgColor: "#333333",
      textColor: "#FFFFFF"
    },
    {
      label: "Ignition App",
      type: "link",
      url: "#",
      bgColor: "#FF4500",
      hoverBgColor: "#E03E00",
      textColor: "#FFFFFF",
      hasAppStores: true,
      appStore: "https://apps.apple.com",
      playStore: "https://play.google.com"
    }
  ];

  return (
    <header 
      className="h-[8vh] flex items-center justify-between px-6" 
      style={{ 
        backgroundColor: '#ffffff'
      }}
    >
      {/* Left: Go4Garage logo */}
      <div className="flex items-center gap-3">
        <img 
          src="https://customer-assets.emergentagent.com/job_evhub-auth/artifacts/4ci0b4px_go4garage-header.png" 
          alt="Go4Garage" 
          className="h-10 w-auto"
        />
      </div>

      {/* Right: Action buttons - Solid Colored Backgrounds */}
      <div className="flex items-center gap-3">
        {headerButtons.map((button, index) => (
          <div key={index} className="flex items-center gap-2">
            <a
              href={button.url}
              target={button.url !== "#" ? "_blank" : undefined}
              rel={button.url !== "#" ? "noopener noreferrer" : undefined}
              className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all duration-300 hover:scale-105"
              style={{
                color: button.textColor,
                fontWeight: 700,
                fontFamily: 'Inter, Roboto, -apple-system, system-ui, sans-serif',
                backgroundColor: button.bgColor,
                border: 'none'
              }}
              title={button.tooltip || button.label}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = button.hoverBgColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = button.bgColor;
              }}
            >
              <span>{button.label}</span>
              {!button.hasAppStores && (
                <ExternalLink className="w-3 h-3 opacity-90 group-hover:opacity-100 transition-opacity" />
              )}
            </a>
            {button.hasAppStores && (
              <div className="flex items-center gap-2">
                <a
                  href={button.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-7 h-7 rounded-md transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.15)'
                  }}
                  title="Download on App Store"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </a>
                <a
                  href={button.playStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-7 h-7 rounded-md transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: 'rgba(52, 168, 83, 0.1)',
                    border: '1px solid rgba(52, 168, 83, 0.2)'
                  }}
                  title="Get it on Google Play"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#34A853' }}>
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
};

export default MinimalHeader;