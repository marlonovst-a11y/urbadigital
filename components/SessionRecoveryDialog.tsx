'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface SessionRecoveryDialogProps {
  open: boolean;
  nickname: string;
  onContinue: () => void;
  onStartNew: () => void;
}

export default function SessionRecoveryDialog({ open, nickname, onContinue, onStartNew }: SessionRecoveryDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-[#1E2D6B]">
            Sesión anterior encontrada
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base pt-2">
            Hola <span className="font-bold text-[#2167AE]">{nickname}</span>, tienes una sesión anterior incompleta.
            <br /><br />
            ¿Deseas continuar donde lo dejaste o empezar de nuevo?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            onClick={onStartNew}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
          >
            Empezar de nuevo
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onContinue}
            className="bg-[#2167AE] text-white hover:bg-[#1E2D6B] font-semibold"
          >
            Continuar sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
