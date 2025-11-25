"""Add deletion_audit_id to issues table

Revision ID: 4dc28d6267ec
Revises: 20251124_1500
Create Date: 2025-11-24 13:27:32.142526+00:00

Description:
    Adds deletion_audit_id column to issues table to track partial deletion failures.
    When a hard delete fails (partial status), this field links to the audit record.
    Used in frontend to show red warning icon and "View Audit Log" button.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4dc28d6267ec'
down_revision = '20251124_1500'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add deletion_audit_id column to issues table."""
    op.add_column(
        'issues',
        sa.Column(
            'deletion_audit_id',
            sa.Integer(),
            nullable=True,
            comment='Link to deletion_audit record if deletion failed (partial status)'
        )
    )

    # Add foreign key constraint
    op.create_foreign_key(
        'fk_issues_deletion_audit',
        'issues',
        'deletion_audit',
        ['deletion_audit_id'],
        ['id'],
        ondelete='SET NULL'  # If audit record deleted, set to NULL
    )

    # Create index for faster lookups
    op.create_index(
        op.f('ix_issues_deletion_audit_id'),
        'issues',
        ['deletion_audit_id'],
        unique=False
    )


def downgrade() -> None:
    """Remove deletion_audit_id column from issues table."""
    op.drop_index(op.f('ix_issues_deletion_audit_id'), table_name='issues')
    op.drop_constraint('fk_issues_deletion_audit', 'issues', type_='foreignkey')
    op.drop_column('issues', 'deletion_audit_id')
