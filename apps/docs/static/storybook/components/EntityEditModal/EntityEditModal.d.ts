import { EntityEditModalProps } from './types';
export declare function EntityEditModal<TEntity extends Record<string, unknown> = Record<string, unknown>>({ isOpen, onClose, onSave, entity, sectionId, config, permissionLevel, parentModalId, size, maxWidth, }: EntityEditModalProps<TEntity>): import("react/jsx-runtime").JSX.Element | null;
export default EntityEditModal;
