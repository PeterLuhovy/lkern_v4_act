import { default as React } from '../../../../../node_modules/react';
import { Toast as ToastType } from '../../../../config/src/index.ts';
export interface ToastProps {
    toast: ToastType;
    onClose?: (id: string) => void;
}
export declare const Toast: React.FC<ToastProps>;
export default Toast;
