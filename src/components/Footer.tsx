import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-background text-foreground py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center px-4">
        <p className="text-sm">
          © Caio e Duda / 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
