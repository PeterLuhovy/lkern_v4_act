import { default as React } from '../../../../../node_modules/react';
export interface AuthRoleSwitcherProps {
    /**
     * Whether sidebar is collapsed (affects display)
     */
    isCollapsed?: boolean;
}
/**
 * AuthRoleSwitcher Component
 *
 * 🚨 DEVELOPMENT TOOL - FOR TESTING ONLY
 *
 * Shows 9-level permission switcher in 3x3 grid:
 * - Basic lvl1-3 (green zone, Ctrl+1/2/3)
 * - Standard lvl1-3 (yellow zone, Ctrl+4/5/6)
 * - Admin lvl1-3 (red zone, Ctrl+7/8/9)
 *
 * Keyboard shortcuts: Ctrl+1 through Ctrl+9
 *
 * TODO: Remove when lkms-auth microservice is ready
 */
export declare const AuthRoleSwitcher: React.FC<AuthRoleSwitcherProps>;
export default AuthRoleSwitcher;
