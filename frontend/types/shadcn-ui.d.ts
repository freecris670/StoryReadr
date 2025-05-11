declare module 'shadcn-ui' {
    import React from 'react';
  
    // Диалог и его примитивы
    export const Dialog: React.FC<{
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
      children?: React.ReactNode;
    }>;
  
    export const DialogTrigger: React.FC<{
      asChild?: boolean;
      children?: React.ReactNode;
    }>;
  
    export const DialogContent: React.FC<{
      children?: React.ReactNode;
    }>;
  
    export const DialogHeader: React.FC<{
      children?: React.ReactNode;
    }>;
  
    export const DialogTitle: React.FC<{
      children?: React.ReactNode;
    }>;
  
    export const DialogDescription: React.FC<{
      children?: React.ReactNode;
    }>;
  }