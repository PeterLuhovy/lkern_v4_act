import { default as React } from '../../../../../node_modules/react';
export type IssueType = 'bug' | 'feature' | 'improvement' | 'question';
export interface IssueTypeSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectType: (type: IssueType) => void;
    modalId?: string;
    availableTypes?: IssueType[];
}
/**
 * IssueTypeSelectModal Component
 *
 * Small modal with 4 buttons to select issue type.
 * Uses basic Modal component with grid layout for buttons.
 */
export declare const IssueTypeSelectModal: React.FC<IssueTypeSelectModalProps>;
export default IssueTypeSelectModal;
