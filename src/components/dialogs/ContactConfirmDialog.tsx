// src/components/dialogs/ContactConfirmDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ContactConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  userName?: string;
  creditCost?: number;
}

export default function ContactConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
  userName = "このミュージシャン",
  creditCost = 1,
}: ContactConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>コンタクトの確認</DialogTitle>
          <DialogDescription>
            {userName}とコンタクトを取りますか？{creditCost}クレジットが消費されます。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button onClick={onConfirm}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
