'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface NicknameCooldownDialogProps {
  open: boolean;
  onClose: () => void;
  nickname: string;
  allowedAt: Date;
  remainingMinutes: number;
}

export default function NicknameCooldownDialog({
  open,
  onClose,
  nickname,
  allowedAt,
  remainingMinutes
}: NicknameCooldownDialogProps) {
  const formattedTime = allowedAt.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-[#1E2D6B]">
            Apodo ya utilizado
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-gray-700 pt-4">
            El apodo <span className="font-bold text-[#2167AE]">{nickname}</span> ya participó recientemente.
          </AlertDialogDescription>
          <div className="pt-4 text-center">
            <p className="text-gray-700 mb-2">
              Podrás volver a jugar a las:
            </p>
            <p className="text-3xl font-bold text-[#2167AE]">
              {formattedTime}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (en aproximadamente {remainingMinutes} minutos)
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onClose}
            className="bg-[#2167AE] hover:bg-[#1a5391] text-white w-full"
          >
            Entendido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
